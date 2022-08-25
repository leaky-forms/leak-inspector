DELIMITERS = new RegExp("[&|\\,]|%3D|%26");
EXTENSION_RE = new RegExp("\\\\.[A-Za-z]{2,4}$");
ENCODING_LAYERS = 3;

ENCODINGS_NO_ROT = [
  "base64",
  "urlencode",
  "lzstring",
  "custom_map_1",
];

LIKELY_ENCODINGS = [
  "base64",
  "urlencode",
  "lzstring",
  "custom_map_1",
];

HASHES = [
  "md2",
  "md4",
  "md5",
  "sha1",
  "sha256",
  "sha512",
  "sha_salted_1"
];

LIKELY_HASHES = ["md5", "sha1", "sha256", "sha512", "sha_salted_1"];

function get_path_from_url(url) {
  try {
    let hostname = getHostName(url);
    let splitted_url = url.split(hostname);
    return splitted_url[splitted_url.length - 1];
  } catch (error) {
    if (this._debugging) {
      console.log("Cannot parse url %s %s" % (url, exc));
    }
    return "";
  }
}

class Hasher {
  constructor() {
    this._hashes = this.init();
    this.hashes_and_checksums = Object.keys(this._hashes);
    this.supported_hashes = HASHES;
  }
  init = function () {
    var hashes = {};
    hashes["md2"] = md2;
    hashes["md4"] = md4;
    hashes["md5"] = md5;
    hashes["sha1"] = sha1;
    hashes["sha256"] = sha256;
    hashes["sha512"] = sha512;
    hashes["sha_salted_1"] = sha_salted_1;
    return hashes;
  };
  get_hash(hash_name, string) {
    // Compute the desired hash"""
    return this._hashes[hash_name](string);
  }
}

class Encoder {
  constructor() {
    this._encodings = this.init();
    this.supported_encodings = Object.keys(this._encodings);
  }
  init = function () {
    var encodings = {};
    encodings["base64"] = base64.encode;
    encodings["urlencode"] = encodeURIComponent;
    encodings["lzstring"] = LZString.compressToEncodedURIComponent;
    encodings["custom_map_1"] = custom_map_enc;
    return encodings;
  };
  encode(encoding, string) {
    return this._encodings[encoding](string);
  }
}

class Decoder {
  constructor() {
    this._decodings = this.init();
    this.supported_encodings = Object.keys(this._decodings);
  }
  init = function () {
    var encodings = {};
    encodings["base64"] = base64.decode;
    encodings["urlencode"] = decodeURIComponent;
    encodings["lzstring"] = LZString.decompressFromEncodedURIComponent;
    encodings["custom_map_1"] = custom_map_dec;
    return encodings;
  };
  decode(encoding, string) {
    // console.log(encoding, string)
    return this._decodings[encoding](string);
  }
}

// LeakDetector searches URL, POST bodies, and cookies for leaks.

// The detector is constructed with a set of search strings (given by
// the `search_strings` parameters. It has several methods to check for
// leaks containing these strings in URLs, POST bodies, and cookie header
// strings.

// Parameters
// ==========
// search_strings : list
//     LeakDetector will search for leaks containing any item in this list
// precompute_hashes : bool
//     Set to `True` to include precomputed hashes in the candidate set.
// hash_set : list
//     List of hash functions to use when building the set of candidate
//     strings.
// hash_layers : int
//     The detector will find instances of `search_string` iteratively
//     hashed up to `hash_layers` times by any combination of supported
//     hashes.
// precompute_encodings : bool
//     Set to `True` to include precomputed encodings in the candidate set
// encoding_set : list
//     List of encodings to use when building the set of candidate
//     strings.
// encoding_layers : int
//     The detector will find instances of `search_string` iteratively
//     encoded up to `encoding_layers` times by any combination of
//     supported encodings.
// debugging : bool
//     Set to `True` to enable a verbose output.

// This LeakDetector class was transformed from the this Python library: https://gist.github.com/englehardt/5860308c5a69e622bf15b16735343934
class LeakDetector {
  constructor(
    search_strings,
    precompute_hashes = true,
    hash_set = undefined,
    hash_layers = 2,
    precompute_encodings = true,
    encoding_set = undefined,
    encoding_layers = 2,
    debugging = false
  ) {
    this.search_strings = search_strings;
    this._min_length = Math.min.apply(
      Math,
      search_strings.map(function (str) {
        return str.length;
      })
    );
    this._hasher = new Hasher();
    this._hash_set = hash_set;
    this._hash_layers = hash_layers;
    this._encoder = new Encoder();
    this._encoding_set = encoding_set;
    this._encoding_layers = encoding_layers;
    this._decoder = new Decoder();
    this._precompute_pool = {};
    this._precompute_pool_by_layer = [];
    //  If hash/encoding sets aren't specified, use all available.
    if (this._hash_set === undefined) {
      this._hash_set = this._hasher.supported_hashes;
    }
    if (this._encoding_set === undefined) {
      this._encoding_set = this._encoder.supported_encodings;
    }
    this._build_precompute_pool(precompute_hashes, precompute_encodings);
    this._debugging = debugging;
    this._checked = [];
  }
  _compute_hashes(string, layers, prev_hashes) {
    // Returns all iterative hashes of `string` up to the
    // specified number of `layers`"""
    for (let h of this._hasher.supported_hashes) {
      let hashed_string = this._hasher.get_hash(h, string);
      if (hashed_string === string) {
        continue;
      }
      let hash_stack = [h].concat(prev_hashes ? prev_hashes : [string]);
      this._precompute_pool[hashed_string] = hash_stack;
      if (layers > 1) {
        this._compute_hashes(hashed_string, layers - 1, hash_stack);
      }
    }
  }
  _compute_encodings(string, layers, prev_encodings = []) {
    // Returns all iterative encodings of `string` up to the
    // specified number of `layers`

    for (let enc of this._encoder.supported_encodings) {
      let encoded_string;
      try {
        encoded_string = this._encoder.encode(enc, string);
      } catch (error) {
        encoded_string = this._encoder.encode(enc, string);
        try {
          encoded_string = this._encoder.encode(enc, string).toString();
        } catch (error) {
          if (this._debugging) {
            console.log(error);
          }
        }
      }

      if (encoded_string === string) {
        continue;
      }

      let encoding_stack = [enc].concat(prev_encodings.length ? prev_encodings : [string]);
      this._precompute_pool[encoded_string] = encoding_stack;
      if (layers > 1) {
        this._compute_encodings(encoded_string, layers - 1, encoding_stack);
      }
    }
  }
  _build_precompute_pool(precompute_hashes, precompute_encodings) {
    // Build a pool of hashes for the given search string
    let seed_strings = [];
    for (let string of this.search_strings) {
      seed_strings.push(string);
      if (string.startsWith("http")) {
        continue;
      }
      let all_lower = string.toLowerCase();
      if (all_lower !== string) {
        seed_strings.push(string.toLowerCase());
      }
      let all_upper = string.toUpperCase();
      if (all_upper !== string) {
        seed_strings.push(string.toUpperCase());
      }
    }
    let strings = [];
    for (let string of seed_strings) {
      strings.push(string);
      const ENABLE_USERNAME_MATCH = false;
      // If the search string appears to be an email address, we also want
      // to include just the username portion of the URL, and the address
      // and username with any '.'s removed from the username (since these
      // are optional in Gmail).
      if (ENABLE_USERNAME_MATCH && string.includes("@")) {
        let parts = string.rsplit("@");
        if (parts.length === 2) {
          let uname = parts[0];
          let domain = parts[1];
          strings.push(uname);
          strings.push(uname.replaceAll(".", ""));
          strings.push(uname.replaceAll(".", "") + "@" + domain);
        }
        // # Domain searches have too many false positives
        // # strings.append(parts[1])
        // # strings.append(parts[1].rsplit('.', 1)[0])
      }
      // # The URL tokenizer strips file extensions. So if our search string
      // # has a file extension we should also search for a stripped version
      if (string.match(EXTENSION_RE)) {
        strings.push(string.replace(EXTENSION_RE, ""));
      }
    }
    for (let string of strings) {
      this._precompute_pool[string] = [string];
    }
    this._min_length = Math.min.apply(
      Math,
      Object.values(this._precompute_pool).map(function (str) {
        return str[0].length;
      })
    );
    let initial_items = Object.values(this._precompute_pool);
    if (precompute_hashes) {
      for (let initial_item of initial_items) {
        this._compute_hashes(
          initial_item[0],
          this._hash_layers,
          initial_item[1]
        );
      }
    }
    if (precompute_encodings) {
      for (let initial_item of initial_items) {
        this._compute_encodings(
          initial_item[0],
          this._encoding_layers,
          initial_item[1]
        );
      }
    }
    for (const [value, encodings] of Object.entries(this._precompute_pool)) {
      this._precompute_pool_by_layer.push({
        key: encodings.join(),
        value,
      });
    }
  }
  _split_on_delims(string, rv_parts, rv_named) {
    // Splits a string on several delimiters
    if (string === "") {
      return;
    }

    let parts = new Set(string.split(new RegExp(DELIMITERS)));
    if (parts.has("")) {
      parts.delete("");
    }
    for (let part of parts) {
      if (part === "") {
        continue;
      }
      let count = (part.match(new RegExp("=", "g")) || []).length;
      if (count !== 1) {
        rv_parts.add(part);
      }
      if (count === 0) {
        continue;
      }
      let splitted_param = part.split("=");
      let n = splitted_param[0];
      let k = splitted_param[1];
      if (n && n.length > 0 && k && k.length > 0) {
        rv_named.add([n, k]);
      } else {
        rv_parts.add(part);
      }
    }
    if (this._debugging) {
      if (this._debugging) {
        console.log("RV PARTS: ", rv_parts);
      }
    }
  }
  check_if_in_precompute_pool(string) {
    // Returns a tuple that lists the (possibly layered) hashes or
    // encodings that result in input string
    try {
      return this._precompute_pool[string.toString()];
    } catch (error) {
      try {
        return this._precompute_pool[string.decode()];
      } catch (error) {
        return;
      }
    }
  }
  check_for_leak = function (
    string,
    layers = 1,
    prev_encodings = [],
    prev = ""
  ) {
    // Check if given string contains a leak
    // Short tokens won't contain email address
    if (string === null || string.length < this._min_length) {
      return;
    }

    if (
      this._checked[prev_encodings] &&
      this._checked[prev_encodings].includes(string)
    ) {
      return;
    }
    this._checked.push({
      key: prev_encodings,
      value: string,
    }); // add to already checked

    let substr_results = this.substring_search(
      string,
      this._encoding_layers,
      prev_encodings
    );
    if (substr_results.length) {
      return substr_results[0];
    }

    // # Check if direct hash or plaintext
    let rv = this.check_if_in_precompute_pool(string);
    // # print('result', rv)
    if (rv !== undefined) {
      return prev_encodings + rv;
    }
    let tokens = new Set();
    let parameters = new Set();
    // # don't split on the first layer
    if (layers === this._hash_layers) {
      tokens = new Set([string]);
    } else {
      try {
        this._split_on_delims(string, tokens, parameters);
      } catch (error) {
        tokens = new Set([string]);
      }
    }
    let tokens_union_params = union(tokens, parameters);
    for (let item of tokens_union_params) {
      let value;
      if (item.length === 2) {
        value = item[1];
      } else {
        value = item;
      }
      // # Try encodings
      for (let encoding of this._encoding_set) {
        let decoded;
        // # multiple rots are unnecessary
        if (encoding.startsWith("rot") && prev.startsWith("rot")) {
          continue;
        }
        try {
          // # decoded = this._decoder.decode(encoding, string)
          decoded = this._decoder.decode(encoding, value);
          if (typeof decoded === Number) {
            decoded = decoded.toString();
          }
        } catch (error) {
          if (this._debugging) {
            console.log(error);
          }
          continue;
        }

        if (decoded === string) {
          continue;
        }
        if (decoded === undefined) {
          continue;
        }

        let encoding_stack = prev_encodings.concat(encoding);

        if (layers > 1) {
          rv = this.check_for_leak(
            decoded,
            layers - 1,
            encoding_stack,
            encoding
          );
          if (rv !== undefined) {
            return rv;
          }
        } else {
          rv = this.check_if_in_precompute_pool(decoded);
          if (rv !== undefined) {
            return encoding_stack + rv;
          }
        }
      }
    }
    return;
  };
  _check_parts_for_leaks(tokens, parameters, nlayers) {
    // Check token and parameter string parts for leaks
    let leaks = [];
    for (let token of tokens) {
      // # print('token', token)
      let leak = this.check_for_leak(token, nlayers);
      if (leak !== undefined) {
        leaks.push(leak);
      }
    }
    for (let parameter of parameters.values()) {
      let prev_encodings = [];
      let searchName = parameter[0];
      let searchValue = parameter[1];
      let n_layers_param = nlayers;
      // # these URL params already decoded by parse_qs
      // # decrement n_layers, and add to the the encoding stack
      if (parameter.parse_qs && parameter.parse_qs.length === 2) {
        searchName = parameter.parse_qs[0];
        searchValue = parameter.parse_qs[1];
        prev_encodings = ["urlencode"];
        n_layers_param = nlayers - 1;
      }
      let leak = this.check_for_leak(
        searchName,
        n_layers_param,
        prev_encodings
      );
      if (leak !== undefined) {
        leaks.push(leak);
      }
      leak = this.check_for_leak(searchValue, n_layers_param, prev_encodings);
      if (leak !== undefined) {
        leaks.push(leak);
      }
    }
    return leaks;
  }
  _split_url(url) {
    // Split url path and query string on delimiters
    let tokens = new Set();
    let parameters = new Set();
    let purl;
    let path_parts;
    try {
      purl = new URL(url);
      path_parts = purl.pathname.split("/");
    } catch (error) {
      purl = {
        hash: "",
        hostname: "",
        password: "",
        pathname: "",
        port: "",
        protocol: "",
        search: "",
        username: "",
      };
      path_parts = url.split("/");
    }
    for (let part of path_parts) {
      // # TODO: consider removing this arbitrary exception for .com
      if (part.includes(".") && !part.endsWith(".com")) {
        let checkKeyword = part.match(EXTENSION_RE);
        part = part.replaceAll(checkKeyword, "");
      }
      this._split_on_delims(part, tokens, parameters);
    }
    this._split_on_delims(purl.search, tokens, parameters);
    // # parse URL parameters

    const params = new URLSearchParams(purl.search);
    for (const param of params) {
      parameters.add({ parse_qs: [param[0], param[1]] });
    }
    this._split_on_delims(purl.hash, tokens, parameters);
    return [tokens, parameters];
  }
  check_url(url, encoding_layers = 3, substring_search = true) {
    // Check if a given url contains a leak"""
    let tokens = this._split_url(url)[0];
    let parameters = this._split_url(url)[1];
    this._checked = []; //# reset the alreadt seen
    if (this._debugging) {
      console.log("URL tokens:");
      for (token in tokens) {
        console.log(token);
      }
      console.log("\nURL parameters:");
      for (parameter in parameters) {
        console.log(parameter.key, parameter.value);
      }
    }
    let path = get_path_from_url(url);
    return this._check_whole_and_parts_for_leaks(
      path,
      tokens,
      parameters,
      encoding_layers,
      substring_search
    );
  }
  _get_header_str(header_str, header_name) {
    //Returns the header string parsed from `header_str`"""
    for (let item of json.loads(header_str)) {
      if (item[0] === header_name) {
        return item[1];
      }
    }
    return "";
  }
  get_location_str = function (header_str) {
    return this._get_header_str(header_str, "Location");
  };
  get_referrer_str = function () {
    return this._get_header_str(header_str, "Referer");
  };
  check_location_header(
    location_str,
    encoding_layers = 3,
    substring_search = true
  ) {
    // Check the Location HTTP response header for leaks."""
    if (location_str === "") {
      return [];
    }
    let tokens = this._split_url(location_str)[0];
    let parameters = this._split_url(location_str)[1];
    this._checked = [];
    return this._check_whole_and_parts_for_leaks(
      location_str,
      tokens,
      parameters,
      encoding_layers,
      substring_search
    );
  }
  check_post_data(post_str, encoding_layers = 3, substring_search = true) {
    // Check the Location HTTP response header for leaks."""
    if (post_str === "" || !post_str) {
      return [];
    }
    let splir_res = this._split_url(post_str);
    let tokens = splir_res[0];
    let parameters = splir_res[1];
    this._checked = [];
    this._split_on_delims(post_str, tokens, parameters);
    // # tokens, parameters = this._split_cookie(post_str, from_request=False)
    return this._check_whole_and_parts_for_leaks(
      post_str,
      tokens,
      parameters,
      encoding_layers,
      substring_search
    );
  }
  check_referrer_header(
    header_str,
    encoding_layers = 3,
    substring_search = true
  ) {
    // Check the Referer HTTP request header for leaks."""
    if (header_str === "") {
      return [];
    }
    referrer_str = this.get_referrer_str(header_str);
    if (!referrer_str) {
      return [];
    }
    let tokens = this._split_url(referrer_str)[0];
    let parameters = this._split_url(referrer_str)[1];
    this._checked = [];
    return this._check_whole_and_parts_for_leaks(
      referrer_str,
      tokens,
      parameters,
      encoding_layers,
      substring_search
    );
  }
  check_referrer_str() {
    // Check the Referer HTTP request header for leaks."""
    if (!referrer_str) {
      return [];
    }
    let tokens = this._split_url(referrer_str)[0];
    let parameters = this._split_url(referrer_str)[1];
    this._checked = [];
    return this._check_whole_and_parts_for_leaks(
      referrer_str,
      tokens,
      parameters,
      encoding_layers,
      substring_search
    );
  }
  _check_whole_and_parts_for_leaks(
    input_string,
    tokens,
    parameters,
    encoding_layers,
    substring_search
  ) {
    // Search an input string and its parts for leaks."""
    // # print('_check_whole_and_parts_for_leaks', input_string, tokens, parameters)
    let results = this._check_parts_for_leaks(
      tokens,
      parameters,
      encoding_layers
    );
    if (substring_search) {
      // console.log('leak in: ', input_string)
      let substr_results = this.substring_search(input_string, 2);
      // # filter repeating results
      return union(new Set(results), new Set(substr_results));
    } else {
      return results;
    }
  }
  substring_search(input_string, max_layers = undefined, prev_encodings = []) {
    // Do a substring search for all precomputed hashes/encodings
    // `max_layers` limits the number of encoding/hashing layers used in the
    // substring search (to limit time). The default is no limit (`None`).
    if (input_string === undefined || input_string === "") {
      return [];
    }
    try {
      input_string = encodeURI(input_string);
    } catch (error) {
      return [];
    }

    let leaks = [];
    let n_prev_encodings = prev_encodings.length;
    // # max - 1
    let n_max_precomp_layer = max_layers - n_prev_encodings;

    for (
      var n_precomp_layer = 1;
      n_precomp_layer < n_max_precomp_layer + 1;
      n_precomp_layer++
    ) {
      let _precompute_pool = this._precompute_pool_by_layer.filter(
        (pool_el) => pool_el.key.split(",").length === n_precomp_layer
      );
      for (const entry of _precompute_pool) {
        if (input_string.includes(entry.value)) {
          leaks.push(prev_encodings + entry.key);
        }
      }
    }
    return leaks;
  }
}

String.prototype.rsplit = function (sep, maxsplit) {
  var split = this.split(sep);
  return maxsplit
    ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit))
    : split;
};

function union(setA, setB) {
  let _union = new Set(setA);
  for (let elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function symmetricDifference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
}

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}