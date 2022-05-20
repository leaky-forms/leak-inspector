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
