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
