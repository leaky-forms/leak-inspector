// This autofill fields detector code was taken from Mozilla's Autofill module; 
// here is the link of the code: 'https://searchfox.org/mozilla-central/source/toolkit/components/formautofill'

// BEGIN of HeuristicRegexp.jsm

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Form Autofill field Heuristics RegExp.
 */

/* exported HeuristicsRegExp */

"use strict";

var HeuristicsRegExp = {
  RULES: {
    email: undefined,
    tel: undefined,
    organization: undefined,
    "street-address": undefined,
    "address-line1": undefined,
    "address-line2": undefined,
    "address-line3": undefined,
    "address-level2": undefined,
    "address-level1": undefined,
    "postal-code": undefined,
    country: undefined,
    // Note: We place the `cc-name` field for Credit Card first, because
    // it is more specific than the `name` field below and we want to check
    // for it before we catch the more generic one.
    "cc-name": undefined,
    name: undefined,
    "given-name": undefined,
    "additional-name": undefined,
    "family-name": undefined,
    "cc-number": undefined,
    "cc-exp-month": undefined,
    "cc-exp-year": undefined,
    "cc-exp": undefined,
    "cc-type": undefined
  },

  RULE_SETS: [
    //=========================================================================
    // Firefox-specific rules
    {
      "address-line1": "addrline1|address_1",
      "address-line2": "addrline2|address_2",
      "address-line3": "addrline3|address_3",
      "address-level1": "land", // de-DE
      "additional-name": "apellido.?materno|lastlastname",
      "cc-number": "(cc|kk)nr", // de-DE
      "cc-exp-month": "(cc|kk)month", // de-DE
      "cc-exp-year": "(cc|kk)year", // de-DE
      "cc-type": "type",
    },

    //=========================================================================
    // These are the rules used by Bitwarden [0], converted into RegExp form.
    // [0] https://github.com/bitwarden/browser/blob/c2b8802201fac5e292d55d5caf3f1f78088d823c/src/services/autofill.service.ts#L436
    {
      email: "(^e-?mail$)|(^email-?address$)",

      tel:
        "(^phone$)" +
        "|(^mobile$)" +
        "|(^mobile-?phone$)" +
        "|(^tel$)" +
        "|(^telephone$)" +
        "|(^phone-?number$)",

      organization:
        "(^company$)" +
        "|(^company-?name$)" +
        "|(^organization$)" +
        "|(^organization-?name$)",

      "street-address":
        "(^address$)" +
        "|(^street-?address$)" +
        "|(^addr$)" +
        "|(^street$)" +
        "|(^mailing-?addr(ess)?$)" + // Modified to not grab lines, below
        "|(^billing-?addr(ess)?$)" + // Modified to not grab lines, below
        "|(^mail-?addr(ess)?$)" + // Modified to not grab lines, below
        "|(^bill-?addr(ess)?$)", // Modified to not grab lines, below

      "address-line1":
        "(^address-?1$)" +
        "|(^address-?line-?1$)" +
        "|(^addr-?1$)" +
        "|(^street-?1$)",

      "address-line2":
        "(^address-?2$)" +
        "|(^address-?line-?2$)" +
        "|(^addr-?2$)" +
        "|(^street-?2$)",

      "address-line3":
        "(^address-?3$)" +
        "|(^address-?line-?3$)" +
        "|(^addr-?3$)" +
        "|(^street-?3$)",

      "address-level2":
        "(^city$)" +
        "|(^town$)" +
        "|(^address-?level-?2$)" +
        "|(^address-?city$)" +
        "|(^address-?town$)",

      "address-level1":
        "(^state$)" +
        "|(^province$)" +
        "|(^provence$)" +
        "|(^address-?level-?1$)" +
        "|(^address-?state$)" +
        "|(^address-?province$)",

      "postal-code":
        "(^postal$)" +
        "|(^zip$)" +
        "|(^zip2$)" +
        "|(^zip-?code$)" +
        "|(^postal-?code$)" +
        "|(^post-?code$)" +
        "|(^address-?zip$)" +
        "|(^address-?postal$)" +
        "|(^address-?code$)" +
        "|(^address-?postal-?code$)" +
        "|(^address-?zip-?code$)",

      country:
        "(^country$)" +
        "|(^country-?code$)" +
        "|(^country-?name$)" +
        "|(^address-?country$)" +
        "|(^address-?country-?name$)" +
        "|(^address-?country-?code$)",

      name: "(^name$)|full-?name|your-?name",

      "given-name":
        "(^f-?name$)" +
        "|(^first-?name$)" +
        "|(^given-?name$)" +
        "|(^first-?n$)",

      "additional-name":
        "(^m-?name$)" +
        "|(^middle-?name$)" +
        "|(^additional-?name$)" +
        "|(^middle-?initial$)" +
        "|(^middle-?n$)" +
        "|(^middle-?i$)",

      "family-name":
        "(^l-?name$)" +
        "|(^last-?name$)" +
        "|(^s-?name$)" +
        "|(^surname$)" +
        "|(^family-?name$)" +
        "|(^family-?n$)" +
        "|(^last-?n$)",

      "cc-name":
        "cc-?name" +
        "|card-?name" +
        "|cardholder-?name" +
        "|cardholder" +
        // "|(^name$)" + // Removed to avoid overwriting "name", above.
        "|(^nom$)",

      "cc-number":
        "cc-?number" +
        "|cc-?num" +
        "|card-?number" +
        "|card-?num" +
        "|(^number$)" +
        "|(^cc$)" +
        "|cc-?no" +
        "|card-?no" +
        "|(^credit-?card$)" +
        "|numero-?carte" +
        "|(^carte$)" +
        "|(^carte-?credit$)" +
        "|num-?carte" +
        "|cb-?num",

      "cc-exp":
        "(^cc-?exp$)" +
        "|(^card-?exp$)" +
        "|(^cc-?expiration$)" +
        "|(^card-?expiration$)" +
        "|(^cc-?ex$)" +
        "|(^card-?ex$)" +
        "|(^card-?expire$)" +
        "|(^card-?expiry$)" +
        "|(^validite$)" +
        "|(^expiration$)" +
        "|(^expiry$)" +
        "|mm-?yy" +
        "|mm-?yyyy" +
        "|yy-?mm" +
        "|yyyy-?mm" +
        "|expiration-?date" +
        "|payment-?card-?expiration" +
        "|(^payment-?cc-?date$)",

      "cc-exp-month":
        "(^exp-?month$)" +
        "|(^cc-?exp-?month$)" +
        "|(^cc-?month$)" +
        "|(^card-?month$)" +
        "|(^cc-?mo$)" +
        "|(^card-?mo$)" +
        "|(^exp-?mo$)" +
        "|(^card-?exp-?mo$)" +
        "|(^cc-?exp-?mo$)" +
        "|(^card-?expiration-?month$)" +
        "|(^expiration-?month$)" +
        "|(^cc-?mm$)" +
        "|(^cc-?m$)" +
        "|(^card-?mm$)" +
        "|(^card-?m$)" +
        "|(^card-?exp-?mm$)" +
        "|(^cc-?exp-?mm$)" +
        "|(^exp-?mm$)" +
        "|(^exp-?m$)" +
        "|(^expire-?month$)" +
        "|(^expire-?mo$)" +
        "|(^expiry-?month$)" +
        "|(^expiry-?mo$)" +
        "|(^card-?expire-?month$)" +
        "|(^card-?expire-?mo$)" +
        "|(^card-?expiry-?month$)" +
        "|(^card-?expiry-?mo$)" +
        "|(^mois-?validite$)" +
        "|(^mois-?expiration$)" +
        "|(^m-?validite$)" +
        "|(^m-?expiration$)" +
        "|(^expiry-?date-?field-?month$)" +
        "|(^expiration-?date-?month$)" +
        "|(^expiration-?date-?mm$)" +
        "|(^exp-?mon$)" +
        "|(^validity-?mo$)" +
        "|(^exp-?date-?mo$)" +
        "|(^cb-?date-?mois$)" +
        "|(^date-?m$)",

      "cc-exp-year":
        "(^exp-?year$)" +
        "|(^cc-?exp-?year$)" +
        "|(^cc-?year$)" +
        "|(^card-?year$)" +
        "|(^cc-?yr$)" +
        "|(^card-?yr$)" +
        "|(^exp-?yr$)" +
        "|(^card-?exp-?yr$)" +
        "|(^cc-?exp-?yr$)" +
        "|(^card-?expiration-?year$)" +
        "|(^expiration-?year$)" +
        "|(^cc-?yy$)" +
        "|(^cc-?y$)" +
        "|(^card-?yy$)" +
        "|(^card-?y$)" +
        "|(^card-?exp-?yy$)" +
        "|(^cc-?exp-?yy$)" +
        "|(^exp-?yy$)" +
        "|(^exp-?y$)" +
        "|(^cc-?yyyy$)" +
        "|(^card-?yyyy$)" +
        "|(^card-?exp-?yyyy$)" +
        "|(^cc-?exp-?yyyy$)" +
        "|(^expire-?year$)" +
        "|(^expire-?yr$)" +
        "|(^expiry-?year$)" +
        "|(^expiry-?yr$)" +
        "|(^card-?expire-?year$)" +
        "|(^card-?expire-?yr$)" +
        "|(^card-?expiry-?year$)" +
        "|(^card-?expiry-?yr$)" +
        "|(^an-?validite$)" +
        "|(^an-?expiration$)" +
        "|(^annee-?validite$)" +
        "|(^annee-?expiration$)" +
        "|(^expiry-?date-?field-?year$)" +
        "|(^expiration-?date-?year$)" +
        "|(^cb-?date-?ann$)" +
        "|(^expiration-?date-?yy$)" +
        "|(^expiration-?date-?yyyy$)" +
        "|(^validity-?year$)" +
        "|(^exp-?date-?year$)" +
        "|(^date-?y$)",

      "cc-type":
        "(^cc-?type$)" +
        "|(^card-?type$)" +
        "|(^card-?brand$)" +
        "|(^cc-?brand$)" +
        "|(^cb-?type$)",
    },

    //=========================================================================
    // These rules are from Chromium source codes [1]. Most of them
    // converted to JS format have the same meaning with the original ones except
    // the first line of "address-level1".
    // [1] https://source.chromium.org/chromium/chromium/src/+/master:components/autofill/core/common/autofill_regex_constants.cc
    {
      // ==== Email ====
      email:
        "e.?mail" +
        "|courriel" + // fr
        "|correo.*electr(o|ó)nico" + // es-ES
        "|メールアドレス" + // ja-JP
        "|Электронной.?Почты" + // ru
        "|邮件|邮箱" + // zh-CN
        "|電郵地址" + // zh-TW
        "|ഇ-മെയില്‍|ഇലക്ട്രോണിക്.?" +
        "മെയിൽ" + // ml
        "|ایمیل|پست.*الکترونیک" + // fa
        "|ईमेल|इलॅक्ट्रॉनिक.?मेल" + // hi
        "|(\\b|_)eposta(\\b|_)" + // tr
        "|(?:이메일|전자.?우편|[Ee]-?mail)(.?주소)?", // ko-KR

      // ==== Telephone ====
      tel:
        "phone|mobile|contact.?number" +
        "|telefonnummer" + // de-DE
        "|telefono|teléfono" + // es
        "|telfixe" + // fr-FR
        "|電話" + // ja-JP
        "|telefone|telemovel" + // pt-BR, pt-PT
        "|телефон" + // ru
        "|मोबाइल" + // hi for mobile
        "|(\\b|_|\\*)telefon(\\b|_|\\*)" + // tr
        "|电话" + // zh-CN
        "|മൊബൈല്‍" + // ml for mobile
        "|(?:전화|핸드폰|휴대폰|휴대전화)(?:.?번호)?", // ko-KR

      // ==== Address Fields ====
      organization:
        "company|business|organization|organisation" +
        "|(?<!con)firma|firmenname" + // de-DE
        "|empresa" + // es
        "|societe|société" + // fr-FR
        "|ragione.?sociale" + // it-IT
        "|会社" + // ja-JP
        "|название.?компании" + // ru
        "|单位|公司" + // zh-CN
        "|شرکت" + // fa
        "|회사|직장", // ko-KR

      "street-address": "streetaddress|street-address",

      "address-line1":
        "^address$|address[_-]?line(one)?|address1|addr1|street" +
        "|(?:shipping|billing)address$" +
        "|strasse|straße|hausnummer|housenumber" + // de-DE
        "|house.?name" + // en-GB
        "|direccion|dirección" + // es
        "|adresse" + // fr-FR
        "|indirizzo" + // it-IT
        "|^住所$|住所1" + // ja-JP
        "|morada|((?<!identificação do )endereço)" + // pt-BR, pt-PT
        "|Адрес" + // ru
        "|地址" + // zh-CN
        "|(\\b|_)adres(?! (başlığı(nız)?|tarifi))(\\b|_)" + // tr
        "|^주소.?$|주소.?1", // ko-KR

      "address-line2":
        "address[_-]?line(2|two)|address2|addr2|street|suite|unit(?!e)" + // Firefox adds `(?!e)` to unit to skip `United State`
        "|adresszusatz|ergänzende.?angaben" + // de-DE
        "|direccion2|colonia|adicional" + // es
        "|addresssuppl|complementnom|appartement" + // fr-FR
        "|indirizzo2" + // it-IT
        "|住所2" + // ja-JP
        "|complemento|addrcomplement" + // pt-BR, pt-PT
        "|Улица" + // ru
        "|地址2" + // zh-CN
        "|주소.?2", // ko-KR

      "address-line3":
        "address[_-]?line(3|three)|address3|addr3|street|suite|unit(?!e)" + // Firefox adds `(?!e)` to unit to skip `United State`
        "|adresszusatz|ergänzende.?angaben" + // de-DE
        "|direccion3|colonia|adicional" + // es
        "|addresssuppl|complementnom|appartement" + // fr-FR
        "|indirizzo3" + // it-IT
        "|住所3" + // ja-JP
        "|complemento|addrcomplement" + // pt-BR, pt-PT
        "|Улица" + // ru
        "|地址3" + // zh-CN
        "|주소.?3", // ko-KR

      "address-level2":
        "city|town" +
        "|\\bort\\b|stadt" + // de-DE
        "|suburb" + // en-AU
        "|ciudad|provincia|localidad|poblacion" + // es
        "|ville|commune" + // fr-FR
        "|localita" + // it-IT
        "|市区町村" + // ja-JP
        "|cidade" + // pt-BR, pt-PT
        "|Город" + // ru
        "|市" + // zh-CN
        "|分區" + // zh-TW
        "|شهر" + // fa
        "|शहर" + // hi for city
        "|ग्राम|गाँव" + // hi for village
        "|നഗരം|ഗ്രാമം" + // ml for town|village
        "|((\\b|_|\\*)([İii̇]l[cç]e(miz|niz)?)(\\b|_|\\*))" + // tr
        "|^시[^도·・]|시[·・]?군[·・]?구", // ko-KR

      "address-level1":
        "(?<!(united|hist|history).?)state|county|region|province" +
        "|county|principality" + // en-UK
        "|都道府県" + // ja-JP
        "|estado|provincia" + // pt-BR, pt-PT
        "|область" + // ru
        "|省" + // zh-CN
        "|地區" + // zh-TW
        "|സംസ്ഥാനം" + // ml
        "|استان" + // fa
        "|राज्य" + // hi
        "|((\\b|_|\\*)(eyalet|[şs]ehir|[İii̇]l(imiz)?|kent)(\\b|_|\\*))" + // tr
        "|^시[·・]?도", // ko-KR

      "postal-code":
        "zip|postal|post.*code|pcode" +
        "|pin.?code" + // en-IN
        "|postleitzahl" + // de-DE
        "|\\bcp\\b" + // es
        "|\\bcdp\\b" + // fr-FR
        "|\\bcap\\b" + // it-IT
        "|郵便番号" + // ja-JP
        "|codigo|codpos|\\bcep\\b" + // pt-BR, pt-PT
        "|Почтовый.?Индекс" + // ru
        "|पिन.?कोड" + // hi
        "|പിന്‍കോഡ്" + // ml
        "|邮政编码|邮编" + // zh-CN
        "|郵遞區號" + // zh-TW
        "|(\\b|_)posta kodu(\\b|_)" + // tr
        "|우편.?번호", // ko-KR

      country:
        "country|countries" +
        "|país|pais" + // es
        "|(\\b|_)land(\\b|_)(?!.*(mark.*))" + // de-DE landmark is a type in india.
        "|(?<!(入|出))国" + // ja-JP
        "|国家" + // zh-CN
        "|국가|나라" + // ko-KR
        "|(\\b|_)(ülke|ulce|ulke)(\\b|_)" + // tr
        "|کشور", // fa

      // ==== Name Fields ====
      "cc-name":
        "card.?(?:holder|owner)|name.*(\\b)?on(\\b)?.*card" +
        "|(?:card|cc).?name|cc.?full.?name" +
        "|karteninhaber" + // de-DE
        "|nombre.*tarjeta" + // es
        "|nom.*carte" + // fr-FR
        "|nome.*cart" + // it-IT
        "|名前" + // ja-JP
        "|Имя.*карты" + // ru
        "|信用卡开户名|开户名|持卡人姓名" + // zh-CN
        "|持卡人姓名", // zh-TW

      name:
        "^name|full.?name|your.?name|customer.?name|bill.?name|ship.?name" +
        "|name.*first.*last|firstandlastname" +
        "|nombre.*y.*apellidos" + // es
        "|^nom(?!bre)" + // fr-FR
        "|お名前|氏名" + // ja-JP
        "|^nome" + // pt-BR, pt-PT
        "|نام.*نام.*خانوادگی" + // fa
        "|姓名" + // zh-CN
        "|(\\b|_|\\*)ad[ı]? soyad[ı]?(\\b|_|\\*)" + // tr
        "|성명", // ko-KR

      "given-name":
        "first.*name|initials|fname|first$|given.*name" +
        "|vorname" + // de-DE
        "|nombre" + // es
        "|forename|prénom|prenom" + // fr-FR
        "|名" + // ja-JP
        "|nome" + // pt-BR, pt-PT
        "|Имя" + // ru
        "|نام" + // fa
        "|이름" + // ko-KR
        "|പേര്" + // ml
        "|(\\b|_|\\*)(isim|ad|ad(i|ı|iniz|ınız)?)(\\b|_|\\*)" + // tr
        "|नाम", // hi

      "additional-name":
        "middle.*name|mname|middle$|middle.*initial|m\\.i\\.|mi$|\\bmi\\b",

      "family-name":
        "last.*name|lname|surname|last$|secondname|family.*name" +
        "|nachname" + // de-DE
        "|apellidos?" + // es
        "|famille|^nom(?!bre)" + // fr-FR
        "|cognome" + // it-IT
        "|姓" + // ja-JP
        "|apelidos|surename|sobrenome" + // pt-BR, pt-PT
        "|Фамилия" + // ru
        "|نام.*خانوادگی" + // fa
        "|उपनाम" + // hi
        "|മറുപേര്" + // ml
        "|(\\b|_|\\*)(soyisim|soyad(i|ı|iniz|ınız)?)(\\b|_|\\*)" + // tr
        "|\\b성(?:[^명]|\\b)", // ko-KR

      // ==== Credit Card Fields ====
      // Note: `cc-name` expression has been moved up, above `name`, in
      // order to handle specialization through ordering.
      "cc-number":
        "(add)?(?:card|cc|acct).?(?:number|#|no|num|field)" +
        "|(?<!telefon|haus|person|fødsels)nummer" + // de-DE, sv-SE, no
        "|カード番号" + // ja-JP
        "|Номер.*карты" + // ru
        "|信用卡号|信用卡号码" + // zh-CN
        "|信用卡卡號" + // zh-TW
        "|카드" + // ko-KR
        // es/pt/fr
        "|(numero|número|numéro)(?!.*(document|fono|phone|réservation))",

      "cc-exp-month":
        "expir|exp.*mo|exp.*date|ccmonth|cardmonth|addmonth" +
        "|gueltig|gültig|monat" + // de-DE
        "|fecha" + // es
        "|date.*exp" + // fr-FR
        "|scadenza" + // it-IT
        "|有効期限" + // ja-JP
        "|validade" + // pt-BR, pt-PT
        "|Срок действия карты" + // ru
        "|月", // zh-CN

      "cc-exp-year":
        "exp|^/|(add)?year" +
        "|ablaufdatum|gueltig|gültig|jahr" + // de-DE
        "|fecha" + // es
        "|scadenza" + // it-IT
        "|有効期限" + // ja-JP
        "|validade" + // pt-BR, pt-PT
        "|Срок действия карты" + // ru
        "|年|有效期", // zh-CN

      "cc-exp":
        "expir|exp.*date|^expfield$" +
        "|gueltig|gültig" + // de-DE
        "|fecha" + // es
        "|date.*exp" + // fr-FR
        "|scadenza" + // it-IT
        "|有効期限" + // ja-JP
        "|validade" + // pt-BR, pt-PT
        "|Срок действия карты", // ru
    },
  ],

  _getRule(name) {
    let rules = [];
    this.RULE_SETS.forEach(set => {
      if (set[name]) {
        rules.push(`(${set[name]})`.normalize("NFKC"));
      }
    });

    const value = new RegExp(rules.join("|"), "iu");
    Object.defineProperty(this.RULES, name, { get: undefined });
    Object.defineProperty(this.RULES, name, { value });
    return value;
  },

  init() {
    Object.keys(this.RULES).forEach(field =>
      Object.defineProperty(this.RULES, field, {
        get() {
          return HeuristicsRegExp._getRule(field);
        },
      })
    );
  },
};

HeuristicsRegExp.init();
// END of HeuristicsRegExp.jsm

// BEGIN of formAutofill.jsm
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 "use strict";

var EXPORTED_SYMBOLS = ["FormAutofill"];

// const { XPCOMUtils } = ChromeUtils.import(
//   "resource://gre/modules/XPCOMUtils.jsm"
// );
// const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

// XPCOMUtils.defineLazyModuleGetters(this, {
//   Region: "resource://gre/modules/Region.jsm",
// });

const ADDRESSES_FIRST_TIME_USE_PREF = "extensions.formautofill.firstTimeUse";
const AUTOFILL_CREDITCARDS_AVAILABLE_PREF =
  "extensions.formautofill.creditCards.available";
const CREDITCARDS_USED_STATUS_PREF = "extensions.formautofill.creditCards.used";
const ENABLED_AUTOFILL_ADDRESSES_PREF =
  "extensions.formautofill.addresses.enabled";
const ENABLED_AUTOFILL_ADDRESSES_CAPTURE_PREF =
  "extensions.formautofill.addresses.capture.enabled";
const ENABLED_AUTOFILL_CREDITCARDS_PREF =
  "extensions.formautofill.creditCards.enabled";
const ENABLED_AUTOFILL_CREDITCARDS_REAUTH_PREF =
  "extensions.formautofill.reauth.enabled";
const AUTOFILL_CREDITCARDS_HIDE_UI_PREF =
  "extensions.formautofill.creditCards.hideui";
const SUPPORTED_COUNTRIES_PREF = "extensions.formautofill.supportedCountries";

// XPCOMUtils.defineLazyPreferenceGetter(
//   this,
//   "logLevel",
//   "extensions.formautofill.loglevel",
//   "Warn"
// );

// A logging helper for debug logging to avoid creating Console objects
// or triggering expensive JS -> C++ calls when debug logging is not
// enabled.
//
// Console objects, even natively-implemented ones, can consume a lot of
// memory, and since this code may run in every content process, that
// memory can add up quickly. And, even when debug-level messages are
// being ignored, console.debug() calls can be expensive.
//
// This helper avoids both of those problems by never touching the
// console object unless debug logging is enabled.
function debug() {
  if (logLevel.toLowerCase() == "debug") {
    this.log.debug(...arguments);
  }
}

var FormAutofill = {
  ENABLED_AUTOFILL_ADDRESSES_PREF,
  ENABLED_AUTOFILL_ADDRESSES_CAPTURE_PREF,
  ENABLED_AUTOFILL_CREDITCARDS_PREF,
  ENABLED_AUTOFILL_CREDITCARDS_REAUTH_PREF,
  ADDRESSES_FIRST_TIME_USE_PREF,
  CREDITCARDS_USED_STATUS_PREF,

  get DEFAULT_REGION() {
    return Region.home || "US";
  },
  get isAutofillEnabled() {
    return (
      FormAutofill.isAutofillAddressesEnabled ||
      this.isAutofillCreditCardsEnabled
    );
  },
  get isAutofillCreditCardsEnabled() {
    return (
      FormAutofill.isAutofillCreditCardsAvailable &&
      FormAutofill._isAutofillCreditCardsEnabled
    );
  },

  // defineLazyLogGetter(scope, logPrefix) {
  //   scope.debug = debug;

  //   XPCOMUtils.defineLazyGetter(scope, "log", () => {
  //     let ConsoleAPI = ChromeUtils.import(
  //       "resource://gre/modules/Console.jsm",
  //       {}
  //     ).ConsoleAPI;
  //     return new ConsoleAPI({
  //       maxLogLevelPref: "extensions.formautofill.loglevel",
  //       prefix: logPrefix,
  //     });
  //   });
  // },
};

// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "isAutofillAddressesEnabled",
//   ENABLED_AUTOFILL_ADDRESSES_PREF
// );
// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "isAutofillAddressesCaptureEnabled",
//   ENABLED_AUTOFILL_ADDRESSES_CAPTURE_PREF
// );
// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "isAutofillCreditCardsAvailable",
//   AUTOFILL_CREDITCARDS_AVAILABLE_PREF
// );
// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "_isAutofillCreditCardsEnabled",
//   ENABLED_AUTOFILL_CREDITCARDS_PREF
// );
// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "isAutofillCreditCardsHideUI",
//   AUTOFILL_CREDITCARDS_HIDE_UI_PREF
// );
// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "isAutofillAddressesFirstTimeUse",
//   ADDRESSES_FIRST_TIME_USE_PREF
// );
// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "AutofillCreditCardsUsedStatus",
//   CREDITCARDS_USED_STATUS_PREF
// );
// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofill,
//   "supportedCountries",
//   SUPPORTED_COUNTRIES_PREF,
//   null,
//   null,
//   val => val.split(",")
// );

// // XXX: This should be invalidated on intl:app-locales-changed.
// XPCOMUtils.defineLazyGetter(FormAutofill, "countries", () => {
//   let availableRegionCodes = Services.intl.getAvailableLocaleDisplayNames(
//     "region"
//   );
//   let displayNames = Services.intl.getRegionDisplayNames(
//     undefined,
//     availableRegionCodes
//   );
//   let result = new Map();
//   for (let i = 0; i < availableRegionCodes.length; i++) {
//     result.set(availableRegionCodes[i].toUpperCase(), displayNames[i]);
//   }
//   return result;
// });

FormAutofill.isAutofillAddressesEnabled = ENABLED_AUTOFILL_ADDRESSES_PREF;
FormAutofill.isAutofillAddressesCaptureEnabled = ENABLED_AUTOFILL_ADDRESSES_CAPTURE_PREF;

FormAutofill.isAutofillCreditCardsAvailable = AUTOFILL_CREDITCARDS_AVAILABLE_PREF;
FormAutofill._isAutofillCreditCardsEnabled = ENABLED_AUTOFILL_CREDITCARDS_PREF;


FormAutofill.isAutofillCreditCardsHideUI = AUTOFILL_CREDITCARDS_HIDE_UI_PREF;
FormAutofill.isAutofillAddressesFirstTimeUse = ADDRESSES_FIRST_TIME_USE_PREF;





FormAutofill.AutofillCreditCardsUsedStatus = CREDITCARDS_USED_STATUS_PREF;
FormAutofill.supportedCountries = SUPPORTED_COUNTRIES_PREF;

FormAutofill.countries = '';

// END of FormAutofill.jsm
//BEGIN of CreditCard.jsm
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 "use strict";

// var EXPORTED_SYMBOLS = ["CreditCard"];

// The list of known and supported credit card network ids ("types")
// This list mirrors the networks from dom/payments/BasicCardPayment.cpp
// and is defined by https://www.w3.org/Payments/card-network-ids
const SUPPORTED_NETWORKS = Object.freeze([
  "amex",
  "cartebancaire",
  "diners",
  "discover",
  "jcb",
  "mastercard",
  "mir",
  "unionpay",
  "visa",
]);

// This lists stores lower cased variations of popular credit card network
// names for matching against strings.
const NETWORK_NAMES = {
  "american express": "amex",
  "master card": "mastercard",
  "union pay": "unionpay",
};

// Based on https://en.wikipedia.org/wiki/Payment_card_number
//
// Notice:
//   - CarteBancaire (`4035`, `4360`) is now recognized as Visa.
//   - UnionPay (`63--`) is now recognized as Discover.
// This means that the order matters.
// First we'll try to match more specific card,
// and if that doesn't match we'll test against the more generic range.
const CREDIT_CARD_IIN = [
  { type: "amex", start: 34, end: 34, len: 15 },
  { type: "amex", start: 37, end: 37, len: 15 },
  { type: "cartebancaire", start: 4035, end: 4035, len: 16 },
  { type: "cartebancaire", start: 4360, end: 4360, len: 16 },
  // We diverge from Wikipedia here, because Diners card
  // support length of 14-19.
  { type: "diners", start: 300, end: 305, len: [14, 19] },
  { type: "diners", start: 3095, end: 3095, len: [14, 19] },
  { type: "diners", start: 36, end: 36, len: [14, 19] },
  { type: "diners", start: 38, end: 39, len: [14, 19] },
  { type: "discover", start: 6011, end: 6011, len: [16, 19] },
  { type: "discover", start: 622126, end: 622925, len: [16, 19] },
  { type: "discover", start: 624000, end: 626999, len: [16, 19] },
  { type: "discover", start: 628200, end: 628899, len: [16, 19] },
  { type: "discover", start: 64, end: 65, len: [16, 19] },
  { type: "jcb", start: 3528, end: 3589, len: [16, 19] },
  { type: "mastercard", start: 2221, end: 2720, len: 16 },
  { type: "mastercard", start: 51, end: 55, len: 16 },
  { type: "mir", start: 2200, end: 2204, len: 16 },
  { type: "unionpay", start: 62, end: 62, len: [16, 19] },
  { type: "unionpay", start: 81, end: 81, len: [16, 19] },
  { type: "visa", start: 4, end: 4, len: 16 },
].sort((a, b) => b.start - a.start);

class CreditCard {
  /**
   * A CreditCard object represents a credit card, with
   * number, name, expiration, network, and CCV.
   * The number is the only required information when creating
   * an object, all other members are optional. The number
   * is validated during construction and will throw if invalid.
   *
   * @param {string} name, optional
   * @param {string} number
   * @param {string} expirationString, optional
   * @param {string|number} expirationMonth, optional
   * @param {string|number} expirationYear, optional
   * @param {string} network, optional
   * @param {string|number} ccv, optional
   * @param {string} encryptedNumber, optional
   * @throws if number is an invalid credit card number
   */
  constructor({
    name,
    number,
    expirationString,
    expirationMonth,
    expirationYear,
    network,
    ccv,
    encryptedNumber,
  }) {
    this._name = name;
    this._unmodifiedNumber = number;
    this._encryptedNumber = encryptedNumber;
    this._ccv = ccv;
    this.number = number;
    let { month, year } = CreditCard.normalizeExpiration({
      expirationString,
      expirationMonth,
      expirationYear,
    });
    this._expirationMonth = month;
    this._expirationYear = year;
    this.network = network;
  }

  set name(value) {
    this._name = value;
  }

  set expirationMonth(value) {
    if (typeof value == "undefined") {
      this._expirationMonth = undefined;
      return;
    }
    this._expirationMonth = CreditCard.normalizeExpirationMonth(value);
  }

  get expirationMonth() {
    return this._expirationMonth;
  }

  set expirationYear(value) {
    if (typeof value == "undefined") {
      this._expirationYear = undefined;
      return;
    }
    this._expirationYear = CreditCard.normalizeExpirationYear(value);
  }

  get expirationYear() {
    return this._expirationYear;
  }

  set expirationString(value) {
    let { month, year } = CreditCard.parseExpirationString(value);
    this.expirationMonth = month;
    this.expirationYear = year;
  }

  set ccv(value) {
    this._ccv = value;
  }

  get number() {
    return this._number;
  }

  /**
   * Sets the number member of a CreditCard object. If the number
   * is not valid according to the Luhn algorithm then the member
   * will get set to the empty string before throwing an exception.
   *
   * @param {string} value
   * @throws if the value is an invalid credit card number
   */
  set number(value) {
    if (value) {
      let normalizedNumber = value.replace(/[-\s]/g, "");
      // Based on the information on wiki[1], the shortest valid length should be
      // 12 digits (Maestro).
      // [1] https://en.wikipedia.org/wiki/Payment_card_number
      normalizedNumber = normalizedNumber.match(/^\d{12,}$/)
        ? normalizedNumber
        : "";
      this._number = normalizedNumber;
    } else {
      this._number = "";
    }

    if (value && !this.isValidNumber()) {
      this._number = "";
      throw new Error("Invalid credit card number");
    }
  }

  get network() {
    return this._network;
  }

  set network(value) {
    this._network = value || undefined;
  }

  // Implements the Luhn checksum algorithm as described at
  // http://wikipedia.org/wiki/Luhn_algorithm
  // Number digit lengths vary with network, but should fall within 12-19 range. [2]
  // More details at https://en.wikipedia.org/wiki/Payment_card_number
  isValidNumber() {
    if (!this._number) {
      return false;
    }

    // Remove dashes and whitespace
    let number = this._number.replace(/[\-\s]/g, "");

    let len = number.length;
    if (len < 12 || len > 19) {
      return false;
    }

    if (!/^\d+$/.test(number)) {
      return false;
    }

    let total = 0;
    for (let i = 0; i < len; i++) {
      let ch = parseInt(number[len - i - 1], 10);
      if (i % 2 == 1) {
        // Double it, add digits together if > 10
        ch *= 2;
        if (ch > 9) {
          ch -= 9;
        }
      }
      total += ch;
    }
    return total % 10 == 0;
  }

  /**
   * Attempts to match the number against known network identifiers.
   *
   * @param {string} ccNumber
   *
   * @returns {string|null}
   */
  static getType(ccNumber) {
    for (let i = 0; i < CREDIT_CARD_IIN.length; i++) {
      const range = CREDIT_CARD_IIN[i];
      if (typeof range.len == "number") {
        if (range.len != ccNumber.length) {
          continue;
        }
      } else if (
        ccNumber.length < range.len[0] ||
        ccNumber.length > range.len[1]
      ) {
        continue;
      }

      const prefixLength = Math.floor(Math.log10(range.start)) + 1;
      const prefix = parseInt(ccNumber.substring(0, prefixLength), 10);
      if (prefix >= range.start && prefix <= range.end) {
        return range.type;
      }
    }
    return null;
  }

  /**
   * Attempts to retrieve a card network identifier based
   * on a name.
   *
   * @param {string|undefined|null} name
   *
   * @returns {string|null}
   */
  static getNetworkFromName(name) {
    if (!name) {
      return null;
    }
    let lcName = name
      .trim()
      .toLowerCase()
      .normalize("NFKC");
    if (SUPPORTED_NETWORKS.includes(lcName)) {
      return lcName;
    }
    for (let term in NETWORK_NAMES) {
      if (lcName.includes(term)) {
        return NETWORK_NAMES[term];
      }
    }
    return null;
  }

  /**
   * Returns true if the card number is valid and the
   * expiration date has not passed. Otherwise false.
   *
   * @returns {boolean}
   */
  isValid() {
    if (!this.isValidNumber()) {
      return false;
    }

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    if (this._expirationYear > currentYear) {
      return true;
    }

    // getMonth is 0-based, so add 1 because credit cards are 1-based
    let currentMonth = currentDate.getMonth() + 1;
    return (
      this._expirationYear == currentYear &&
      this._expirationMonth >= currentMonth
    );
  }

  get maskedNumber() {
    return CreditCard.getMaskedNumber(this._number);
  }

  get longMaskedNumber() {
    return CreditCard.getLongMaskedNumber(this._number);
  }

  /**
   * Get credit card display label. It should display masked numbers, the
   * cardholder's name, and the expiration date, separated by a commas.
   * In addition, the card type is provided in the accessibility label.
   */
  static getLabelInfo({ number, name, month, year, type }) {
    let formatSelector = ["number"];
    if (name) {
      formatSelector.push("name");
    }
    if (month && year) {
      formatSelector.push("expiration");
    }
    let stringId = `credit-card-label-${formatSelector.join("-")}-2`;
    return {
      id: stringId,
      args: {
        number: CreditCard.getMaskedNumber(number),
        name,
        month: month?.toString(),
        year: year?.toString(),
        type,
      },
    };
  }

  /**
   * !!! DEPRECATED !!!
   * Please use getLabelInfo above, as it allows for localization.
   */
  static getLabel({ number, name }) {
    let parts = [];

    if (number) {
      parts.push(CreditCard.getMaskedNumber(number));
    }
    if (name) {
      parts.push(name);
    }
    return parts.join(", ");
  }

  static normalizeExpirationMonth(month) {
    month = parseInt(month, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      return undefined;
    }
    return month;
  }

  static normalizeExpirationYear(year) {
    year = parseInt(year, 10);
    if (isNaN(year) || year < 0) {
      return undefined;
    }
    if (year < 100) {
      year += 2000;
    }
    return year;
  }

  static parseExpirationString(expirationString) {
    let rules = [
      {
        regex: "(\\d{4})[-/](\\d{1,2})",
        yearIndex: 1,
        monthIndex: 2,
      },
      {
        regex: "(\\d{1,2})[-/](\\d{4})",
        yearIndex: 2,
        monthIndex: 1,
      },
      {
        regex: "(\\d{1,2})[-/](\\d{1,2})",
      },
      {
        regex: "(\\d{2})(\\d{2})",
      },
    ];

    for (let rule of rules) {
      let result = new RegExp(`(?:^|\\D)${rule.regex}(?!\\d)`).exec(
        expirationString
      );
      if (!result) {
        continue;
      }

      let year, month;

      if (!rule.yearIndex || !rule.monthIndex) {
        month = parseInt(result[1], 10);
        if (month > 12) {
          year = parseInt(result[1], 10);
          month = parseInt(result[2], 10);
        } else {
          year = parseInt(result[2], 10);
        }
      } else {
        year = parseInt(result[rule.yearIndex], 10);
        month = parseInt(result[rule.monthIndex], 10);
      }

      if (month < 1 || month > 12 || (year >= 100 && year < 2000)) {
        continue;
      }

      return { month, year };
    }
    return { month: undefined, year: undefined };
  }

  static normalizeExpiration({
    expirationString,
    expirationMonth,
    expirationYear,
  }) {
    // Only prefer the string version if missing one or both parsed formats.
    let parsedExpiration = {};
    if (expirationString && (!expirationMonth || !expirationYear)) {
      parsedExpiration = CreditCard.parseExpirationString(expirationString);
    }
    return {
      month: CreditCard.normalizeExpirationMonth(
        parsedExpiration.month || expirationMonth
      ),
      year: CreditCard.normalizeExpirationYear(
        parsedExpiration.year || expirationYear
      ),
    };
  }

  static formatMaskedNumber(maskedNumber) {
    return {
      affix: "****",
      label: maskedNumber.replace(/^\**/, ""),
    };
  }

  static getMaskedNumber(number) {
    return "*".repeat(4) + " " + number.substr(-4);
  }

  static getLongMaskedNumber(number) {
    return "*".repeat(number.length - 4) + number.substr(-4);
  }

  /*
   * Validates the number according to the Luhn algorithm. This
   * method does not throw an exception if the number is invalid.
   */
  static isValidNumber(number) {
    try {
      new CreditCard({ number });
    } catch (ex) {
      return false;
    }
    return true;
  }

  static isValidNetwork(network) {
    return SUPPORTED_NETWORKS.includes(network);
  }
}
CreditCard.SUPPORTED_NETWORKS = SUPPORTED_NETWORKS;

//END of CreditCard.jsm

//BEGIn of formAutofillUtils.jsm
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 "use strict";

// var EXPORTED_SYMBOLS = ["FormAutofillUtils", "AddressDataLoader"];

const ADDRESS_METADATA_PATH = "resource://autofill/addressmetadata/";
const ADDRESS_REFERENCES = "addressReferences.js";
const ADDRESS_REFERENCES_EXT = "addressReferencesExt.js";

const ADDRESSES_COLLECTION_NAME = "addresses";
const CREDITCARDS_COLLECTION_NAME = "creditCards";
const MANAGE_ADDRESSES_KEYWORDS = [
  "manageAddressesTitle",
  "addNewAddressTitle",
];
const EDIT_ADDRESS_KEYWORDS = [
  "givenName",
  "additionalName",
  "familyName",
  "organization2",
  "streetAddress",
  "state",
  "province",
  "city",
  "country",
  "zip",
  "postalCode",
  "email",
  "tel",
];
const MANAGE_CREDITCARDS_KEYWORDS = [
  "manageCreditCardsTitle",
  "addNewCreditCardTitle",
];
const EDIT_CREDITCARD_KEYWORDS = [
  "cardNumber",
  "nameOnCard",
  "cardExpiresMonth",
  "cardExpiresYear",
  "cardNetwork",
];
const FIELD_STATES = {
  NORMAL: "NORMAL",
  AUTO_FILLED: "AUTO_FILLED",
  PREVIEW: "PREVIEW",
};
const SECTION_TYPES = {
  ADDRESS: "address",
  CREDIT_CARD: "creditCard",
};

// The maximum length of data to be saved in a single field for preventing DoS
// attacks that fill the user's hard drive(s).
const MAX_FIELD_VALUE_LENGTH = 200;

// const { XPCOMUtils } = ChromeUtils.import(
//   "resource://gre/modules/XPCOMUtils.jsm"
// );
// const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
// const { FormAutofill } = ChromeUtils.import(
//   "resource://autofill/FormAutofill.jsm"
// );
// XPCOMUtils.defineLazyModuleGetters(this, {
//   CreditCard: "resource://gre/modules/CreditCard.jsm",
//   OSKeyStore: "resource://gre/modules/OSKeyStore.jsm",
// });

let AddressDataLoader = {
  // Status of address data loading. We'll load all the countries with basic level 1
  // information while requesting conutry information, and set country to true.
  // Level 1 Set is for recording which country's level 1/level 2 data is loaded,
  // since we only load this when getCountryAddressData called with level 1 parameter.
  _dataLoaded: {
    country: false,
    level1: new Set(),
  },

  /**
   * Load address data and extension script into a sandbox from different paths.
   * @param   {string} path
   *          The path for address data and extension script. It could be root of the address
   *          metadata folder(addressmetadata/) or under specific country(addressmetadata/TW/).
   * @returns {object}
   *          A sandbox that contains address data object with properties from extension.
   */
  _loadScripts(path) {
    let sandbox = {};
    let extSandbox = {};

    try {
      sandbox = FormAutofillUtils.loadDataFromScript(path + ADDRESS_REFERENCES);
      extSandbox = FormAutofillUtils.loadDataFromScript(
        path + ADDRESS_REFERENCES_EXT
      );
    } catch (e) {
      // Will return only address references if extension loading failed or empty sandbox if
      // address references loading failed.
      return sandbox;
    }

    if (extSandbox.addressDataExt) {
      for (let key in extSandbox.addressDataExt) {
        let addressDataForKey = sandbox.addressData[key];
        if (!addressDataForKey) {
          addressDataForKey = sandbox.addressData[key] = {};
        }

        Object.assign(addressDataForKey, extSandbox.addressDataExt[key]);
      }
    }
    return sandbox;
  },

  /**
   * Convert certain properties' string value into array. We should make sure
   * the cached data is parsed.
   * @param   {object} data Original metadata from addressReferences.
   * @returns {object} parsed metadata with property value that converts to array.
   */
  _parse(data) {
    if (!data) {
      return null;
    }

    const properties = [
      "languages",
      "sub_keys",
      "sub_isoids",
      "sub_names",
      "sub_lnames",
    ];
    for (let key of properties) {
      if (!data[key]) {
        continue;
      }
      // No need to normalize data if the value is array already.
      if (Array.isArray(data[key])) {
        return data;
      }

      data[key] = data[key].split("~");
    }
    return data;
  },

  /**
   * We'll cache addressData in the loader once the data loaded from scripts.
   * It'll become the example below after loading addressReferences with extension:
   * addressData: {
   *               "data/US": {"lang": ["en"], ...// Data defined in libaddressinput metadata
   *                           "alternative_names": ... // Data defined in extension }
   *               "data/CA": {} // Other supported country metadata
   *               "data/TW": {} // Other supported country metadata
   *               "data/TW/台北市": {} // Other supported country level 1 metadata
   *              }
   * @param   {string} country
   * @param   {string?} level1
   * @returns {object} Default locale metadata
   */
  _loadData(country, level1 = null) {
    // Load the addressData if needed
    if (!this._dataLoaded.country) {
      this._addressData = this._loadScripts(ADDRESS_METADATA_PATH).addressData;
      this._dataLoaded.country = true;
    }
    if (!level1) {
      return this._parse(this._addressData[`data/${country}`]);
    }
    // If level1 is set, load addressReferences under country folder with specific
    // country/level 1 for level 2 information.
    if (!this._dataLoaded.level1.has(country)) {
      Object.assign(
        this._addressData,
        this._loadScripts(`${ADDRESS_METADATA_PATH}${country}/`).addressData
      );
      this._dataLoaded.level1.add(country);
    }
    return this._parse(this._addressData[`data/${country}/${level1}`]);
  },

  /**
   * Return the region metadata with default locale and other locales (if exists).
   * @param   {string} country
   * @param   {string?} level1
   * @returns {object} Return default locale and other locales metadata.
   */
  getData(country, level1 = null) {
    let defaultLocale = this._loadData(country, level1);
    if (!defaultLocale) {
      return null;
    }

    let countryData = this._parse(this._addressData[`data/${country}`]);
    let locales = [];
    // TODO: Should be able to support multi-locale level 1/ level 2 metadata query
    //      in Bug 1421886
    if (countryData.languages) {
      let list = countryData.languages.filter(key => key !== countryData.lang);
      locales = list.map(key =>
        this._parse(this._addressData[`${defaultLocale.id}--${key}`])
      );
    }
    return { defaultLocale, locales };
  },
};

this.FormAutofillUtils = {
  get AUTOFILL_FIELDS_THRESHOLD() {
    return 3;
  },

  ADDRESSES_COLLECTION_NAME,
  CREDITCARDS_COLLECTION_NAME,
  MANAGE_ADDRESSES_KEYWORDS,
  EDIT_ADDRESS_KEYWORDS,
  MANAGE_CREDITCARDS_KEYWORDS,
  EDIT_CREDITCARD_KEYWORDS,
  MAX_FIELD_VALUE_LENGTH,
  FIELD_STATES,
  SECTION_TYPES,

  _fieldNameInfo: {
    name: "name",
    "given-name": "name",
    "additional-name": "name",
    "family-name": "name",
    organization: "organization",
    "street-address": "address",
    "address-line1": "address",
    "address-line2": "address",
    "address-line3": "address",
    "address-level1": "address",
    "address-level2": "address",
    "postal-code": "address",
    country: "address",
    "country-name": "address",
    tel: "tel",
    "tel-country-code": "tel",
    "tel-national": "tel",
    "tel-area-code": "tel",
    "tel-local": "tel",
    "tel-local-prefix": "tel",
    "tel-local-suffix": "tel",
    "tel-extension": "tel",
    email: "email",
    "cc-name": "creditCard",
    "cc-given-name": "creditCard",
    "cc-additional-name": "creditCard",
    "cc-family-name": "creditCard",
    "cc-number": "creditCard",
    "cc-exp-month": "creditCard",
    "cc-exp-year": "creditCard",
    "cc-exp": "creditCard",
    "cc-type": "creditCard",
  },

  _collators: {},
  _reAlternativeCountryNames: {},

  isAddressField(fieldName) {
    return (
      !!this._fieldNameInfo[fieldName] && !this.isCreditCardField(fieldName)
    );
  },

  isCreditCardField(fieldName) {
    return this._fieldNameInfo[fieldName] == "creditCard";
  },

  isCCNumber(ccNumber) {
    return CreditCard.isValidNumber(ccNumber);
  },

  ensureLoggedIn(promptMessage) {
    return OSKeyStore.ensureLoggedIn(
      this._reauthEnabledByUser && promptMessage ? promptMessage : false
    );
  },

  /**
   * Get the array of credit card network ids ("types") we expect and offer as valid choices
   *
   * @returns {Array}
   */
  getCreditCardNetworks() {
    return CreditCard.SUPPORTED_NETWORKS;
  },

  getCategoryFromFieldName(fieldName) {
    return this._fieldNameInfo[fieldName];
  },

  getCategoriesFromFieldNames(fieldNames) {
    let categories = new Set();
    for (let fieldName of fieldNames) {
      let info = this.getCategoryFromFieldName(fieldName);
      if (info) {
        categories.add(info);
      }
    }
    return Array.from(categories);
  },

  getAddressSeparator() {
    // The separator should be based on the L10N address format, and using a
    // white space is a temporary solution.
    return " ";
  },

  /**
   * Get address display label. It should display information separated
   * by a comma.
   *
   * @param  {object} address
   * @param  {string?} addressFields Override the fields which can be displayed, but not the order.
   * @returns {string}
   */
  getAddressLabel(address, addressFields = null) {
    // TODO: Implement a smarter way for deciding what to display
    //       as option text. Possibly improve the algorithm in
    //       ProfileAutoCompleteResult.jsm and reuse it here.
    let fieldOrder = [
      "name",
      "-moz-street-address-one-line", // Street address
      "address-level3", // Townland / Neighborhood / Village
      "address-level2", // City/Town
      "organization", // Company or organization name
      "address-level1", // Province/State (Standardized code if possible)
      "country-name", // Country name
      "postal-code", // Postal code
      "tel", // Phone number
      "email", // Email address
    ];

    address = { ...address };
    let parts = [];
    if (addressFields) {
      let requiredFields = addressFields.trim().split(/\s+/);
      fieldOrder = fieldOrder.filter(name => requiredFields.includes(name));
    }
    if (address["street-address"]) {
      address["-moz-street-address-one-line"] = this.toOneLineAddress(
        address["street-address"]
      );
    }
    for (const fieldName of fieldOrder) {
      let string = address[fieldName];
      if (string) {
        parts.push(string);
      }
      if (parts.length == 2 && !addressFields) {
        break;
      }
    }
    return parts.join(", ");
  },

  /**
   * Internal method to split an address to multiple parts per the provided delimiter,
   * removing blank parts.
   * @param {string} address The address the split
   * @param {string} [delimiter] The separator that is used between lines in the address
   * @returns {string[]}
   */
  _toStreetAddressParts(address, delimiter = "\n") {
    let array = typeof address == "string" ? address.split(delimiter) : address;

    if (!Array.isArray(array)) {
      return [];
    }
    return array.map(s => (s ? s.trim() : "")).filter(s => s);
  },

  /**
   * Converts a street address to a single line, removing linebreaks marked by the delimiter
   * @param {string} address The address the convert
   * @param {string} [delimiter] The separator that is used between lines in the address
   * @returns {string}
   */
  toOneLineAddress(address, delimiter = "\n") {
    let addressParts = this._toStreetAddressParts(address, delimiter);
    return addressParts.join(this.getAddressSeparator());
  },

  /**
   * Compares two addresses, removing internal whitespace
   * @param {string} a The first address to compare
   * @param {string} b The second address to compare
   * @param {array} collators Search collators that will be used for comparison
   * @param {string} [delimiter="\n"] The separator that is used between lines in the address
   * @returns {boolean} True if the addresses are equal, false otherwise
   */
  compareStreetAddress(a, b, collators, delimiter = "\n") {
    let oneLineA = this._toStreetAddressParts(a, delimiter)
      .map(p => p.replace(/\s/g, ""))
      .join("");
    let oneLineB = this._toStreetAddressParts(b, delimiter)
      .map(p => p.replace(/\s/g, ""))
      .join("");
    return this.strCompare(oneLineA, oneLineB, collators);
  },

  /**
   * In-place concatenate tel-related components into a single "tel" field and
   * delete unnecessary fields.
   * @param {object} address An address record.
   */
  compressTel(address) {
    let telCountryCode = address["tel-country-code"] || "";
    let telAreaCode = address["tel-area-code"] || "";

    if (!address.tel) {
      if (address["tel-national"]) {
        address.tel = telCountryCode + address["tel-national"];
      } else if (address["tel-local"]) {
        address.tel = telCountryCode + telAreaCode + address["tel-local"];
      } else if (address["tel-local-prefix"] && address["tel-local-suffix"]) {
        address.tel =
          telCountryCode +
          telAreaCode +
          address["tel-local-prefix"] +
          address["tel-local-suffix"];
      }
    }

    for (let field in address) {
      if (field != "tel" && this.getCategoryFromFieldName(field) == "tel") {
        delete address[field];
      }
    }
  },

  autofillFieldSelector(doc) {
    return doc.querySelectorAll("input, select");
  },

  ALLOWED_TYPES: ["text", "email", "tel", "number", "month"],
  isFieldEligibleForAutofill(element) {
    let tagName = element.tagName;
    if (tagName == "INPUT") {
      // `element.type` can be recognized as `text`, if it's missing or invalid.
      if (!this.ALLOWED_TYPES.includes(element.type)) {
        return false;
      }
    } else if (tagName != "SELECT") {
      return false;
    }

    return true;
  },

  loadDataFromScript(url, sandbox = {}) {
    Services.scriptloader.loadSubScript(url, sandbox);
    return sandbox;
  },

  /**
   * Get country address data and fallback to US if not found.
   * See AddressDataLoader._loadData for more details of addressData structure.
   * @param {string} [country=FormAutofill.DEFAULT_REGION]
   *        The country code for requesting specific country's metadata. It'll be
   *        default region if parameter is not set.
   * @param {string} [level1=null]
   *        Return address level 1/level 2 metadata if parameter is set.
   * @returns {object|null}
   *          Return metadata of specific region with default locale and other supported
   *          locales. We need to return a default country metadata for layout format
   *          and collator, but for sub-region metadata we'll just return null if not found.
   */
  getCountryAddressRawData(
    country = FormAutofill.DEFAULT_REGION,
    level1 = null
  ) {
    let metadata = AddressDataLoader.getData(country, level1);
    if (!metadata) {
      if (level1) {
        return null;
      }
      // Fallback to default region if we couldn't get data from given country.
      if (country != FormAutofill.DEFAULT_REGION) {
        metadata = AddressDataLoader.getData(FormAutofill.DEFAULT_REGION);
      }
    }

    // TODO: Now we fallback to US if we couldn't get data from default region,
    //       but it could be removed in bug 1423464 if it's not necessary.
    if (!metadata) {
      metadata = AddressDataLoader.getData("US");
    }
    return metadata;
  },

  /**
   * Get country address data with default locale.
   * @param {string} country
   * @param {string} level1
   * @returns {object|null} Return metadata of specific region with default locale.
   *          NOTE: The returned data may be for a default region if the
   *          specified one cannot be found. Callers who only want the specific
   *          region should check the returned country code.
   */
  getCountryAddressData(country, level1) {
    let metadata = this.getCountryAddressRawData(country, level1);
    return metadata && metadata.defaultLocale;
  },

  /**
   * Get country address data with all locales.
   * @param {string} country
   * @param {string} level1
   * @returns {array<object>|null}
   *          Return metadata of specific region with all the locales.
   *          NOTE: The returned data may be for a default region if the
   *          specified one cannot be found. Callers who only want the specific
   *          region should check the returned country code.
   */
  getCountryAddressDataWithLocales(country, level1) {
    let metadata = this.getCountryAddressRawData(country, level1);
    return metadata && [metadata.defaultLocale, ...metadata.locales];
  },

  /**
   * Get the collators based on the specified country.
   * @param   {string} country The specified country.
   * @returns {array} An array containing several collator objects.
   */
  getSearchCollators(country) {
    // TODO: Only one language should be used at a time per country. The locale
    //       of the page should be taken into account to do this properly.
    //       We are going to support more countries in bug 1370193 and this
    //       should be addressed when we start to implement that bug.

    if (!this._collators[country]) {
      let dataset = this.getCountryAddressData(country);
      let languages = dataset.languages || [dataset.lang];
      let options = {
        ignorePunctuation: true,
        sensitivity: "base",
        usage: "search",
      };
      this._collators[country] = languages.map(
        lang => new Intl.Collator(lang, options)
      );
    }
    return this._collators[country];
  },

  // Based on the list of fields abbreviations in
  // https://github.com/googlei18n/libaddressinput/wiki/AddressValidationMetadata
  FIELDS_LOOKUP: {
    N: "name",
    O: "organization",
    A: "street-address",
    S: "address-level1",
    C: "address-level2",
    D: "address-level3",
    Z: "postal-code",
    n: "newLine",
  },

  /**
   * Parse a country address format string and outputs an array of fields.
   * Spaces, commas, and other literals are ignored in this implementation.
   * For example, format string "%A%n%C, %S" should return:
   * [
   *   {fieldId: "street-address", newLine: true},
   *   {fieldId: "address-level2"},
   *   {fieldId: "address-level1"},
   * ]
   *
   * @param   {string} fmt Country address format string
   * @returns {array<object>} List of fields
   */
  parseAddressFormat(fmt) {
    if (!fmt) {
      throw new Error("fmt string is missing.");
    }

    return fmt.match(/%[^%]/g).reduce((parsed, part) => {
      // Take the first letter of each segment and try to identify it
      let fieldId = this.FIELDS_LOOKUP[part[1]];
      // Early return if cannot identify part.
      if (!fieldId) {
        return parsed;
      }
      // If a new line is detected, add an attribute to the previous field.
      if (fieldId == "newLine") {
        let size = parsed.length;
        if (size) {
          parsed[size - 1].newLine = true;
        }
        return parsed;
      }
      return parsed.concat({ fieldId });
    }, []);
  },

  /**
   * Used to populate dropdowns in the UI (e.g. FormAutofill preferences, Web Payments).
   * Use findAddressSelectOption for matching a value to a region.
   *
   * @param {string[]} subKeys An array of regionCode strings
   * @param {string[]} subIsoids An array of ISO ID strings, if provided will be preferred over the key
   * @param {string[]} subNames An array of regionName strings
   * @param {string[]} subLnames An array of latinised regionName strings
   * @returns {Map?} Returns null if subKeys or subNames are not truthy.
   *                   Otherwise, a Map will be returned mapping keys -> names.
   */
  buildRegionMapIfAvailable(subKeys, subIsoids, subNames, subLnames) {
    // Not all regions have sub_keys. e.g. DE
    if (
      !subKeys ||
      !subKeys.length ||
      (!subNames && !subLnames) ||
      (subNames && subKeys.length != subNames.length) ||
      (subLnames && subKeys.length != subLnames.length)
    ) {
      return null;
    }

    // Overwrite subKeys with subIsoids, when available
    if (subIsoids && subIsoids.length && subIsoids.length == subKeys.length) {
      for (let i = 0; i < subIsoids.length; i++) {
        if (subIsoids[i]) {
          subKeys[i] = subIsoids[i];
        }
      }
    }

    // Apply sub_lnames if sub_names does not exist
    let names = subNames || subLnames;
    return new Map(subKeys.map((key, index) => [key, names[index]]));
  },

  /**
   * Parse a require string and outputs an array of fields.
   * Spaces, commas, and other literals are ignored in this implementation.
   * For example, a require string "ACS" should return:
   * ["street-address", "address-level2", "address-level1"]
   *
   * @param   {string} requireString Country address require string
   * @returns {array<string>} List of fields
   */
  parseRequireString(requireString) {
    if (!requireString) {
      throw new Error("requireString string is missing.");
    }

    return requireString.split("").map(fieldId => this.FIELDS_LOOKUP[fieldId]);
  },

  /**
   * Use alternative country name list to identify a country code from a
   * specified country name.
   * @param   {string} countryName A country name to be identified
   * @param   {string} [countrySpecified] A country code indicating that we only
   *                                      search its alternative names if specified.
   * @returns {string} The matching country code.
   */
  identifyCountryCode(countryName, countrySpecified) {
    let countries = countrySpecified
      ? [countrySpecified]
      : [...FormAutofill.countries.keys()];

    for (let country of countries) {
      let collators = this.getSearchCollators(country);
      let metadata = this.getCountryAddressData(country);
      if (country != metadata.key) {
        // We hit the fallback logic in getCountryAddressRawData so ignore it as
        // it's not related to `country` and use the name from l10n instead.
        metadata = {
          id: `data/${country}`,
          key: country,
          name: FormAutofill.countries.get(country),
        };
      }
      let alternativeCountryNames = metadata.alternative_names || [
        metadata.name,
      ];
      let reAlternativeCountryNames = this._reAlternativeCountryNames[country];
      if (!reAlternativeCountryNames) {
        reAlternativeCountryNames = this._reAlternativeCountryNames[
          country
        ] = [];
      }

      for (let i = 0; i < alternativeCountryNames.length; i++) {
        let name = alternativeCountryNames[i];
        let reName = reAlternativeCountryNames[i];
        if (!reName) {
          reName = reAlternativeCountryNames[i] = new RegExp(
            "\\b" + this.escapeRegExp(name) + "\\b",
            "i"
          );
        }

        if (
          this.strCompare(name, countryName, collators) ||
          reName.test(countryName)
        ) {
          return country;
        }
      }
    }

    return null;
  },

  findSelectOption(selectEl, record, fieldName) {
    if (this.isAddressField(fieldName)) {
      return this.findAddressSelectOption(selectEl, record, fieldName);
    }
    if (this.isCreditCardField(fieldName)) {
      return this.findCreditCardSelectOption(selectEl, record, fieldName);
    }
    return null;
  },

  /**
   * Try to find the abbreviation of the given sub-region name
   * @param   {string[]} subregionValues A list of inferable sub-region values.
   * @param   {string} [country] A country name to be identified.
   * @returns {string} The matching sub-region abbreviation.
   */
  getAbbreviatedSubregionName(subregionValues, country) {
    let values = Array.isArray(subregionValues)
      ? subregionValues
      : [subregionValues];

    let collators = this.getSearchCollators(country);
    for (let metadata of this.getCountryAddressDataWithLocales(country)) {
      let {
        sub_keys: subKeys,
        sub_names: subNames,
        sub_lnames: subLnames,
      } = metadata;
      if (!subKeys) {
        // Not all regions have sub_keys. e.g. DE
        continue;
      }
      // Apply sub_lnames if sub_names does not exist
      subNames = subNames || subLnames;

      let speculatedSubIndexes = [];
      for (const val of values) {
        let identifiedValue = this.identifyValue(
          subKeys,
          subNames,
          val,
          collators
        );
        if (identifiedValue) {
          return identifiedValue;
        }

        // Predict the possible state by partial-matching if no exact match.
        [subKeys, subNames].forEach(sub => {
          speculatedSubIndexes.push(
            sub.findIndex(token => {
              let pattern = new RegExp(
                "\\b" + this.escapeRegExp(token) + "\\b"
              );

              return pattern.test(val);
            })
          );
        });
      }
      let subKey = subKeys[speculatedSubIndexes.find(i => !!~i)];
      if (subKey) {
        return subKey;
      }
    }
    return null;
  },

  /**
   * Find the option element from select element.
   * 1. Try to find the locale using the country from address.
   * 2. First pass try to find exact match.
   * 3. Second pass try to identify values from address value and options,
   *    and look for a match.
   * @param   {DOMElement} selectEl
   * @param   {object} address
   * @param   {string} fieldName
   * @returns {DOMElement}
   */
  findAddressSelectOption(selectEl, address, fieldName) {
    let value = address[fieldName];
    if (!value) {
      return null;
    }

    let collators = this.getSearchCollators(address.country);

    for (let option of selectEl.options) {
      if (
        this.strCompare(value, option.value, collators) ||
        this.strCompare(value, option.text, collators)
      ) {
        return option;
      }
    }

    switch (fieldName) {
      case "address-level1": {
        let { country } = address;
        let identifiedValue = this.getAbbreviatedSubregionName(
          [value],
          country
        );
        // No point going any further if we cannot identify value from address level 1
        if (!identifiedValue) {
          return null;
        }
        for (let dataset of this.getCountryAddressDataWithLocales(country)) {
          let keys = dataset.sub_keys;
          if (!keys) {
            // Not all regions have sub_keys. e.g. DE
            continue;
          }
          // Apply sub_lnames if sub_names does not exist
          let names = dataset.sub_names || dataset.sub_lnames;

          // Go through options one by one to find a match.
          // Also check if any option contain the address-level1 key.
          let pattern = new RegExp(
            "\\b" + this.escapeRegExp(identifiedValue) + "\\b",
            "i"
          );
          for (let option of selectEl.options) {
            let optionValue = this.identifyValue(
              keys,
              names,
              option.value,
              collators
            );
            let optionText = this.identifyValue(
              keys,
              names,
              option.text,
              collators
            );
            if (
              identifiedValue === optionValue ||
              identifiedValue === optionText ||
              pattern.test(option.value)
            ) {
              return option;
            }
          }
        }
        break;
      }
      case "country": {
        if (this.getCountryAddressData(value).alternative_names) {
          for (let option of selectEl.options) {
            if (
              this.identifyCountryCode(option.text, value) ||
              this.identifyCountryCode(option.value, value)
            ) {
              return option;
            }
          }
        }
        break;
      }
    }

    return null;
  },

  findCreditCardSelectOption(selectEl, creditCard, fieldName) {
    let oneDigitMonth = creditCard["cc-exp-month"]
      ? creditCard["cc-exp-month"].toString()
      : null;
    let twoDigitsMonth = oneDigitMonth ? oneDigitMonth.padStart(2, "0") : null;
    let fourDigitsYear = creditCard["cc-exp-year"]
      ? creditCard["cc-exp-year"].toString()
      : null;
    let twoDigitsYear = fourDigitsYear ? fourDigitsYear.substr(2, 2) : null;
    let options = Array.from(selectEl.options);

    switch (fieldName) {
      case "cc-exp-month": {
        if (!oneDigitMonth) {
          return null;
        }
        for (let option of options) {
          if (
            [option.text, option.label, option.value].some(s => {
              let result = /[1-9]\d*/.exec(s);
              return result && result[0] == oneDigitMonth;
            })
          ) {
            return option;
          }
        }
        break;
      }
      case "cc-exp-year": {
        if (!fourDigitsYear) {
          return null;
        }
        for (let option of options) {
          if (
            [option.text, option.label, option.value].some(
              s => s == twoDigitsYear || s == fourDigitsYear
            )
          ) {
            return option;
          }
        }
        break;
      }
      case "cc-exp": {
        if (!oneDigitMonth || !fourDigitsYear) {
          return null;
        }
        let patterns = [
          oneDigitMonth + "/" + twoDigitsYear, // 8/22
          oneDigitMonth + "/" + fourDigitsYear, // 8/2022
          twoDigitsMonth + "/" + twoDigitsYear, // 08/22
          twoDigitsMonth + "/" + fourDigitsYear, // 08/2022
          oneDigitMonth + "-" + twoDigitsYear, // 8-22
          oneDigitMonth + "-" + fourDigitsYear, // 8-2022
          twoDigitsMonth + "-" + twoDigitsYear, // 08-22
          twoDigitsMonth + "-" + fourDigitsYear, // 08-2022
          twoDigitsYear + "-" + twoDigitsMonth, // 22-08
          fourDigitsYear + "-" + twoDigitsMonth, // 2022-08
          fourDigitsYear + "/" + oneDigitMonth, // 2022/8
          twoDigitsMonth + twoDigitsYear, // 0822
          twoDigitsYear + twoDigitsMonth, // 2208
        ];

        for (let option of options) {
          if (
            [option.text, option.label, option.value].some(str =>
              patterns.some(pattern => str.includes(pattern))
            )
          ) {
            return option;
          }
        }
        break;
      }
      case "cc-type": {
        let network = creditCard["cc-type"] || "";
        for (let option of options) {
          if (
            [option.text, option.label, option.value].some(
              s => s.trim().toLowerCase() == network
            )
          ) {
            return option;
          }
        }
        break;
      }
    }

    return null;
  },

  /**
   * Try to match value with keys and names, but always return the key.
   * @param   {array<string>} keys
   * @param   {array<string>} names
   * @param   {string} value
   * @param   {array} collators
   * @returns {string}
   */
  identifyValue(keys, names, value, collators) {
    let resultKey = keys.find(key => this.strCompare(value, key, collators));
    if (resultKey) {
      return resultKey;
    }

    let index = names.findIndex(name =>
      this.strCompare(value, name, collators)
    );
    if (index !== -1) {
      return keys[index];
    }

    return null;
  },

  /**
   * Compare if two strings are the same.
   * @param   {string} a
   * @param   {string} b
   * @param   {array} collators
   * @returns {boolean}
   */
  strCompare(a = "", b = "", collators) {
    return collators.some(collator => !collator.compare(a, b));
  },

  /**
   * Escaping user input to be treated as a literal string within a regular
   * expression.
   * @param   {string} string
   * @returns {string}
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  /**
   * Get formatting information of a given country
   * @param   {string} country
   * @returns {object}
   *         {
   *           {string} addressLevel3Label
   *           {string} addressLevel2Label
   *           {string} addressLevel1Label
   *           {string} postalCodeLabel
   *           {object} fieldsOrder
   *           {string} postalCodePattern
   *         }
   */
  getFormFormat(country) {
    let dataset = this.getCountryAddressData(country);
    // We hit a country fallback in `getCountryAddressRawData` but it's not relevant here.
    if (country != dataset.key) {
      // Use a sparse object so the below default values take effect.
      dataset = {
        /**
         * Even though data/ZZ only has address-level2, include the other levels
         * in case they are needed for unknown countries. Users can leave the
         * unnecessary fields blank which is better than forcing users to enter
         * the data in incorrect fields.
         */
        fmt: "%N%n%O%n%A%n%C %S %Z",
      };
    }
    return {
      // When particular values are missing for a country, the
      // data/ZZ value should be used instead:
      // https://chromium-i18n.appspot.com/ssl-aggregate-address/data/ZZ
      addressLevel3Label: dataset.sublocality_name_type || "suburb",
      addressLevel2Label: dataset.locality_name_type || "city",
      addressLevel1Label: dataset.state_name_type || "province",
      addressLevel1Options: this.buildRegionMapIfAvailable(
        dataset.sub_keys,
        dataset.sub_isoids,
        dataset.sub_names,
        dataset.sub_lnames
      ),
      countryRequiredFields: this.parseRequireString(dataset.require || "AC"),
      fieldsOrder: this.parseAddressFormat(dataset.fmt || "%N%n%O%n%A%n%C"),
      postalCodeLabel: dataset.zip_name_type || "postalCode",
      postalCodePattern: dataset.zip,
    };
  },

  /**
   * Localize "data-localization" or "data-localization-region" attributes.
   * @param {Element} element
   * @param {string} attributeName
   */
  localizeAttributeForElement(element, attributeName) {
    switch (attributeName) {
      case "data-localization": {
        element.textContent = this.stringBundle.GetStringFromName(
          element.getAttribute(attributeName)
        );
        element.removeAttribute(attributeName);
        break;
      }
      case "data-localization-region": {
        let regionCode = element.getAttribute(attributeName);
        element.textContent = Services.intl.getRegionDisplayNames(undefined, [
          regionCode,
        ]);
        element.removeAttribute(attributeName);
        return;
      }
      default:
        throw new Error("Unexpected attributeName");
    }
  },

  /**
   * Localize elements with "data-localization" or "data-localization-region" attributes.
   * @param {Element} root
   */
  localizeMarkup(root) {
    let elements = root.querySelectorAll("[data-localization]");
    for (let element of elements) {
      this.localizeAttributeForElement(element, "data-localization");
    }

    elements = root.querySelectorAll("[data-localization-region]");
    for (let element of elements) {
      this.localizeAttributeForElement(element, "data-localization-region");
    }
  },
};

this.log = null;
// FormAutofill.defineLazyLogGetter(this, EXPORTED_SYMBOLS[0]);
FormAutofillUtils.stringBundle = FormAutofill.properties;
// XPCOMUtils.defineLazyGetter(FormAutofillUtils, "stringBundle", function() {
//   return Services.strings.createBundle(
//     "chrome://formautofill/locale/formautofill.properties"
//   );
// });
FormAutofillUtils.brandBundle = '';
// XPCOMUtils.defineLazyGetter(FormAutofillUtils, "brandBundle", function() {
//   return Services.strings.createBundle(
//     "chrome://branding/locale/brand.properties"
//   );
// });

// XPCOMUtils.defineLazyPreferenceGetter(
//   FormAutofillUtils,
//   "_reauthEnabledByUser",
//   "extensions.formautofill.reauth.enabled",
//   false
// );
FormAutofillUtils._reauthEnabledByUser = ENABLED_AUTOFILL_CREDITCARDS_REAUTH_PREF;
//END of FormAutofillUtils.jsm

// BEGIN of FormAutofillHeuristics.js
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Form Autofill field heuristics.
 */

"use strict";

var EXPORTED_SYMBOLS = ["FormAutofillHeuristics", "LabelUtils"];

// const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
// const { XPCOMUtils } = ChromeUtils.import(
//   "resource://gre/modules/XPCOMUtils.jsm"
// );
// const { FormAutofill } = ChromeUtils.import(
//   "resource://autofill/FormAutofill.jsm"
// );
// ChromeUtils.defineModuleGetter(
//   this,
//   "FormAutofillUtils",
//   "resource://autofill/FormAutofillUtils.jsm"
// );

// XPCOMUtils.defineLazyModuleGetters(this, {
//   CreditCard: "resource://gre/modules/CreditCard.jsm",
// });

this.log = null;
// FormAutofill.defineLazyLogGetter(this, EXPORTED_SYMBOLS[0]);

const PREF_HEURISTICS_ENABLED = "extensions.formautofill.heuristics.enabled";
const PREF_SECTION_ENABLED = "extensions.formautofill.section.enabled";
const DEFAULT_SECTION_NAME = "-moz-section-default";

/**
 * To help us classify sections, we want to know what fields can appear
 * multiple times in a row.
 * Such fields, like `address-line{X}`, should not break sections.
 */
const MULTI_FIELD_NAMES = [
  "address-level3",
  "address-level2",
  "address-level1",
  "tel",
  "postal-code",
  "email",
  "street-address",
];

/**
 * A scanner for traversing all elements in a form and retrieving the field
 * detail with FormAutofillHeuristics.getInfo function. It also provides a
 * cursor (parsingIndex) to indicate which element is waiting for parsing.
 */
class FieldScanner {
  /**
   * Create a FieldScanner based on form elements with the existing
   * fieldDetails.
   *
   * @param {Array.DOMElement} elements
   *        The elements from a form for each parser.
   */
  constructor(elements, { allowDuplicates = false, sectionEnabled = true }) {
    this._elementsWeakRef = new WeakRef(elements);
    this.fieldDetails = [];
    this._parsingIndex = 0;
    this._sections = [];
    this._allowDuplicates = allowDuplicates;
    this._sectionEnabled = sectionEnabled;
  }

  get _elements() {
    return this._elementsWeakRef.deref();
  }

  /**
   * This cursor means the index of the element which is waiting for parsing.
   *
   * @returns {number}
   *          The index of the element which is waiting for parsing.
   */
  get parsingIndex() {
    return this._parsingIndex;
  }

  /**
   * Move the parsingIndex to the next elements. Any elements behind this index
   * means the parsing tasks are finished.
   *
   * @param {number} index
   *        The latest index of elements waiting for parsing.
   */
  set parsingIndex(index) {
    if (index > this._elements.length) {
      throw new Error("The parsing index is out of range.");
    }
    this._parsingIndex = index;
  }

  /**
   * Retrieve the field detail by the index. If the field detail is not ready,
   * the elements will be traversed until matching the index.
   *
   * @param {number} index
   *        The index of the element that you want to retrieve.
   * @returns {Object}
   *          The field detail at the specific index.
   */
  getFieldDetailByIndex(index) {
    if (index >= this._elements.length) {
      throw new Error(
        `The index ${index} is out of range.(${this._elements.length})`
      );
    }

    if (index < this.fieldDetails.length) {
      return this.fieldDetails[index];
    }

    for (let i = this.fieldDetails.length; i < index + 1; i++) {
      this.pushDetail();
    }

    return this.fieldDetails[index];
  }

  get parsingFinished() {
    return this.parsingIndex >= this._elements.length;
  }

  _pushToSection(name, fieldDetail) {
    for (let section of this._sections) {
      if (section.name == name) {
        section.fieldDetails.push(fieldDetail);
        return;
      }
    }
    this._sections.push({
      name,
      fieldDetails: [fieldDetail],
    });
  }

  _classifySections() {
    let fieldDetails = this._sections[0].fieldDetails;
    this._sections = [];
    let seenTypes = new Set();
    let previousType;
    let sectionCount = 0;

    for (let fieldDetail of fieldDetails) {
      if (!fieldDetail.fieldName) {
        continue;
      }
      if (
        seenTypes.has(fieldDetail.fieldName) &&
        (previousType != fieldDetail.fieldName ||
          !MULTI_FIELD_NAMES.includes(fieldDetail.fieldName))
      ) {
        seenTypes.clear();
        sectionCount++;
      }
      previousType = fieldDetail.fieldName;
      seenTypes.add(fieldDetail.fieldName);
      this._pushToSection(
        DEFAULT_SECTION_NAME + "-" + sectionCount,
        fieldDetail
      );
    }
  }

  /**
   * The result is an array contains the sections with its belonging field
   * details. If `this._sections` contains one section only with the default
   * section name (DEFAULT_SECTION_NAME), `this._classifySections` should be
   * able to identify all sections in the heuristic way.
   *
   * @returns {Array<Object>}
   *          The array with the sections, and the belonging fieldDetails are in
   *          each section.
   */
  getSectionFieldDetails() {
    // When the section feature is disabled, `getSectionFieldDetails` should
    // provide a single address and credit card section result.
    if (!this._sectionEnabled) {
      return this._getFinalDetails(this.fieldDetails);
    }
    if (!this._sections.length) {
      return [];
    }
    if (
      this._sections.length == 1 &&
      this._sections[0].name == DEFAULT_SECTION_NAME
    ) {
      this._classifySections();
    }

    return this._sections.reduce((sections, current) => {
      sections.push(...this._getFinalDetails(current.fieldDetails));
      return sections;
    }, []);
  }

  /**
   * This function will prepare an autocomplete info object with getInfo
   * function and push the detail to fieldDetails property.
   * Any field will be pushed into `this._sections` based on the section name
   * in `autocomplete` attribute.
   *
   * Any element without the related detail will be used for adding the detail
   * to the end of field details.
   */
  pushDetail() {
    let elementIndex = this.fieldDetails.length;
    if (elementIndex >= this._elements.length) {
      throw new Error("Try to push the non-existing element info.");
    }
    let element = this._elements[elementIndex];
    let info = FormAutofillHeuristics.getInfo(element);
    let fieldInfo = {
      fieldName: info ? info.fieldName : "",
      element: new WeakRef(element).deref(),
    };

    if (info && info._reason) {
      fieldInfo._reason = info._reason;
    }

    this.fieldDetails.push(fieldInfo);
    this._pushToSection(this._getSectionName(fieldInfo), fieldInfo);
  }

  _getSectionName(info) {
    let names = [];
    if (info.section) {
      names.push(info.section);
    }
    if (info.addressType) {
      names.push(info.addressType);
    }
    return names.length ? names.join(" ") : DEFAULT_SECTION_NAME;
  }

  /**
   * When a field detail should be changed its fieldName after parsing, use
   * this function to update the fieldName which is at a specific index.
   *
   * @param {number} index
   *        The index indicates a field detail to be updated.
   * @param {string} fieldName
   *        The new fieldName
   */
  updateFieldName(index, fieldName) {
    if (index >= this.fieldDetails.length) {
      throw new Error("Try to update the non-existing field detail.");
    }
    this.fieldDetails[index].fieldName = fieldName;
  }

  _isSameField(field1, field2) {
    return (
      field1.section == field2.section &&
      field1.addressType == field2.addressType &&
      field1.fieldName == field2.fieldName
    );
  }

  /**
   * Provide the final field details without invalid field name, and the
   * duplicated fields will be removed as well. For the debugging purpose,
   * the final `fieldDetails` will include the duplicated fields if
   * `_allowDuplicates` is true.
   *
   * Each item should contain one type of fields only, and the two valid types
   * are Address and CreditCard.
   *
   * @param   {Array<Object>} fieldDetails
   *          The field details for trimming.
   * @returns {Array<Object>}
   *          The array with the field details without invalid field name and
   *          duplicated fields.
   */
  _getFinalDetails(fieldDetails) {
    let addressFieldDetails = [];
    let creditCardFieldDetails = [];
    for (let fieldDetail of fieldDetails) {
      let fieldName = fieldDetail.fieldName;
      if (FormAutofillUtils.isAddressField(fieldName)) {
        addressFieldDetails.push(fieldDetail);
      } else if (FormAutofillUtils.isCreditCardField(fieldName)) {
        creditCardFieldDetails.push(fieldDetail);
      } else {
        log.debug(
          "Not collecting a field with a unknown fieldName",
          fieldDetail
        );
      }
    }

    return [
      {
        type: FormAutofillUtils.SECTION_TYPES.ADDRESS,
        fieldDetails: addressFieldDetails,
      },
      {
        type: FormAutofillUtils.SECTION_TYPES.CREDIT_CARD,
        fieldDetails: creditCardFieldDetails,
      },
    ]
      .map(section => {
        if (this._allowDuplicates) {
          return section;
        }
        // Deduplicate each set of fieldDetails
        let details = section.fieldDetails;
        section.fieldDetails = details.filter((detail, index) => {
          let previousFields = details.slice(0, index);
          return !previousFields.find(f => this._isSameField(detail, f));
        });
        return section;
      })
      .filter(section => !!section.fieldDetails.length);
  }

  elementExisting(index) {
    return index < this._elements.length;
  }
}

var LabelUtils = {
  // The tag name list is from Chromium except for "STYLE":
  // eslint-disable-next-line max-len
  // https://cs.chromium.org/chromium/src/components/autofill/content/renderer/form_autofill_util.cc?l=216&rcl=d33a171b7c308a64dc3372fac3da2179c63b419e
  EXCLUDED_TAGS: ["SCRIPT", "NOSCRIPT", "OPTION", "STYLE"],

  // A map object, whose keys are the id's of form fields and each value is an
  // array consisting of label elements correponding to the id.
  // @type {Map<string, array>}
  _mappedLabels: null,

  // An array consisting of label elements whose correponding form field doesn't
  // have an id attribute.
  // @type {Array<HTMLLabelElement>}
  _unmappedLabels: null,

  // A weak map consisting of label element and extracted strings pairs.
  // @type {WeakMap<HTMLLabelElement, array>}
  _labelStrings: null,

  /**
   * Extract all strings of an element's children to an array.
   * "element.textContent" is a string which is merged of all children nodes,
   * and this function provides an array of the strings contains in an element.
   *
   * @param  {Object} element
   *         A DOM element to be extracted.
   * @returns {Array}
   *          All strings in an element.
   */
  extractLabelStrings(element) {
    if (this._labelStrings.has(element)) {
      return this._labelStrings.get(element);
    }
    let strings = [];
    let _extractLabelStrings = el => {
      if (this.EXCLUDED_TAGS.includes(el.tagName)) {
        return;
      }

      if (el.nodeType == el.TEXT_NODE || !el.childNodes.length) {
        let trimmedText = el.textContent.trim();
        if (trimmedText) {
          strings.push(trimmedText);
        }
        return;
      }

      for (let node of el.childNodes) {
        let nodeType = node.nodeType;
        if (nodeType != node.ELEMENT_NODE && nodeType != node.TEXT_NODE) {
          continue;
        }
        _extractLabelStrings(node);
      }
    };
    _extractLabelStrings(element);
    this._labelStrings.set(element, strings);
    return strings;
  },

  generateLabelMap(doc) {
    let mappedLabels = new Map();
    let unmappedLabels = [];

    for (let label of doc.querySelectorAll("label")) {
      let id = label.htmlFor;
      if (!id) {
        let control = label.control;
        if (!control) {
          continue;
        }
        id = control.id;
      }
      if (id) {
        let labels = mappedLabels.get(id);
        if (labels) {
          labels.push(label);
        } else {
          mappedLabels.set(id, [label]);
        }
      } else {
        unmappedLabels.push(label);
      }
    }

    this._mappedLabels = mappedLabels;
    this._unmappedLabels = unmappedLabels;
    this._labelStrings = new WeakMap();
  },

  clearLabelMap() {
    this._mappedLabels = null;
    this._unmappedLabels = null;
    this._labelStrings = null;
  },

  findLabelElements(element) {
    if (!this._mappedLabels) {
      this.generateLabelMap(element.ownerDocument);
    }

    let id = element.id;
    if (!id) {
      return this._unmappedLabels.filter(label => label.control == element);
    }
    return this._mappedLabels.get(id) || [];
  },
};

/**
 * Returns the autocomplete information of fields according to heuristics.
 */
this.FormAutofillHeuristics = {
  RULES: HeuristicsRegExp.RULES,

  /**
   * Try to find a contiguous sub-array within an array.
   *
   * @param {Array} array
   * @param {Array} subArray
   *
   * @returns {boolean}
   *          Return whether subArray was found within the array or not.
   */
  _matchContiguousSubArray(array, subArray) {
    return array.some((elm, i) =>
      subArray.every((sElem, j) => sElem == array[i + j])
    );
  },

  /**
   * Try to find the field that is look like a month select.
   *
   * @param {DOMElement} element
   * @returns {boolean}
   *          Return true if we observe the trait of month select in
   *          the current element.
   */
  _isExpirationMonthLikely(element) {
    if (element.className !== "HTMLSelectElement") {
      return false;
    }

    const options = [...element.options];
    const desiredValues = Array(12)
      .fill(1)
      .map((v, i) => v + i);

    // The number of month options shouldn't be less than 12 or larger than 13
    // including the default option.
    if (options.length < 12 || options.length > 13) {
      return false;
    }

    return (
      this._matchContiguousSubArray(
        options.map(e => +e.value),
        desiredValues
      ) ||
      this._matchContiguousSubArray(
        options.map(e => +e.label),
        desiredValues
      )
    );
  },

  /**
   * Try to find the field that is look like a year select.
   *
   * @param {DOMElement} element
   * @returns {boolean}
   *          Return true if we observe the trait of year select in
   *          the current element.
   */
  _isExpirationYearLikely(element) {
    if (element.className !== "HTMLSelectElement") {
      return false;
    }

    const options = [...element.options];
    // A normal expiration year select should contain at least the last three years
    // in the list.
    const curYear = new Date().getFullYear();
    const desiredValues = Array(3)
      .fill(0)
      .map((v, i) => v + curYear + i);

    return (
      this._matchContiguousSubArray(
        options.map(e => +e.value),
        desiredValues
      ) ||
      this._matchContiguousSubArray(
        options.map(e => +e.label),
        desiredValues
      )
    );
  },

  /**
   * Try to match the telephone related fields to the grammar
   * list to see if there is any valid telephone set and correct their
   * field names.
   *
   * @param {FieldScanner} fieldScanner
   *        The current parsing status for all elements
   * @returns {boolean}
   *          Return true if there is any field can be recognized in the parser,
   *          otherwise false.
   */
  _parsePhoneFields(fieldScanner) {
    let matchingResult;

    const GRAMMARS = this.PHONE_FIELD_GRAMMARS;
    for (let i = 0; i < GRAMMARS.length; i++) {
      let detailStart = fieldScanner.parsingIndex;
      let ruleStart = i;
      for (
        ;
        i < GRAMMARS.length &&
        GRAMMARS[i][0] &&
        fieldScanner.elementExisting(detailStart);
        i++, detailStart++
      ) {
        let detail = fieldScanner.getFieldDetailByIndex(detailStart);
        if (
          !detail ||
          GRAMMARS[i][0] != detail.fieldName ||
          (detail._reason && detail._reason == "autocomplete")
        ) {
          break;
        }
        let element = detail.elementWeakRef;
        if (!element) {
          break;
        }
        if (
          GRAMMARS[i][2] &&
          (!element.maxLength || GRAMMARS[i][2] < element.maxLength)
        ) {
          break;
        }
      }
      if (i >= GRAMMARS.length) {
        break;
      }

      if (!GRAMMARS[i][0]) {
        matchingResult = {
          ruleFrom: ruleStart,
          ruleTo: i,
        };
        break;
      }

      // Fast rewinding to the next rule.
      for (; i < GRAMMARS.length; i++) {
        if (!GRAMMARS[i][0]) {
          break;
        }
      }
    }

    let parsedField = false;
    if (matchingResult) {
      let { ruleFrom, ruleTo } = matchingResult;
      let detailStart = fieldScanner.parsingIndex;
      for (let i = ruleFrom; i < ruleTo; i++) {
        fieldScanner.updateFieldName(detailStart, GRAMMARS[i][1]);
        fieldScanner.parsingIndex++;
        detailStart++;
        parsedField = true;
      }
    }

    if (fieldScanner.parsingFinished) {
      return parsedField;
    }

    let nextField = fieldScanner.getFieldDetailByIndex(
      fieldScanner.parsingIndex
    );
    if (
      nextField &&
      nextField._reason != "autocomplete" &&
      fieldScanner.parsingIndex > 0
    ) {
      const regExpTelExtension = new RegExp(
        "\\bext|ext\\b|extension|ramal", // pt-BR, pt-PT
        "iu"
      );
      const previousField = fieldScanner.getFieldDetailByIndex(
        fieldScanner.parsingIndex - 1
      );
      const previousFieldType = FormAutofillUtils.getCategoryFromFieldName(
        previousField.fieldName
      );
      if (
        previousField &&
        previousFieldType == "tel" &&
        this._matchRegexp(nextField.elementWeakRef, regExpTelExtension)
      ) {
        fieldScanner.updateFieldName(
          fieldScanner.parsingIndex,
          "tel-extension"
        );
        fieldScanner.parsingIndex++;
        parsedField = true;
      }
    }

    return parsedField;
  },

  /**
   * Try to find the correct address-line[1-3] sequence and correct their field
   * names.
   *
   * @param {FieldScanner} fieldScanner
   *        The current parsing status for all elements
   * @returns {boolean}
   *          Return true if there is any field can be recognized in the parser,
   *          otherwise false.
   */
  _parseAddressFields(fieldScanner) {
    let parsedFields = false;
    const addressLines = ["address-line1", "address-line2", "address-line3"];

    // TODO: These address-line* regexps are for the lines with numbers, and
    // they are the subset of the regexps in `heuristicsRegexp.js`. We have to
    // find a better way to make them consistent.
    const addressLineRegexps = {
      "address-line1": new RegExp(
        "address[_-]?line(1|one)|address1|addr1" +
        "|addrline1|address_1" + // Extra rules by Firefox
        "|indirizzo1" + // it-IT
        "|住所1" + // ja-JP
        "|地址1" + // zh-CN
          "|주소.?1", // ko-KR
        "iu"
      ),
      "address-line2": new RegExp(
        "address[_-]?line(2|two)|address2|addr2" +
        "|addrline2|address_2" + // Extra rules by Firefox
        "|indirizzo2" + // it-IT
        "|住所2" + // ja-JP
        "|地址2" + // zh-CN
          "|주소.?2", // ko-KR
        "iu"
      ),
      "address-line3": new RegExp(
        "address[_-]?line(3|three)|address3|addr3" +
        "|addrline3|address_3" + // Extra rules by Firefox
        "|indirizzo3" + // it-IT
        "|住所3" + // ja-JP
        "|地址3" + // zh-CN
          "|주소.?3", // ko-KR
        "iu"
      ),
    };
    while (!fieldScanner.parsingFinished) {
      let detail = fieldScanner.getFieldDetailByIndex(
        fieldScanner.parsingIndex
      );
      if (
        !detail ||
        !addressLines.includes(detail.fieldName) ||
        detail._reason == "autocomplete"
      ) {
        // When the field is not related to any address-line[1-3] fields or
        // determined by autocomplete attr, it means the parsing process can be
        // terminated.
        break;
      }
      const elem = detail.elementWeakRef;
      for (let regexp of Object.keys(addressLineRegexps)) {
        if (this._matchRegexp(elem, addressLineRegexps[regexp])) {
          fieldScanner.updateFieldName(fieldScanner.parsingIndex, regexp);
          parsedFields = true;
        }
      }
      fieldScanner.parsingIndex++;
    }

    return parsedFields;
  },

  /**
   * Try to look for expiration date fields and revise the field names if needed.
   *
   * @param {FieldScanner} fieldScanner
   *        The current parsing status for all elements
   * @returns {boolean}
   *          Return true if there is any field can be recognized in the parser,
   *          otherwise false.
   */
  _parseCreditCardFields(fieldScanner) {
    if (fieldScanner.parsingFinished) {
      return false;
    }

    const savedIndex = fieldScanner.parsingIndex;
    const detail = fieldScanner.getFieldDetailByIndex(
      fieldScanner.parsingIndex
    );

    // Respect to autocomplete attr
    if (!detail || (detail._reason && detail._reason == "autocomplete")) {
      return false;
    }

    const monthAndYearFieldNames = ["cc-exp-month", "cc-exp-year"];
    // Skip the uninteresting fields
    if (
      !["cc-exp", "cc-type", ...monthAndYearFieldNames].includes(
        detail.fieldName
      )
    ) {
      return false;
    }

    const element = detail.elementWeakRef

    // If we didn't auto-discover type field, check every select for options that
    // match credit card network names in value or label.
    if (element.className == "HTMLSelectElement") {
      for (let option of element.querySelectorAll("option")) {
        if (
          CreditCard.getNetworkFromName(option.value) ||
          CreditCard.getNetworkFromName(option.text)
        ) {
          fieldScanner.updateFieldName(fieldScanner.parsingIndex, "cc-type");
          fieldScanner.parsingIndex++;
          return true;
        }
      }
    }

    // If the input type is a month picker, then assume it's cc-exp.
    if (element.type == "month") {
      fieldScanner.updateFieldName(fieldScanner.parsingIndex, "cc-exp");
      fieldScanner.parsingIndex++;

      return true;
    }

    // Don't process the fields if expiration month and expiration year are already
    // matched by regex in correct order.
    if (
      fieldScanner.getFieldDetailByIndex(fieldScanner.parsingIndex++)
        .fieldName == "cc-exp-month" &&
      !fieldScanner.parsingFinished &&
      fieldScanner.getFieldDetailByIndex(fieldScanner.parsingIndex++)
        .fieldName == "cc-exp-year"
    ) {
      return true;
    }
    fieldScanner.parsingIndex = savedIndex;

    // Determine the field name by checking if the fields are month select and year select
    // likely.
    if (this._isExpirationMonthLikely(element)) {
      fieldScanner.updateFieldName(fieldScanner.parsingIndex, "cc-exp-month");
      fieldScanner.parsingIndex++;
      if (!fieldScanner.parsingFinished) {
        const nextDetail = fieldScanner.getFieldDetailByIndex(
          fieldScanner.parsingIndex
        );
        const nextElement = nextDetail.elementWeakRef;
        if (this._isExpirationYearLikely(nextElement)) {
          fieldScanner.updateFieldName(
            fieldScanner.parsingIndex,
            "cc-exp-year"
          );
          fieldScanner.parsingIndex++;
          return true;
        }
      }
    }
    fieldScanner.parsingIndex = savedIndex;

    // Verify that the following consecutive two fields can match cc-exp-month and cc-exp-year
    // respectively.
    if (this._findMatchedFieldName(element, ["cc-exp-month"])) {
      fieldScanner.updateFieldName(fieldScanner.parsingIndex, "cc-exp-month");
      fieldScanner.parsingIndex++;
      if (!fieldScanner.parsingFinished) {
        const nextDetail = fieldScanner.getFieldDetailByIndex(
          fieldScanner.parsingIndex
        );
        const nextElement = nextDetail.elementWeakRef;
        if (this._findMatchedFieldName(nextElement, ["cc-exp-year"])) {
          fieldScanner.updateFieldName(
            fieldScanner.parsingIndex,
            "cc-exp-year"
          );
          fieldScanner.parsingIndex++;
          return true;
        }
      }
    }
    fieldScanner.parsingIndex = savedIndex;

    // Look for MM and/or YY(YY).
    if (this._matchRegexp(element, /^mm$/gi)) {
      fieldScanner.updateFieldName(fieldScanner.parsingIndex, "cc-exp-month");
      fieldScanner.parsingIndex++;
      if (!fieldScanner.parsingFinished) {
        const nextDetail = fieldScanner.getFieldDetailByIndex(
          fieldScanner.parsingIndex
        );
        const nextElement = nextDetail.elementWeakRef;
        if (this._matchRegexp(nextElement, /^(yy|yyyy)$/)) {
          fieldScanner.updateFieldName(
            fieldScanner.parsingIndex,
            "cc-exp-year"
          );
          fieldScanner.parsingIndex++;

          return true;
        }
      }
    }
    fieldScanner.parsingIndex = savedIndex;

    // Look for a cc-exp with 2-digit or 4-digit year.
    if (
      this._matchRegexp(
        element,
        /(?:exp.*date[^y\\n\\r]*|mm\\s*[-/]?\\s*)yy(?:[^y]|$)/gi
      ) ||
      this._matchRegexp(
        element,
        /(?:exp.*date[^y\\n\\r]*|mm\\s*[-/]?\\s*)yyyy(?:[^y]|$)/gi
      )
    ) {
      fieldScanner.updateFieldName(fieldScanner.parsingIndex, "cc-exp");
      fieldScanner.parsingIndex++;
      return true;
    }
    fieldScanner.parsingIndex = savedIndex;

    // Match general cc-exp regexp at last.
    if (this._findMatchedFieldName(element, ["cc-exp"])) {
      fieldScanner.updateFieldName(fieldScanner.parsingIndex, "cc-exp");
      fieldScanner.parsingIndex++;
      return true;
    }
    fieldScanner.parsingIndex = savedIndex;

    // Set current field name to null as it failed to match any patterns.
    fieldScanner.updateFieldName(fieldScanner.parsingIndex, null);
    fieldScanner.parsingIndex++;
    return true;
  },

  /**
   * This function should provide all field details of a form which are placed
   * in the belonging section. The details contain the autocomplete info
   * (e.g. fieldName, section, etc).
   *
   * `allowDuplicates` is used for the xpcshell-test purpose currently because
   * the heuristics should be verified that some duplicated elements still can
   * be predicted correctly.
   *
   * @param {any} formOrDivs
   *        the elements in this form to be predicted the field info.
   * @param {boolean} allowDuplicates
   *        true to remain any duplicated field details otherwise to remove the
   *        duplicated ones.
   * @returns {Array<Array<Object>>}
   *        all sections within its field details in the form.
   */
  getFormInfo(formOrDivs, allowDuplicates = false) {
    let eligibleFields;
      if(formOrDivs.length>0){
        eligibleFields = Array.from(formOrDivs).filter(elem =>
                FormAutofillUtils.isFieldEligibleForAutofill(elem)
      );
      }else{
        eligibleFields = Array.from(formOrDivs.elements).filter(elem =>
            FormAutofillUtils.isFieldEligibleForAutofill(elem)
          );
      }

    if (eligibleFields.length <= 0) {
      return [];
    }

    let fieldScanner = new FieldScanner(eligibleFields, {
      allowDuplicates,
      sectionEnabled: this._sectionEnabled,
    });
    while (!fieldScanner.parsingFinished) {
      let parsedPhoneFields = this._parsePhoneFields(fieldScanner);
      let parsedAddressFields = this._parseAddressFields(fieldScanner);
      let parsedExpirationDateFields = this._parseCreditCardFields(
        fieldScanner
      );

      // If there is no any field parsed, the parsing cursor can be moved
      // forward to the next one.
      if (
        !parsedPhoneFields &&
        !parsedAddressFields &&
        !parsedExpirationDateFields
      ) {
        fieldScanner.parsingIndex++;
      }
    }

    LabelUtils.clearLabelMap();

    return fieldScanner.getSectionFieldDetails();
  },

  _regExpTableHashValue(...signBits) {
    return signBits.reduce((p, c, i) => p | (!!c << i), 0);
  },

  _setRegExpListCache(regexps, b0, b1, b2) {
    if (!this._regexpList) {
      this._regexpList = [];
    }
    this._regexpList[this._regExpTableHashValue(b0, b1, b2)] = regexps;
  },

  _getRegExpListCache(b0, b1, b2) {
    if (!this._regexpList) {
      return null;
    }
    return this._regexpList[this._regExpTableHashValue(b0, b1, b2)] || null;
  },

  _getRegExpList(isAutoCompleteOff, elementTagName) {
    let isSelectElem = elementTagName == "SELECT";
    let regExpListCache = this._getRegExpListCache(
      false,  // isAutoCompleteOff,
      FormAutofill.isAutofillCreditCardsAvailable,
      isSelectElem
    );
    if (regExpListCache) {
      return regExpListCache;
    }
    const FIELDNAMES_IGNORING_AUTOCOMPLETE_OFF = [
      "cc-name",
      "cc-number",
      "cc-exp-month",
      "cc-exp-year",
      "cc-exp",
      "cc-type",
    ];
    let regexps = false // isAutoCompleteOff was set to false
      ? FIELDNAMES_IGNORING_AUTOCOMPLETE_OFF
      : Object.keys(this.RULES);

    if (!FormAutofill.isAutofillCreditCardsAvailable) {
      regexps = regexps.filter(
        name => !FormAutofillUtils.isCreditCardField(name)
      );
    }

    if (isSelectElem) {
      const FIELDNAMES_FOR_SELECT_ELEMENT = [
        "address-level1",
        "address-level2",
        "country",
        "cc-exp-month",
        "cc-exp-year",
        "cc-exp",
        "cc-type",
      ];
      regexps = regexps.filter(name =>
        FIELDNAMES_FOR_SELECT_ELEMENT.includes(name)
      );
    }

    this._setRegExpListCache(
      regexps,
      false, // isAutoCompleteOff was set to false
      FormAutofill.isAutofillCreditCardsAvailable,
      isSelectElem
    );

    return regexps;
  },

  getInfo(element) {
    let info = element.getAttribute('autocomplete');
    // An input[autocomplete="on"] will not be early return here since it stll
    // needs to find the field name.
    if (
      info &&
      info.fieldName &&
      info.fieldName != "on" &&
      info.fieldName != "off"
    ) {
      info._reason = "autocomplete";
      return info;
    }

    if (!this._prefEnabled) {
      return null;
    }

    let isAutoCompleteOff = false; // isAutoCompleteOff was set to false
      // element.autocomplete == "off" ||
      // (element.form && element.form.autocomplete == "off");

    // "email" type of input is accurate for heuristics to determine its Email
    // field or not. However, "tel" type is used for ZIP code for some web site
    // (e.g. HomeDepot, BestBuy), so "tel" type should be not used for "tel"
    // prediction.
    if (element.type == "email" && !false) { // isAutoCompleteOff was set to false
      return {
        fieldName: "email",
        section: "",
        addressType: "",
        contactType: "",
      };
    }

    let regexps = this._getRegExpList(false, element.tagName);  // isAutoCompleteOff was set to false
    if (!regexps.length) {
      return null;
    }

    let matchedFieldName = this._findMatchedFieldName(element, regexps);
    if (matchedFieldName) {
      return {
        fieldName: matchedFieldName,
        section: "",
        addressType: "",
        contactType: "",
      };
    }

    return null;
  },

  /**
   * @typedef ElementStrings
   * @type {object}
   * @yield {string} id - element id.
   * @yield {string} name - element name.
   * @yield {Array<string>} labels - extracted labels.
   */

  /**
   * Extract all the signature strings of an element.
   *
   * @param {HTMLElement} element
   * @returns {ElementStrings}
   */
  _getElementStrings(element) {
    return {
      *[Symbol.iterator]() {
        yield element.id;
        yield element.name;

        const labels = LabelUtils.findLabelElements(element);
        for (let label of labels) {
          yield* LabelUtils.extractLabelStrings(label);
        }
      },
    };
  },

  /**
   * Find the first matched field name of the element wih given regex list.
   *
   * @param {HTMLElement} element
   * @param {Array<string>} regexps
   *        The regex key names that correspond to pattern in the rule list.
   * @returns {?string} The first matched field name
   */
  _findMatchedFieldName(element, regexps) {
    const getElementStrings = this._getElementStrings(element);
    for (let regexp of regexps) {
      for (let string of getElementStrings) {
        if (this.RULES[regexp].test(string)) {
          return regexp;
        }
      }
    }

    return null;
  },

  /**
   * Determine whether the regexp can match any of element strings.
   *
   * @param {HTMLElement} element
   * @param {RegExp} regexp
   *
   * @returns {boolean}
   */
  _matchRegexp(element, regexp) {
    const elemStrings = this._getElementStrings(element);
    for (const str of elemStrings) {
      if (regexp.test(str)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Phone field grammars - first matched grammar will be parsed. Grammars are
   * separated by { REGEX_SEPARATOR, FIELD_NONE, 0 }. Suffix and extension are
   * parsed separately unless they are necessary parts of the match.
   * The following notation is used to describe the patterns:
   * <cc> - country code field.
   * <ac> - area code field.
   * <phone> - phone or prefix.
   * <suffix> - suffix.
   * <ext> - extension.
   * :N means field is limited to N characters, otherwise it is unlimited.
   * (pattern <field>)? means pattern is optional and matched separately.
   *
   * This grammar list from Chromium will be enabled partially once we need to
   * support more cases of Telephone fields.
   */
  PHONE_FIELD_GRAMMARS: [
    // Country code: <cc> Area Code: <ac> Phone: <phone> (- <suffix>

    // (Ext: <ext>)?)?
    // {REGEX_COUNTRY, FIELD_COUNTRY_CODE, 0},
    // {REGEX_AREA, FIELD_AREA_CODE, 0},
    // {REGEX_PHONE, FIELD_PHONE, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // \( <ac> \) <phone>:3 <suffix>:4 (Ext: <ext>)?
    // {REGEX_AREA_NOTEXT, FIELD_AREA_CODE, 3},
    // {REGEX_PREFIX_SEPARATOR, FIELD_PHONE, 3},
    // {REGEX_PHONE, FIELD_SUFFIX, 4},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <cc> <ac>:3 - <phone>:3 - <suffix>:4 (Ext: <ext>)?
    // {REGEX_PHONE, FIELD_COUNTRY_CODE, 0},
    // {REGEX_PHONE, FIELD_AREA_CODE, 3},
    // {REGEX_PREFIX_SEPARATOR, FIELD_PHONE, 3},
    // {REGEX_SUFFIX_SEPARATOR, FIELD_SUFFIX, 4},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <cc>:3 <ac>:3 <phone>:3 <suffix>:4 (Ext: <ext>)?
    ["tel", "tel-country-code", 3],
    ["tel", "tel-area-code", 3],
    ["tel", "tel-local-prefix", 3],
    ["tel", "tel-local-suffix", 4],
    [null, null, 0],

    // Area Code: <ac> Phone: <phone> (- <suffix> (Ext: <ext>)?)?
    // {REGEX_AREA, FIELD_AREA_CODE, 0},
    // {REGEX_PHONE, FIELD_PHONE, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <ac> <phone>:3 <suffix>:4 (Ext: <ext>)?
    // {REGEX_PHONE, FIELD_AREA_CODE, 0},
    // {REGEX_PHONE, FIELD_PHONE, 3},
    // {REGEX_PHONE, FIELD_SUFFIX, 4},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <cc> \( <ac> \) <phone> (- <suffix> (Ext: <ext>)?)?
    // {REGEX_PHONE, FIELD_COUNTRY_CODE, 0},
    // {REGEX_AREA_NOTEXT, FIELD_AREA_CODE, 0},
    // {REGEX_PREFIX_SEPARATOR, FIELD_PHONE, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: \( <ac> \) <phone> (- <suffix> (Ext: <ext>)?)?
    // {REGEX_PHONE, FIELD_COUNTRY_CODE, 0},
    // {REGEX_AREA_NOTEXT, FIELD_AREA_CODE, 0},
    // {REGEX_PREFIX_SEPARATOR, FIELD_PHONE, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <cc> - <ac> - <phone> - <suffix> (Ext: <ext>)?
    // {REGEX_PHONE, FIELD_COUNTRY_CODE, 0},
    // {REGEX_PREFIX_SEPARATOR, FIELD_AREA_CODE, 0},
    // {REGEX_PREFIX_SEPARATOR, FIELD_PHONE, 0},
    // {REGEX_SUFFIX_SEPARATOR, FIELD_SUFFIX, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Area code: <ac>:3 Prefix: <prefix>:3 Suffix: <suffix>:4 (Ext: <ext>)?
    // {REGEX_AREA, FIELD_AREA_CODE, 3},
    // {REGEX_PREFIX, FIELD_PHONE, 3},
    // {REGEX_SUFFIX, FIELD_SUFFIX, 4},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <ac> Prefix: <phone> Suffix: <suffix> (Ext: <ext>)?
    // {REGEX_PHONE, FIELD_AREA_CODE, 0},
    // {REGEX_PREFIX, FIELD_PHONE, 0},
    // {REGEX_SUFFIX, FIELD_SUFFIX, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <ac> - <phone>:3 - <suffix>:4 (Ext: <ext>)?
    ["tel", "tel-area-code", 0],
    ["tel", "tel-local-prefix", 3],
    ["tel", "tel-local-suffix", 4],
    [null, null, 0],

    // Phone: <cc> - <ac> - <phone> (Ext: <ext>)?
    // {REGEX_PHONE, FIELD_COUNTRY_CODE, 0},
    // {REGEX_PREFIX_SEPARATOR, FIELD_AREA_CODE, 0},
    // {REGEX_SUFFIX_SEPARATOR, FIELD_PHONE, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <ac> - <phone> (Ext: <ext>)?
    // {REGEX_AREA, FIELD_AREA_CODE, 0},
    // {REGEX_PHONE, FIELD_PHONE, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <cc>:3 - <phone>:10 (Ext: <ext>)?
    // {REGEX_PHONE, FIELD_COUNTRY_CODE, 3},
    // {REGEX_PHONE, FIELD_PHONE, 10},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Ext: <ext>
    // {REGEX_EXTENSION, FIELD_EXTENSION, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},

    // Phone: <phone> (Ext: <ext>)?
    // {REGEX_PHONE, FIELD_PHONE, 0},
    // {REGEX_SEPARATOR, FIELD_NONE, 0},
  ],
};

// XPCOMUtils.defineLazyGetter(FormAutofillHeuristics, "RULES", () => {
//   let sandbox = {};
//   const HEURISTICS_REGEXP = "resource://autofill/content/heuristicsRegexp.js";
//   Services.scriptloader.loadSubScript(HEURISTICS_REGEXP, sandbox);
//   return sandbox.HeuristicsRegExp.RULES;
// });

// XPCOMUtils.defineLazyGetter(FormAutofillHeuristics, "_prefEnabled", () => {
//   return Services.prefs.getBoolPref(PREF_HEURISTICS_ENABLED);
// });
FormAutofillHeuristics._prefEnabled = PREF_HEURISTICS_ENABLED;


// Services.prefs.addObserver(PREF_HEURISTICS_ENABLED, () => {
//   FormAutofillHeuristics._prefEnabled = Services.prefs.getBoolPref(
//     PREF_HEURISTICS_ENABLED
//   );
// });
FormAutofillHeuristics._sectionEnabled = PREF_SECTION_ENABLED;

// XPCOMUtils.defineLazyGetter(FormAutofillHeuristics, "_sectionEnabled", () => {
//   return Services.prefs.getBoolPref(PREF_SECTION_ENABLED);
// });

// Services.prefs.addObserver(PREF_SECTION_ENABLED, () => {
//   FormAutofillHeuristics._sectionEnabled = Services.prefs.getBoolPref(
//     PREF_SECTION_ENABLED
//   );
// });

// END of FormAutofillHeuristics.js