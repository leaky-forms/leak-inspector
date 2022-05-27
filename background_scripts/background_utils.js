function decodeRequestBody(data) {
  let decodedBody;
  const dataBytes = new Uint8Array(data.bytes);
  try {
    // try to convert bytes to string
    decodedBody = decodeURIComponent(
      String.fromCharCode.apply(null, dataBytes)
    );
  } catch (error) {
    try {
      // try to decode from utf-8
      decodedBody = new TextDecoder().decode(dataBytes);
    } catch (error) {
      console.log(`ERROR in decodeRequestBody: ${error}`);
    }
  }
  return decodedBody;
}


function getHostName(url) {
  return new URL(url).hostname;
}

function getBaseDomainFromUrl(url) {
  return getBaseDomain(getHostName(url));
}
// Taken from: https://github.com/EFForg/privacybadger/blob/b8378150248b487e3ce01a3890ad4ee788db0404/src/lib/basedomain.js

const RE_V4 =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|0x[0-9a-f][0-9a-f]?|0[0-7]{3})\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|0x[0-9a-f][0-9a-f]?|0[0-7]{3})$/i;
const RE_V4_HEX = /^0x([0-9a-f]{8})$/i;
const RE_V4_NUMERIC = /^[0-9]+$/;
const RE_V4inV6 =
  /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const RE_BAD_CHARACTERS = /([^0-9a-f:])/i;
const RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]$)/i;

function hasOwn(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isIPv4(address) {
  if (RE_V4.test(address)) {
    return true;
  }
  if (RE_V4_HEX.test(address)) {
    return true;
  }
  if (RE_V4_NUMERIC.test(address)) {
    return true;
  }
  return false;
}

function isIPv6(address) {
  var a4addon = 0;
  var address4 = address.match(RE_V4inV6);
  if (address4) {
    var temp4 = address4[0].split(".");
    for (var i = 0; i < 4; i++) {
      if (/^0[0-9]+/.test(temp4[i])) {
        return false;
      }
    }
    address = address.replace(RE_V4inV6, "");
    if (/[0-9]$/.test(address)) {
      return false;
    }

    address = address + temp4.join(":");
    a4addon = 2;
  }

  if (RE_BAD_CHARACTERS.test(address)) {
    return false;
  }

  if (RE_BAD_ADDRESS.test(address)) {
    return false;
  }

  function count(string, substring) {
    return (
      (string.length - string.replace(new RegExp(substring, "g"), "").length) /
      substring.length
    );
  }

  var halves = count(address, "::");
  if (halves == 1 && count(address, ":") <= 6 + 2 + a4addon) {
    return true;
  }
  if (halves == 0 && count(address, ":") == 7 + a4addon) {
    return true;
  }
  return false;
}

/**
 * Returns base domain for specified host based on Public Suffix List.
 * @param {String} hostname The name of the host to get the base domain for
 * @returns {String} The base domain
 */
function getBaseDomain(hostname) {
  // remove trailing dot
  if (hostname.charAt(hostname.length - 1) == ".") {
    hostname = hostname.slice(0, -1);
  }

  // return IP address untouched
  if (isIPv6(hostname) || isIPv4(hostname)) {
    return hostname;
  }

  // search through PSL
  let tld = 0,
    prevDomains = [],
    cur_domain = hostname,
    next_dot = cur_domain.indexOf(".");

  for (; ;) {
    if (hasOwn(publicSuffixes, cur_domain)) {
      tld = publicSuffixes[cur_domain];
      break;
    }

    if (next_dot < 0) {
      tld = 1;
      break;
    }

    prevDomains.push(cur_domain.slice(0, next_dot));
    cur_domain = cur_domain.slice(next_dot + 1);
    next_dot = cur_domain.indexOf(".");
  }

  while (tld > 0 && prevDomains.length > 0) {
    cur_domain = prevDomains.pop() + "." + cur_domain;
    tld--;
  }

  return cur_domain;
}

/**
 * Converts an IP address to a number. If given input is not a valid IP address
 * then 0 is returned.
 * @param {String} ip The IP address to convert
 * @returns {Integer}
 */
function ipAddressToNumber(ip) {
  // Separate IP address into octets, make sure there are four.
  var octets = ip.split(".");
  if (octets.length !== 4) {
    return 0;
  }

  var result = 0;
  var maxOctetIndex = 3;
  for (var i = maxOctetIndex; i >= 0; i--) {
    var octet = parseInt(octets[maxOctetIndex - i], 10);

    // If octet is invalid return early, no need to continue.
    if (Number.isNaN(octet) || octet < 0 || octet > 255) {
      return 0;
    }

    // Use bit shifting to store each octet for result.
    result |= octet << (i * 8); // eslint-disable-line no-bitwise
  }

  // Results of bitwise operations in JS are interpreted as signed
  // so use zero-fill right shift to return unsigned number.
  return result >>> 0; // eslint-disable-line no-bitwise
}

/**
 * Determines if domain is private, that is localhost or the IP address spaces
 * specified by RFC 1918.
 * @param {String} domain The domain to check
 * @returns {Boolean}
 */
function isPrivateDomain(domain) {
  // Check for localhost match.
  if (domain === "localhost") {
    return true;
  }

  // Check for private IP match.
  var ipNumber = ipAddressToNumber(domain);
  var privateIpMasks = {
    "127.0.0.0": "255.0.0.0",
    "10.0.0.0": "255.0.0.0",
    "172.16.0.0": "255.240.0.0",
    "192.168.0.0": "255.255.0.0",
  };
  for (var ip in privateIpMasks) {
    // Ignore object properties.
    if (!hasOwn(privateIpMasks, ip)) {
      continue;
    }

    // Compare given IP value to private IP value using bitwise AND.
    // Make sure result of AND is unsigned by using zero-fill right shift.
    var privateIpNumber = ipAddressToNumber(ip);
    var privateMaskNumber = ipAddressToNumber(privateIpMasks[ip]);
    if ((ipNumber & privateMaskNumber) >>> 0 === privateIpNumber) {
      // eslint-disable-line no-bitwise
      return true;
    }
  }

  // Getting here means given host didn't match localhost
  // or other private addresses so return false.
  return false;
}

/**
 * Checks whether a request is third party for the given document, uses
 * information from the public suffix list to determine the effective domain
 * name for the document.
 *
 * @param {String} request_host The request host
 * @param {String} site_host The document (first-party) host
 *
 * @returns {Boolean}
 */
function isThirdParty(request_host, site_host) {
  if (!request_host || !site_host) {
    return true;
  }

  // remove trailing dot
  if (request_host.charAt(request_host.length - 1) == ".") {
    request_host = request_host.slice(0, -1);
  }
  if (site_host.charAt(site_host.length - 1) == ".") {
    site_host = site_host.slice(0, -1);
  }

  if (request_host == site_host) {
    return false;
  }

  // Extract domain name - leave IP addresses unchanged, otherwise leave only base domain
  let site_base = getBaseDomain(site_host);
  if (request_host.length > site_base.length) {
    return !request_host.endsWith("." + site_base);
  } else {
    return request_host != site_base;
  }
}

/**
 * Extracts host name from a URL.
 */
function extractHostFromURL(url) {
  if (url && extractHostFromURL._lastURL == url) {
    return extractHostFromURL._lastDomain;
  }

  var host = "";
  try {
    host = new URI(url).host;
  } catch (e) {
    console.error("Failed to extract host from %s\n", url, e);
    // Keep the empty string for invalid URIs.
  }

  extractHostFromURL._lastURL = url;
  extractHostFromURL._lastDomain = host;
  return host;
}

/**
 * Parses URLs and provides an interface similar to nsIURI in Gecko, see
 * https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIURI.
 * TODO: Make sure the parsing actually works the same as nsStandardURL.
 * @constructor
 */
function URI(spec) {
  this.spec = spec;
  this._schemeEnd = spec.indexOf(":");
  if (this._schemeEnd < 0) {
    throw new Error("Invalid URI scheme");
  }

  if (spec.substr(this._schemeEnd + 1, 2) != "//") {
    // special case for filesystem, blob URIs
    if (this.scheme === "filesystem" || this.scheme === "blob") {
      this._schemeEnd = spec.indexOf(":", this._schemeEnd + 1);
      if (spec.substr(this._schemeEnd + 1, 2) != "//") {
        throw new Error("Unexpected URI structure");
      }
    } else {
      throw new Error("Unexpected URI structure");
    }
  }

  this._hostPortStart = this._schemeEnd + 3;
  this._hostPortEnd = spec.indexOf("/", this._hostPortStart);
  if (this._hostPortEnd < 0) {
    throw new Error("Invalid URI host");
  }

  var authEnd = spec.indexOf("@", this._hostPortStart);
  if (authEnd >= 0 && authEnd < this._hostPortEnd) {
    this._hostPortStart = authEnd + 1;
  }

  this._portStart = -1;
  this._hostEnd = spec.indexOf("]", this._hostPortStart + 1);
  if (
    spec[this._hostPortStart] == "[" &&
    this._hostEnd >= 0 &&
    this._hostEnd < this._hostPortEnd
  ) {
    // The host is an IPv6 literal
    this._hostStart = this._hostPortStart + 1;
    if (spec[this._hostEnd + 1] == ":") {
      this._portStart = this._hostEnd + 2;
    }
  } else {
    this._hostStart = this._hostPortStart;
    this._hostEnd = spec.indexOf(":", this._hostStart);
    if (this._hostEnd >= 0 && this._hostEnd < this._hostPortEnd) {
      this._portStart = this._hostEnd + 1;
    } else {
      this._hostEnd = this._hostPortEnd;
    }
  }
}
URI.prototype = {
  spec: null,
  get scheme() {
    return this.spec.substring(0, this._schemeEnd).toLowerCase();
  },
  get host() {
    return this.spec.substring(this._hostStart, this._hostEnd);
  },
  get hostPort() {
    return this.spec.substring(this._hostPortStart, this._hostPortEnd);
  },
  get port() {
    if (this._portStart < 0) {
      return -1;
    } else {
      return parseInt(
        this.spec.substring(this._portStart, this._hostPortEnd),
        10
      );
    }
  },
  get path() {
    return this.spec.substring(this._hostPortEnd);
  },
  get prePath() {
    return this.spec.substring(0, this._hostPortEnd);
  },
};

function checkRequest(request, inputElements, tdsResult, timeStamp, requestBaseDomain) {
  const searchTerms = inputElements.inputFields.map((inputEl) => inputEl.value);
  const leak_detector = new LeakDetector(
    searchTerms,
    (precompute_hashes = true),
    (hash_set = LIKELY_HASHES),
    (hash_layers = 3),
    (precompute_encodings = true),
    (encoding_set = ENCODINGS_NO_ROT),
    (encoding_layers = 3),
    (debugging = false)
  );
  const url_leaks = leak_detector.check_url(request.url, (encoding_layers = 3));
  if (url_leaks.size) {
    console.log("URL leak occured by tracker domain:", timeStamp, url_leaks);
    console.log(tdsResult);
    return {
      block: true,
      type: "Tracker Domain",
      timeStamp,
      domain: requestBaseDomain,
      trackerDetails: tdsResult ? tdsResult.tracker : undefined,
      inputFields: inputElements.inputFields.filter(el => [...url_leaks].some(leak => leak.includes(el.value)))
    };
  }

  let requestBodies = [];
  const reqBody = request.requestBody;
  if (request.method == "POST" && reqBody) {
    if (reqBody.raw) {
      try {
        requestBodies = reqBody.raw.map(function (data) {
          return decodeRequestBody(data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  for (const reqBody of requestBodies) {
    const postLeaks = leak_detector.check_post_data(
      reqBody,
      (encoding_layers = 3)
    );
    if (postLeaks.size) {
      console.log(
        "POST body leak to tracker domain ",
        timeStamp,
        postLeaks
      );
      console.log(tdsResult);
      return {
        block: true,
        type: "Tracker Domain",
        timeStamp,
        domain: requestBaseDomain,
        trackerDetails: tdsResult ? tdsResult.tracker : undefined,
        inputFields: inputElements.inputFields.filter(
          el => [...postLeaks].some(leak => leak.includes(el.value))
        )
      };
    }
  }
  return {
    block: false,
  };
}

function checkSniff(elValue, xpath, fieldName, stack, tabURL) {
  // Taken from https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/bfbd47a4c7a1b37e3ae73dc432386bd12798dbf1/shared/js/content-scope/tracking-cookies-1p-protection.js#L14
  const lineTest = /(\()?(http[^)]+):[0-9]+:[0-9]+(\))?/;
  try {
    // Based on https://github.com/duckduckgo/duckduckgo-privacy-extension/blob/bfbd47a4c7a1b37e3ae73dc432386bd12798dbf1/shared/js/content-scope/tracking-cookies-1p-protection.js#L31-L38
    let scriptOrigins = new Set();
    let scriptURLs = new Set();
    for (const stackFrame of stack) {
      const res = stackFrame.match(lineTest);
      const scriptUrl = res && res[2];  // url is the second capture group
      if (scriptUrl) {
        scriptOrigins.add(getHostName(scriptUrl));
        scriptURLs.add(scriptUrl);
      }
    }

    const tabDomain = getBaseDomainFromUrl(tabURL);
    // quit if all scripts have the same domain as the website
    const sameSiteScript = [...scriptOrigins].every(
      (host) =>
        getBaseDomain(host) === tabDomain || host.endsWith(`.${tabDomain}`)
    );
    if (sameSiteScript) {
      return undefined;
    }

    // quit if all scripts have the same entity (owner) as the website
    const sameEntityDomain = [...scriptOrigins].every(
      (host) =>
        entities[tabDomain] &&
        entities[getBaseDomain(host)] &&
        entities[tabDomain] === entities[host]
    );
    if (sameEntityDomain) {
      return undefined;
    }

    // take third-party scripts only
    let thirdPartyScriptUrls = Array.from(scriptURLs).filter(
      (url) => getBaseDomainFromUrl(url) !== tabDomain
    );

    // run the tracker detection
    const tdsResults = [...thirdPartyScriptUrls].map((scriptURL) => {
      return {
        domain: getBaseDomainFromUrl(scriptURL),
        tracker: tds.getTrackerData(scriptURL, tabURL, ""),
      };
    });

    let trackersList = [];
    for (const tdsResult of tdsResults) {
      let domainType;
      let trackerDetails;
      if (tdsResult.tracker === null || tdsResult.tracker.action !== "block") {
        // if the tracker is not in the blocklist, then it is not a tracker
        domainType = "Third Party"; // not in the blocklist
      } else {
        domainType = "Tracker Script";
        trackerDetails = tdsResult.tracker.tracker;
      }
      let trackerRes = {
        xpath: xpath,
        inputValue: elValue,
        type: domainType,
        fieldName,
        domain: tdsResult.domain,
        trackerDetails: trackerDetails,
      };
      trackersList.push(trackerRes);
    }
    if (!window.thirdPartyControl) {
      return [...trackersList].filter((host) =>
      host['type'] === 'Tracker Script');
    }
    return trackersList;
  } catch (e) {
    console.warn("Error in HTML input getter override", e);
  }
}

function setBadge(currTabId) {
  chrome.storage.local.get("extension_switch", function (storage) {
    let badgeText = "";
    let badgeBackgroundColor = [0,255,0,255]; // green

    // if extension is switched on
    if (storage.extension_switch) {
 
      let leakyReqNum = 0;
      let leakyReqs = leaky_requests[currTabId];
      if(leakyReqs){
        for (const domain of Object.keys(leakyReqs)) {
          leakyReqNum += leakyReqs[domain].details.length;
        }
      }

      badgeText = leakyReqNum.toString();

      if (leakyReqNum > 0) {
        badgeBackgroundColor = [255,0,0,255]; // red
      } else {
        let sniffNum = 0;
        const tabSniffs = sniffs[currTabId];
        if (tabSniffs) {
          for (const domain of Object.keys(tabSniffs)) {
            sniffNum += tabSniffs[domain].details.length;
          }
        }
        if (sniffNum > 0) {
          badgeText = sniffNum.toString();
          badgeBackgroundColor = [255,255,0,255]; // yellow
        }
      }
    }

    chrome.browserAction.setBadgeText({text:badgeText, tabId:currTabId});
    chrome.browserAction.setBadgeBackgroundColor({color:badgeBackgroundColor, tabId:currTabId});
  });
}
