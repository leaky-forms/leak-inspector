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