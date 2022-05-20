var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (r) {
      var e,
        t,
        a,
        o,
        n,
        c,
        d,
        h = "",
        C = 0;
      for (r = Base64._utf8_encode(r); C < r.length;)
        (o = (e = r.charCodeAt(C++)) >> 2),
          (n = ((3 & e) << 4) | ((t = r.charCodeAt(C++)) >> 4)),
          (c = ((15 & t) << 2) | ((a = r.charCodeAt(C++)) >> 6)),
          (d = 63 & a),
          isNaN(t) ? (c = d = 64) : isNaN(a) && (d = 64),
          (h =
            h +
            Base64._keyStr.charAt(o) +
            Base64._keyStr.charAt(n) +
            Base64._keyStr.charAt(c) +
            Base64._keyStr.charAt(d));
      return h;
    },
    decode: function (r) {
      var e,
        t,
        a,
        o,
        n,
        c,
        d = "",
        h = 0;
      for (r = r.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < r.length;)
        (e =
          (Base64._keyStr.indexOf(r.charAt(h++)) << 2) |
          ((o = Base64._keyStr.indexOf(r.charAt(h++))) >> 4)),
          (t =
            ((15 & o) << 4) | ((n = Base64._keyStr.indexOf(r.charAt(h++))) >> 2)),
          (a = ((3 & n) << 6) | (c = Base64._keyStr.indexOf(r.charAt(h++)))),
          (d += String.fromCharCode(e)),
          64 != n && (d += String.fromCharCode(t)),
          64 != c && (d += String.fromCharCode(a));
      return (d = Base64._utf8_decode(d));
    },
    _utf8_encode: function (r) {
      r = r.replace(/\r\n/g, "\n");
      for (var e = "", t = 0; t < r.length; t++) {
        var a = r.charCodeAt(t);
        a < 128
          ? (e += String.fromCharCode(a))
          : a > 127 && a < 2048
            ? ((e += String.fromCharCode((a >> 6) | 192)),
              (e += String.fromCharCode((63 & a) | 128)))
            : ((e += String.fromCharCode((a >> 12) | 224)),
              (e += String.fromCharCode(((a >> 6) & 63) | 128)),
              (e += String.fromCharCode((63 & a) | 128)));
      }
      return e;
    },
    _utf8_decode: function (r) {
      for (var e = "", t = 0, a = (c1 = c2 = 0); t < r.length;)
        (a = r.charCodeAt(t)) < 128
          ? ((e += String.fromCharCode(a)), t++)
          : a > 191 && a < 224
            ? ((c2 = r.charCodeAt(t + 1)),
              (e += String.fromCharCode(((31 & a) << 6) | (63 & c2))),
              (t += 2))
            : ((c2 = r.charCodeAt(t + 1)),
              (c3 = r.charCodeAt(t + 2)),
              (e += String.fromCharCode(
                ((15 & a) << 12) | ((63 & c2) << 6) | (63 & c3)
              )),
              (t += 3));
      return e;
    },
  };