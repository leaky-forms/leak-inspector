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