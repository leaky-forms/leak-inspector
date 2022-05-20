var Sha1 = {
    hash: function (r, t) {
      (t = void 0 === t || t) && (r = Utf8.encode(r));
      for (
        var e = [1518500249, 1859775393, 2400959708, 3395469782],
        a = (r += String.fromCharCode(128)).length / 4 + 2,
        o = Math.ceil(a / 16),
        n = new Array(o),
        f = 0;
        f < o;
        f++
      ) {
        n[f] = new Array(16);
        for (var u = 0; u < 16; u++)
          n[f][u] =
            (r.charCodeAt(64 * f + 4 * u) << 24) |
            (r.charCodeAt(64 * f + 4 * u + 1) << 16) |
            (r.charCodeAt(64 * f + 4 * u + 2) << 8) |
            r.charCodeAt(64 * f + 4 * u + 3);
      }
      (n[o - 1][14] = (8 * (r.length - 1)) / Math.pow(2, 32)),
        (n[o - 1][14] = Math.floor(n[o - 1][14])),
        (n[o - 1][15] = (8 * (r.length - 1)) & 4294967295);
      var h,
        c,
        d,
        S,
        C,
        i = 1732584193,
        v = 4023233417,
        A = 2562383102,
        g = 271733878,
        l = 3285377520,
        s = new Array(80);
      for (f = 0; f < o; f++) {
        for (var x = 0; x < 16; x++) s[x] = n[f][x];
        for (x = 16; x < 80; x++)
          s[x] = Sha1.ROTL(s[x - 3] ^ s[x - 8] ^ s[x - 14] ^ s[x - 16], 1);
        (h = i), (c = v), (d = A), (S = g), (C = l);
        for (x = 0; x < 80; x++) {
          var H = Math.floor(x / 20),
            m =
              (Sha1.ROTL(h, 5) + Sha1.f(H, c, d, S) + C + e[H] + s[x]) &
              4294967295;
          (C = S), (S = d), (d = Sha1.ROTL(c, 30)), (c = h), (h = m);
        }
        (i = (i + h) & 4294967295),
          (v = (v + c) & 4294967295),
          (A = (A + d) & 4294967295),
          (g = (g + S) & 4294967295),
          (l = (l + C) & 4294967295);
      }
      return (
        Sha1.toHexStr(i) +
        Sha1.toHexStr(v) +
        Sha1.toHexStr(A) +
        Sha1.toHexStr(g) +
        Sha1.toHexStr(l)
      );
    },
    f: function (r, t, e, a) {
      switch (r) {
        case 0:
          return (t & e) ^ (~t & a);
        case 1:
          return t ^ e ^ a;
        case 2:
          return (t & e) ^ (t & a) ^ (e & a);
        case 3:
          return t ^ e ^ a;
      }
    },
    ROTL: function (r, t) {
      return (r << t) | (r >>> (32 - t));
    },
    toHexStr: function (r) {
      for (var t = "", e = 7; e >= 0; e--)
        t += ((r >>> (4 * e)) & 15).toString(16);
      return t;
    },
  },
    Utf8 = {
      encode: function (r) {
        var t = r.replace(/[\u0080-\u07ff]/g, function (r) {
          var t = r.charCodeAt(0);
          return String.fromCharCode(192 | (t >> 6), 128 | (63 & t));
        });
        return (t = t.replace(/[\u0800-\uffff]/g, function (r) {
          var t = r.charCodeAt(0);
          return String.fromCharCode(
            224 | (t >> 12),
            128 | ((t >> 6) & 63),
            128 | (63 & t)
          );
        }));
      },
      decode: function (r) {
        var t = r.replace(
          /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
          function (r) {
            var t =
              ((15 & r.charCodeAt(0)) << 12) |
              ((63 & r.charCodeAt(1)) << 6) |
              (63 & r.charCodeAt(2));
            return String.fromCharCode(t);
          }
        );
        return (t = t.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (r) {
          var t = ((31 & r.charCodeAt(0)) << 6) | (63 & r.charCodeAt(1));
          return String.fromCharCode(t);
        }));
      },
    };