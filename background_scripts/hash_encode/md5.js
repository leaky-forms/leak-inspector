var MD5 = function (r) {
    function n(r, n) {
      return (r << n) | (r >>> (32 - n));
    }
    function t(r, n) {
      var t, o, e, u, f;
      return (
        (e = 2147483648 & r),
        (u = 2147483648 & n),
        (f = (1073741823 & r) + (1073741823 & n)),
        (t = 1073741824 & r) & (o = 1073741824 & n)
          ? 2147483648 ^ f ^ e ^ u
          : t | o
            ? 1073741824 & f
              ? 3221225472 ^ f ^ e ^ u
              : 1073741824 ^ f ^ e ^ u
            : f ^ e ^ u
      );
    }
    function o(r, o, e, u, f, i, a) {
      return (
        (r = t(
          r,
          t(
            t(
              (function (r, n, t) {
                return (r & n) | (~r & t);
              })(o, e, u),
              f
            ),
            a
          )
        )),
        t(n(r, i), o)
      );
    }
    function e(r, o, e, u, f, i, a) {
      return (
        (r = t(
          r,
          t(
            t(
              (function (r, n, t) {
                return (r & t) | (n & ~t);
              })(o, e, u),
              f
            ),
            a
          )
        )),
        t(n(r, i), o)
      );
    }
    function u(r, o, e, u, f, i, a) {
      return (
        (r = t(
          r,
          t(
            t(
              (function (r, n, t) {
                return r ^ n ^ t;
              })(o, e, u),
              f
            ),
            a
          )
        )),
        t(n(r, i), o)
      );
    }
    function f(r, o, e, u, f, i, a) {
      return (
        (r = t(
          r,
          t(
            t(
              (function (r, n, t) {
                return n ^ (r | ~t);
              })(o, e, u),
              f
            ),
            a
          )
        )),
        t(n(r, i), o)
      );
    }
    function i(r) {
      var n,
        t = "",
        o = "";
      for (n = 0; n <= 3; n++)
        t += (o = "0" + ((r >>> (8 * n)) & 255).toString(16)).substr(
          o.length - 2,
          2
        );
      return t;
    }
    var a,
      c,
      C,
      g,
      h,
      d,
      v,
      S,
      m,
      l = Array();
    for (
      l = (function (r) {
        for (
          var n,
          t = r.length,
          o = t + 8,
          e = 16 * ((o - (o % 64)) / 64 + 1),
          u = Array(e - 1),
          f = 0,
          i = 0;
          i < t;
  
        )
          (f = (i % 4) * 8),
            (u[(n = (i - (i % 4)) / 4)] = u[n] | (r.charCodeAt(i) << f)),
            i++;
        return (
          (f = (i % 4) * 8),
          (u[(n = (i - (i % 4)) / 4)] = u[n] | (128 << f)),
          (u[e - 2] = t << 3),
          (u[e - 1] = t >>> 29),
          u
        );
      })(
        (r = (function (r) {
          r = r.replace(/\r\n/g, "\n");
          for (var n = "", t = 0; t < r.length; t++) {
            var o = r.charCodeAt(t);
            o < 128
              ? (n += String.fromCharCode(o))
              : o > 127 && o < 2048
                ? ((n += String.fromCharCode((o >> 6) | 192)),
                  (n += String.fromCharCode((63 & o) | 128)))
                : ((n += String.fromCharCode((o >> 12) | 224)),
                  (n += String.fromCharCode(((o >> 6) & 63) | 128)),
                  (n += String.fromCharCode((63 & o) | 128)));
          }
          return n;
        })(r))
      ),
      d = 1732584193,
      v = 4023233417,
      S = 2562383102,
      m = 271733878,
      a = 0;
      a < l.length;
      a += 16
    )
      (c = d),
        (C = v),
        (g = S),
        (h = m),
        (d = o(d, v, S, m, l[a + 0], 7, 3614090360)),
        (m = o(m, d, v, S, l[a + 1], 12, 3905402710)),
        (S = o(S, m, d, v, l[a + 2], 17, 606105819)),
        (v = o(v, S, m, d, l[a + 3], 22, 3250441966)),
        (d = o(d, v, S, m, l[a + 4], 7, 4118548399)),
        (m = o(m, d, v, S, l[a + 5], 12, 1200080426)),
        (S = o(S, m, d, v, l[a + 6], 17, 2821735955)),
        (v = o(v, S, m, d, l[a + 7], 22, 4249261313)),
        (d = o(d, v, S, m, l[a + 8], 7, 1770035416)),
        (m = o(m, d, v, S, l[a + 9], 12, 2336552879)),
        (S = o(S, m, d, v, l[a + 10], 17, 4294925233)),
        (v = o(v, S, m, d, l[a + 11], 22, 2304563134)),
        (d = o(d, v, S, m, l[a + 12], 7, 1804603682)),
        (m = o(m, d, v, S, l[a + 13], 12, 4254626195)),
        (S = o(S, m, d, v, l[a + 14], 17, 2792965006)),
        (d = e(
          d,
          (v = o(v, S, m, d, l[a + 15], 22, 1236535329)),
          S,
          m,
          l[a + 1],
          5,
          4129170786
        )),
        (m = e(m, d, v, S, l[a + 6], 9, 3225465664)),
        (S = e(S, m, d, v, l[a + 11], 14, 643717713)),
        (v = e(v, S, m, d, l[a + 0], 20, 3921069994)),
        (d = e(d, v, S, m, l[a + 5], 5, 3593408605)),
        (m = e(m, d, v, S, l[a + 10], 9, 38016083)),
        (S = e(S, m, d, v, l[a + 15], 14, 3634488961)),
        (v = e(v, S, m, d, l[a + 4], 20, 3889429448)),
        (d = e(d, v, S, m, l[a + 9], 5, 568446438)),
        (m = e(m, d, v, S, l[a + 14], 9, 3275163606)),
        (S = e(S, m, d, v, l[a + 3], 14, 4107603335)),
        (v = e(v, S, m, d, l[a + 8], 20, 1163531501)),
        (d = e(d, v, S, m, l[a + 13], 5, 2850285829)),
        (m = e(m, d, v, S, l[a + 2], 9, 4243563512)),
        (S = e(S, m, d, v, l[a + 7], 14, 1735328473)),
        (d = u(
          d,
          (v = e(v, S, m, d, l[a + 12], 20, 2368359562)),
          S,
          m,
          l[a + 5],
          4,
          4294588738
        )),
        (m = u(m, d, v, S, l[a + 8], 11, 2272392833)),
        (S = u(S, m, d, v, l[a + 11], 16, 1839030562)),
        (v = u(v, S, m, d, l[a + 14], 23, 4259657740)),
        (d = u(d, v, S, m, l[a + 1], 4, 2763975236)),
        (m = u(m, d, v, S, l[a + 4], 11, 1272893353)),
        (S = u(S, m, d, v, l[a + 7], 16, 4139469664)),
        (v = u(v, S, m, d, l[a + 10], 23, 3200236656)),
        (d = u(d, v, S, m, l[a + 13], 4, 681279174)),
        (m = u(m, d, v, S, l[a + 0], 11, 3936430074)),
        (S = u(S, m, d, v, l[a + 3], 16, 3572445317)),
        (v = u(v, S, m, d, l[a + 6], 23, 76029189)),
        (d = u(d, v, S, m, l[a + 9], 4, 3654602809)),
        (m = u(m, d, v, S, l[a + 12], 11, 3873151461)),
        (S = u(S, m, d, v, l[a + 15], 16, 530742520)),
        (d = f(
          d,
          (v = u(v, S, m, d, l[a + 2], 23, 3299628645)),
          S,
          m,
          l[a + 0],
          6,
          4096336452
        )),
        (m = f(m, d, v, S, l[a + 7], 10, 1126891415)),
        (S = f(S, m, d, v, l[a + 14], 15, 2878612391)),
        (v = f(v, S, m, d, l[a + 5], 21, 4237533241)),
        (d = f(d, v, S, m, l[a + 12], 6, 1700485571)),
        (m = f(m, d, v, S, l[a + 3], 10, 2399980690)),
        (S = f(S, m, d, v, l[a + 10], 15, 4293915773)),
        (v = f(v, S, m, d, l[a + 1], 21, 2240044497)),
        (d = f(d, v, S, m, l[a + 8], 6, 1873313359)),
        (m = f(m, d, v, S, l[a + 15], 10, 4264355552)),
        (S = f(S, m, d, v, l[a + 6], 15, 2734768916)),
        (v = f(v, S, m, d, l[a + 13], 21, 1309151649)),
        (d = f(d, v, S, m, l[a + 4], 6, 4149444226)),
        (m = f(m, d, v, S, l[a + 11], 10, 3174756917)),
        (S = f(S, m, d, v, l[a + 2], 15, 718787259)),
        (v = f(v, S, m, d, l[a + 9], 21, 3951481745)),
        (d = t(d, c)),
        (v = t(v, C)),
        (S = t(S, g)),
        (m = t(m, h));
    return (i(d) + i(v) + i(S) + i(m)).toLowerCase();
  };