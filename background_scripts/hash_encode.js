var HEX_CHARS = "0123456789abcdef".split(""),
  S = [
    41, 46, 67, 201, 162, 216, 124, 1, 61, 54, 84, 161, 236, 240, 6, 19, 98,
    167, 5, 243, 192, 199, 115, 140, 152, 147, 43, 217, 188, 76, 130, 202, 30,
    155, 87, 60, 253, 212, 224, 22, 103, 66, 111, 24, 138, 23, 229, 18, 190, 78,
    196, 214, 218, 158, 222, 73, 160, 251, 245, 142, 187, 47, 238, 122, 169,
    104, 121, 145, 21, 178, 7, 63, 148, 194, 16, 137, 11, 34, 95, 33, 128, 127,
    93, 154, 90, 144, 50, 39, 53, 62, 204, 231, 191, 247, 151, 3, 255, 25, 48,
    179, 72, 165, 181, 209, 215, 94, 146, 42, 172, 86, 170, 198, 79, 184, 56,
    210, 150, 164, 125, 182, 118, 252, 107, 226, 156, 116, 4, 241, 69, 157, 112,
    89, 100, 113, 135, 32, 134, 91, 207, 101, 230, 45, 168, 2, 27, 96, 37, 173,
    174, 176, 185, 246, 28, 70, 97, 105, 52, 64, 126, 15, 85, 71, 163, 35, 221,
    81, 175, 58, 195, 92, 249, 206, 186, 197, 234, 38, 44, 83, 13, 110, 133, 40,
    132, 9, 211, 223, 205, 244, 65, 129, 77, 82, 106, 220, 55, 200, 108, 193,
    171, 250, 36, 225, 123, 8, 12, 189, 177, 74, 120, 136, 149, 139, 227, 99,
    232, 109, 233, 203, 213, 254, 59, 0, 29, 57, 242, 239, 183, 14, 102, 88,
    208, 228, 166, 119, 114, 248, 235, 117, 75, 10, 49, 68, 80, 180, 143, 237,
    31, 26, 219, 153, 141, 51, 159, 17, 131, 20,
  ],
  M = [],
  X = [],
  C = [];
function md2(r) {
  var o,
    f,
    a,
    e,
    t,
    H,
    d = 0,
    A = 1,
    c = 0,
    h = 0,
    i = 0,
    n = r.length;
  for (f = 0; f < 16; ++f) X[f] = C[f] = 0;
  M[16] = M[17] = M[18] = 0;
  do {
    for (
      M[0] = M[16],
      M[1] = M[17],
      M[2] = M[18],
      M[16] =
      M[17] =
      M[18] =
      M[3] =
      M[4] =
      M[5] =
      M[6] =
      M[7] =
      M[8] =
      M[9] =
      M[10] =
      M[11] =
      M[12] =
      M[13] =
      M[14] =
      M[15] =
      0,
      f = h;
      c < n && f < 16;
      ++c
    )
      (o = r.charCodeAt(c)) < 128
        ? (M[f++] = o)
        : o < 2048
          ? ((M[f++] = 192 | (o >> 6)), (M[f++] = 128 | (63 & o)))
          : o < 55296 || o >= 57344
            ? ((M[f++] = 224 | (o >> 12)),
              (M[f++] = 128 | ((o >> 6) & 63)),
              (M[f++] = 128 | (63 & o)))
            : ((o = 65536 + (((1023 & o) << 10) | (1023 & r.charCodeAt(++c)))),
              (M[f++] = 240 | (o >> 18)),
              (M[f++] = 128 | ((o >> 12) & 63)),
              (M[f++] = 128 | ((o >> 6) & 63)),
              (M[f++] = 128 | (63 & o)));
    if (((i += f - h), (h = f - 16), c === n && f < 16))
      for (A = 2, t = 16 - (15 & i); f < 16; ++f) M[f] = t;
    for (f = 0; f < 16; ++f) (C[f] ^= S[M[f] ^ d]), (d = C[f]);
    for (f = 0; f < A; ++f)
      for (
        H = 0 === f ? M : C,
        X[16] = H[0],
        X[32] = X[16] ^ X[0],
        X[17] = H[1],
        X[33] = X[17] ^ X[1],
        X[18] = H[2],
        X[34] = X[18] ^ X[2],
        X[19] = H[3],
        X[35] = X[19] ^ X[3],
        X[20] = H[4],
        X[36] = X[20] ^ X[4],
        X[21] = H[5],
        X[37] = X[21] ^ X[5],
        X[22] = H[6],
        X[38] = X[22] ^ X[6],
        X[23] = H[7],
        X[39] = X[23] ^ X[7],
        X[24] = H[8],
        X[40] = X[24] ^ X[8],
        X[25] = H[9],
        X[41] = X[25] ^ X[9],
        X[26] = H[10],
        X[42] = X[26] ^ X[10],
        X[27] = H[11],
        X[43] = X[27] ^ X[11],
        X[28] = H[12],
        X[44] = X[28] ^ X[12],
        X[29] = H[13],
        X[45] = X[29] ^ X[13],
        X[30] = H[14],
        X[46] = X[30] ^ X[14],
        X[31] = H[15],
        X[47] = X[31] ^ X[15],
        t = 0,
        a = 0;
        a < 18;
        ++a
      ) {
        for (e = 0; e < 48; ++e) X[e] = t = X[e] ^ S[t];
        t = (t + a) & 255;
      }
  } while (1 === A);
  var l = "";
  for (f = 0; f < 16; ++f)
    l += HEX_CHARS[(X[f] >> 4) & 15] + HEX_CHARS[15 & X[f]];
  return l;
}

var hexcase = 0,
  b64pad = "",
  chrsz = 8;
function hex_md4(r) {
  return binl2hex(core_md4(str2binl(r), r.length * chrsz));
}
function b64_md4(r) {
  return binl2b64(core_md4(str2binl(r), r.length * chrsz));
}
function str_md4(r) {
  return binl2str(core_md4(str2binl(r), r.length * chrsz));
}
function hex_hmac_md4(r, d) {
  return binl2hex(core_hmac_md4(r, d));
}
function b64_hmac_md4(r, d) {
  return binl2b64(core_hmac_md4(r, d));
}
function str_hmac_md4(r, d) {
  return binl2str(core_hmac_md4(r, d));
}
function md4_vm_test() {
  return "a448017aaf21d8525fc10ae87aa6729d" == hex_md4("abc");
}
function core_md4(r, d) {
  (r[d >> 5] |= 128 << d % 32), (r[14 + (((d + 64) >>> 9) << 4)] = d);
  for (
    var n = 1732584193, _ = -271733879, m = -1732584194, h = 271733878, f = 0;
    f < r.length;
    f += 16
  ) {
    var t = n,
      c = _,
      e = m,
      a = h;
    (n = md4_ff(n, _, m, h, r[f + 0], 3)),
      (h = md4_ff(h, n, _, m, r[f + 1], 7)),
      (m = md4_ff(m, h, n, _, r[f + 2], 11)),
      (_ = md4_ff(_, m, h, n, r[f + 3], 19)),
      (n = md4_ff(n, _, m, h, r[f + 4], 3)),
      (h = md4_ff(h, n, _, m, r[f + 5], 7)),
      (m = md4_ff(m, h, n, _, r[f + 6], 11)),
      (_ = md4_ff(_, m, h, n, r[f + 7], 19)),
      (n = md4_ff(n, _, m, h, r[f + 8], 3)),
      (h = md4_ff(h, n, _, m, r[f + 9], 7)),
      (m = md4_ff(m, h, n, _, r[f + 10], 11)),
      (_ = md4_ff(_, m, h, n, r[f + 11], 19)),
      (n = md4_ff(n, _, m, h, r[f + 12], 3)),
      (h = md4_ff(h, n, _, m, r[f + 13], 7)),
      (m = md4_ff(m, h, n, _, r[f + 14], 11)),
      (n = md4_gg(
        n,
        (_ = md4_ff(_, m, h, n, r[f + 15], 19)),
        m,
        h,
        r[f + 0],
        3
      )),
      (h = md4_gg(h, n, _, m, r[f + 4], 5)),
      (m = md4_gg(m, h, n, _, r[f + 8], 9)),
      (_ = md4_gg(_, m, h, n, r[f + 12], 13)),
      (n = md4_gg(n, _, m, h, r[f + 1], 3)),
      (h = md4_gg(h, n, _, m, r[f + 5], 5)),
      (m = md4_gg(m, h, n, _, r[f + 9], 9)),
      (_ = md4_gg(_, m, h, n, r[f + 13], 13)),
      (n = md4_gg(n, _, m, h, r[f + 2], 3)),
      (h = md4_gg(h, n, _, m, r[f + 6], 5)),
      (m = md4_gg(m, h, n, _, r[f + 10], 9)),
      (_ = md4_gg(_, m, h, n, r[f + 14], 13)),
      (n = md4_gg(n, _, m, h, r[f + 3], 3)),
      (h = md4_gg(h, n, _, m, r[f + 7], 5)),
      (m = md4_gg(m, h, n, _, r[f + 11], 9)),
      (n = md4_hh(
        n,
        (_ = md4_gg(_, m, h, n, r[f + 15], 13)),
        m,
        h,
        r[f + 0],
        3
      )),
      (h = md4_hh(h, n, _, m, r[f + 8], 9)),
      (m = md4_hh(m, h, n, _, r[f + 4], 11)),
      (_ = md4_hh(_, m, h, n, r[f + 12], 15)),
      (n = md4_hh(n, _, m, h, r[f + 2], 3)),
      (h = md4_hh(h, n, _, m, r[f + 10], 9)),
      (m = md4_hh(m, h, n, _, r[f + 6], 11)),
      (_ = md4_hh(_, m, h, n, r[f + 14], 15)),
      (n = md4_hh(n, _, m, h, r[f + 1], 3)),
      (h = md4_hh(h, n, _, m, r[f + 9], 9)),
      (m = md4_hh(m, h, n, _, r[f + 5], 11)),
      (_ = md4_hh(_, m, h, n, r[f + 13], 15)),
      (n = md4_hh(n, _, m, h, r[f + 3], 3)),
      (h = md4_hh(h, n, _, m, r[f + 11], 9)),
      (m = md4_hh(m, h, n, _, r[f + 7], 11)),
      (_ = md4_hh(_, m, h, n, r[f + 15], 15)),
      (n = safe_add(n, t)),
      (_ = safe_add(_, c)),
      (m = safe_add(m, e)),
      (h = safe_add(h, a));
  }
  return Array(n, _, m, h);
}
function md4_cmn(r, d, n, _, m, h) {
  return safe_add(rol(safe_add(safe_add(d, r), safe_add(_, h)), m), n);
}
function md4_ff(r, d, n, _, m, h) {
  return md4_cmn((d & n) | (~d & _), r, 0, m, h, 0);
}
function md4_gg(r, d, n, _, m, h) {
  return md4_cmn((d & n) | (d & _) | (n & _), r, 0, m, h, 1518500249);
}
function md4_hh(r, d, n, _, m, h) {
  return md4_cmn(d ^ n ^ _, r, 0, m, h, 1859775393);
}
function core_hmac_md4(r, d) {
  var n = str2binl(r);
  n.length > 16 && (n = core_md4(n, r.length * chrsz));
  for (var _ = Array(16), m = Array(16), h = 0; h < 16; h++)
    (_[h] = 909522486 ^ n[h]), (m[h] = 1549556828 ^ n[h]);
  var f = core_md4(_.concat(str2binl(d)), 512 + d.length * chrsz);
  return core_md4(m.concat(f), 640);
}
function safe_add(r, d) {
  var n = (65535 & r) + (65535 & d);
  return (((r >> 16) + (d >> 16) + (n >> 16)) << 16) | (65535 & n);
}
function rol(r, d) {
  return (r << d) | (r >>> (32 - d));
}
function str2binl(r) {
  for (
    var d = Array(), n = (1 << chrsz) - 1, _ = 0;
    _ < r.length * chrsz;
    _ += chrsz
  )
    d[_ >> 5] |= (r.charCodeAt(_ / chrsz) & n) << _ % 32;
  return d;
}
function binl2str(r) {
  for (var d = "", n = (1 << chrsz) - 1, _ = 0; _ < 32 * r.length; _ += chrsz)
    d += String.fromCharCode((r[_ >> 5] >>> _ % 32) & n);
  return d;
}
function binl2hex(r) {
  for (
    var d = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", n = "", _ = 0;
    _ < 4 * r.length;
    _++
  )
    n +=
      d.charAt((r[_ >> 2] >> ((_ % 4) * 8 + 4)) & 15) +
      d.charAt((r[_ >> 2] >> ((_ % 4) * 8)) & 15);
  return n;
}
function binl2b64(r) {
  for (var d = "", n = 0; n < 4 * r.length; n += 3)
    for (
      var _ =
        (((r[n >> 2] >> ((n % 4) * 8)) & 255) << 16) |
        (((r[(n + 1) >> 2] >> (((n + 1) % 4) * 8)) & 255) << 8) |
        ((r[(n + 2) >> 2] >> (((n + 2) % 4) * 8)) & 255),
      m = 0;
      m < 4;
      m++
    )
      8 * n + 6 * m > 32 * r.length
        ? (d += b64pad)
        : (d +=
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(
            (_ >> (6 * (3 - m))) & 63
          ));
  return d;
}

// Was taken from https://git.fh-campuswien.ac.at/CampusCyberSecurityTeam/ctfs/blob/3b757b3dc7134038ebc603f89a0b6983f6352ee2/writeups/2019/neverlan2019.md
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

// Was taken from https://www.movable-type.co.uk/scripts/sha256.html
class Sha256 {
  static hash(t, r) {
    const e = Object.assign({ msgFormat: "string", outFormat: "hex" }, r);
    switch (e.msgFormat) {
      default:
      case "string":
        t = (function (t) {
          try {
            return new TextEncoder()
              .encode(t, "utf-8")
              .reduce((t, r) => t + String.fromCharCode(r), "");
          } catch (r) {
            return unescape(encodeURIComponent(t));
          }
        })(t);
        break;
      case "hex-bytes":
        t = (function (t) {
          const r = t.replace(" ", "");
          return "" == r
            ? ""
            : r
              .match(/.{2}/g)
              .map((t) => String.fromCharCode(parseInt(t, 16)))
              .join("");
        })(t);
    }
    const a = [
      1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
      2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
      1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
      264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
      2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
      113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
      1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
      3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
      430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
      1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
      2428436474, 2756734187, 3204031479, 3329325298,
    ],
      n = [
        1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
        528734635, 1541459225,
      ],
      o = (t += String.fromCharCode(128)).length / 4 + 2,
      h = Math.ceil(o / 16),
      c = new Array(h);
    for (let r = 0; r < h; r++) {
      c[r] = new Array(16);
      for (let e = 0; e < 16; e++)
        c[r][e] =
          (t.charCodeAt(64 * r + 4 * e + 0) << 24) |
          (t.charCodeAt(64 * r + 4 * e + 1) << 16) |
          (t.charCodeAt(64 * r + 4 * e + 2) << 8) |
          (t.charCodeAt(64 * r + 4 * e + 3) << 0);
    }
    const s = (8 * (t.length - 1)) / Math.pow(2, 32),
      R = (8 * (t.length - 1)) >>> 0;
    (c[h - 1][14] = Math.floor(s)), (c[h - 1][15] = R);
    for (let t = 0; t < h; t++) {
      const r = new Array(64);
      for (let e = 0; e < 16; e++) r[e] = c[t][e];
      for (let t = 16; t < 64; t++)
        r[t] =
          (Sha256.σ1(r[t - 2]) +
            r[t - 7] +
            Sha256.σ0(r[t - 15]) +
            r[t - 16]) >>>
          0;
      let e = n[0],
        o = n[1],
        h = n[2],
        s = n[3],
        R = n[4],
        i = n[5],
        S = n[6],
        u = n[7];
      for (let t = 0; t < 64; t++) {
        const n = u + Sha256.Σ1(R) + Sha256.Ch(R, i, S) + a[t] + r[t],
          c = Sha256.Σ0(e) + Sha256.Maj(e, o, h);
        (u = S),
          (S = i),
          (i = R),
          (R = (s + n) >>> 0),
          (s = h),
          (h = o),
          (o = e),
          (e = (n + c) >>> 0);
      }
      (n[0] = (n[0] + e) >>> 0),
        (n[1] = (n[1] + o) >>> 0),
        (n[2] = (n[2] + h) >>> 0),
        (n[3] = (n[3] + s) >>> 0),
        (n[4] = (n[4] + R) >>> 0),
        (n[5] = (n[5] + i) >>> 0),
        (n[6] = (n[6] + S) >>> 0),
        (n[7] = (n[7] + u) >>> 0);
    }
    for (let t = 0; t < n.length; t++)
      n[t] = ("00000000" + n[t].toString(16)).slice(-8);
    const i = "hex-w" == e.outFormat ? " " : "";
    return n.join(i);
  }
  static ROTR(t, r) {
    return (r >>> t) | (r << (32 - t));
  }
  static Σ0(t) {
    return Sha256.ROTR(2, t) ^ Sha256.ROTR(13, t) ^ Sha256.ROTR(22, t);
  }
  static Σ1(t) {
    return Sha256.ROTR(6, t) ^ Sha256.ROTR(11, t) ^ Sha256.ROTR(25, t);
  }
  static σ0(t) {
    return Sha256.ROTR(7, t) ^ Sha256.ROTR(18, t) ^ (t >>> 3);
  }
  static σ1(t) {
    return Sha256.ROTR(17, t) ^ Sha256.ROTR(19, t) ^ (t >>> 10);
  }
  static Ch(t, r, e) {
    return (t & r) ^ (~t & e);
  }
  static Maj(t, r, e) {
    return (t & r) ^ (t & e) ^ (r & e);
  }
}

// Was taken from https://github.com/UCSD-PL/rs-benchmarks/blob/7cbf7a04ce0a4c751e866806c526f951aeb9b0ae/chrome-extensions/any.do/js/libs/sha1.ts
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

//Was taken from https://www.movable-type.co.uk/scripts/sha512.html
class Sha512 {
  static hash(a, e) {
    const c = Object.assign({ msgFormat: "string", outFormat: "hex" }, e);
    switch (c.msgFormat) {
      default:
      case "string":
        a = (function (a) {
          try {
            return new TextEncoder()
              .encode(a, "utf-8")
              .reduce((a, e) => a + String.fromCharCode(e), "");
          } catch (e) {
            return unescape(encodeURIComponent(a));
          }
        })(a);
        break;
      case "hex-bytes":
        a = (function (a) {
          const e = a.replace(" ", "");
          return "" == e
            ? ""
            : e
              .match(/.{2}/g)
              .map((a) => String.fromCharCode(parseInt(a, 16)))
              .join("");
        })(a);
    }
    const t = [
      "428a2f98d728ae22",
      "7137449123ef65cd",
      "b5c0fbcfec4d3b2f",
      "e9b5dba58189dbbc",
      "3956c25bf348b538",
      "59f111f1b605d019",
      "923f82a4af194f9b",
      "ab1c5ed5da6d8118",
      "d807aa98a3030242",
      "12835b0145706fbe",
      "243185be4ee4b28c",
      "550c7dc3d5ffb4e2",
      "72be5d74f27b896f",
      "80deb1fe3b1696b1",
      "9bdc06a725c71235",
      "c19bf174cf692694",
      "e49b69c19ef14ad2",
      "efbe4786384f25e3",
      "0fc19dc68b8cd5b5",
      "240ca1cc77ac9c65",
      "2de92c6f592b0275",
      "4a7484aa6ea6e483",
      "5cb0a9dcbd41fbd4",
      "76f988da831153b5",
      "983e5152ee66dfab",
      "a831c66d2db43210",
      "b00327c898fb213f",
      "bf597fc7beef0ee4",
      "c6e00bf33da88fc2",
      "d5a79147930aa725",
      "06ca6351e003826f",
      "142929670a0e6e70",
      "27b70a8546d22ffc",
      "2e1b21385c26c926",
      "4d2c6dfc5ac42aed",
      "53380d139d95b3df",
      "650a73548baf63de",
      "766a0abb3c77b2a8",
      "81c2c92e47edaee6",
      "92722c851482353b",
      "a2bfe8a14cf10364",
      "a81a664bbc423001",
      "c24b8b70d0f89791",
      "c76c51a30654be30",
      "d192e819d6ef5218",
      "d69906245565a910",
      "f40e35855771202a",
      "106aa07032bbd1b8",
      "19a4c116b8d2d0c8",
      "1e376c085141ab53",
      "2748774cdf8eeb99",
      "34b0bcb5e19b48a8",
      "391c0cb3c5c95a63",
      "4ed8aa4ae3418acb",
      "5b9cca4f7763e373",
      "682e6ff3d6b2b8a3",
      "748f82ee5defb2fc",
      "78a5636f43172f60",
      "84c87814a1f0ab72",
      "8cc702081a6439ec",
      "90befffa23631e28",
      "a4506cebde82bde9",
      "bef9a3f7b2c67915",
      "c67178f2e372532b",
      "ca273eceea26619c",
      "d186b8c721c0c207",
      "eada7dd6cde0eb1e",
      "f57d4f7fee6ed178",
      "06f067aa72176fba",
      "0a637dc5a2c898a6",
      "113f9804bef90dae",
      "1b710b35131c471b",
      "28db77f523047d84",
      "32caab7b40c72493",
      "3c9ebe0a15c9bebc",
      "431d67c49c100d4c",
      "4cc5d4becb3e42b6",
      "597f299cfc657e2a",
      "5fcb6fab3ad6faec",
      "6c44198c4a475817",
    ].map((a) => Sha512.Long.fromString(a)),
      d = [
        "6a09e667f3bcc908",
        "bb67ae8584caa73b",
        "3c6ef372fe94f82b",
        "a54ff53a5f1d36f1",
        "510e527fade682d1",
        "9b05688c2b3e6c1f",
        "1f83d9abfb41bd6b",
        "5be0cd19137e2179",
      ].map((a) => Sha512.Long.fromString(a)),
      r = (a += String.fromCharCode(128)).length / 8 + 2,
      b = Math.ceil(r / 16),
      f = new Array(b);
    for (let e = 0; e < b; e++) {
      f[e] = new Array(16);
      for (let c = 0; c < 16; c++) {
        const t =
          (a.charCodeAt(128 * e + 8 * c + 0) << 24) |
          (a.charCodeAt(128 * e + 8 * c + 1) << 16) |
          (a.charCodeAt(128 * e + 8 * c + 2) << 8) |
          (a.charCodeAt(128 * e + 8 * c + 3) << 0),
          d =
            (a.charCodeAt(128 * e + 8 * c + 4) << 24) |
            (a.charCodeAt(128 * e + 8 * c + 5) << 16) |
            (a.charCodeAt(128 * e + 8 * c + 6) << 8) |
            (a.charCodeAt(128 * e + 8 * c + 7) << 0);
        f[e][c] = new Sha512.Long(t, d);
      }
    }
    f[b - 1][14] = new Sha512.Long(0, 0);
    const n = (8 * (a.length - 1)) / Math.pow(2, 32),
      o = (8 * (a.length - 1)) >>> 0;
    f[b - 1][15] = new Sha512.Long(Math.floor(n), o);
    for (let a = 0; a < b; a++) {
      const e = new Array(80);
      for (let c = 0; c < 16; c++) e[c] = f[a][c];
      for (let a = 16; a < 80; a++)
        e[a] = Sha512.σ1(e[a - 2])
          .add(e[a - 7])
          .add(Sha512.σ0(e[a - 15]))
          .add(e[a - 16]);
      let c = d[0],
        r = d[1],
        b = d[2],
        n = d[3],
        o = d[4],
        h = d[5],
        i = d[6],
        s = d[7];
      for (let a = 0; a < 80; a++) {
        const d = s
          .add(Sha512.Σ1(o))
          .add(Sha512.Ch(o, h, i))
          .add(t[a])
          .add(e[a]),
          f = Sha512.Σ0(c).add(Sha512.Maj(c, r, b));
        (s = i),
          (i = h),
          (h = o),
          (o = n.add(d)),
          (n = b),
          (b = r),
          (r = c),
          (c = d.add(f));
      }
      (d[0] = d[0].add(c)),
        (d[1] = d[1].add(r)),
        (d[2] = d[2].add(b)),
        (d[3] = d[3].add(n)),
        (d[4] = d[4].add(o)),
        (d[5] = d[5].add(h)),
        (d[6] = d[6].add(i)),
        (d[7] = d[7].add(s));
    }
    for (let a = 0; a < d.length; a++) d[a] = d[a].toString();
    const h = "hex-w" == c.outFormat ? " " : "";
    return d.join(h);
  }
  static ROTR(a, e) {
    if (0 == e) return a;
    if (32 == e) return new Sha512.Long(a.lo, a.hi);
    let c = a.hi,
      t = a.lo;
    e > 32 && (([t, c] = [c, t]), (e -= 32));
    const d = (c >>> e) | (t << (32 - e)),
      r = (t >>> e) | (c << (32 - e));
    return new Sha512.Long(d, r);
  }
  static Σ0(a) {
    return Sha512.ROTR(a, 28).xor(Sha512.ROTR(a, 34)).xor(Sha512.ROTR(a, 39));
  }
  static Σ1(a) {
    return Sha512.ROTR(a, 14).xor(Sha512.ROTR(a, 18)).xor(Sha512.ROTR(a, 41));
  }
  static σ0(a) {
    return Sha512.ROTR(a, 1).xor(Sha512.ROTR(a, 8)).xor(a.shr(7));
  }
  static σ1(a) {
    return Sha512.ROTR(a, 19).xor(Sha512.ROTR(a, 61)).xor(a.shr(6));
  }
  static Ch(a, e, c) {
    return a.and(e).xor(a.not().and(c));
  }
  static Maj(a, e, c) {
    return a.and(e).xor(a.and(c)).xor(e.and(c));
  }
}
Sha512.Long = class {
  constructor(a, e) {
    (this.hi = a >>> 0), (this.lo = e >>> 0);
  }
  static fromString(a) {
    const e = parseInt(a.slice(0, -8), 16),
      c = parseInt(a.slice(-8), 16);
    return new Sha512.Long(e, c);
  }
  toString() {
    return (
      ("00000000" + this.hi.toString(16)).slice(-8) +
      ("00000000" + this.lo.toString(16)).slice(-8)
    );
  }
  add(a) {
    const e = this.lo + a.lo,
      c = this.hi + a.hi + (e > 4294967296 ? 1 : 0);
    return new Sha512.Long(c >>> 0, e >>> 0);
  }
  and(a) {
    return new Sha512.Long(this.hi & a.hi, this.lo & a.lo);
  }
  xor(a) {
    return new Sha512.Long(this.hi ^ a.hi, this.lo ^ a.lo);
  }
  not() {
    return new Sha512.Long(~this.hi, ~this.lo);
  }
  shr(a) {
    return 0 == a
      ? this
      : 32 == a
        ? new Sha512.Long(0, this.hi)
        : a > 32
          ? new Sha512.Long(0, this.hi >>> (a - 32))
          : new Sha512.Long(this.hi >>> a, (this.lo >>> a) | (this.hi << (32 - a)));
  }
};

function sha_salted_1(a) {
  return Sha256.hash(a + "QX4QkKEU");
}

// Was taken from https://github.com/pieroxy/lz-string/blob/master/libs/lz-string.min.js
var LZString = (function () {
  var r = String.fromCharCode,
    o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
    e = {};
  function t(r, o) {
    if (!e[r]) {
      e[r] = {};
      for (var n = 0; n < r.length; n++) e[r][r.charAt(n)] = n;
    }
    return e[r][o];
  }
  var i = {
    compressToBase64: function (r) {
      if (null == r) return "";
      var n = i._compress(r, 6, function (r) {
        return o.charAt(r);
      });
      switch (n.length % 4) {
        default:
        case 0:
          return n;
        case 1:
          return n + "===";
        case 2:
          return n + "==";
        case 3:
          return n + "=";
      }
    },
    decompressFromBase64: function (r) {
      return null == r
        ? ""
        : "" == r
          ? null
          : i._decompress(r.length, 32, function (n) {
            return t(o, r.charAt(n));
          });
    },
    compressToUTF16: function (o) {
      return null == o
        ? ""
        : i._compress(o, 15, function (o) {
          return r(o + 32);
        }) + " ";
    },
    decompressFromUTF16: function (r) {
      return null == r
        ? ""
        : "" == r
          ? null
          : i._decompress(r.length, 16384, function (o) {
            return r.charCodeAt(o) - 32;
          });
    },
    compressToUint8Array: function (r) {
      for (
        var o = i.compress(r),
        n = new Uint8Array(2 * o.length),
        e = 0,
        t = o.length;
        e < t;
        e++
      ) {
        var s = o.charCodeAt(e);
        (n[2 * e] = s >>> 8), (n[2 * e + 1] = s % 256);
      }
      return n;
    },
    decompressFromUint8Array: function (o) {
      if (null == o) return i.decompress(o);
      for (var n = new Array(o.length / 2), e = 0, t = n.length; e < t; e++)
        n[e] = 256 * o[2 * e] + o[2 * e + 1];
      var s = [];
      return (
        n.forEach(function (o) {
          s.push(r(o));
        }),
        i.decompress(s.join(""))
      );
    },
    compressToEncodedURIComponent: function (r) {
      return null == r
        ? ""
        : i._compress(r, 6, function (r) {
          return n.charAt(r);
        });
    },
    decompressFromEncodedURIComponent: function (r) {
      return null == r
        ? ""
        : "" == r
          ? null
          : ((r = r.replace(/ /g, "+")),
            i._decompress(r.length, 32, function (o) {
              return t(n, r.charAt(o));
            }));
    },
    compress: function (o) {
      return i._compress(o, 16, function (o) {
        return r(o);
      });
    },
    _compress: function (r, o, n) {
      if (null == r) return "";
      var e,
        t,
        i,
        s = {},
        u = {},
        a = "",
        p = "",
        c = "",
        l = 2,
        f = 3,
        h = 2,
        d = [],
        m = 0,
        v = 0;
      for (i = 0; i < r.length; i += 1)
        if (
          ((a = r.charAt(i)),
            Object.prototype.hasOwnProperty.call(s, a) ||
            ((s[a] = f++), (u[a] = !0)),
            (p = c + a),
            Object.prototype.hasOwnProperty.call(s, p))
        )
          c = p;
        else {
          if (Object.prototype.hasOwnProperty.call(u, c)) {
            if (c.charCodeAt(0) < 256) {
              for (e = 0; e < h; e++)
                (m <<= 1), v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
              for (t = c.charCodeAt(0), e = 0; e < 8; e++)
                (m = (m << 1) | (1 & t)),
                  v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
            } else {
              for (t = 1, e = 0; e < h; e++)
                (m = (m << 1) | t),
                  v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t = 0);
              for (t = c.charCodeAt(0), e = 0; e < 16; e++)
                (m = (m << 1) | (1 & t)),
                  v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
            }
            0 == --l && ((l = Math.pow(2, h)), h++), delete u[c];
          } else
            for (t = s[c], e = 0; e < h; e++)
              (m = (m << 1) | (1 & t)),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t >>= 1);
          0 == --l && ((l = Math.pow(2, h)), h++),
            (s[p] = f++),
            (c = String(a));
        }
      if ("" !== c) {
        if (Object.prototype.hasOwnProperty.call(u, c)) {
          if (c.charCodeAt(0) < 256) {
            for (e = 0; e < h; e++)
              (m <<= 1), v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
            for (t = c.charCodeAt(0), e = 0; e < 8; e++)
              (m = (m << 1) | (1 & t)),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t >>= 1);
          } else {
            for (t = 1, e = 0; e < h; e++)
              (m = (m << 1) | t),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t = 0);
            for (t = c.charCodeAt(0), e = 0; e < 16; e++)
              (m = (m << 1) | (1 & t)),
                v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t >>= 1);
          }
          0 == --l && ((l = Math.pow(2, h)), h++), delete u[c];
        } else
          for (t = s[c], e = 0; e < h; e++)
            (m = (m << 1) | (1 & t)),
              v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
              (t >>= 1);
        0 == --l && ((l = Math.pow(2, h)), h++);
      }
      for (t = 2, e = 0; e < h; e++)
        (m = (m << 1) | (1 & t)),
          v == o - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
          (t >>= 1);
      for (; ;) {
        if (((m <<= 1), v == o - 1)) {
          d.push(n(m));
          break;
        }
        v++;
      }
      return d.join("");
    },
    decompress: function (r) {
      return null == r
        ? ""
        : "" == r
          ? null
          : i._decompress(r.length, 32768, function (o) {
            return r.charCodeAt(o);
          });
    },
    _decompress: function (o, n, e) {
      var t,
        i,
        s,
        u,
        a,
        p,
        c,
        l = [],
        f = 4,
        h = 4,
        d = 3,
        m = "",
        v = [],
        g = { val: e(0), position: n, index: 1 };
      for (t = 0; t < 3; t += 1) l[t] = t;
      for (s = 0, a = Math.pow(2, 2), p = 1; p != a;)
        (u = g.val & g.position),
          (g.position >>= 1),
          0 == g.position && ((g.position = n), (g.val = e(g.index++))),
          (s |= (u > 0 ? 1 : 0) * p),
          (p <<= 1);
      switch (s) {
        case 0:
          for (s = 0, a = Math.pow(2, 8), p = 1; p != a;)
            (u = g.val & g.position),
              (g.position >>= 1),
              0 == g.position && ((g.position = n), (g.val = e(g.index++))),
              (s |= (u > 0 ? 1 : 0) * p),
              (p <<= 1);
          c = r(s);
          break;
        case 1:
          for (s = 0, a = Math.pow(2, 16), p = 1; p != a;)
            (u = g.val & g.position),
              (g.position >>= 1),
              0 == g.position && ((g.position = n), (g.val = e(g.index++))),
              (s |= (u > 0 ? 1 : 0) * p),
              (p <<= 1);
          c = r(s);
          break;
        case 2:
          return "";
      }
      for (l[3] = c, i = c, v.push(c); ;) {
        if (g.index > o) return "";
        for (s = 0, a = Math.pow(2, d), p = 1; p != a;)
          (u = g.val & g.position),
            (g.position >>= 1),
            0 == g.position && ((g.position = n), (g.val = e(g.index++))),
            (s |= (u > 0 ? 1 : 0) * p),
            (p <<= 1);
        switch ((c = s)) {
          case 0:
            for (s = 0, a = Math.pow(2, 8), p = 1; p != a;)
              (u = g.val & g.position),
                (g.position >>= 1),
                0 == g.position && ((g.position = n), (g.val = e(g.index++))),
                (s |= (u > 0 ? 1 : 0) * p),
                (p <<= 1);
            (l[h++] = r(s)), (c = h - 1), f--;
            break;
          case 1:
            for (s = 0, a = Math.pow(2, 16), p = 1; p != a;)
              (u = g.val & g.position),
                (g.position >>= 1),
                0 == g.position && ((g.position = n), (g.val = e(g.index++))),
                (s |= (u > 0 ? 1 : 0) * p),
                (p <<= 1);
            (l[h++] = r(s)), (c = h - 1), f--;
            break;
          case 2:
            return v.join("");
        }
        if ((0 == f && ((f = Math.pow(2, d)), d++), l[c])) m = l[c];
        else {
          if (c !== h) return null;
          m = i + i.charAt(0);
        }
        v.push(m),
          (l[h++] = i + m.charAt(0)),
          (i = m),
          0 == --f && ((f = Math.pow(2, d)), d++);
      }
    },
  };
  return i;
})();
"function" == typeof define && define.amd
  ? define(function () {
    return LZString;
  })
  : "undefined" != typeof module && null != module
    ? (module.exports = LZString)
    : "undefined" != typeof angular &&
    null != angular &&
    angular.module("LZString", []).factory("LZString", function () {
      return LZString;
    });

(p =
  Array.isArray ||
  function (t) {
    return "[object Array]" === Object.prototype.toString.apply(t);
  }),
  (b = function (t) {
    return "string" == typeof t;
  }),
  (g = function (t) {
    return (
      "function" == typeof t ||
      "[object Function]" === Object.prototype.toString.apply(t)
    );
  }),
  (A = function (t, r) {
    var n, o, e;
    if (t && g(r))
      if (p(t))
        for (
          o = 0, e = t.length;
          o < e && ((n = t[o]), !1 !== r.call(n, o, n));
          o++
        );
      else if (b(t))
        for (
          o = 0, e = t.length;
          o < e && ((n = t.charAt(o)), !1 !== r.call(n, o, n));
          o++
        );
      else
        for (o in t)
          if (t.hasOwnProperty(o) && ((n = t[o]), !1 === r.call(n, o, n)))
            break;
    return t;
  }),
  (custom_map_enc = function (t, r) {
    var n,
      o,
      e,
      c = [];
    return (
      (n = "kibp8A4EWRMKHa7gvyz1dOPt6UI5xYD3nqhVwZBXfCcFeJmrLN20lS9QGsjTuo"),
      (o = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
      r &&
      ((n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
        (o = "kibp8A4EWRMKHa7gvyz1dOPt6UI5xYD3nqhVwZBXfCcFeJmrLN20lS9QGsjTuo")),
      A(t, function (r) {
        c.push((r = n.indexOf((e = t.charAt(r)))) < 0 ? e : o.charAt(r));
      }),
      c.join("")
    );
  });

(p =
  Array.isArray ||
  function (t) {
    return "[object Array]" === Object.prototype.toString.apply(t);
  }),
  (b = function (t) {
    return "string" == typeof t;
  }),
  (g = function (t) {
    return (
      "function" == typeof t ||
      "[object Function]" === Object.prototype.toString.apply(t)
    );
  }),
  (A = function (t, r) {
    var n, o, e;
    if (t && g(r))
      if (p(t))
        for (
          o = 0, e = t.length;
          o < e && ((n = t[o]), !1 !== r.call(n, o, n));
          o++
        );
      else if (b(t))
        for (
          o = 0, e = t.length;
          o < e && ((n = t.charAt(o)), !1 !== r.call(n, o, n));
          o++
        );
      else
        for (o in t)
          if (t.hasOwnProperty(o) && ((n = t[o]), !1 === r.call(n, o, n)))
            break;
    return t;
  }),
  (custom_map_dec = function (t, r) {
    var n,
      o,
      e,
      c = [];
    return (
      (n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
      (o = "kibp8A4EWRMKHa7gvyz1dOPt6UI5xYD3nqhVwZBXfCcFeJmrLN20lS9QGsjTuo"),
      r &&
      ((n = "kibp8A4EWRMKHa7gvyz1dOPt6UI5xYD3nqhVwZBXfCcFeJmrLN20lS9QGsjTuo"),
        (o = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")),
      A(t, function (r) {
        c.push((r = n.indexOf((e = t.charAt(r)))) < 0 ? e : o.charAt(r));
      }),
      c.join("")
    );
  });

// Was taken from https://gist.github.com/2013techsmarts/2ad28962b478287e452ee8f4025856be
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

DELIMITERS = new RegExp("[&|\\,]|%3D|%26");
EXTENSION_RE = new RegExp("\\\\.[A-Za-z]{2,4}$");
ENCODING_LAYERS = 3;

ENCODINGS_NO_ROT = [
  //'base16',
  // 'base32',
  // 'base58',
  "base64",
  "urlencode",
  // 'yenc',
  // 'entity',
  // 'deflate',
  // 'zlib',
  // 'gzip',
  "lzstring",
  "custom_map_1",
];

LIKELY_ENCODINGS = [
  "base64",
  "urlencode",
  // 'entity',
  "lzstring",
  "custom_map_1",
];

HASHES = [
  "md2",
  "md4",
  "md5",
  "sha1",
  "sha256" /*'sha224', 'sha384',*/,
  "sha512" /*'sha3_224', 'sha3_256', 'sha3_384', 'sha3_512',*/,
  /*'mmh2', 'mmh2_unsigned',*/
  /* 'mmh3_32',*/
  //   'mmh3_64_1', 'mmh3_64_2', 'mmh3_128',
  //   'ripemd160',
  //   'whirlpool',
  "sha_salted_1",
  /* , 'blake2b', 'blake2s'*/
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
    hashes["md4"] = hex_md4;
    hashes["md5"] = MD5;
    hashes["sha1"] = Sha1.hash;
    hashes["sha256"] = Sha256.hash;
    hashes["sha512"] = Sha512.hash;
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
    encodings["base64"] = Base64.encode;
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
    encodings["base64"] = Base64.decode;
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
  _split_cookie(cookie_str) {
    // Returns all parsed parts of the cookie names and values"""
    let tokens = new Set();
    let parameters = new Set();
    try {
      cookies = ck.SimpleCookie();
      cookies.load(cookie_str);
    } catch (error) {
      return tokens, parameters; //# return empty sets
    }

    for (cookie in cookies.values()) {
      this._split_on_delims(cookie.key, tokens, parameters);
      this._split_on_delims(cookie.value, tokens, parameters);
    }
    return tokens, parameters;
  }
  get_location_str = function (header_str) {
    return this._get_header_str(header_str, "Location");
  };
  get_referrer_str = function () {
    return this._get_header_str(header_str, "Referer");
  };
  get_cookie_str = function (header_str, from_request = true) {
    if (!header_str) {
      return "";
    }
    if (from_request) {
      header_name = "Cookie";
    } else {
      header_name = "Set-Cookie";
    }

    return this._get_header_str(header_str, header_name);
  };
  check_cookies(
    header_str,
    encoding_layers = 3,
    from_request = true,
    substring_search = true
  ) {
    // Check the cookies portion of the header string for leaks"""
    let cookie_str = this.get_cookie_str(header_str, from_request);
    if (!cookie_str) {
      return [];
    }
    tokens,
      (parameters = this._split_cookie(
        header_str,
        (from_request = from_request)
      ));
    this._checked = [];
    return this._check_whole_and_parts_for_leaks(
      cookie_str,
      tokens,
      parameters,
      encoding_layers,
      substring_search
    );
  }
  check_cookie_str(cookie_str, encoding_layers = 3, substring_search = true) {
    // Check the cookie (either request or response) string for leaks"""
    if (!cookie_str) {
      return [];
    }
    tokens, (parameters = this._split_cookie(cookie_str));
    this._checked = [];
    return this._check_whole_and_parts_for_leaks(
      cookie_str,
      tokens,
      parameters,
      encoding_layers,
      substring_search
    );
  }
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

// //     PWD = 'mypwd111111111111'
// //     EMAIL = 'cosicadam0+cision.com@gmail.com'
// //     EMAIL2 = '11111@gmail.com'

// const leak_detector = new LeakDetector(
//   searchTerms,
//   (precompute_hashes = true),
//   (hash_set = LIKELY_HASHES),
//   (hash_layers = 3),
//   (precompute_encodings = true),
//   (encoding_set = ENCODINGS_NO_ROT),
//   (encoding_layers = 3),
//   (debugging = false)
// );

// //     // URL = "https://www.awin1.com/a/b.php?merchantId=6604&hash=efd356ba6de9ca3f73f09823bff72f5dc8bdc026324c00350a94d4431963e96c&bId=HLEX_60d441ba361b17.54766982"
// //     // url_leaks = leak_detector.check_url(URL, encoding_layers=3)
// //     // console.log(url_leaks);

// let POST_DATA = "l2ryyrvf~16~2#signin-userid~N9_dGVzdEBnbWFpbC5jb20=~vn.2_dXNlcklE*ei.2_c2lnbmluLXVzZXJpZA==*selectorActionCount.0_7*eventId.0_l6*AB.5_vi_MQ==_vn_RGVmYXVsdA==_ei_OTY3MzI=_en_Q291bnRyeSBDb2RlIGZvciBkYXRhTGF5ZXI=*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_MTAyMTMx_en_W01FUkNILTEyMzAwXSBbSG9tZXBhZ2VdIE1vdmUgVGhpcyBXZWVrcyBUb3AgT2ZmZXJzIEZvciBHZW90YXJnZXRlZCBSZWdpb25zIChNLmNvbSkgVVBEQVRFRA==*vi_MA==_vn_TUVSQ0gtMTE4NTg=_ei_MTAxNzU1_en_W0FFTV0gW0hvbWVwYWdlXSBbSGVybyAtIFN1cGVyIFNpemVkXSBQcmlvcml0eSBPcmRlciAoTS5jb20p*vi_MA==_vn_TUVSQ0gtMTE4NTg=_ei_MTAxNzU1_en_W0FFTV0gW0hvbWVwYWdlXSBbSGVybyAtIFN1cGVyIFNpemVkXSBQcmlvcml0eSBPcmRlciAoTS5jb20p*vi_Nw==_vn_TUVSQ0gtMTE4Njc=_ei_OTkzNTA=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAzXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_Nw==_vn_TUVSQ0gtMTE4Njc=_ei_OTkzNTA=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAzXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTA=_vn_TUVSQ0gtMTE4NzA=_ei_OTkzNDk=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSA0XSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTA=_vn_TUVSQ0gtMTE4NzA=_ei_OTkzNDk=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSA0XSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTM=_vn_TUVSQ0gtMTE4NjE=_ei_OTkzNTE=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAyXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTM=_vn_TUVSQ0gtMTE4NjE=_ei_OTkzNTE=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAyXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_Mw==_vn_RU1FQQ==_ei_MTAyMTI1_en_W0hvbWVwYWdlXSBbRmVhdHVyZWQgRGVzdGluYXRpb25zXSBHZW90YXJnZXRlZCBVcGRhdGVzIChNLmNvbSk=*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_OTkwMjM=_en_W01FUkNILTg3NjFdIFtIb21lcGFnZV0gQ2FyZWVycyBCYW5uZXIgMDkyMSBBRU0gKE0uY29tKQ==*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_OTM3MTA=_en_W1RSQUNLSU5HXSBtZXJjaFZpZXdlZA==~-~r15-216668786~-~~l2ryyrvh~0~2#signin-userid~EdGVzdEBnbWFpbC5jb20=~ft.0_66z*vn.2_dXNlcklE*ei.2_c2lnbmluLXVzZXJpZA==*selectorActionCount.0_8*eventId.0_l7*AB.5_vi_MQ==_vn_RGVmYXVsdA==_ei_OTY3MzI=_en_Q291bnRyeSBDb2RlIGZvciBkYXRhTGF5ZXI=*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_MTAyMTMx_en_W01FUkNILTEyMzAwXSBbSG9tZXBhZ2VdIE1vdmUgVGhpcyBXZWVrcyBUb3AgT2ZmZXJzIEZvciBHZW90YXJnZXRlZCBSZWdpb25zIChNLmNvbSkgVVBEQVRFRA==*vi_MA==_vn_TUVSQ0gtMTE4NTg=_ei_MTAxNzU1_en_W0FFTV0gW0hvbWVwYWdlXSBbSGVybyAtIFN1cGVyIFNpemVkXSBQcmlvcml0eSBPcmRlciAoTS5jb20p*vi_MA==_vn_TUVSQ0gtMTE4NTg=_ei_MTAxNzU1_en_W0FFTV0gW0hvbWVwYWdlXSBbSGVybyAtIFN1cGVyIFNpemVkXSBQcmlvcml0eSBPcmRlciAoTS5jb20p*vi_Nw==_vn_TUVSQ0gtMTE4Njc=_ei_OTkzNTA=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAzXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_Nw==_vn_TUVSQ0gtMTE4Njc=_ei_OTkzNTA=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAzXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTA=_vn_TUVSQ0gtMTE4NzA=_ei_OTkzNDk=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSA0XSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTA=_vn_TUVSQ0gtMTE4NzA=_ei_OTkzNDk=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSA0XSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTM=_vn_TUVSQ0gtMTE4NjE=_ei_OTkzNTE=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAyXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTM=_vn_TUVSQ0gtMTE4NjE=_ei_OTkzNTE=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAyXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_Mw==_vn_RU1FQQ==_ei_MTAyMTI1_en_W0hvbWVwYWdlXSBbRmVhdHVyZWQgRGVzdGluYXRpb25zXSBHZW90YXJnZXRlZCBVcGRhdGVzIChNLmNvbSk=*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_OTkwMjM=_en_W01FUkNILTg3NjFdIFtIb21lcGFnZV0gQ2FyZWVycyBCYW5uZXIgMDkyMSBBRU0gKE0uY29tKQ==*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_OTM3MTA=_en_W1RSQUNLSU5HXSBtZXJjaFZpZXdlZA==~-~-~-~~l2ryys8m~29~-~Nio_6x*gx_8h*ft_9j*er_al*du_bm*cx_cr*c1_dt~ft.0_1z*selectorActionCount.0_j*eventId.0_li*AB.5_vi_MQ==_vn_RGVmYXVsdA==_ei_OTY3MzI=_en_Q291bnRyeSBDb2RlIGZvciBkYXRhTGF5ZXI=*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_MTAyMTMx_en_W01FUkNILTEyMzAwXSBbSG9tZXBhZ2VdIE1vdmUgVGhpcyBXZWVrcyBUb3AgT2ZmZXJzIEZvciBHZW90YXJnZXRlZCBSZWdpb25zIChNLmNvbSkgVVBEQVRFRA==*vi_MA==_vn_TUVSQ0gtMTE4NTg=_ei_MTAxNzU1_en_W0FFTV0gW0hvbWVwYWdlXSBbSGVybyAtIFN1cGVyIFNpemVkXSBQcmlvcml0eSBPcmRlciAoTS5jb20p*vi_MA==_vn_TUVSQ0gtMTE4NTg=_ei_MTAxNzU1_en_W0FFTV0gW0hvbWVwYWdlXSBbSGVybyAtIFN1cGVyIFNpemVkXSBQcmlvcml0eSBPcmRlciAoTS5jb20p*vi_Nw==_vn_TUVSQ0gtMTE4Njc=_ei_OTkzNTA=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAzXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_Nw==_vn_TUVSQ0gtMTE4Njc=_ei_OTkzNTA=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAzXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTA=_vn_TUVSQ0gtMTE4NzA=_ei_OTkzNDk=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSA0XSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTA=_vn_TUVSQ0gtMTE4NzA=_ei_OTkzNDk=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSA0XSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTM=_vn_TUVSQ0gtMTE4NjE=_ei_OTkzNTE=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAyXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_MTM=_vn_TUVSQ0gtMTE4NjE=_ei_OTkzNTE=_en_W0FFTV1bSG9tZXBhZ2VdIFs0IFBhY2sgVGlsZSAyXSBQcmlvcml0eSBPcmRlciAoTS5jb20gLSBBRU0p*vi_Mw==_vn_RU1FQQ==_ei_MTAyMTI1_en_W0hvbWVwYWdlXSBbRmVhdHVyZWQgRGVzdGluYXRpb25zXSBHZW90YXJnZXRlZCBVcGRhdGVzIChNLmNvbSk=*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_OTkwMjM=_en_W01FUkNILTg3NjFdIFtIb21lcGFnZV0gQ2FyZWVycyBCYW5uZXIgMDkyMSBBRU0gKE0uY29tKQ==*vi_MA==_vn_RXhwZXJpZW5jZSBB_ei_OTM3MTA=_en_W1RSQUNLSU5HXSBtZXJjaFZpZXdlZA==~-~-~-"
//     post_leaks = leak_detector.check_post_data(POST_DATA, encoding_layers=3)
//     console.log(post_leaks);