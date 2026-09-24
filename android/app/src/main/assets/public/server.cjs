var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_dotenv2 = __toESM(require("dotenv"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_compression = __toESM(require("compression"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");

// src/server/db.ts
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);

// src/data/countriesData.ts
function getCurrencyForCountry(code, name = "") {
  const upperCode = code.toUpperCase();
  const lowerName = name.toLowerCase();
  if (upperCode === "IN" || lowerName.includes("india")) return "INR";
  if (upperCode === "SG" || lowerName.includes("singapore")) return "SGD";
  if (upperCode === "MY" || lowerName.includes("malaysia")) return "MYR";
  if (upperCode === "FJ" || lowerName.includes("fiji")) return "FJD";
  if (upperCode === "MU" || lowerName.includes("mauritius")) return "MUR";
  if (upperCode === "AE" || lowerName.includes("united arab emirates") || lowerName.includes("dubai") || lowerName.includes("uae")) return "AED";
  if (upperCode === "SA" || lowerName.includes("saudi arabia") || lowerName.includes("saudi")) return "SAR";
  if (upperCode === "NP" || lowerName.includes("nepal")) return "NPR";
  return "USD";
}
function getMarketForCountry(code) {
  const upperCode = code.toUpperCase();
  switch (upperCode) {
    case "IN":
      return "mkt-in";
    case "SG":
      return "mkt-sg";
    case "MY":
      return "mkt-my";
    case "MU":
      return "mkt-mu";
    case "FJ":
      return "mkt-fj";
    case "AE":
      return "mkt-ae";
    case "SA":
      return "mkt-sa";
    case "NP":
      return "mkt-np";
    default:
      return "mkt-int";
  }
}
function getRegionForCountry(code) {
  const c = code.toUpperCase();
  if (["AE", "SA", "QA", "KW", "OM", "BH"].includes(c)) return "GCC";
  if ([
    "IN",
    "SG",
    "MY",
    "NP",
    "BD",
    "LK",
    "PK",
    "BT",
    "MV",
    "TH",
    "VN",
    "ID",
    "PH",
    "CN",
    "JP",
    "KR",
    "HK",
    "TW",
    "MO",
    "KH",
    "LA",
    "MM",
    "BN",
    "TL",
    "AF",
    "AZ",
    "AM",
    "GE",
    "KZ",
    "KG",
    "TJ",
    "TM",
    "UZ",
    "IQ",
    "IR",
    "IL",
    "JO",
    "LB",
    "SY",
    "YE",
    "PS"
  ].includes(c)) return "Asia";
  if ([
    "GB",
    "DE",
    "FR",
    "IT",
    "ES",
    "NL",
    "BE",
    "CH",
    "SE",
    "NO",
    "FI",
    "DK",
    "IE",
    "PL",
    "AT",
    "PT",
    "GR",
    "CZ",
    "RO",
    "HU",
    "SK",
    "SI",
    "BG",
    "HR",
    "EE",
    "LV",
    "LT",
    "IS",
    "LU",
    "MT",
    "CY",
    "AL",
    "AD",
    "BY",
    "BA",
    "LI",
    "MD",
    "MC",
    "ME",
    "MK",
    "RS",
    "SM",
    "VA",
    "UA",
    "RU",
    "FO",
    "GI",
    "AX",
    "IM",
    "JE",
    "GG",
    "SJB",
    "SJ"
  ].includes(c)) return "Europe";
  if ([
    "MU",
    "ZA",
    "EG",
    "KE",
    "NG",
    "MA",
    "GH",
    "TZ",
    "UG",
    "DZ",
    "AO",
    "BJ",
    "BW",
    "BF",
    "BI",
    "CV",
    "CM",
    "CF",
    "TD",
    "KM",
    "CG",
    "CD",
    "CI",
    "DJ",
    "GQ",
    "ER",
    "SZ",
    "ET",
    "GA",
    "GM",
    "GN",
    "GW",
    "LS",
    "LR",
    "LY",
    "MG",
    "MW",
    "ML",
    "MR",
    "YT",
    "MZ",
    "NA",
    "NE",
    "RE",
    "RW",
    "SH",
    "ST",
    "SN",
    "SC",
    "SL",
    "SO",
    "SS",
    "SD",
    "TG",
    "TN",
    "ZM",
    "ZW",
    "EH"
  ].includes(c)) return "Africa";
  if ([
    "US",
    "CA",
    "MX",
    "PR",
    "JM",
    "TT",
    "BB",
    "BS",
    "BM",
    "BZ",
    "CR",
    "CU",
    "CW",
    "DM",
    "DO",
    "SV",
    "GD",
    "GP",
    "GT",
    "HT",
    "HN",
    "MQ",
    "MS",
    "NI",
    "PA",
    "KN",
    "LC",
    "VC",
    "SX",
    "TC",
    "AG",
    "AI",
    "AW",
    "KY",
    "MF",
    "PM",
    "VG",
    "VI"
  ].includes(c)) return "North America";
  if ([
    "BR",
    "AR",
    "CL",
    "CO",
    "PE",
    "VE",
    "EC",
    "PY",
    "UY",
    "BO",
    "GY",
    "SR",
    "GF",
    "FK"
  ].includes(c)) return "South America";
  if ([
    "AU",
    "NZ",
    "FJ",
    "PG",
    "SB",
    "VU",
    "WS",
    "TO",
    "AS",
    "CK",
    "PF",
    "GU",
    "KI",
    "MH",
    "FM",
    "NR",
    "NC",
    "NU",
    "NF",
    "MP",
    "PW",
    "PN",
    "TK",
    "TV",
    "UM",
    "WF"
  ].includes(c)) return "Oceania";
  return "Asia";
}
function codeToFlag(code) {
  if (!code || code.length !== 2) return "\u{1F310}";
  const uppercase = code.toUpperCase();
  const first = uppercase.charCodeAt(0) + 127397;
  const second = uppercase.charCodeAt(1) + 127397;
  return String.fromCodePoint(first, second);
}
var COUNTRY_CALLING_CODES = {
  IN: { dialCode: "+91", minLen: 10, maxLen: 10, postalPlaceholder: "e.g. 141008" },
  US: { dialCode: "+1", minLen: 10, maxLen: 10, postalPlaceholder: "e.g. 10282" },
  GB: { dialCode: "+44", minLen: 10, maxLen: 11, postalPlaceholder: "e.g. SW1A 1AA" },
  AE: { dialCode: "+971", minLen: 8, maxLen: 9, postalPlaceholder: "e.g. 00000" },
  SG: { dialCode: "+65", minLen: 8, maxLen: 8, postalPlaceholder: "e.g. 049318" },
  MY: { dialCode: "+60", minLen: 9, maxLen: 10, postalPlaceholder: "e.g. 50450" },
  FJ: { dialCode: "+679", minLen: 7, maxLen: 7, postalPlaceholder: "e.g. 00240" },
  MU: { dialCode: "+230", minLen: 7, maxLen: 8, postalPlaceholder: "e.g. 742CU001" },
  NP: { dialCode: "+977", minLen: 10, maxLen: 10, postalPlaceholder: "e.g. 44600" },
  AU: { dialCode: "+61", minLen: 9, maxLen: 9, postalPlaceholder: "e.g. 2000" },
  CA: { dialCode: "+1", minLen: 10, maxLen: 10, postalPlaceholder: "e.g. M5V 2T6" },
  BO: { dialCode: "+591", minLen: 8, maxLen: 8, postalPlaceholder: "e.g. 1234" },
  AF: { dialCode: "+93" },
  AX: { dialCode: "+358" },
  AL: { dialCode: "+355" },
  DZ: { dialCode: "+213" },
  AS: { dialCode: "+1" },
  AD: { dialCode: "+376" },
  AO: { dialCode: "+244" },
  AI: { dialCode: "+1" },
  AQ: { dialCode: "+672" },
  AG: { dialCode: "+1" },
  AR: { dialCode: "+54" },
  AM: { dialCode: "+374" },
  AW: { dialCode: "+297" },
  AT: { dialCode: "+43" },
  AZ: { dialCode: "+994" },
  BS: { dialCode: "+1" },
  BH: { dialCode: "+973" },
  BD: { dialCode: "+880" },
  BB: { dialCode: "+1" },
  BY: { dialCode: "+375" },
  BE: { dialCode: "+32" },
  BZ: { dialCode: "+501" },
  BJ: { dialCode: "+229" },
  BM: { dialCode: "+1" },
  BT: { dialCode: "+975" },
  BA: { dialCode: "+387" },
  BW: { dialCode: "+267" },
  BV: { dialCode: "+47" },
  BR: { dialCode: "+55" },
  IO: { dialCode: "+246" },
  BN: { dialCode: "+673" },
  BG: { dialCode: "+359" },
  BF: { dialCode: "+226" },
  BI: { dialCode: "+257" },
  KH: { dialCode: "+855" },
  CM: { dialCode: "+237" },
  CV: { dialCode: "+238" },
  KY: { dialCode: "+1" },
  CF: { dialCode: "+236" },
  TD: { dialCode: "+235" },
  CL: { dialCode: "+56" },
  CN: { dialCode: "+86" },
  CX: { dialCode: "+61" },
  CC: { dialCode: "+61" },
  CO: { dialCode: "+57" },
  KM: { dialCode: "+269" },
  CG: { dialCode: "+242" },
  CD: { dialCode: "+243" },
  CK: { dialCode: "+682" },
  CR: { dialCode: "+506" },
  CI: { dialCode: "+225" },
  HR: { dialCode: "+385" },
  CU: { dialCode: "+53" },
  CW: { dialCode: "+599" },
  CY: { dialCode: "+357" },
  CZ: { dialCode: "+420" },
  DK: { dialCode: "+45" },
  DJ: { dialCode: "+253" },
  DM: { dialCode: "+1" },
  DO: { dialCode: "+1" },
  EC: { dialCode: "+593" },
  EG: { dialCode: "+20" },
  SV: { dialCode: "+503" },
  GQ: { dialCode: "+240" },
  ER: { dialCode: "+291" },
  EE: { dialCode: "+372" },
  SZ: { dialCode: "+268" },
  ET: { dialCode: "+251" },
  FK: { dialCode: "+500" },
  FO: { dialCode: "+298" },
  FI: { dialCode: "+358" },
  FR: { dialCode: "+33" },
  GF: { dialCode: "+594" },
  PF: { dialCode: "+689" },
  TF: { dialCode: "+262" },
  GA: { dialCode: "+241" },
  GM: { dialCode: "+220" },
  GE: { dialCode: "+995" },
  DE: { dialCode: "+49" },
  GH: { dialCode: "+233" },
  GI: { dialCode: "+350" },
  GR: { dialCode: "+30" },
  GL: { dialCode: "+299" },
  GD: { dialCode: "+1" },
  GP: { dialCode: "+590" },
  GU: { dialCode: "+1" },
  GT: { dialCode: "+502" },
  GG: { dialCode: "+44" },
  GN: { dialCode: "+224" },
  GW: { dialCode: "+245" },
  GY: { dialCode: "+592" },
  HT: { dialCode: "+509" },
  HM: { dialCode: "+672" },
  VA: { dialCode: "+39" },
  HN: { dialCode: "+504" },
  HK: { dialCode: "+852" },
  HU: { dialCode: "+36" },
  IS: { dialCode: "+354" },
  ID: { dialCode: "+62" },
  IR: { dialCode: "+98" },
  IQ: { dialCode: "+964" },
  IE: { dialCode: "+353" },
  IM: { dialCode: "+44" },
  IL: { dialCode: "+972" },
  IT: { dialCode: "+39" },
  JM: { dialCode: "+1" },
  JP: { dialCode: "+81" },
  JE: { dialCode: "+44" },
  JO: { dialCode: "+962" },
  KZ: { dialCode: "+7" },
  KE: { dialCode: "+254" },
  KI: { dialCode: "+686" },
  KP: { dialCode: "+850" },
  KR: { dialCode: "+82" },
  KW: { dialCode: "+965" },
  KG: { dialCode: "+996" },
  LA: { dialCode: "+856" },
  LV: { dialCode: "+371" },
  LB: { dialCode: "+961" },
  LS: { dialCode: "+266" },
  LR: { dialCode: "+231" },
  LY: { dialCode: "+218" },
  LI: { dialCode: "+423" },
  LT: { dialCode: "+370" },
  LU: { dialCode: "+352" },
  MO: { dialCode: "+853" },
  MG: { dialCode: "+261" },
  MW: { dialCode: "+265" },
  MV: { dialCode: "+960" },
  ML: { dialCode: "+223" },
  MT: { dialCode: "+356" },
  MH: { dialCode: "+692" },
  MQ: { dialCode: "+596" },
  MR: { dialCode: "+222" },
  YT: { dialCode: "+262" },
  MX: { dialCode: "+52" },
  FM: { dialCode: "+691" },
  MD: { dialCode: "+373" },
  MC: { dialCode: "+377" },
  MN: { dialCode: "+976" },
  ME: { dialCode: "+382" },
  MS: { dialCode: "+1" },
  MA: { dialCode: "+212" },
  MZ: { dialCode: "+258" },
  MM: { dialCode: "+95" },
  NA: { dialCode: "+264" },
  NR: { dialCode: "+674" },
  NL: { dialCode: "+31" },
  NC: { dialCode: "+687" },
  NZ: { dialCode: "+64" },
  NI: { dialCode: "+505" },
  NE: { dialCode: "+227" },
  NG: { dialCode: "+234" },
  NU: { dialCode: "+683" },
  NF: { dialCode: "+672" },
  MK: { dialCode: "+389" },
  MP: { dialCode: "+1" },
  NO: { dialCode: "+47" },
  OM: { dialCode: "+968" },
  PK: { dialCode: "+92" },
  PW: { dialCode: "+680" },
  PS: { dialCode: "+970" },
  PA: { dialCode: "+507" },
  PG: { dialCode: "+675" },
  PY: { dialCode: "+595" },
  PE: { dialCode: "+51" },
  PH: { dialCode: "+63" },
  PN: { dialCode: "+64" },
  PL: { dialCode: "+48" },
  PT: { dialCode: "+351" },
  PR: { dialCode: "+1" },
  QA: { dialCode: "+974" },
  RE: { dialCode: "+262" },
  RO: { dialCode: "+40" },
  RU: { dialCode: "+7" },
  RW: { dialCode: "+250" },
  BL: { dialCode: "+590" },
  SH: { dialCode: "+290" },
  KN: { dialCode: "+1" },
  LC: { dialCode: "+1" },
  MF: { dialCode: "+590" },
  PM: { dialCode: "+508" },
  VC: { dialCode: "+1" },
  WS: { dialCode: "+685" },
  SM: { dialCode: "+378" },
  ST: { dialCode: "+239" },
  SA: { dialCode: "+966" },
  SN: { dialCode: "+221" },
  RS: { dialCode: "+381" },
  SC: { dialCode: "+248" },
  SL: { dialCode: "+232" },
  SX: { dialCode: "+1" },
  SK: { dialCode: "+421" },
  SI: { dialCode: "+386" },
  SB: { dialCode: "+677" },
  SO: { dialCode: "+252" },
  ZA: { dialCode: "+27" },
  GS: { dialCode: "+500" },
  SS: { dialCode: "+211" },
  ES: { dialCode: "+34" },
  LK: { dialCode: "+94" },
  SD: { dialCode: "+249" },
  SR: { dialCode: "+597" },
  SJ: { dialCode: "+47" },
  SE: { dialCode: "+46" },
  CH: { dialCode: "+41" },
  SY: { dialCode: "+963" },
  TW: { dialCode: "+886" },
  TJ: { dialCode: "+992" },
  TZ: { dialCode: "+255" },
  TH: { dialCode: "+66" },
  TL: { dialCode: "+670" },
  TG: { dialCode: "+228" },
  TK: { dialCode: "+690" },
  TO: { dialCode: "+676" },
  TT: { dialCode: "+1" },
  TN: { dialCode: "+216" },
  TR: { dialCode: "+90" },
  TM: { dialCode: "+993" },
  TC: { dialCode: "+1" },
  TV: { dialCode: "+688" },
  UG: { dialCode: "+256" },
  UA: { dialCode: "+380" },
  UM: { dialCode: "+1" },
  UY: { dialCode: "+598" },
  UZ: { dialCode: "+998" },
  VU: { dialCode: "+678" },
  VE: { dialCode: "+58" },
  VN: { dialCode: "+84" },
  VG: { dialCode: "+1" },
  VI: { dialCode: "+1" },
  WF: { dialCode: "+681" },
  EH: { dialCode: "+212" },
  YE: { dialCode: "+967" },
  ZM: { dialCode: "+260" },
  ZW: { dialCode: "+263" }
};
function getPostalLabel(code) {
  if (code === "US") return "ZIP Code";
  if (code === "IN") return "Pincode";
  if (code === "GB") return "Postcode";
  return "Postal Code";
}
var LOOKUP_SUPPORTED_CODES = /* @__PURE__ */ new Set(["IN", "US", "GB", "SG", "MY", "CA", "AU"]);
var RAW_COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AX", name: "\xC5land Islands" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua & Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia & Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo - Brazzaville" },
  { code: "CD", name: "Congo - Kinshasa" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "C\xF4te d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CW", name: "Cura\xE7ao" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard & McDonald Islands" },
  { code: "VA", name: "Vatican City" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong SAR China" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "North Korea" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao SAR China" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar (Burma)" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MK", name: "North Macedonia" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestinian Territories" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn Islands" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "R\xE9union" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "BL", name: "St. Barth\xE9lemy" },
  { code: "SH", name: "St. Helena" },
  { code: "KN", name: "St. Kitts & Nevis" },
  { code: "LC", name: "St. Lucia" },
  { code: "MF", name: "St. Martin" },
  { code: "PM", name: "St. Pierre & Miquelon" },
  { code: "VC", name: "St. Vincent & Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "S\xE3o Tom\xE9 & Pr\xEDncipe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SX", name: "Sint Maarten" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia & South Sandwich Islands" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard & Jan Mayen" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad & Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks & Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UM", name: "U.S. Outlying Islands" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "VG", name: "British Virgin Islands" },
  { code: "VI", name: "U.S. Virgin Islands" },
  { code: "WF", name: "Wallis & Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
];
var WORLD_COUNTRIES = RAW_COUNTRIES.map((c) => {
  const meta = COUNTRY_CALLING_CODES[c.code] || { dialCode: "+1" };
  const currencyCode = getCurrencyForCountry(c.code, c.name);
  return {
    code: c.code,
    iso2: c.code,
    name: c.name,
    flag: codeToFlag(c.code),
    phoneCode: meta.dialCode,
    dialCode: meta.dialCode,
    currencyCode,
    currency: currencyCode,
    postalLabel: getPostalLabel(c.code),
    postalPlaceholder: meta.postalPlaceholder || "Postal / ZIP Code",
    phoneMinDigits: meta.minLen || 6,
    phoneMaxDigits: meta.maxLen || 12,
    supportsLookup: LOOKUP_SUPPORTED_CODES.has(c.code),
    region: getRegionForCountry(c.code),
    marketId: getMarketForCountry(c.code)
  };
});
var DEFAULT_COUNTRY = WORLD_COUNTRIES.find((c) => c.code === "IN") || {
  code: "IN",
  iso2: "IN",
  name: "India",
  flag: "\u{1F1EE}\u{1F1F3}",
  phoneCode: "+91",
  dialCode: "+91",
  currencyCode: "INR",
  currency: "INR",
  postalLabel: "Pincode",
  postalPlaceholder: "e.g. 141008",
  phoneMinDigits: 10,
  phoneMaxDigits: 10,
  supportsLookup: true
};

// src/data/initialData.ts
var INITIAL_CURRENCIES = [
  { code: "INR", symbol: "\u20B9", name: "Indian Rupee", rateToINR: 1, country: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rateToINR: 62.5, country: "Singapore", flag: "\u{1F1F8}\u{1F1EC}" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", rateToINR: 18.8, country: "Malaysia", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "MUR", symbol: "Rs", name: "Mauritian Rupee", rateToINR: 1.8, country: "Mauritius", flag: "\u{1F1F2}\u{1F1FA}" },
  { code: "FJD", symbol: "FJ$", name: "Fijian Dollar", rateToINR: 37.2, country: "Fiji", flag: "\u{1F1EB}\u{1F1EF}" },
  { code: "AED", symbol: "\u062F.\u0625", name: "UAE Dirham", rateToINR: 22.8, country: "United Arab Emirates", flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "SAR", symbol: "\uFDFC", name: "Saudi Riyal", rateToINR: 22.2, country: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "NPR", symbol: "\u0930\u0941", name: "Nepalese Rupee", rateToINR: 0.625, country: "Nepal", flag: "\u{1F1F3}\u{1F1F5}" },
  { code: "USD", symbol: "$", name: "US Dollar (Worldwide)", rateToINR: 83.5, country: "United States & Global", flag: "\u{1F310}" }
];
var INITIAL_MARKETS = [
  {
    id: "mkt-in",
    name: "India Market",
    code: "IN",
    currencyCode: "INR",
    shippingRule: "COD_AND_PREPAID",
    paymentGateways: ["RAZORPAY", "COD", "STRIPE"],
    freeShippingThreshold: 1999,
    enabled: true
  },
  {
    id: "mkt-sg",
    name: "Singapore Market",
    code: "SG",
    currencyCode: "SGD",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 99,
    enabled: true
  },
  {
    id: "mkt-my",
    name: "Malaysia Market",
    code: "MY",
    currencyCode: "MYR",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 350,
    enabled: true
  },
  {
    id: "mkt-mu",
    name: "Mauritius Market",
    code: "MU",
    currencyCode: "MUR",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 3500,
    enabled: true
  },
  {
    id: "mkt-fj",
    name: "Fiji Market",
    code: "FJ",
    currencyCode: "FJD",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 180,
    enabled: true
  },
  {
    id: "mkt-ae",
    name: "UAE Market",
    code: "AE",
    currencyCode: "AED",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 300,
    enabled: true
  },
  {
    id: "mkt-sa",
    name: "Saudi Arabia Market",
    code: "SA",
    currencyCode: "SAR",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 300,
    enabled: true
  },
  {
    id: "mkt-np",
    name: "Nepal Market",
    code: "NP",
    currencyCode: "NPR",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 3e3,
    enabled: true
  },
  {
    id: "mkt-int",
    name: "International Market (USD)",
    code: "INT",
    currencyCode: "USD",
    shippingRule: "PREPAID_ONLY",
    paymentGateways: ["RAZORPAY", "STRIPE", "PAYPAL"],
    freeShippingThreshold: 99,
    enabled: true
  }
];
var INITIAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Hair Oils & Elixirs",
    slug: "hair-oils",
    image: "/images/hakkiveda_108_oil_gold.jpg",
    imageFilename: "hakkiveda_108_oil_gold.jpg",
    desktopBanner: "/images/hakkiveda_108_oil_gold.jpg",
    desktopBannerFilename: "hakkiveda_108_oil_gold.jpg",
    mobileBanner: "/images/hakkiveda_108_oil_gold.jpg",
    mobileBannerFilename: "hakkiveda_108_oil_gold.jpg",
    description: "Slow-brewed in copper cauldrons with 42 rare mountain herbs for deep scalp penetration.",
    fullDescription: "Experience the authentic Hakki-Pikki tribal hair oil formulation. Handcrafted in Mysore over 21 solar cycles using 108 wild forest herbs and virgin sesame oil.",
    itemCount: 4,
    status: "ACTIVE",
    showInNav: true,
    showOnHomepage: true,
    isFeatured: true,
    parentId: null,
    sortOrder: 1,
    seoTitle: "Adivasi Hair Oils & Natural Elixirs - HakkiVeda",
    seoMetaDescription: "Pure tribal adivasi 108 herbal hair oils handcrafted for root strength, reducing hair fall, and deep scalp nourishment.",
    seoKeywords: "adivasi hair oil, 108 herbs oil, natural hair elixir, hakkiveda hair oil"
  },
  {
    id: "cat-2",
    name: "Herbal Cleansers",
    slug: "herbal-cleansers",
    image: "/images/hakkiveda_108_oil_yellow_cap.jpg",
    imageFilename: "hakkiveda_108_oil_yellow_cap.jpg",
    description: "Sulfate-free shampoos and natural soapnut clarifying cleansers.",
    fullDescription: "Gentle, natural scalp cleansers enriched with Shikakai, Reetha, and wild Hibiscus flowers that preserve essential oils while clarifying product buildup.",
    itemCount: 3,
    status: "ACTIVE",
    showInNav: true,
    showOnHomepage: true,
    isFeatured: true,
    parentId: null,
    sortOrder: 2,
    seoTitle: "Herbal Cleansers & Sulfate-Free Shampoos - HakkiVeda",
    seoMetaDescription: "Shop natural soapnut and shikakai scalp cleansers for smooth, residue-free hair and scalp wellness.",
    seoKeywords: "herbal cleanser, adivasi shampoo, shikakai hair wash"
  },
  {
    id: "cat-3",
    name: "Follicle Serums",
    slug: "follicle-serums",
    image: "/images/hakkiveda_108_oil_back_label.jpg",
    imageFilename: "hakkiveda_108_oil_back_label.jpg",
    description: "Targeted scalp drops to nourish hair roots and improve strand density.",
    fullDescription: "Potent tribal drop concentrate formulated with wild Bhringraj and Gunja seeds to nourish and revitalize thinning scalp zones.",
    itemCount: 2,
    status: "ACTIVE",
    showInNav: true,
    showOnHomepage: true,
    isFeatured: false,
    parentId: "cat-1",
    sortOrder: 3,
    seoTitle: "Follicle Nourishing Serums - HakkiVeda",
    seoMetaDescription: "Concentrated adivasi scalp drops designed to boost root vitality and improve hair density.",
    seoKeywords: "follicle serum, hair density drops, root booster"
  },
  {
    id: "cat-4",
    name: "Tribal Masks & Lepas",
    slug: "masks-lepas",
    image: "/images/hakkiveda_baldness_powder.jpg",
    imageFilename: "hakkiveda_baldness_powder.jpg",
    description: "Traditional forest herbal muds and restorative scalp detox pastes.",
    fullDescription: "Ancient herbal mud packs infused with wild Brahmi, Neem, and volcanic red clay to cool inflamed hair roots and clear scalp buildup.",
    itemCount: 2,
    status: "ACTIVE",
    showInNav: true,
    showOnHomepage: true,
    isFeatured: false,
    parentId: null,
    sortOrder: 4,
    seoTitle: "Adivasi Tribal Scalp Masks & Herbal Lepas - HakkiVeda",
    seoMetaDescription: "Detoxifying herbal hair masks and scalp mud packs formulated with forest botanical roots.",
    seoKeywords: "hair mask, herbal lepa, scalp mud pack"
  },
  {
    id: "cat-5",
    name: "Wellness Combos",
    slug: "wellness-combos",
    image: "/images/hakkiveda_oil_couple_herbs.jpg",
    imageFilename: "hakkiveda_oil_couple_herbs.jpg",
    description: "Complete 90-day hair density and scalp care bundles.",
    fullDescription: "Curated herbal therapy kits combining 108 oil, herbal cleanser, and scalp lepas for holistic 90-day hair care cycles.",
    itemCount: 3,
    status: "ACTIVE",
    showInNav: true,
    showOnHomepage: true,
    isFeatured: true,
    parentId: null,
    sortOrder: 5,
    seoTitle: "90-Day Hair Density & Wellness Combos - HakkiVeda",
    seoMetaDescription: "Save on complete adivasi hair care regimen kits and 90-day hair wellness combo packs.",
    seoKeywords: "hair care combo, adivasi hair care kit, wellness bundle"
  }
];
var INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "HAKKIVEDA Natural Adivasi 108 Herbal Hair Oil (Tribal Gold)",
    category: "Hair Oils & Elixirs",
    primaryCategory: "hair-care",
    subtitle: "Authentic 108 Mountain Herbs Slow-Brewed Formula",
    priceINR: 2499,
    originalPriceINR: 2999,
    rating: 4.95,
    reviewsCount: 1420,
    image: "/images/hakkiveda_108_oil_gold.jpg",
    additionalImages: [
      "/images/hakkiveda_oil_couple_herbs.jpg",
      "/images/hakkiveda_108_oil_back_label.jpg",
      "/images/hakkiveda_108_oil_yellow_cap.jpg",
      "/images/hakkiveda_108_herbs_infographic.jpg"
    ],
    description: "The crown jewel of Hakki-Pikki tribal wisdom. Handcrafted in small artisanal batches in Mysore using 108 rare wild-harvested herbs, root extracts, and virgin sesame & coconut oils slow-cooked in traditional copper cauldrons over woodfire for 21 solar cycles.",
    benefits: [
      "Nourishes scalp roots and supports visible hair density",
      "Significantly reduces excessive hair fall and root breakage from root to tip",
      "Promotes natural dark luster and healthy length vitality",
      "Relieves dry scalp, persistent itchiness, and flaky buildup",
      "Deeply conditions coarse, dry, and chemically treated hair strands"
    ],
    ingredients: [
      "Wild Amla (Phyllanthus emblica)",
      "Bhringraj (Eclipta alba)",
      "Gunja Seed Elixir (Abrus precatorius)",
      "Shikakai (Senegalia rugata)",
      "Devadaru Resin (Cedrus deodara)",
      "Jatamansi (Nardostachys jatamansi)",
      "Nagarmotha (Cyperus rotundus)",
      "Cold-pressed Sesame & Coconut Oil base"
    ],
    volume: "200 ml / 6.7 fl oz",
    usageRitual: "Warm 10-15ml oil in your palms. Apply gently onto dry scalp using fingertips in circular movements. Leave overnight or for at least 2 hours before washing with 42 Mountain Herbs Shampoo.",
    howToUse: [
      "Warm a generous portion (10-15 ml) between your palms or place the bottle in warm water for 2 minutes.",
      "Part your hair into clean sections using your fingers or a wide-tooth neem comb.",
      "Massage the herbal oil deeply into your scalp roots in circular, gentle rhythmic motions for 8\u201310 minutes.",
      "Smooth remaining oil down to the hair tips to prevent split ends and cuticle roughness.",
      "Leave overnight for deep restorative scalp nourishment, or leave for a minimum of 2 hours wrapped in a warm damp towel.",
      "Rinse with lukewarm water and HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo."
    ],
    whoItIsFor: [
      "Men and women looking to address excessive hair shedding and crown thinning",
      "Those experiencing stress-related hair thinning or sparse hairline spots",
      "Anyone dealing with dry, itchy, or dandruff-prone scalp terrain",
      "Those seeking thick, glossy, and natural dark hair vitality with Ayurvedic purity",
      "Safe and effective for all hair types (Straight, Wavy, Curly, Coily) and color-treated hair"
    ],
    safetyPrecautions: [
      "Perform a 24-hour patch test behind the ear before first application to rule out rare individual botanical sensitivities.",
      "For external scalp and hair topical use only. Do not ingest.",
      "Avoid direct contact with eyes. In case of accidental contact, flush immediately with fresh cool water.",
      "Contains 100% natural herbs \u2014 natural sedimentation may settle at the bottom of the bottle, which is proof of raw herbal purity."
    ],
    storageInstructions: "Store in a cool, dry place away from direct sunlight and moisture. Keep the cap tightly sealed after each use. No artificial preservatives added.",
    shippingAndDelivery: "Dispatched within 24 hours in tamper-proof botanical protective packaging. Express Delivery: 2\u20134 business days across India; 4\u20137 business days for international express air shipping (USA, Singapore, Malaysia, Mauritius, UAE, Fiji, and Global).",
    returnsPolicy: "Eligible return, replacement or refund requests should be raised within 7 days of delivery. Opened/used personal-care products are generally non-returnable for hygiene reasons except for damaged, defective or incorrect items.",
    productAttributes: [
      { label: "Item Form", value: "Cold-infusion Botanical Herbal Oil" },
      { label: "Volume / Net Quantity", value: "200 ml / 6.7 fl oz (Standard)" },
      { label: "Hair Type", value: "All Hair Types (Thinning, Dry, Coarse, Damaged)" },
      { label: "Scent", value: "Authentic Earthy Forest Herbs & Devadaru" },
      { label: "Formulation Method", value: "21 Solar Cycles Woodfire Copper Brewing" },
      { label: "Country of Origin", value: "Mysore, Karnataka, India" },
      { label: "Formulation Heritage", value: "Traditional Hakki-Pikki Herbal Formulation" },
      { label: "Shelf Life", value: "24 Months from Manufacturing Date" }
    ],
    variants: [
      {
        id: "var-101",
        name: "100 ml (Trial Pack)",
        sku: "HV-TGHO-100",
        priceINR: 1499,
        originalPriceINR: 1799,
        stock: 180,
        weight: "160g",
        size: "100 ml",
        image: "/images/hakkiveda_108_oil_gold.jpg",
        active: true
      },
      {
        id: "var-102",
        name: "200 ml (Standard - Most Popular)",
        sku: "HV-TGHO-200",
        priceINR: 2499,
        originalPriceINR: 2999,
        stock: 250,
        weight: "320g",
        size: "200 ml",
        image: "/images/hakkiveda_108_oil_gold.jpg",
        active: true
      },
      {
        id: "var-103",
        name: "500 ml (Family Value Pack)",
        sku: "HV-TGHO-500",
        priceINR: 4999,
        originalPriceINR: 6499,
        stock: 120,
        weight: "680g",
        size: "500 ml",
        image: "/images/hakkiveda_108_oil_yellow_cap.jpg",
        active: true
      },
      {
        id: "var-104",
        name: "1 L (Artisanal Copper Edition)",
        sku: "HV-TGHO-1000",
        priceINR: 8999,
        originalPriceINR: 11999,
        stock: 45,
        weight: "1350g",
        size: "1 L",
        image: "/images/hakkiveda_oil_couple_herbs.jpg",
        active: true
      }
    ],
    stock: 250,
    sku: "HV-TGHO-200",
    isBestseller: true,
    isNew: false,
    inStock: true
  },
  {
    id: "prod-2",
    name: "HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo",
    category: "Herbal Cleansers",
    primaryCategory: "hair-care",
    subtitle: "Sulfate-Free Soapnut & Shikakai Scalp Cleanser",
    priceINR: 1299,
    originalPriceINR: 1599,
    rating: 4.88,
    reviewsCount: 840,
    image: "/images/hakkiveda_108_oil_yellow_cap.jpg",
    additionalImages: [
      "/images/hakkiveda_108_herbs_infographic.jpg",
      "/images/hakkiveda_108_oil_back_label.jpg"
    ],
    description: "A gentle, low-foaming botanical cleanser enriched with Reetha (soapnut), Hibiscus flowers, and Shikakai infusion. Gently lifts oil and environmental impurities without stripping natural scalp lipids.",
    benefits: [
      "Sulfate, Paraben, Phthalate and Silicone free",
      "Maintains healthy 5.5 acidic scalp microbiome pH",
      "Prevents post-wash dryness, frizz, and strand brittleness",
      "Safe for keratin-treated, colored, and chemically processed hair"
    ],
    ingredients: [
      "Reetha Fruit Extract (Sapindus mukorossi)",
      "Shikakai Decoction (Acacia concinna)",
      "Fresh Hibiscus Petal Juice (Hibiscus rosa-sinensis)",
      "Aloe Vera Leaf Extract (Aloe barbadensis)",
      "Vetiver Essential Oil (Chrysopogon zizanioides)"
    ],
    volume: "250 ml / 8.4 fl oz",
    usageRitual: "Take a coin-sized amount, dilute with water, apply to damp scalp, massage gently for 2 minutes and rinse thoroughly with cool water.",
    howToUse: [
      "Wet hair thoroughly with lukewarm or cool water.",
      "Take 1\u20132 pumps in wet hands, lather slightly, and apply directly to the scalp roots.",
      "Massage with finger pads for 2 to 3 minutes to activate the botanical saponins.",
      "Let the mild lather glide down the lengths of your hair without vigorous friction.",
      "Rinse thoroughly until water runs completely clear."
    ],
    whoItIsFor: [
      "Individuals looking for a residue-free natural cleanser to wash off heavy herbal oils",
      "Sensitive scalp sufferers prone to itchy flare-ups from harsh SLS/SLES sulfates",
      "Color-treated and chemically straightened hair needing gentle nourishment"
    ],
    safetyPrecautions: [
      "For external hair and scalp use only.",
      "Natural soapnuts can sting if they enter the eyes. Rinse thoroughly with water immediately if contact occurs."
    ],
    storageInstructions: "Keep in a cool place away from direct heat and water splashes. Close pump tightly when travelling.",
    shippingAndDelivery: "Fast dispatch within 24 hours. Arrives in 2-4 business days across India, 4-7 days worldwide.",
    returnsPolicy: "Eligible return, replacement or refund requests should be raised within 7 days of delivery. Opened/used personal-care products are generally non-returnable for hygiene reasons except for damaged, defective or incorrect items.",
    productAttributes: [
      { label: "Item Form", value: "Botanical Liquid Scalp Cleanser" },
      { label: "Volume", value: "250 ml / 8.4 fl oz" },
      { label: "Sulfate & Paraben Free", value: "100% Free of synthetic sulfates & silicones" },
      { label: "pH Balance", value: "5.5 Scalp Safe" },
      { label: "Country of Origin", value: "India" },
      { label: "Shelf Life", value: "24 Months" }
    ],
    variants: [
      {
        id: "var-201",
        name: "200 ml (Compact)",
        sku: "HV-MHCS-200",
        priceINR: 999,
        originalPriceINR: 1199,
        stock: 140,
        weight: "240g",
        size: "200 ml",
        image: "/images/hakkiveda_108_oil_yellow_cap.jpg",
        active: true
      },
      {
        id: "var-202",
        name: "250 ml (Standard)",
        sku: "HV-MHCS-250",
        priceINR: 1299,
        originalPriceINR: 1599,
        stock: 180,
        weight: "300g",
        size: "250 ml",
        image: "/images/hakkiveda_108_oil_yellow_cap.jpg",
        active: true
      },
      {
        id: "var-203",
        name: "500 ml (Family Size)",
        sku: "HV-MHCS-500",
        priceINR: 2299,
        originalPriceINR: 2899,
        stock: 90,
        weight: "580g",
        size: "500 ml",
        image: "/images/hakkiveda_108_oil_yellow_cap.jpg",
        active: true
      }
    ],
    stock: 180,
    sku: "HV-MHCS-250",
    isBestseller: true,
    isNew: false,
    inStock: true
  },
  {
    id: "prod-3",
    name: "HAKKIVEDA Root Density Follicle Serum",
    category: "Follicle Serums",
    primaryCategory: "hair-care",
    subtitle: "Concentrated Botanical Scalp Drops",
    priceINR: 1899,
    originalPriceINR: 2199,
    rating: 4.92,
    reviewsCount: 512,
    image: "/images/hakkiveda_108_oil_back_label.jpg",
    additionalImages: [
      "/images/hakkiveda_108_oil_gold.jpg",
      "/images/hakkiveda_108_herbs_infographic.jpg"
    ],
    description: "An advanced non-greasy aqueous serum formulated with fermented Indian Gooseberry and Gotu Kola. Designed to be left on the scalp daily to stimulate microcirculation and strengthen the dermal papilla.",
    benefits: [
      "Non-sticky leave-in daily morning or bedtime formula",
      "Increases hair strand diameter and root elasticity",
      "Shields roots from DHT follicle miniaturization",
      "Dermatologically tested and non-comedogenic for sensitive scalps"
    ],
    ingredients: [
      "Fermented Amla Nectar",
      "Gotu Kola (Centella asiatica)",
      "Red Onion Extract",
      "Brahmi Leaf Juice",
      "Rosemary Essential Oil Hydrosol"
    ],
    volume: "50 ml / 1.7 fl oz",
    usageRitual: "Apply 1 full dropper onto dry or towel-dried scalp sections daily. Massage gently. Do not rinse.",
    howToUse: [
      "Use the precision glass pipette to draw 1 ml of serum.",
      "Part hair in areas of visible thinning, receding temples, or crown section.",
      "Apply drops directly onto the scalp surface.",
      "Gently tap and massage with your fingertips until completely absorbed. Do not rinse."
    ],
    whoItIsFor: [
      "Men and women with early receding hairline or crown thinning",
      "Busy professionals seeking an invisible, water-light leave-on daily solution"
    ],
    safetyPrecautions: [
      "External scalp use only. Keep out of reach of children.",
      "If mild redness or sensitivity occurs, reduce frequency to alternate days."
    ],
    storageInstructions: "Store in an amber glass bottle at room temperature away from direct sunlight.",
    shippingAndDelivery: "Packaged in shock-proof air-cushioned boxes. Express delivery in 2-4 business days.",
    returnsPolicy: "Eligible return, replacement or refund requests should be raised within 7 days of delivery. Opened/used personal-care products are generally non-returnable for hygiene reasons except for damaged, defective or incorrect items.",
    productAttributes: [
      { label: "Item Form", value: "Weightless Aqueous Scalp Drops" },
      { label: "Volume", value: "50 ml / 1.7 fl oz" },
      { label: "Fragrance", value: "Mild Natural Rosemary & Brahmi" },
      { label: "Non-Greasy", value: "100% Water-based Fast Absorbing" }
    ],
    variants: [
      {
        id: "var-301",
        name: "30 ml (Travel Pipette)",
        sku: "HV-RDFS-030",
        priceINR: 1299,
        originalPriceINR: 1499,
        stock: 80,
        weight: "90g",
        size: "30 ml",
        image: "/images/hakkiveda_108_oil_back_label.jpg",
        active: true
      },
      {
        id: "var-302",
        name: "50 ml (Standard Dropper)",
        sku: "HV-RDFS-050",
        priceINR: 1899,
        originalPriceINR: 2199,
        stock: 120,
        weight: "140g",
        size: "50 ml",
        image: "/images/hakkiveda_108_oil_back_label.jpg",
        active: true
      },
      {
        id: "var-303",
        name: "100 ml (2-Month Intensive)",
        sku: "HV-RDFS-100",
        priceINR: 3299,
        originalPriceINR: 3999,
        stock: 65,
        weight: "240g",
        size: "100 ml",
        image: "/images/hakkiveda_108_oil_back_label.jpg",
        active: true
      }
    ],
    stock: 120,
    sku: "HV-RDFS-050",
    isBestseller: false,
    isNew: true,
    inStock: true
  },
  {
    id: "prod-4",
    name: "HAKKIVEDA Natural Adivasi Baldness Powder & Lepa",
    category: "Tribal Masks & Lepas",
    primaryCategory: "skin-care",
    subtitle: "Nourishing & Bald Spot Scalp Care Powder",
    priceINR: 1499,
    originalPriceINR: 1799,
    rating: 4.91,
    reviewsCount: 680,
    image: "/images/hakkiveda_baldness_powder.jpg",
    additionalImages: [
      "/images/hakkiveda_baldness_powder_ingredients.jpg",
      "/images/hakkiveda_108_oil_gold.jpg"
    ],
    description: "Specialized Hakki-Pikki tribal herbal powder formula for bald spots, receding temple lines, and thinning hair root patches. Mix with water or oil to form a traditional herbal paste (Lepa).",
    benefits: [
      "Targeted root nourishment on visible bald patches & thinning spots",
      "Helps reduce severe dandruff flakes and clears clogged scalp sebum pores",
      "Soothes and stimulates the scalp terrain with natural camphor cooling"
    ],
    ingredients: [
      "Wild Neem Leaf Powder (Azadirachta indica)",
      "Gunja Seed Ash Powder (Abrus precatorius)",
      "Purified Camphor (Bhimseni Kapoor)",
      "Multani Mitti & Devadaru Bark",
      "Fenugreek & Tulsi Extract"
    ],
    volume: "150 g / 5.3 oz",
    usageRitual: "Mix 2 tablespoons with warm water or Herbal Hair Oil to form a paste. Apply on bald spots & scalp. Leave for 20 minutes, then wash with HAKKIVEDA Clarifying Shampoo.",
    howToUse: [
      "Take 2 to 3 tablespoons of powder in a wooden or ceramic bowl.",
      "Add warm water or 10-15 ml of HAKKIVEDA Hair Oil to make a smooth, creamy paste.",
      "Apply paste generously over thinning zones, bald patches, and the crown area.",
      "Leave the botanical paste on for 20\u201330 minutes until semi-dry.",
      "Gently wash off using warm water and HAKKIVEDA Shampoo."
    ],
    whoItIsFor: [
      "Men and women dealing with stubborn bald patches, receding hairline, and severe thinning",
      "Individuals battling recurring flaky dandruff and clogged follicle pores"
    ],
    safetyPrecautions: [
      "A mild cooling or tingling sensation from pure Bhimseni camphor is normal.",
      "Avoid applying on open cuts, active abrasions, or broken skin."
    ],
    storageInstructions: "Store in an airtight jar in a cool, dry place. Keep spoon dry when scooping powder.",
    shippingAndDelivery: "Fast dispatch within 24 hours with sealed moisture-barrier packaging.",
    returnsPolicy: "Eligible return, replacement or refund requests should be raised within 7 days of delivery. Opened/used personal-care products are generally non-returnable for hygiene reasons except for damaged, defective or incorrect items.",
    productAttributes: [
      { label: "Item Form", value: "Micro-milled Forest Herbal Lepa Powder" },
      { label: "Net Weight", value: "150 g / 5.3 oz" },
      { label: "Recommended Frequency", value: "2-3 Times per Week" },
      { label: "Country of Origin", value: "India" }
    ],
    variants: [
      {
        id: "var-401",
        name: "150 g (Single Pack)",
        sku: "HV-HBCP-150",
        priceINR: 1499,
        originalPriceINR: 1799,
        stock: 195,
        weight: "190g",
        size: "150 g",
        image: "/images/hakkiveda_baldness_powder.jpg",
        active: true
      },
      {
        id: "var-402",
        name: "300 g (Double Value Jar)",
        sku: "HV-HBCP-300",
        priceINR: 2699,
        originalPriceINR: 3499,
        stock: 110,
        weight: "360g",
        size: "300 g",
        image: "/images/hakkiveda_baldness_powder.jpg",
        active: true
      },
      {
        id: "var-403",
        name: "500 g (Herbal Mud Tub)",
        sku: "HV-HBCP-500",
        priceINR: 3999,
        originalPriceINR: 5499,
        stock: 50,
        weight: "580g",
        size: "500 g",
        image: "/images/hakkiveda_baldness_powder.jpg",
        active: true
      }
    ],
    stock: 195,
    sku: "HV-HBCP-150",
    isBestseller: true,
    isNew: false,
    inStock: true
  },
  {
    id: "prod-5",
    name: "HAKKIVEDA Complete Baldness & Hair Density Care Kit",
    category: "Wellness Combos",
    primaryCategory: "tribal-wellness",
    subtitle: "Herbal Hair Oil + Baldness Care Powder + 42 Herbs Shampoo",
    priceINR: 4999,
    originalPriceINR: 5697,
    rating: 4.98,
    reviewsCount: 2100,
    image: "/images/hakkiveda_oil_couple_herbs.jpg",
    additionalImages: [
      "/images/hakkiveda_108_oil_gold.jpg",
      "/images/hakkiveda_baldness_powder.jpg",
      "/images/hakkiveda_108_herbs_infographic.jpg"
    ],
    description: "The complete 3-step baldness care & hair density regimen. Includes 1x HAKKIVEDA Herbal Hair Oil (200ml), 1x HAKKIVEDA Herbal Baldness Care Powder (150g), and 1x HAKKIVEDA 42 Herbs Shampoo (250ml). Includes free brass head massager tool!",
    benefits: [
      "Save over 20% compared to purchasing items individually",
      "Comprehensive 3-step holistic solution for baldness, severe thinning & root hair fall",
      "Includes complimentary handmade brass Kansa scalp massage wand",
      "Priority express worldwide door delivery"
    ],
    ingredients: [
      "Full 108 Hakki-Pikki Mountain Herbs (Amla, Bhringraj, Gunja, Shikakai, Devadaru, Reetha, Hibiscus, Neem)"
    ],
    volume: "Bundle (200ml Oil + 150g Baldness Powder + 250ml Shampoo)",
    usageRitual: "Step 1: Apply Herbal Hair Oil 3x weekly. Step 2: Apply Baldness Care Powder paste 2x weekly. Step 3: Wash thoroughly with 42 Herbs Shampoo.",
    howToUse: [
      "Morning / Night (3x/Week): Massage scalp with 108 Herbal Hair Oil and use the included Kansa wand for 5 minutes.",
      "Weekend Ritual (2x/Week): Mix Baldness Powder into paste, apply on thinning roots for 20 mins.",
      "Cleansing: Wash gently with 42 Mountain Herbs Shampoo."
    ],
    whoItIsFor: [
      "Individuals looking to care for crown bald spots or receding temples with an intensive holistic hair regimen."
    ],
    safetyPrecautions: [
      "Follow individual product instructions for optimal synergistic benefit."
    ],
    storageInstructions: "Keep in the provided artisanal wooden-style box in a dry, room-temperature room.",
    shippingAndDelivery: "Eligible for Free Priority Express Air Shipping worldwide.",
    returnsPolicy: "Eligible return, replacement or refund requests should be raised within 7 days of delivery for damaged, defective, or incorrect items.",
    productAttributes: [
      { label: "Bundle Contents", value: "200ml 108 Oil + 150g Baldness Lepa + 250ml Shampoo + Free Kansa Wand" },
      { label: "Usage Duration", value: "Complete 90-Day Hair Care Regimen" },
      { label: "Savings", value: "Save over 20% compared to individual items" }
    ],
    variants: [
      {
        id: "var-501",
        name: "Starter 30-Day Regimen",
        sku: "HV-CHDR-START",
        priceINR: 3499,
        originalPriceINR: 3999,
        stock: 100,
        weight: "600g",
        size: "Starter 30-Day Kit",
        image: "/images/hakkiveda_oil_couple_herbs.jpg",
        active: true
      },
      {
        id: "var-502",
        name: "Full 90-Day Care Kit (Best Value)",
        sku: "HV-CHDR-90D",
        priceINR: 4999,
        originalPriceINR: 5697,
        stock: 150,
        weight: "980g",
        size: "90-Day Full Regimen Kit",
        image: "/images/hakkiveda_oil_couple_herbs.jpg",
        active: true
      },
      {
        id: "var-503",
        name: "180-Day Intensive Care Bundle",
        sku: "HV-CHDR-180D",
        priceINR: 8999,
        originalPriceINR: 11394,
        stock: 60,
        weight: "1900g",
        size: "180-Day Intensive Kit",
        image: "/images/hakkiveda_oil_couple_herbs.jpg",
        active: true
      }
    ],
    stock: 150,
    sku: "HV-CHDR-COMBO",
    isBestseller: true,
    isNew: false,
    inStock: true
  },
  {
    id: "prod-6",
    name: "Botanical Bhringraj & Amla Vitalizing Tonic",
    category: "Hair Oils & Elixirs",
    primaryCategory: "hair-care",
    subtitle: "Lightweight Daily Hair Shine & Darkening Spray",
    priceINR: 1199,
    originalPriceINR: 1399,
    rating: 4.82,
    reviewsCount: 230,
    image: "/images/hakkiveda_108_herbs_infographic.jpg",
    additionalImages: [
      "/images/hakkiveda_108_oil_gold.jpg"
    ],
    description: "A light, fragrant hair elixir spray that shields strands from UV damage, prevents split ends, and enhances natural gloss.",
    benefits: [
      "Tames flyaways and reduces split ends instantly",
      "Adds natural silky shine without any greasiness",
      "Heat-protection shield for daily sun and styling exposure"
    ],
    ingredients: [
      "Cold-pressed Bhringraj Juice (Eclipta alba)",
      "Fresh Amla Water (Phyllanthus emblica)",
      "Vetiver Root Hydrosol (Chrysopogon zizanioides)"
    ],
    volume: "100 ml / 3.4 fl oz",
    usageRitual: "Mist lightly over damp or dry hair lengths. Comb through.",
    howToUse: [
      "Shake well before spraying.",
      "Hold the bottle 6 inches away from hair and mist evenly across the lengths.",
      "Comb through with fingers or a wooden comb. Do not rinse."
    ],
    whoItIsFor: [
      "Anyone looking for instant hair gloss, frizz control, and UV protection during the day."
    ],
    safetyPrecautions: [
      "External use only. Avoid spraying directly into eyes."
    ],
    storageInstructions: "Store in a cool and dry spot away from high temperatures.",
    shippingAndDelivery: "Fast dispatch within 24 hours.",
    returnsPolicy: "Eligible return, replacement or refund requests should be raised within 7 days of delivery. Opened/used personal-care products are generally non-returnable for hygiene reasons except for damaged, defective or incorrect items.",
    productAttributes: [
      { label: "Item Form", value: "Weightless Botanical Fine Mist" },
      { label: "Volume", value: "100 ml / 3.4 fl oz" },
      { label: "Hair Type", value: "All Hair Types" }
    ],
    variants: [
      {
        id: "var-601",
        name: "100 ml (Pocket Mist)",
        sku: "HV-BAVT-100",
        priceINR: 1199,
        originalPriceINR: 1399,
        stock: 80,
        weight: "140g",
        size: "100 ml",
        image: "/images/hakkiveda_108_herbs_infographic.jpg",
        active: true
      },
      {
        id: "var-602",
        name: "200 ml (Duo Month Value)",
        sku: "HV-BAVT-200",
        priceINR: 1999,
        originalPriceINR: 2499,
        stock: 95,
        weight: "250g",
        size: "200 ml",
        image: "/images/hakkiveda_108_herbs_infographic.jpg",
        active: true
      }
    ],
    stock: 80,
    sku: "HV-BAVT-100",
    isBestseller: false,
    isNew: true,
    inStock: true
  }
];
var INITIAL_HERO_SLIDES = [
  {
    id: "slide-1",
    tag: "Authentic Hakki-Pikki Secret",
    title: "Ancient Rituals",
    highlightText: "Modern Care",
    subtitle: "Harness the power of 42 rare mountain herbs, formulated by the Hakki-Pikki tribe for extraordinary hair density & scalp vitality.",
    image: "/images/hero_tribal_elders.jpg",
    ctaText: "Shop Tribal Elixir",
    ctaLink: "/tribal-wellness",
    active: true,
    enable3dOverflow: true,
    foregroundCutoutUrl: "/images/woman_long_hair_cutout.svg",
    foregroundCutoutFilename: "woman_long_hair_cutout.svg",
    desktopPosX: 70,
    desktopPosY: 0,
    desktopWidth: 440,
    desktopBottomOverflow: 130,
    mobilePosX: 60,
    mobilePosY: 0,
    mobileWidth: 260,
    mobileBottomOverflow: 65,
    disableMobileOverflow: false
  },
  {
    id: "slide-2",
    tag: "Hand-Crafted in Mysore",
    title: "21-Day Copper",
    highlightText: "Cauldron Brew",
    subtitle: "Slow-cooked over traditional woodfire with wild-harvested herbs from the pristine Western Ghats forest canopy.",
    image: "/images/hakkiveda_oil_couple_herbs.jpg",
    ctaText: "Discover Our Story",
    ctaLink: "#brand-story",
    active: true
  },
  {
    id: "slide-3",
    tag: "AI Hair Consultation",
    title: "Personalized Tribal",
    highlightText: "Hair Analysis",
    subtitle: "Take our 60-second AI Hair Quiz to unlock your tailor-made Ayurvedic scalp routine & herb selection.",
    image: "/images/hakkiveda_108_oil_gold.jpg",
    ctaText: "Start AI Hair Quiz",
    ctaLink: "#ai-quiz",
    active: true
  }
];
var INITIAL_BEFORE_AFTER = [
  {
    id: "ba-1",
    title: "90 Days Crown Density Transformation",
    days: 90,
    concern: "Crown Thinning & Sparse Scalp Patches",
    beforeImage: "/images/before_male_top.jpg",
    afterImage: "/images/after_male_top.jpg",
    testimonial: "My crown was sparse and thinning. After using HAKKIVEDA Tribal Gold Oil 3x a week for 90 days, my crown density and luster improved remarkably!",
    author: "Rajesh K.",
    location: "Delhi, India"
  },
  {
    id: "ba-2",
    title: "60 Days Scalp Patch Density Care",
    days: 60,
    concern: "Crown Thinning Patch & Breakage",
    beforeImage: "/images/before_male_back.jpg",
    afterImage: "/images/after_male_back.jpg",
    testimonial: "The sparse patch at the back of my head needed serious nourishment. By week 8 of applying HAKKIVEDA oil, it looked significantly fuller and healthier!",
    author: "Arjun V.",
    location: "Singapore"
  },
  {
    id: "ba-3",
    title: "120 Days Scalp Parting Care",
    days: 120,
    concern: "Widening Scalp Parting & Sparse Hairline",
    beforeImage: "/images/before_female_parting.jpg",
    afterImage: "/images/after_female_parting.jpg",
    testimonial: "My hair parting gap was widening and showing scalp. The 42-herb infusion brought back thick density and visibly improved the parting coverage.",
    author: "Priya S.",
    location: "Bengaluru, India"
  }
];
var INITIAL_REVIEWS = [
  {
    id: "rev-1",
    productId: "prod-1",
    customerName: "Meera Deshmukh",
    rating: 5,
    title: "True Tribal Magic in a Bottle!",
    comment: "The scent is earthly and deep. After 4 weeks, my scalp feels so calm and my hair roots are visibly stronger. Worth every single rupee!",
    date: "2026-07-15",
    verifiedPurchase: true,
    location: "Bengaluru, India"
  },
  {
    id: "rev-2",
    productId: "prod-1",
    customerName: "David Tan",
    rating: 5,
    title: "Fast Shipping to Singapore & Top Quality",
    comment: "Arrived in Singapore in just 3 days. My wife and I both use HAKKIVEDA oil now. Outstanding density improvements.",
    date: "2026-07-10",
    verifiedPurchase: true,
    location: "Singapore"
  },
  {
    id: "rev-3",
    productId: "prod-2",
    customerName: "Kavitha Pillay",
    rating: 5,
    title: "Gentle on Sensitive Scalp",
    comment: "Most commercial shampoos trigger itching for me. This soapnut formula cleans thoroughly without any harsh chemicals.",
    date: "2026-06-28",
    verifiedPurchase: true,
    location: "Penang, Malaysia"
  }
];
var INITIAL_BLOGS = [
  {
    id: "blog-1",
    title: "Secrets of the Hakki-Pikki Tribe: 42 Forest Herbs Unveiled",
    slug: "hakki-pikki-42-herbs-secrets",
    excerpt: "Explore how nomadic elders of Karnataka preserve ancient botanical knowledge, wildcrafting rare roots and flowers in harmony with forest moon cycles.",
    content: `For generations, the nomadic Hakki-Pikki tribe of Southern India lived in deep communion with the dense forest reserves of the Western Ghats. Their extraordinary hair thickness and youthful longevity have long intrigued modern herbal researchers.

At the core of their formula lies a sacred balance of 42 botanicals, including Gunja seeds, wild Bhringraj, Devadaru tree resin, and Jatamansi roots. Each herb is harvested at dawn during specific planetary alignments when active phytonutrients reach peak potency.

Unlike mass-manufactured beauty products, HAKKIVEDA continues this sacred heritage in Hunsur, Mysore, employing tribal elders to supervise the 21-day copper cauldron brewing process over natural woodfires.`,
    author: "Elder Somanna & Dr. A. V. Shastri (Chief Vaidya)",
    date: "2026-07-01",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800",
    category: "Tribal Lore & History"
  },
  {
    id: "blog-2",
    title: "Why Copper Cauldron Slow-Brewing Matters for Hair Oils",
    slug: "copper-cauldron-slow-brewing-benefits",
    excerpt: "Discover why heating botanical oils in pure copper cauldrons for 21 days enhances bioavailability and scalp absorption.",
    content: `In classical Ayurvedic alchemy (Rasa Shastra), copper is considered a sacred element capable of ionizing botanical extracts. When 42 wild mountain herbs are submerged in cold-pressed sesame and coconut oils inside copper vessels for 21 days:

1. Copper micro-ions fuse with lipid molecules, acting as natural bioavailability boosters.
2. Low, steady woodfire heat prevents thermal destruction of heat-sensitive antioxidants like Vitamin E and polyphenols.
3. Moisture slowly evaporates, leaving an undiluted, golden potion that deeply penetrates all three layers of the hair follicle.`,
    author: "Dr. Archana Rao, Senior Ayurvedic Botanist",
    date: "2026-06-18",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1512290900676-26c2a48f4134?auto=format&fit=crop&q=80&w=800",
    category: "Ayurvedic Science"
  }
];
var INITIAL_COUPONS = [];
var INITIAL_SITE_SETTINGS = {
  announcementText: "Worldwide Express Shipping \u2022 100% Authentic 42 Mountain Herbs Formula",
  announcementActive: true,
  announcementBgColor: "#D4AF37",
  announcementTextColor: "#1C550E",
  announcementMode: "slide",
  announcementPauseDuration: 3,
  announcementTransitionSpeed: "normal",
  announcementDirection: "right_to_left",
  announcementMessages: [
    {
      id: "ann-1",
      text: "Worldwide Express Shipping \u2022 100% Authentic 42 Mountain Herbs Formula",
      link: "",
      enabled: true,
      sortOrder: 1
    },
    {
      id: "ann-2",
      text: "Handcrafted in 21-Day Slow Woodfire Decoction by Hakki-Pikki Tribe",
      link: "#about",
      enabled: true,
      sortOrder: 2
    },
    {
      id: "ann-3",
      text: "Complimentary Express Delivery on Orders Over \u20B9999 / $50",
      link: "#products",
      enabled: true,
      sortOrder: 3
    }
  ],
  logoText: "HAKKIVEDA",
  logoSubtext: "Hakki-Pikki Tribe & Ayurveda",
  logoInitials: "HV",
  headerHvLogo: "/images/hakkiveda_hv_logo.svg",
  logoImageUrl: "/images/hakkiveda_hv_logo.svg",
  companyName: "HAKKIVEDA Herbal Enterprises",
  address: "Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105",
  phone: "+91 76195 36831",
  whatsappNumber: "917619536831",
  email: "support@hakkiveda.com",
  heroCtaText: "Shop Tribal Elixir",
  heroCtaLink: "#products",
  footerAbout: "Blend of Hakki-Pikki Tribe & Ayurveda. Handcrafted in small batches with 42 wild mountain herbs slow-cooked over woodfire in copper cauldrons for 21 days.",
  footerCopyright: "\xA9 2026 HAKKIVEDA Herbal Enterprises. All Rights Reserved. Door No. 574, V.P. Bore, Hunsur, Mysore.",
  seoTitle: "HAKKIVEDA | Authentic Hakki-Pikki Tribal Ayurvedic Hair Care",
  seoDescription: "Discover authentic Hakki-Pikki tribal Ayurvedic hair care from HAKKIVEDA. Shop 108 Herbs Hair Oil, Herbal Shampoo, Baldness Powder and premium natural wellness products with worldwide shipping.",
  seoKeywords: "HAKKIVEDA, Adivasi Hair Oil, 108 Herbs Hair Oil, Hakki Pikki Tribe, Ayurvedic Hair Oil, Herbal Hair Growth, Natural Hair Care, Herbal Shampoo, Hair Fall Solution, Ayurvedic Wellness",
  maintenanceMode: false,
  freeShippingThresholdINR: 1500,
  codEnabled: true,
  razorpayKeyId: "rzp_live_hakkiveda_key",
  expressCourierPartner: "DHL / BlueDart Express",
  shiprocketPickupPincode: "560001",
  // Phase 10D: Admin-Controlled International Shipping Defaults
  internationalShippingEnabled: true,
  internationalDefaultShippingRateINR: void 0,
  internationalCountryShippingRates: {},
  internationalFreeShippingEnabled: false,
  internationalFreeShippingThresholdINR: null,
  quizHeadline: "AI Ayurvedic Scalp & Hair Density Assessment",
  quizSubtitle: "Unlock your personalized 42-herb formulation in 60 seconds."
};
var INITIAL_HEADER_LAYOUT_SETTINGS = {
  showLogo: true,
  showSearch: true,
  showCountrySelector: true,
  showWishlist: true,
  showAccount: true,
  showCart: true,
  showMenu: true,
  hoverStyle: "gold_line",
  headerLayout: "standard"
};
var INITIAL_NAV_LINKS = [
  {
    id: "nav-1",
    label: "Collections",
    url: "#products",
    linkType: "COLLECTION",
    visible: true,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true,
    userVisibility: "EVERYONE",
    allowedCountries: [],
    status: "ACTIVE",
    sortOrder: 1,
    icon: "Leaf",
    badge: "HOT",
    clicks: 342,
    impressions: 1850,
    megaMenu: {
      enabled: true,
      featuredImageUrl: "",
      featuredImageTitle: "",
      featuredImageSubtitle: "",
      featuredImageLink: "",
      columns: [
        {
          id: "col-1",
          title: "By Concern",
          links: [
            { id: "link-1", label: "Hair Fall Control", url: "/hair-care", badge: "HOT", enabled: true },
            { id: "link-2", label: "Scalp Nourishment & Dandruff", url: "/hair-care", enabled: true },
            { id: "link-3", label: "Premature Greying Repair", url: "/hair-care", enabled: true },
            { id: "link-4", label: "Growth Boost Elixir", url: "/products/root-density-follicle-serum", badge: "NEW", enabled: true }
          ]
        },
        {
          id: "col-2",
          title: "Tribe Specialities",
          links: [
            { id: "link-5", label: "42 Mountain Herbs Oil", url: "/products/hakkiveda-108-herbs-hair-oil", badge: "SALE", enabled: true },
            { id: "link-6", label: "Amla & Bhringraj Scalp Pack", url: "/products/baldness-care-powder", enabled: true },
            { id: "link-7", label: "Forest Honey & Neem Cleanser", url: "/products/neem-face-cleanser", enabled: true },
            { id: "link-8", label: "Export Wholesale Packs", url: "/b2b-enquiry", badge: "B2B", enabled: true }
          ]
        }
      ]
    }
  },
  {
    id: "nav-2",
    label: "Tribal Heritage",
    url: "#brand-story",
    linkType: "HOMEPAGE",
    isModal: false,
    visible: true,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true,
    userVisibility: "EVERYONE",
    allowedCountries: [],
    status: "ACTIVE",
    sortOrder: 2,
    icon: "Shield",
    clicks: 128,
    impressions: 1420,
    pageContent: {
      desktopHeroImage: "/images/hero_tribal_elders.jpg",
      desktopHeroFilename: "hero_tribal_elders.jpg",
      mobileHeroImage: "/images/hero_tribal_elders.jpg",
      mobileHeroFilename: "hero_tribal_elders.jpg",
      mainHeading: "Where Ancient Tribal Wisdom Meets Modern Hair Science",
      smallHeading: "The Genesis of HAKKIVEDA",
      richText: {
        paragraphs: [
          "For centuries, the nomadic Hakki-Pikki tribe traversed the dense forest corridors of the Western Ghats in Karnataka, India. Unbounded by modern industrial cosmetics, they relied on a secret repertoire of 42 wild mountain herbs, tree barks, seeds, and flower juices to keep their hair thick, dark, and resilient well into old age.",
          "At HAKKIVEDA, we preserve this authentic living heritage. We work directly with tribal harvesters in Hunsur to sustainably gather rare botanicals at sunrise when nutrient concentration is highest."
        ],
        lists: [
          "42 Wild Herbs: Including Abrus precatorius, Jatamansi, and Bhringraj harvested in untouched forests.",
          "21-Day Woodfire Brew: Slow-cooked in pure copper cauldrons over woodfire for optimal phytonutrient retention.",
          "Tribal Empowerment: Fair-trade compensation directly supporting Hakki-Pikki artisan families in Mysore.",
          "Worldwide Shipping: Exported directly to India, Singapore, Malaysia, Fiji, Mauritius, and Global markets."
        ],
        quotes: [
          "Every drop is small-batch brewed by Hakki-Pikki tribal elders in Mysore using 42 wild herbs."
        ],
        highlightText: "Ancestral Mysore Heritage \u2022 Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka"
      },
      gallery: [
        {
          id: "gal-1",
          url: "/images/hakkiveda_oil_couple_herbs.jpg",
          filename: "hakkiveda_oil_couple_herbs.jpg",
          title: "Tribal Elders & Herb Gathering",
          altText: "Hakki-Pikki tribal elders with wild forest botanicals",
          sortOrder: 1
        },
        {
          id: "gal-2",
          url: "/images/hakkiveda_108_herbs_infographic.jpg",
          filename: "hakkiveda_108_herbs_infographic.jpg",
          title: "42 Wild Mountain Botanicals",
          altText: "Botanical infographic of sacred mountain herbs",
          sortOrder: 2
        },
        {
          id: "gal-3",
          url: "/images/hakkiveda_108_oil_gold.jpg",
          filename: "hakkiveda_108_oil_gold.jpg",
          title: "Traditional Copper Cauldron Extraction",
          altText: "Pure golden herbal hair oil bottle handcrafted in Mysore",
          sortOrder: 3
        }
      ],
      videoMp4Url: "",
      videoYoutubeUrl: "",
      ctaText: "Explore 42-Herb Formulations",
      ctaLink: "#products",
      seoAltText: "Hakki-Pikki Forest Canopy and Tribal Elders in Mysore",
      seoImageTitle: "Ancestral Hakki-Pikki Herbal Hair Oil Brewing Tradition"
    }
  },
  {
    id: "nav-3",
    label: "AI Hair Quiz",
    url: "#ai-quiz",
    linkType: "QUIZ",
    isModal: true,
    modalType: "QUIZ",
    visible: true,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true,
    userVisibility: "EVERYONE",
    allowedCountries: [],
    status: "ACTIVE",
    sortOrder: 3,
    icon: "Sparkles",
    badge: "NEW",
    clicks: 520,
    impressions: 2100
  },
  {
    id: "nav-4",
    label: "Results & Proof",
    url: "#before-after",
    linkType: "HOMEPAGE",
    visible: true,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true,
    userVisibility: "EVERYONE",
    allowedCountries: [],
    status: "ACTIVE",
    sortOrder: 4,
    icon: "Flame",
    clicks: 215,
    impressions: 1600
  },
  {
    id: "nav-5",
    label: "B2B / Export",
    url: "#b2b",
    linkType: "B2B",
    isModal: false,
    modalType: "B2B",
    visible: true,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true,
    userVisibility: "EVERYONE",
    allowedCountries: [],
    status: "ACTIVE",
    sortOrder: 5,
    icon: "Briefcase",
    badge: "B2B",
    clicks: 88,
    impressions: 980
  },
  {
    id: "nav-6",
    label: "Journal & Guides",
    url: "#blogs",
    linkType: "JOURNAL",
    visible: true,
    showOnDesktop: true,
    showOnTablet: true,
    showOnMobile: true,
    userVisibility: "EVERYONE",
    allowedCountries: [],
    status: "ACTIVE",
    sortOrder: 6,
    icon: "MessageSquare",
    clicks: 94,
    impressions: 1120
  }
];
var INITIAL_TESTIMONIAL_VIDEOS = [
  {
    id: "vid-1",
    customerName: "HAKKIVEDA Rituals",
    location: "Pakshirajapura, Karnataka",
    rating: 5,
    title: "Traditional 21-Day Woodfire Decoction Method",
    category: "Preparation",
    duration: "1:45",
    videoUrl: "https://youtu.be/1jzF9v5PEBY?si=AWftq4EOQ5cOXjt4",
    thumbnail: "https://img.youtube.com/vi/1jzF9v5PEBY/hqdefault.jpg",
    reviewText: "Watch how 108 wildcrafted herbs are simmered in copper cauldrons over woodfire."
  },
  {
    id: "vid-2",
    customerName: "Application Masterclass",
    location: "Hakki-Pikki Heritage",
    rating: 5,
    title: "Warm Scalp Massage & Night Ritual Guide",
    category: "Application",
    duration: "0:58",
    videoUrl: "https://youtube.com/shorts/XV-Y5vXaKqU?si=FTdChnp0Ei3dnLlS",
    thumbnail: "https://img.youtube.com/vi/XV-Y5vXaKqU/hqdefault.jpg",
    reviewText: "Step-by-step tribal technique for deep root penetration and follicle activation."
  },
  {
    id: "vid-3",
    customerName: "Herbal Potency",
    location: "Western Ghats",
    rating: 5,
    title: "Pure Forest Herbs & Botanical Sourcing",
    category: "Herbal Ritual",
    duration: "0:45",
    videoUrl: "https://youtube.com/shorts/5Q9IpbVpgZM?si=5MBNXibq_8n0mLZB",
    thumbnail: "https://img.youtube.com/vi/5Q9IpbVpgZM/hqdefault.jpg",
    reviewText: "Ethically foraged Bhringraj, Brahmi, and rare root botanicals in their purest state."
  },
  {
    id: "vid-4",
    customerName: "Product Education",
    location: "HAKKIVEDA Lab",
    rating: 5,
    title: "Choosing the Right Oil Formulation for Your Dosha",
    category: "Product Guide",
    duration: "1:15",
    videoUrl: "https://youtu.be/1jzF9v5PEBY?si=AWftq4EOQ5cOXjt4",
    thumbnail: "https://img.youtube.com/vi/1jzF9v5PEBY/hqdefault.jpg",
    reviewText: "Understand the difference between 108 Herb Gold and Root Revival Elixir."
  }
];
var INITIAL_QUIZ_QUESTIONS = [
  {
    id: "qq-1",
    question: "What is your primary hair & scalp concern?",
    options: [
      { text: "Severe Hair Fall & Thinning Roots", dosha: "VATA" },
      { text: "Flaky Dandruff & Scalp Itchiness", dosha: "PITTA" },
      { text: "Oily Roots & Slow Growth Rate", dosha: "KAPHA" },
      { text: "Premature Graying & Dry Texture", dosha: "TRIDOSHA" }
    ]
  },
  {
    id: "qq-2",
    question: "How often do you wash your scalp each week?",
    options: [
      { text: "Daily or every 2 days", dosha: "PITTA" },
      { text: "2 to 3 times a week", dosha: "VATA" },
      { text: "Once a week or less", dosha: "KAPHA" }
    ]
  }
];
var INITIAL_MEDIA_ITEMS = [
  {
    id: "med-1",
    title: "Hakkiveda 108 Herbal Hair Oil (Gold)",
    type: "IMAGE",
    url: "/images/hakkiveda_108_oil_gold.jpg",
    uploadedAt: "2026-07-27"
  },
  {
    id: "med-2",
    title: "Hakkiveda 108 Oil Yellow Cap Bottle",
    type: "IMAGE",
    url: "/images/hakkiveda_108_oil_yellow_cap.jpg",
    uploadedAt: "2026-07-27"
  },
  {
    id: "med-3",
    title: "Hakkiveda 108 Oil Back Label",
    type: "IMAGE",
    url: "/images/hakkiveda_108_oil_back_label.jpg",
    uploadedAt: "2026-07-27"
  },
  {
    id: "med-4",
    title: "Hakkiveda Adivasi Baldness Powder",
    type: "IMAGE",
    url: "/images/hakkiveda_baldness_powder.jpg",
    uploadedAt: "2026-07-27"
  },
  {
    id: "med-5",
    title: "Hakkiveda Baldness Powder Ingredients",
    type: "IMAGE",
    url: "/images/hakkiveda_baldness_powder_ingredients.jpg",
    uploadedAt: "2026-07-27"
  },
  {
    id: "med-6",
    title: "Hakkiveda Tribal Couple Photo",
    type: "IMAGE",
    url: "/images/hakkiveda_oil_couple_herbs.jpg",
    uploadedAt: "2026-07-27"
  },
  {
    id: "med-7",
    title: "108 Herbs Infographic",
    type: "IMAGE",
    url: "/images/hakkiveda_108_herbs_infographic.jpg",
    uploadedAt: "2026-07-27"
  }
];
var INITIAL_COUNTRIES = WORLD_COUNTRIES.map((c) => {
  const isIndia = c.code === "IN";
  return {
    code: c.code,
    name: c.name,
    flag: c.flag,
    currencyCode: c.currencyCode,
    enabled: true,
    region: c.region || getRegionForCountry(c.code),
    marketId: c.marketId || getMarketForCountry(c.code),
    shippingRule: isIndia ? "COD_AND_PREPAID" : "PREPAID_ONLY",
    paymentRule: isIndia ? "COD_AND_PREPAID" : "PREPAID_ONLY"
  };
});
var INITIAL_CUSTOMER_ACCOUNTS = [
  {
    id: "usr-cust-1",
    name: "Rajesh Sharma",
    email: "rajesh.sharma@gmail.com",
    phone: "+91 98450 12345",
    avatar: "",
    isAdmin: false,
    status: "ACTIVE",
    createdAt: "2026-02-14",
    lastLogin: "2026-07-27 10:45 IST",
    loyaltyPoints: 450,
    referralCode: "HAKKI-RAJESH-89",
    addresses: [
      {
        id: "addr-1",
        title: "Home",
        name: "Rajesh Sharma",
        phone: "+91 98450 12345",
        line1: "108 Sacred Banyan Enclave, Jayalakshmipuram",
        city: "Mysore",
        state: "Karnataka",
        country: "India",
        pincode: "570012",
        isDefault: true
      },
      {
        id: "addr-2",
        title: "Office",
        name: "Rajesh Sharma (Tech Lead)",
        phone: "+91 98450 12345",
        line1: "Suite 402, Embassy TechVillage, Outer Ring Rd",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560103",
        isDefault: false
      }
    ],
    savedPayments: [
      {
        id: "pay-1",
        provider: "RAZORPAY",
        title: "Razorpay UPI",
        details: "rajesh.sharma@okicici",
        isDefault: true
      },
      {
        id: "pay-2",
        provider: "STRIPE",
        title: "HDFC Bank Visa Card",
        details: "\u2022\u2022\u2022\u2022 4242",
        isDefault: false
      }
    ],
    loginHistory: [
      {
        id: "log-1",
        timestamp: "2026-07-27 10:45:12 IST",
        ipLocation: "Mysore, Karnataka, India (IPv4)",
        device: "Chrome on macOS (MacBook Pro)"
      },
      {
        id: "log-2",
        timestamp: "2026-07-24 18:30:00 IST",
        ipLocation: "Bengaluru, Karnataka, India",
        device: "Safari on iPhone 15 Pro"
      }
    ],
    preferences: {
      country: "India",
      currency: "INR",
      language: "English",
      emailOrders: true,
      whatsappUpdates: true,
      promotional: true
    }
  },
  {
    id: "usr-cust-2",
    name: "Priya Nair",
    email: "priya.nair@singapore.com",
    phone: "+65 8123 4567",
    avatar: "",
    isAdmin: false,
    status: "ACTIVE",
    createdAt: "2026-03-22",
    lastLogin: "2026-07-26 15:20 SGT",
    loyaltyPoints: 820,
    referralCode: "HAKKI-PRIYA-22",
    addresses: [
      {
        id: "addr-3",
        title: "Home",
        name: "Priya Nair",
        phone: "+65 8123 4567",
        line1: "12 Marina Boulevard, Tower 2 #18-04",
        city: "Singapore",
        state: "Central Region",
        country: "Singapore",
        pincode: "018982",
        isDefault: true
      }
    ],
    savedPayments: [
      {
        id: "pay-3",
        provider: "STRIPE",
        title: "DBS Altitude Visa",
        details: "\u2022\u2022\u2022\u2022 8888",
        isDefault: true
      },
      {
        id: "pay-4",
        provider: "PAYPAL",
        title: "PayPal Account",
        details: "priya.nair@singapore.com",
        isDefault: false
      }
    ],
    loginHistory: [
      {
        id: "log-3",
        timestamp: "2026-07-26 15:20:00 SGT",
        ipLocation: "Marina Bay, Singapore",
        device: "Chrome on Mac M2"
      }
    ],
    preferences: {
      country: "Singapore",
      currency: "SGD",
      language: "English",
      emailOrders: true,
      whatsappUpdates: true,
      promotional: false
    }
  },
  {
    id: "usr-cust-3",
    name: "Ananya Gupta",
    email: "ananya.g@gmail.com",
    phone: "+91 99001 55432",
    avatar: "",
    isAdmin: false,
    status: "ACTIVE",
    createdAt: "2026-05-10",
    lastLogin: "2026-07-20 20:10 IST",
    loyaltyPoints: 150,
    referralCode: "HAKKI-ANANYA-55",
    addresses: [
      {
        id: "addr-4",
        title: "Home",
        name: "Ananya Gupta",
        phone: "+91 99001 55432",
        line1: "B-402 Palm Beach Heights, Worli",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400018",
        isDefault: true
      }
    ],
    savedPayments: [
      {
        id: "pay-5",
        provider: "COD",
        title: "Cash on Delivery (Domestic)",
        details: "Pay on Handshake Delivery",
        isDefault: true
      }
    ],
    loginHistory: [
      {
        id: "log-4",
        timestamp: "2026-07-20 20:10:00 IST",
        ipLocation: "Mumbai, Maharashtra, India",
        device: "Firefox on Windows 11"
      }
    ],
    preferences: {
      country: "India",
      currency: "INR",
      language: "English",
      emailOrders: true,
      whatsappUpdates: false,
      promotional: true
    }
  }
];
var INITIAL_ORDERS = [];
var INITIAL_PAYMENT_GATEWAYS = [
  {
    id: "RAZORPAY",
    name: "Razorpay Payment Gateway",
    enabled: true,
    mode: "LIVE",
    liveApiKey: "rzp_live_HAKKIVEDA_882910",
    liveSecretKey: "sec_live_9921839102834",
    testApiKey: "rzp_test_HAKKIVEDA_DEMO",
    testSecretKey: "sec_test_1102938102938",
    webhookStatus: "SYNCED",
    webhookUrl: "https://hakkiveda.com/api/webhooks/razorpay",
    lastTestedAt: "2026-07-28 09:30 AM",
    connectionStatus: "CONNECTED",
    supportedCurrencies: ["INR", "USD", "AED", "SGD", "MYR", "EUR", "GBP"],
    sortOrder: 1,
    description: "UPI, Credit/Debit Cards, NetBanking, Wallets & International Cards",
    badgeText: "RECOMMENDED FOR INDIA"
  },
  {
    id: "STRIPE",
    name: "Stripe Global Checkout",
    enabled: true,
    mode: "LIVE",
    liveApiKey: "pk_live_51P_HAKKIVEDA_GLOBAL_99120",
    liveSecretKey: "sk_live_51P_SECRET_KEY_881923",
    testApiKey: "pk_test_51P_DEMO_KEY_10293",
    testSecretKey: "sk_test_51P_DEMO_SECRET_00912",
    webhookStatus: "ACTIVE",
    webhookUrl: "https://hakkiveda.com/api/webhooks/stripe",
    lastTestedAt: "2026-07-28 09:15 AM",
    connectionStatus: "CONNECTED",
    supportedCurrencies: ["USD", "SGD", "MYR", "MUR", "FJD", "AED", "SAR", "NPR", "EUR", "GBP"],
    sortOrder: 2,
    description: "International Cards, Apple Pay, Google Pay & Klarna",
    badgeText: "GLOBAL DEFAULT"
  },
  {
    id: "PAYPAL",
    name: "PayPal Express Checkout",
    enabled: true,
    mode: "LIVE",
    liveApiKey: "client_id_live_paypal_hakki_881",
    liveSecretKey: "secret_live_paypal_hakki_991",
    testApiKey: "client_id_test_paypal_demo",
    testSecretKey: "secret_test_paypal_demo",
    webhookStatus: "ACTIVE",
    webhookUrl: "https://hakkiveda.com/api/webhooks/paypal",
    lastTestedAt: "2026-07-28 08:45 AM",
    connectionStatus: "CONNECTED",
    supportedCurrencies: ["USD", "SGD", "MYR", "EUR", "GBP", "AUD", "CAD"],
    sortOrder: 3,
    description: "PayPal Wallet & Pay in 4 installment payments worldwide",
    badgeText: "GLOBAL WALLET"
  },
  {
    id: "PHONEPE",
    name: "PhonePe Direct Gateway",
    enabled: true,
    mode: "LIVE",
    liveApiKey: "PG_MERCHANT_HAKKIVEDA_LIVE",
    liveSecretKey: "SALT_KEY_INDEX_1_LIVE_SECRET",
    testApiKey: "PG_MERCHANT_TEST_DEMO",
    testSecretKey: "SALT_KEY_INDEX_1_TEST_SECRET",
    webhookStatus: "SYNCED",
    webhookUrl: "https://hakkiveda.com/api/webhooks/phonepe",
    lastTestedAt: "2026-07-28 09:00 AM",
    connectionStatus: "CONNECTED",
    supportedCurrencies: ["INR"],
    sortOrder: 4,
    description: "Direct PhonePe app payments & QR code checkout for India",
    badgeText: "INDIA FAVORITE"
  },
  {
    id: "UPI",
    name: "UPI Instant QR & Apps",
    enabled: true,
    mode: "LIVE",
    liveApiKey: "hakkiveda@ybl",
    liveSecretKey: "vpa_merchant_secret_key_2026",
    testApiKey: "demo@upi",
    testSecretKey: "demo_upi_secret_key",
    webhookStatus: "ACTIVE",
    webhookUrl: "https://hakkiveda.com/api/webhooks/upi",
    lastTestedAt: "2026-07-28 09:10 AM",
    connectionStatus: "CONNECTED",
    supportedCurrencies: ["INR"],
    sortOrder: 5,
    description: "Google Pay, PhonePe, Paytm, BHIM & Cred UPI payments",
    badgeText: "INSTANT ZERO FEE"
  },
  {
    id: "COD",
    name: "Cash On Delivery (COD)",
    enabled: true,
    mode: "LIVE",
    liveApiKey: "N/A",
    liveSecretKey: "N/A",
    testApiKey: "N/A",
    testSecretKey: "N/A",
    webhookStatus: "ACTIVE",
    webhookUrl: "N/A",
    lastTestedAt: "2026-07-28 10:00 AM",
    connectionStatus: "CONNECTED",
    supportedCurrencies: ["INR"],
    sortOrder: 6,
    description: "Doorstep cash collection upon package delivery in India",
    badgeText: "DOMESTIC ONLY"
  }
];
var INITIAL_COD_RULES = {
  enabled: true,
  indiaOnly: true,
  minOrderINR: 499,
  maxOrderINR: 15e3,
  codFeeINR: 50
};
var INITIAL_MARKET_GATEWAYS = [
  {
    marketId: "mkt-in",
    countryCode: "IN",
    marketName: "India Market",
    currencyCode: "INR",
    gateways: ["RAZORPAY", "UPI", "PHONEPE", "COD"]
  },
  {
    marketId: "mkt-sg",
    countryCode: "SG",
    marketName: "Singapore Market",
    currencyCode: "SGD",
    gateways: ["STRIPE", "PAYPAL"]
  },
  {
    marketId: "mkt-my",
    countryCode: "MY",
    marketName: "Malaysia Market",
    currencyCode: "MYR",
    gateways: ["STRIPE", "PAYPAL"]
  },
  {
    marketId: "mkt-mu",
    countryCode: "MU",
    marketName: "Mauritius Market",
    currencyCode: "MUR",
    gateways: ["STRIPE", "PAYPAL"]
  },
  {
    marketId: "mkt-fj",
    countryCode: "FJ",
    marketName: "Fiji Market",
    currencyCode: "FJD",
    gateways: ["STRIPE", "PAYPAL"]
  },
  {
    marketId: "mkt-ae",
    countryCode: "AE",
    marketName: "UAE Market",
    currencyCode: "AED",
    gateways: ["STRIPE", "PAYPAL"]
  },
  {
    marketId: "mkt-sa",
    countryCode: "SA",
    marketName: "Saudi Arabia Market",
    currencyCode: "SAR",
    gateways: ["STRIPE", "PAYPAL"]
  },
  {
    marketId: "mkt-np",
    countryCode: "NP",
    marketName: "Nepal Market",
    currencyCode: "NPR",
    gateways: ["STRIPE", "PAYPAL"]
  },
  {
    marketId: "mkt-int",
    countryCode: "INT",
    marketName: "International Market (Rest of World)",
    currencyCode: "USD",
    gateways: ["STRIPE", "PAYPAL"]
  }
];
var INITIAL_PAYMENT_LOGS = [];
var INITIAL_BRAND_IDENTITY = {
  // 1. Logo Management
  headerHvLogo: "/images/hakkiveda_hv_logo.svg",
  headerHvLogoFilename: "hakkiveda_hv_logo.svg",
  mainLogoLight: "/images/hakkiveda_hv_logo.svg",
  mainLogoDark: "",
  mobileLogo: "/images/hakkiveda_hv_logo.svg",
  footerLogo: "",
  adminLogo: "/images/hakkiveda_hv_logo.svg",
  emailLogo: "",
  favicon: "/images/hakkiveda_hv_logo.svg",
  appleTouchIcon: "/images/hakkiveda_hv_logo.png",
  svgLogo: "/images/hakkiveda_hv_logo.svg",
  transparentLogo: "",
  // 2. Brand Identity
  brandName: "HAKKIVEDA",
  brandSubtitle: "Ancestral Hakki-Pikki Herbal Secret",
  brandInitials: "HV",
  brandDescription: "Authentic 42-herb tribal hair care formulations brewed with traditional Mysore forest wisdom and zero synthetic additives.",
  companyMotto: "Pure Botanical Science \u2022 Zero Synthetic Harm",
  // 3. Brand Colours
  primaryColor: "#0A4F1F",
  secondaryGold: "#D4AF37",
  backgroundColor: "#F8F5EE",
  textColor: "#1F2A1F",
  accentColor: "#176B3A",
  buttonColor: "#0A5A2A",
  hoverColor: "#083F1E",
  borderColor: "#D8CDAF",
  // 4. Typography
  headingFont: "Cinzel, Playfair Display, serif",
  bodyFont: "Plus Jakarta Sans, sans-serif",
  buttonFont: "Plus Jakarta Sans, sans-serif",
  fontSize: "md",
  fontWeight: "bold",
  // 5. Theme Manager
  themeMode: "dark",
  // 6. Brand Animation
  enableLoadingAnimation: true,
  animationType: "gold_glow",
  animationDuration: 1.5,
  introSoundEnabled: true,
  // 7. Social Branding
  socialFacebook: "https://facebook.com/hakkiveda",
  socialInstagram: "https://instagram.com/hakkiveda",
  socialYoutube: "https://youtube.com/@hakkiveda",
  socialWhatsapp: "https://wa.me/917619536831",
  socialLinkedin: "https://linkedin.com/company/hakkiveda",
  socialTwitter: "https://x.com/hakkiveda",
  // 8. Browser & PWA Branding
  browserTitle: "HAKKIVEDA | Authentic Hakki-Pikki Tribal Ayurvedic Hair Care",
  themeColor: "#0E3B2E",
  pwaIcon192: "",
  pwaIcon512: "",
  // 9. Email Branding
  emailHeaderLogo: "",
  emailFooterLogo: "",
  emailAccentColor: "#D4AF37",
  emailSignature: "HAKKIVEDA Botanical Care Team\nHunsur, Mysore, Karnataka 571105",
  // 10. Brand Assets
  brandGuidelinesPdf: "",
  brandGuidelinesFilename: "",
  watermarkLogo: "",
  whiteLogo: "",
  blackLogo: ""
};
var INITIAL_FOOTER_CONFIG = {
  showBrandColumn: true,
  brandLogo: "",
  brandLogoText: "HAKKIVEDA",
  brandDescription: "Blend of Hakki-Pikki Tribe & Ayurveda. Handcrafted in small batches with 42 wild mountain herbs slow-cooked over woodfire in copper cauldrons for 21 days.",
  address: "Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India - 571105",
  phone: "+91 76195 36831",
  whatsappNumber: "917619536831",
  email: "support@hakkiveda.com",
  columns: [
    {
      id: "botanical_catalog",
      title: "Botanical Catalog",
      enabled: true,
      links: [
        { id: "1", label: "Hair Care Rituals", url: "/hair-care" },
        { id: "2", label: "Skin Care & Lepas", url: "/skin-care" },
        { id: "3", label: "Tribal Wellness Kits", url: "/tribal-wellness" },
        { id: "4", label: "Video Rituals", url: "/video-rituals" },
        { id: "5", label: "AI Hair Quiz", url: "quiz", isBadge: true, badgeText: "AI Powered" }
      ]
    },
    {
      id: "customer_care",
      title: "Legal & Customer Care",
      enabled: true,
      links: [
        { id: "c1", label: "Privacy Policy", url: "/privacy-policy" },
        { id: "c2", label: "Terms & Conditions", url: "/terms-and-conditions" },
        { id: "c3", label: "Shipping & Delivery", url: "/shipping-policy" },
        { id: "c4", label: "Return & Refund Policy", url: "/refund-policy" },
        { id: "c5", label: "Cancellation Policy", url: "/cancellation-policy" },
        { id: "c6", label: "Product Disclaimer", url: "/disclaimer" },
        { id: "c7", label: "Contact Us & Grievance", url: "/contact" }
      ]
    }
  ],
  showShippingColumn: true,
  shippingTitle: "WORLDWIDE SHIPPING",
  shippingItems: [
    { id: "s1", text: "Ships Worldwide (200+ Countries)" },
    { id: "s2", text: "Express Air Courier Dispatch" },
    { id: "s3", text: "Tamper-Proof Glass Packaging" },
    { id: "s4", text: "Digital AWB & Live Tracking" },
    { id: "s5", text: "Estimated 3\u201312 Business Days*" },
    { id: "s6", text: "Recipient Customs & Duty Terms" }
  ],
  shippingPolicyButtonText: "View Shipping Policy",
  shippingPolicyModalContent: "Shipping Policy:\n\u2022 Orders dispatched within 24-48 business hours.\n\u2022 Tracked shipping via DHL/FedEx/SpeedPost/Delhivery.\n\u2022 Free Express Shipping on eligible orders.",
  wholesaleLinkText: "Wholesale & Export Enquiries \u2192",
  showNewsletterColumn: true,
  newsletterHeading: "Tribal Secrets Newsletter",
  newsletterSubtext: "Subscribe to receive ancestral scalp care tips, lunar harvesting calendars, and 10% off your first order.",
  newsletterPlaceholder: "Enter email address",
  newsletterButtonText: "Subscribe",
  newsletterSuccessMessage: "\u2713 Welcome! Check your inbox for code WELCOME10.",
  showSocialLinks: true,
  socialLinks: [
    { id: "soc1", platform: "instagram", url: "https://instagram.com/hakkiveda", enabled: true },
    { id: "soc2", platform: "facebook", url: "https://facebook.com/hakkiveda", enabled: true },
    { id: "soc3", platform: "youtube", url: "https://youtube.com/@hakkiveda", enabled: true },
    { id: "soc4", platform: "whatsapp", url: "https://wa.me/917619536831", enabled: true }
  ],
  showPaymentBadges: true,
  paymentBadgesTitle: "SECURE PAYMENT & WORLDWIDE CHECKOUT",
  paymentMethods: {
    upi: true,
    visa: true,
    mastercard: true,
    rupay: true,
    netbanking: true,
    cod: true,
    paypal: true
  },
  copyrightText: "\xA9 2026 HAKKIVEDA Herbal Enterprises. All Rights Reserved. Door No. 574, V.P. Bore, Hunsur, Mysore.",
  showSoundToggle: true,
  showBottomLinks: true,
  bottomLinks: [
    { id: "b1", label: "Privacy Policy", url: "/privacy-policy" },
    { id: "b2", label: "Terms & Conditions", url: "/terms-and-conditions" },
    { id: "b3", label: "Shipping Policy", url: "/shipping-policy" },
    { id: "b4", label: "Return & Refund", url: "/refund-policy" },
    { id: "b5", label: "Disclaimer", url: "/disclaimer" },
    { id: "b6", label: "Contact Support", url: "/contact" }
  ],
  mobileFooter: {
    enabled: true,
    showWarningSection: true,
    warningHeading: "BEWARE OF COUNTERFEIT PRODUCTS",
    warningLines: [
      "Beware of scammers and duplicate Adivasi hair oils.",
      "Authentic HAKKIVEDA products carry our official branding.",
      "Our formulations are rooted in Hakki-Pikki tribal knowledge from Mysuru.",
      "Always check the HAKKIVEDA name and product label before purchasing.",
      "Avoid sellers using copied images or misleading tribal claims.",
      "Never share OTPs, banking passwords or card PINs with anyone.",
      "HAKKIVEDA will never ask for confidential banking credentials.",
      "Purchase only through our official website or authorised sellers.",
      "Check product packaging, batch information and authenticity details.",
      "Report suspicious sellers or fake HAKKIVEDA products to our support team.",
      "Protect your purchase. Choose authentic HAKKIVEDA.",
      "Traditional wisdom deserves genuine products."
    ],
    copyrightText: "\xA9 2026 HAKKIVEDA",
    sloganText: "Blend of Hakki-Pikki Tribe & Ayurveda",
    scrollToTopEnabled: true
  }
};
var INITIAL_B2B_SECTION_CONFIG = {
  enabled: true,
  bannerImage: "https://images.unsplash.com/photo-1608248597289-53e30f146a7d?auto=format&fit=crop&w=1200&q=80",
  backgroundImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
  badgeText: "GLOBAL PARTNERSHIPS",
  heading: "PARTNER WITH HAKKIVEDA",
  subheading: "Wholesale, Distribution & Export",
  description: "Bring authentic HAKKIVEDA herbal rituals to your market. We welcome wholesale, distribution and international partnership enquiries.",
  ctaText: "BECOME A PARTNER",
  ctaUrl: "/b2b-enquiry",
  features: [
    {
      id: "feat-1",
      icon: "Package",
      title: "Custom OEM / Bulk Drums",
      description: "High-capacity drums (25L - 200L) available for custom formulation & white-label packaging.",
      sortOrder: 1
    },
    {
      id: "feat-2",
      icon: "FileCheck",
      title: "Customs & Phytosanitary Documents",
      description: "Full export compliance documentation, Certificate of Analysis (COA), MSDS, and phytosanitary clearance.",
      sortOrder: 2
    },
    {
      id: "feat-3",
      icon: "Tag",
      title: "Tiered Wholesale Pricing",
      description: "Direct factory-gate pricing with progressive volume discount tiers for bulk buyers and distributors.",
      sortOrder: 3
    },
    {
      id: "feat-4",
      icon: "Truck",
      title: "Worldwide Express Shipping",
      description: "Air and sea freight door-to-door delivery with duty clearance support and expedited dispatch.",
      sortOrder: 4
    },
    {
      id: "feat-5",
      icon: "ShieldCheck",
      title: "Secure Export Packaging",
      description: "Leak-proof, spill-resistant international export packaging engineered for extreme climates.",
      sortOrder: 5
    },
    {
      id: "feat-6",
      icon: "Headphones",
      title: "Dedicated Account Manager",
      description: "Assigned export director for quick turnaround, custom formulation consultations, and order tracking.",
      sortOrder: 6
    }
  ],
  selectedProductIds: ["prod-1", "prod-2", "prod-3"],
  showcaseTitle: "Featured Wholesale & Export Packs",
  showcaseSubtitle: "Ready for global bulk shipment, spa supply, and white-label distribution",
  supportedCountries: [
    "India",
    "Singapore",
    "Malaysia",
    "Fiji",
    "Mauritius",
    "UAE",
    "USA",
    "United Kingdom",
    "Germany",
    "Australia",
    "Canada",
    "Japan"
  ],
  theme: {
    backgroundColor: "#0d1a10",
    overlayColor: "#000000",
    overlayOpacity: 35,
    textColor: "#f8fafc",
    buttonColor: "#d4af37"
  }
};
var INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG = {
  enabled: true,
  desktopBanner: "/images/hakkiveda_108_oil_gold.jpg",
  mobileBanner: "/images/hakkiveda_108_oil_gold.jpg",
  heading: "Find the Right HAKKIVEDA Hair Ritual",
  subheading: "PERSONALIZED HAIR ANALYSIS",
  description: "Answer a few quick questions about your hair type, scalp condition and concerns to receive personalized HAKKIVEDA product recommendations.",
  ctaText: "START AI HAIR QUIZ",
  ctaAction: "OPEN_QUIZ",
  imageFit: "contain",
  desktopFocalPoint: "center",
  mobileFocalPoint: "center",
  imageAlignment: "center",
  buttonPosition: "bottom-left"
};
var INITIAL_VIDEO_POPUP_CONFIG = {
  enabled: true,
  frequency: "EVERY_3_DAYS",
  delaySeconds: 2.5,
  videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-serum-or-oil-41223-large.mp4",
  posterUrl: "/images/hakkiveda_108_oil_gold.jpg",
  heading: "Special Tribal Herbal Offer!",
  description: "Experience 100% Authentic Adivasi 108 Mountain Herbs Oil. Hand-crafted in Mysore using 400-year-old Hakki-Pikki tribal rituals.",
  ctaText: "Shop Hair Oil - 20% Off",
  ctaDestination: "#products",
  linkedProductId: "prod-1",
  startDate: "",
  endDate: "",
  enableDesktop: true,
  enableMobile: true
};
var INITIAL_SHOPPABLE_REELS = [
  {
    id: "reel-1",
    title: "60 Days Hair Regrowth Journey",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-massaging-her-head-and-hair-41224-large.mp4",
    posterUrl: "/images/after_female_parting.jpg",
    customerName: "Priya Sharma",
    country: "India",
    caption: "My hair fall completely stopped after 3 weeks of applying HAKKIVEDA 108 Herbal Oil! The density at my parting has doubled. \u{1F33F}\u2728",
    verifiedBadge: true,
    linkedProductId: "prod-1",
    showViewProductButton: true,
    showAddToCartButton: true,
    showBuyNowButton: true,
    showWhatsappButton: true,
    active: true,
    sortOrder: 1
  },
  {
    id: "reel-2",
    title: "Reversing Male Pattern Baldness",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-combing-his-hair-41222-large.mp4",
    posterUrl: "/images/after_male_top.jpg",
    customerName: "Rajesh Kumar",
    country: "Dubai, UAE",
    caption: "Using the Baldness Care Powder paste with 108 Herbal Oil on my crown patch. Fresh baby hair sprouts visible within 45 days!",
    verifiedBadge: true,
    linkedProductId: "prod-4",
    showViewProductButton: true,
    showAddToCartButton: true,
    showBuyNowButton: true,
    showWhatsappButton: true,
    active: true,
    sortOrder: 2
  },
  {
    id: "reel-3",
    title: "42 Mountain Herbs Scalp Detox",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-washing-her-hair-in-a-salon-41225-large.mp4",
    posterUrl: "/images/hakkiveda_108_oil_yellow_cap.jpg",
    customerName: "Ananya Deshmukh",
    country: "London, UK",
    caption: "The 42 Mountain Herbs Clarifying Shampoo cleanses hard water buildup without stripping natural scalp moisture. Pure botanical bliss!",
    verifiedBadge: true,
    linkedProductId: "prod-2",
    showViewProductButton: true,
    showAddToCartButton: true,
    showBuyNowButton: true,
    showWhatsappButton: true,
    active: true,
    sortOrder: 3
  },
  {
    id: "reel-4",
    title: "Ultimate 3-Step Baldness Combo",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-oil-to-her-hair-41226-large.mp4",
    posterUrl: "/images/hakkiveda_baldness_powder.jpg",
    customerName: "Vikramaditya S.",
    country: "Singapore",
    caption: "As a botanical wellness consultant, I admire this authentic Hakki-Pikki tribal formulation. The 3-Step ritual is a favorite comprehensive hair care routine.",
    verifiedBadge: true,
    linkedProductId: "prod-5",
    showViewProductButton: true,
    showAddToCartButton: true,
    showBuyNowButton: true,
    showWhatsappButton: true,
    active: true,
    sortOrder: 4
  }
];
var INITIAL_CATEGORY_PAGES = [
  {
    id: "hair-care",
    slug: "hair-care",
    categoryName: "Hair Care",
    enabled: true,
    title: "Hair Care Formulations",
    shortDescription: "Authentic Adivasi herbal hair oils, density drops, and root nourishing serums.",
    cardImage: "/images/hakkiveda_108_oil_gold.jpg",
    cardCtaText: "Shop Hair Care",
    desktopHeroImage: "/images/hakkiveda_108_oil_gold.jpg",
    mobileHeroImage: "/images/hakkiveda_108_oil_gold.jpg",
    heroVideo: "",
    heroFocalPoint: "center",
    heroObjectFit: "contain",
    heroHeightDesktop: "auto",
    heroHeightMobile: "auto",
    heroOverlayOpacity: 0,
    heroTextColor: "#FFFFFF",
    ctaText: "Explore Hair Care",
    ctaLink: "#products",
    displayOrder: 1,
    seoTitle: "Hair Care Formulations | Adivasi Hair Oils & Serums - HAKKIVEDA",
    seoDescription: "Shop authentic Hakki-Pikki Adivasi Hair Care formulations. 108 Mountain Herbs Hair Oil, 42 Herbs Shampoo, and Root Density Serums. Free express worldwide shipping.",
    ogImage: "/images/hakkiveda_108_oil_gold.jpg",
    sections: [
      {
        id: "routine-1",
        type: "routine",
        title: "3-Step Tribal Hair Care Ritual",
        subtitle: "Ancient application process passed down through generations",
        enabled: true,
        displayOrder: 1,
        items: [
          { q: "Step 1: Scalp Activation", a: "Warm 5-10ml of 108 Herbs Oil between palms and gently massage into scalp for 10 minutes." },
          { q: "Step 2: Overnight Absorption", a: "Leave overnight or at least 2 hours to allow cold-pressed herbs to nourish follicles." },
          { q: "Step 3: Gentle Cleansing", a: "Wash off with 42 Herbs Herbal Shampoo using lukewarm water." }
        ]
      },
      {
        id: "quiz-1",
        type: "quiz",
        title: "Find Your Hair Density Formula",
        subtitle: "Take our 60-second AI Ayurvedic Hair Assessment",
        enabled: true,
        displayOrder: 2
      },
      {
        id: "reviews-1",
        type: "reviews",
        title: "Customer Hair Density Stories",
        subtitle: "Verified customer experiences from around the world",
        enabled: true,
        displayOrder: 3
      },
      {
        id: "faq-1",
        type: "faq",
        title: "Frequently Asked Questions",
        enabled: true,
        displayOrder: 4,
        items: [
          { q: "How soon can I expect visible hair density and reduced hair fall?", a: "Most customers notice a noticeable reduction in hair fall and root breakage within 14 to 21 days of consistent 3x weekly oiling and shampooing. Improved hair luster and healthy strand vitality typically appear within 45 to 60 days." },
          { q: "Is HAKKIVEDA Hair Care safe for color-treated or bleached hair?", a: "Yes! All our hair care products are sulfate-free, paraben-free, and formulated with natural cold-pressed virgin oils that preserve color vibrance while restoring moisture lost during chemical treatments." },
          { q: "How often should I apply the 108 Herbs Hair Oil?", a: "For optimal scalp nourishment, apply 10-15ml of warm oil 3 times a week. Massage thoroughly into dry scalp for 5 minutes and leave it on overnight or for at least 2 hours before washing." },
          { q: "Do I need to wash out the Root Density Follicle Serum?", a: "No! The Root Density Serum is a lightweight, non-greasy aqueous formula designed to be left on the scalp daily. Apply 1 full dropper onto scalp sections and leave it in." }
        ]
      },
      {
        id: "safety-1",
        type: "safety",
        title: "Precautions & Storage",
        subtitle: "Store in a cool dry place away from direct sunlight. Perform patch test prior to first use.",
        enabled: true,
        displayOrder: 5
      }
    ]
  },
  {
    id: "skin-care",
    slug: "skin-care",
    categoryName: "Skin Care",
    enabled: true,
    title: "Skin Care & Lepas",
    shortDescription: "Traditional forest botanical muds, skin detox pastes and restorative herbal lepas.",
    cardImage: "/images/hakkiveda_baldness_powder.jpg",
    cardCtaText: "Shop Skin Care",
    desktopHeroImage: "/images/hakkiveda_baldness_powder.jpg",
    mobileHeroImage: "/images/hakkiveda_baldness_powder.jpg",
    heroVideo: "",
    heroFocalPoint: "center",
    heroObjectFit: "contain",
    heroHeightDesktop: "auto",
    heroHeightMobile: "auto",
    heroOverlayOpacity: 0,
    heroTextColor: "#FFFFFF",
    ctaText: "Discover Skin Care",
    ctaLink: "#products",
    displayOrder: 2,
    seoTitle: "Skin Care & Lepas | Forest Botanical Muds - HAKKIVEDA",
    seoDescription: "Discover authentic Adivasi Skin Care and herbal Lepas. Forest-harvested mud packs, neem powders, and restorative clay masks handcrafted in Mysore.",
    ogImage: "/images/hakkiveda_baldness_powder.jpg",
    sections: [
      {
        id: "routine-2",
        type: "routine",
        title: "Ayurvedic Skin & Scalp Detox Routine",
        subtitle: "Pure forest clay and herbal paste application",
        enabled: true,
        displayOrder: 1,
        items: [
          { q: "Step 1: Preparation", a: "Mix 2 tablespoons of Lepa powder with warm water or herbal oil to form a smooth paste." },
          { q: "Step 2: Application", a: "Apply evenly on target skin or bald scalp areas avoiding immediate eye area." },
          { q: "Step 3: Rinse", a: "Allow to set for 15-20 minutes and wash off with lukewarm water or clarifying shampoo." }
        ]
      },
      {
        id: "quiz-2",
        type: "quiz",
        title: "Get Personalized Herbal Advice",
        subtitle: "Take our 60-second AI Ayurvedic Assessment",
        enabled: true,
        displayOrder: 2
      },
      {
        id: "reviews-2",
        type: "reviews",
        title: "Customer Radiance & Hair Wellness Stories",
        enabled: true,
        displayOrder: 3
      },
      {
        id: "faq-2",
        type: "faq",
        title: "Frequently Asked Questions",
        enabled: true,
        displayOrder: 4,
        items: [
          { q: "What is an Adivasi Lepa and how is it used?", a: "Lepa is a traditional Adivasi paste made by mixing finely ground wild herbs, clay, and botanicals with water, hydrosol, or oil. It is applied topically to detoxify, soothe, and nourish the skin or scalp." },
          { q: "Is the Lepa suitable for sensitive skin or facial use?", a: "Yes, our Lepas are formulated with natural botanicals and free from chemical fillers. We recommend performing a 24-hour patch test behind the ear or inner wrist prior to full facial or scalp application." },
          { q: "How often should I apply the Skin Care Lepa?", a: "Apply 2 to 3 times a week for optimal deep cleansing and skin barrier replenishment. Leave on for 15-20 minutes until semi-dry, then rinse with lukewarm water." }
        ]
      },
      {
        id: "safety-2",
        type: "safety",
        title: "Safety Guidelines",
        subtitle: "For external use only. Discontinue if redness occurs.",
        enabled: true,
        displayOrder: 5
      }
    ]
  },
  {
    id: "tribal-wellness",
    slug: "tribal-wellness",
    categoryName: "Tribal Wellness",
    enabled: true,
    title: "Tribal Wellness & Hair Density Combos",
    shortDescription: "Holistic 90-day hair density kits, wellness combos, and ancestral herbal therapies.",
    cardImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    cardCtaText: "Shop Tribal Wellness",
    desktopHeroImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    mobileHeroImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    heroVideo: "",
    heroFocalPoint: "center",
    heroObjectFit: "contain",
    heroHeightDesktop: "auto",
    heroHeightMobile: "auto",
    heroOverlayOpacity: 0,
    heroTextColor: "#FFFFFF",
    ctaText: "Explore Hair Care Kits",
    ctaLink: "#products",
    displayOrder: 3,
    seoTitle: "Tribal Wellness & Hair Density Combos | Adivasi Kits - HAKKIVEDA",
    seoDescription: "Explore 90-day ancestral Hair Care and Tribal Wellness kits. Complete Adivasi hair care systems handcrafted in Mysore with 108 mountain herbs.",
    ogImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    sections: [
      {
        id: "routine-3",
        type: "routine",
        title: "90-Day Hair Care System Protocol",
        subtitle: "Complete scalp & root nourishment regimen",
        enabled: true,
        displayOrder: 1,
        items: [
          { q: "Months 1-3 Regimen", a: "Combine 3x weekly hair oiling, bi-weekly powder mask detox, and scalp massage for comprehensive root nourishment." }
        ]
      },
      {
        id: "quiz-3",
        type: "quiz",
        title: "Find Your Hair Care System",
        subtitle: "Find out which 90-day bundle matches your needs best",
        enabled: true,
        displayOrder: 2
      },
      {
        id: "reviews-3",
        type: "reviews",
        title: "Transformation Testimonials",
        enabled: true,
        displayOrder: 3
      },
      {
        id: "faq-3",
        type: "faq",
        title: "Wellness Kit Questions",
        enabled: true,
        displayOrder: 4,
        items: [
          { q: "What is included in the Tribal Wellness Kit?", a: "The complete kit includes 1x HAKKIVEDA 108 Herbs Hair Oil (200ml), 1x Herbal Baldness Care Powder (150g), 1x 42 Herbs Shampoo (250ml), plus a complimentary handcrafted brass head massager tool." },
          { q: "Why is a 90-day regimen recommended for tribal remedies?", a: "Hair vitality follows natural 90-day growth and resting cycles. The Hakki-Pikki tribe traditional regimen aligns with 3 lunar cycles to allow deep botanical lipid absorption, scalp conditioning, and root revitalization." },
          { q: "Are there any dietary or lifestyle guidelines during the regimen?", a: "For best results, maintain good hydration, avoid washing hair with scalding hot water, and allow hair to air-dry naturally after applying the shampoo and oil." }
        ]
      },
      {
        id: "safety-3",
        type: "safety",
        title: "Quality Commitment",
        subtitle: "Natural botanicals, zero synthetic mineral oils or parabens.",
        enabled: true,
        displayOrder: 5
      }
    ]
  }
];
var INITIAL_MOBILE_NAV_CONFIG = {
  enabled: true,
  bottomNavEnabled: false,
  authBar: {
    show: true,
    signInText: "Sign In",
    registerText: "Register",
    accountText: "My Account",
    logoutText: "Logout"
  },
  categorySettings: {
    showCategories: true,
    showSubcategories: true,
    categoryOverrides: {
      "cat-1": { show: true, sortOrder: 1, showSubcategories: true },
      "cat-2": { show: true, sortOrder: 2, showSubcategories: true },
      "cat-3": { show: true, sortOrder: 3, showSubcategories: true }
    }
  },
  menuItems: [
    {
      id: "mnav-home",
      type: "STATIC",
      label: "Home",
      route: "/",
      icon: "Home",
      enabled: true,
      sortOrder: 1,
      badge: "NONE"
    },
    {
      id: "mnav-categories",
      type: "CATEGORY_GROUP",
      label: "Botanical Categories",
      route: "/collections",
      icon: "Layers",
      enabled: true,
      sortOrder: 2,
      badge: "NONE",
      isAccordion: true
    },
    {
      id: "mnav-all-products",
      type: "STATIC",
      label: "ALL PRODUCTS",
      route: "/collections",
      icon: "ShoppingBag",
      enabled: true,
      sortOrder: 3,
      badge: "NONE"
    },
    {
      id: "mnav-blogs-more",
      type: "ACCORDION",
      label: "BLOGS & MORE",
      route: "/#blogs",
      icon: "FileText",
      enabled: true,
      sortOrder: 4,
      badge: "NONE",
      isAccordion: true,
      children: [
        {
          id: "mnav-child-brand-story",
          label: "Tribal Lore & Heritage",
          route: "/#brand-story",
          icon: "BookOpen",
          enabled: true,
          sortOrder: 1,
          badge: "NONE"
        },
        {
          id: "mnav-child-quiz",
          label: "AI Hair Assessment Quiz",
          route: "modal:quiz",
          icon: "Sparkles",
          enabled: true,
          sortOrder: 2,
          badge: "HOT",
          badgeText: "AI",
          badgeType: "gold",
          isModal: true,
          modalType: "quiz"
        },
        {
          id: "mnav-child-before-after",
          label: "Results & Real Transformations",
          route: "/#before-after",
          icon: "Sparkles",
          enabled: true,
          sortOrder: 3,
          badge: "NONE"
        },
        {
          id: "mnav-child-blogs",
          label: "Herbal Journal & Articles",
          route: "/#blogs",
          icon: "FileText",
          enabled: true,
          sortOrder: 4,
          badge: "NONE"
        }
      ]
    },
    {
      id: "mnav-quick-links",
      type: "ACCORDION",
      label: "QUICK LINKS",
      route: "/#faq",
      icon: "HelpCircle",
      enabled: true,
      sortOrder: 5,
      badge: "NONE",
      isAccordion: true,
      children: [
        {
          id: "mnav-child-track-order",
          label: "Track My Order / Account Portal",
          route: "modal:auth",
          icon: "User",
          enabled: true,
          sortOrder: 1,
          badge: "NONE",
          isModal: true,
          modalType: "auth"
        },
        {
          id: "mnav-child-b2b",
          label: "B2B & Export Enquiries",
          route: "/b2b-enquiry",
          icon: "Building2",
          enabled: true,
          sortOrder: 2,
          badge: "NONE"
        },
        {
          id: "mnav-child-faq",
          label: "Frequently Asked Questions",
          route: "/#faq",
          icon: "HelpCircle",
          enabled: true,
          sortOrder: 3,
          badge: "NONE"
        },
        {
          id: "mnav-child-whatsapp",
          label: "Official WhatsApp Concierge",
          route: "https://wa.me/917619536831",
          icon: "MessageCircle",
          enabled: true,
          sortOrder: 4,
          badge: "NONE",
          openInNewTab: true
        }
      ]
    },
    {
      id: "mnav-wishlist",
      type: "STATIC",
      label: "WISHLIST",
      route: "modal:wishlist",
      icon: "Heart",
      enabled: true,
      sortOrder: 6,
      badge: "NONE",
      isModal: true,
      modalType: "wishlist"
    },
    {
      id: "mnav-offers",
      type: "STATIC",
      label: "OFFERS",
      route: "/#products",
      icon: "Tag",
      enabled: true,
      sortOrder: 7,
      badge: "SALE",
      badgeText: "SALE",
      badgeType: "amber"
    },
    {
      id: "mnav-b2b",
      type: "STATIC",
      label: "B2B / EXPORT",
      route: "/b2b-enquiry",
      icon: "Building2",
      enabled: true,
      sortOrder: 8,
      badge: "B2B",
      badgeText: "GLOBAL",
      badgeType: "green"
    }
  ],
  socialLinks: [
    {
      id: "mnav-soc-fb",
      platform: "facebook",
      url: "https://facebook.com/hakkiveda",
      enabled: true,
      sortOrder: 1
    },
    {
      id: "mnav-soc-ig",
      platform: "instagram",
      url: "https://instagram.com/hakkiveda",
      enabled: true,
      sortOrder: 2
    },
    {
      id: "mnav-soc-yt",
      platform: "youtube",
      url: "https://youtube.com/@hakkiveda",
      enabled: true,
      sortOrder: 3
    },
    {
      id: "mnav-soc-wa",
      platform: "whatsapp",
      url: "https://wa.me/917619536831",
      enabled: true,
      sortOrder: 4
    }
  ],
  copyrightText: "\xA9 2026 HAKKIVEDA"
};
var INITIAL_HOMEPAGE_EDITORIAL_CONFIG = {
  section1: {
    id: "editorial-roots",
    enabled: true,
    eyebrow: "OUR ROOTS",
    heading: "ROOTED IN TRIBAL WISDOM",
    description: "Inspired by generations of Hakki-Pikki herbal knowledge from Mysuru, HAKKIVEDA brings traditional botanical wisdom into thoughtfully crafted modern hair and wellness rituals.",
    image: "/images/hero_tribal_elders.jpg",
    imageAlt: "Hakki-Pikki tribal elders in Mysuru forests",
    ctaText: "KNOW MORE \u2192",
    ctaLink: "/our-tribal-roots"
  },
  section2: {
    id: "editorial-craft",
    enabled: true,
    eyebrow: "OUR CRAFT",
    heading: "INSIDE HAKKIVEDA",
    description: "Discover the botanical preparation behind HAKKIVEDA \u2014 from carefully selected herbs and traditional processing to the quality checks behind every finished formulation.",
    image: "/images/hakkiveda_108_herbs_infographic.jpg",
    imageAlt: "Hand-selected mountain botanicals and copper cauldron preparation",
    ctaText: "DISCOVER MORE \u2192",
    ctaLink: "/how-hakkiveda-is-made"
  },
  section3: {
    id: "editorial-story",
    enabled: true,
    eyebrow: "OUR JOURNEY",
    heading: "THE HAKKIVEDA STORY",
    description: "A journey connecting Hakki-Pikki botanical traditions with a modern vision: preserving knowledge, creating authentic formulations and sharing those rituals with customers around the world.",
    image: "/images/hakkiveda_oil_couple_herbs.jpg",
    imageAlt: "HAKKIVEDA authentic herbal artisans and formulations",
    ctaText: "READ OUR STORY \u2192",
    ctaLink: "/our-story"
  }
};
var INITIAL_GLOBAL_CLIENT_COUNTRIES = [
  {
    id: "cntry-np",
    countryName: "Nepal",
    countryCode: "NP",
    flag: "\u{1F1F3}\u{1F1F5}",
    slug: "nepal",
    countryCoverImage: "/images/hero_tribal_elders.jpg",
    shortDescription: "Himalayan retail networks, Ayurvedic clinic dispensaries, and organic wellness stores across Kathmandu and Pokhara.",
    seoTitle: "HAKKIVEDA Clients in Nepal | Authentic Ayurvedic Hair Care Retailers",
    seoMetaDescription: "Discover international retailers and Ayurvedic clinics in Nepal partnering with HAKKIVEDA for authentic Hakki-Pikki tribal hair oils and wellness formulas.",
    published: true,
    displayOrder: 1,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "cntry-mu",
    countryName: "Mauritius",
    countryCode: "MU",
    flag: "\u{1F1F2}\u{1F1FA}",
    slug: "mauritius",
    countryCoverImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    shortDescription: "Island wellness boutiques, resort spas, and luxury Ayurvedic beauty collections serving Mauritius and the Indian Ocean.",
    seoTitle: "HAKKIVEDA Clients in Mauritius | Premium Island Stockists & Boutiques",
    seoMetaDescription: "Meet the luxury boutiques and holistic wellness stockists in Mauritius curating HAKKIVEDA cold-pressed tribal oils for discerning island clientele.",
    published: true,
    displayOrder: 2,
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z"
  },
  {
    id: "cntry-sg",
    countryName: "Singapore",
    countryCode: "SG",
    flag: "\u{1F1F8}\u{1F1EC}",
    slug: "singapore",
    countryCoverImage: "/images/hakkiveda_108_herbs_infographic.jpg",
    shortDescription: "Specialty organic beauty pharmacies and heritage wellness studios in Little India, Orchard, and Serangoon.",
    seoTitle: "HAKKIVEDA Clients in Singapore | Urban Organic Wellness Stockists",
    seoMetaDescription: "Explore our retail and wholesale partners in Singapore delivering pure Hakki-Pikki tribal hair oils and natural lepa formulations.",
    published: true,
    displayOrder: 3,
    createdAt: "2024-03-05T00:00:00Z",
    updatedAt: "2024-03-05T00:00:00Z"
  },
  {
    id: "cntry-my",
    countryName: "Malaysia",
    countryCode: "MY",
    flag: "\u{1F1F2}\u{1F1FE}",
    slug: "malaysia",
    countryCoverImage: "/images/hero_tribal_elders.jpg",
    shortDescription: "Holistic lifestyle concept stores and traditional botanical dispensaries in Kuala Lumpur and Penang.",
    seoTitle: "HAKKIVEDA Clients in Malaysia | Botanical & Ayurvedic Partners",
    seoMetaDescription: "Explore our trusted retail distribution partners and wellness centers across Malaysia featuring HAKKIVEDA tribal hair care.",
    published: true,
    displayOrder: 4,
    createdAt: "2024-04-12T00:00:00Z",
    updatedAt: "2024-04-12T00:00:00Z"
  },
  {
    id: "cntry-ae",
    countryName: "UAE",
    countryCode: "AE",
    flag: "\u{1F1E6}\u{1F1EA}",
    slug: "uae",
    countryCoverImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    shortDescription: "Premier organic grocers, luxury spa apothecaries, and wellness centers in Dubai and Abu Dhabi.",
    seoTitle: "HAKKIVEDA Clients in UAE | Dubai & Abu Dhabi Luxury Stockists",
    seoMetaDescription: "Discover our high-profile retail partners and Ayurvedic wellness studios in the United Arab Emirates offering HAKKIVEDA oils.",
    published: true,
    displayOrder: 5,
    createdAt: "2024-05-20T00:00:00Z",
    updatedAt: "2024-05-20T00:00:00Z"
  },
  {
    id: "cntry-lk",
    countryName: "Sri Lanka",
    countryCode: "LK",
    flag: "\u{1F1F1}\u{1F1F0}",
    slug: "sri-lanka",
    countryCoverImage: "/images/hakkiveda_108_herbs_infographic.jpg",
    shortDescription: "Indigenous botanical practitioners, eco-resort apothecaries, and Ayurvedic retail stores in Colombo and Kandy.",
    seoTitle: "HAKKIVEDA Clients in Sri Lanka | Traditional Herbal Dispensaries",
    seoMetaDescription: "Learn about our Ayurvedic retail relationships and wellness partnerships across Sri Lanka.",
    published: true,
    displayOrder: 6,
    createdAt: "2024-06-18T00:00:00Z",
    updatedAt: "2024-06-18T00:00:00Z"
  },
  {
    id: "cntry-zm",
    countryName: "Zambia",
    countryCode: "ZM",
    flag: "\u{1F1FF}\u{1F1F2}",
    slug: "zambia",
    countryCoverImage: "/images/hero_tribal_elders.jpg",
    shortDescription: "Holistic health pharmacies and natural hair care distributors in Lusaka and the Copperbelt.",
    seoTitle: "HAKKIVEDA Clients in Zambia | Lusaka Holistic Health Partners",
    seoMetaDescription: "Discover our wholesale and distribution partners in Zambia bringing pure Indian forest hair oil rituals to African markets.",
    published: true,
    displayOrder: 7,
    createdAt: "2024-07-08T00:00:00Z",
    updatedAt: "2024-07-08T00:00:00Z"
  }
];
var INITIAL_GLOBAL_CLIENT_STORIES = [
  {
    id: "story-np-1",
    countryId: "cntry-np",
    title: "HAKKIVEDA \xD7 Sanjeevani Naturals Nepal",
    slug: "sanjeevani-naturals",
    clientName: "Aarav Sharma",
    businessName: "Sanjeevani Naturals Nepal",
    city: "Kathmandu",
    clientType: "Distributor",
    relationshipType: "Distributor meeting",
    meetingDate: "October 2024",
    shortDescription: "How a prominent Kathmandu organic distributor introduced authentic Hakki-Pikki tribal hair rituals to 14 boutique wellness centers across the Himalayan valley.",
    content: `## A Shared Reverence for Untamed Forest Botanicals

Nestled in the heart of Kathmandu, **Sanjeevani Naturals** has long been the premier curator of pure, whole-plant Himalayan remedies. In autumn 2024, founders Aarav Sharma and his procurement team connected with HAKKIVEDA at an international Ayurvedic summit in New Delhi.

> "Our customers in Nepal demand authenticity above all else. They understand traditional herbs intimately. When we inspected HAKKIVEDA's wood-fired copper cauldron process, we recognized an uncompromised level of craftsmanship that is exceedingly rare in commercial beauty today."
> \u2014 *Aarav Sharma, Founder & Director*

### The Initial Pilot Distribution

The collaboration commenced with a dedicated pilot consignment of the signature **HAKKIVEDA 108 Herbs Tribal Hair Oil (500ml)** and **Natural Baldness Lepa Powder**. Distributed across flagship wellness centers in Thamel, Lazimpat, and Lakeside Pokhara, the results exceeded all expectations:

- **100% Sell-Through** within the first 18 business days.
- **Over 42 Repeat Consultations** logged at partner Ayurvedic clinics.
- **Zero Adverse Sensitivities**, with widespread praise for the grounding herbal aroma and rapid scalp-cooling relief during high-stress winter months.

### Deep Root Nourishment in High-Altitude Climates

The crisp, arid mountain air of the Kathmandu Valley often strips delicate scalp barriers of essential sebum. By introducing regular warm oil massage (Shiro Abhyanga) using HAKKIVEDA's heavy cold-pressed sesame and coconut base, Sanjeevani's clinical patrons reported dramatic reductions in dry flaking, winter breakage, and receding hairline thinning.

### Ongoing Growth & Wholesale Expansion

Following the runaway success of the initial batch, Sanjeevani Naturals formalized an annual distribution agreement, incorporating HAKKIVEDA into their permanent catalog with quarterly temperature-monitored shipments direct from Mysuru.`,
    productsPurchased: "HAKKIVEDA 108 Herbs Hair Oil (500ml), Tribal Baldness Lepa Powder",
    linkedProductIds: ["prod-1", "prod-4"],
    coverImage: "/images/hero_tribal_elders.jpg",
    galleryImages: [
      "/images/hakkiveda_oil_couple_herbs.jpg",
      "/images/hakkiveda_108_herbs_infographic.jpg",
      "/images/hakkiveda_baldness_powder.jpg"
    ],
    videos: [
      {
        id: "vid-np-1",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "HAKKIVEDA Forest Herb Sourcing & Traditional Preparation"
      }
    ],
    testimonial: {
      quote: "The authentic tribal formulation from HAKKIVEDA has received overwhelming acclaim from wellness seekers in Kathmandu and Pokhara. Pure, unadulterated herbal efficacy that honors ancient forest roots.",
      authorName: "Aarav Sharma",
      designation: "Managing Director, Sanjeevani Naturals Nepal"
    },
    websiteUrl: "https://sanjeevaninaturals.np.example",
    socialUrl: "https://instagram.com/sanjeevani_nepal",
    featured: true,
    published: true,
    displayOrder: 1,
    seoTitle: "HAKKIVEDA \xD7 Sanjeevani Naturals Nepal | Client Case Study",
    seoMetaDescription: "Read how Sanjeevani Naturals Nepal partnered with HAKKIVEDA to distribute authentic Hakki-Pikki tribal hair oils across Kathmandu and Pokhara wellness centers.",
    createdAt: "2024-10-18T00:00:00Z",
    updatedAt: "2024-10-18T00:00:00Z"
  },
  {
    id: "story-mu-1",
    countryId: "cntry-mu",
    title: "HAKKIVEDA \xD7 Wish Collection Mauritius",
    slug: "wish-collection",
    clientName: "Devina Ramgoolam",
    businessName: "Wish Collection Mauritius",
    city: "Port Louis & Grand Baie",
    clientType: "Retailer",
    relationshipType: "Wholesale order",
    meetingDate: "December 2024",
    shortDescription: "How a luxury coastal boutique group in Mauritius made HAKKIVEDA their top-recommended scalp ritual for high-humidity coastal hair recovery.",
    content: `## Coastal Luxury Meets Pure Forest Medicine

Along the serene coastlines of Grand Baie and the heritage streets of Port Louis, **Wish Collection** represents the pinnacle of luxury botanical personal care. Founded by Devina Ramgoolam, the boutique chain specializes in clean, unrefined formulas from across the globe.

> "Living in Mauritius means dealing with year-round ocean breezes, saline spray, and tropical sun exposure. Our patrons needed a heavy, deeply penetrative oil that could shield the hair shaft without chemical silicones. HAKKIVEDA delivered precisely that."
> \u2014 *Devina Ramgoolam, Creative Founder*

### Meeting the Artisan Roots

After reviewing sample vials in late 2024, Devina placed an initial wholesale order comprising:
- **108 Herbs Hair Oil (250ml & 500ml Glass Decanters)**
- **Root Density Follicle Serum**
- **Gentle Tribal Scalp Cleansing Bars**

The packaging, sealed with natural parchment and adorned with the authentic Hakki-Pikki tribal motif, immediately resonated with luxury travelers and Mauritian locals alike.

### Transformational Results on Sun-Stressed Strands

Within four weeks of stocking, repeat client feedback highlighted:
1. Marked reduction in frizz and split ends caused by ocean humidity.
2. Noticeable retention of natural hair color and deep shine.
3. Soothing of dry, itchy scalps triggered by chlorinated resort pools.`,
    productsPurchased: "108 Herbs Hair Oil 250ml & 500ml, Root Density Scalp Serum",
    linkedProductIds: ["prod-1", "prod-2", "prod-3"],
    coverImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    galleryImages: [
      "/images/hakkiveda_108_oil_gold.jpg",
      "/images/hakkiveda_108_oil_back_label.jpg"
    ],
    videos: [],
    testimonial: {
      quote: "Our boutique clients adore the earthy fragrance and immediate softening texture of HAKKIVEDA oils. It has become a permanent staple on our luxury Ayurvedic shelf.",
      authorName: "Devina Ramgoolam",
      designation: "Founder & Head Buyer, Wish Collection Mauritius"
    },
    websiteUrl: "https://wishcollection.mu.example",
    socialUrl: "https://instagram.com/wishcollection_mu",
    featured: true,
    published: true,
    displayOrder: 2,
    seoTitle: "HAKKIVEDA \xD7 Wish Collection Mauritius | Luxury Coastal Retail Story",
    seoMetaDescription: "Discover how luxury Mauritian boutique chain Wish Collection integrated HAKKIVEDA tribal forest oils for coastal hair rehabilitation.",
    createdAt: "2024-12-05T00:00:00Z",
    updatedAt: "2024-12-05T00:00:00Z"
  },
  {
    id: "story-sg-1",
    countryId: "cntry-sg",
    title: "HAKKIVEDA \xD7 Serangoon Ayurvedic Wellness",
    slug: "serangoon-ayurvedic-wellness",
    clientName: "Mei Ling Tan & Rajesh Nair",
    businessName: "Serangoon Ayurvedic Wellness",
    city: "Singapore",
    clientType: "Wholesale Buyer",
    relationshipType: "Client visited HAKKIVEDA",
    meetingDate: "January 2025",
    shortDescription: "From a personal visit to our Mysuru extraction workshops to stocking premium scalp treatments in downtown Singapore.",
    content: `## A Hands-On Journey to the Forest Edge

In January 2025, wellness entrepreneurs **Mei Ling Tan** and **Rajesh Nair** traveled from Singapore directly to Mysuru, India. As operators of Serangoon Ayurvedic Wellness, they had grown frustrated with commercial Ayurvedic products filled with mineral oil and synthetic fragrances.

> "Watching the Hakki-Pikki tribal artisans slowly simmer fresh Bhringraj, Brahmi, and Amla in cold-pressed sesame oil over open wood fires convinced us completely. You cannot fake the vibrational purity of slow herbal infusion."
> \u2014 *Rajesh Nair, Co-Founder*

### Implementing the Urban Scalp Detox Ritual

Back in Singapore, Serangoon Wellness introduced a tailored **"Tribal Scalp Awakening"** 60-minute head massage therapy using HAKKIVEDA 108 Oil, followed by home care prescriptions with the **Root Density Follicle Serum**.

### Measurable Client Outcomes

- Over 300 studio treatments administered within the first 60 days.
- Over 92% client satisfaction reported on scalp comfort and reduced daily shedding.
- A waiting list established for each new air-shipped consignment from Karnataka.`,
    productsPurchased: "Root Density Follicle Serum, 108 Hair Oil Master Packs",
    linkedProductIds: ["prod-1", "prod-3"],
    coverImage: "/images/hakkiveda_108_herbs_infographic.jpg",
    galleryImages: [
      "/images/hero_tribal_elders.jpg",
      "/images/hakkiveda_oil_couple_herbs.jpg"
    ],
    videos: [],
    testimonial: {
      quote: "We visited the HAKKIVEDA facility and witnessed the slow wood-fired copper vessel extraction first-hand. Incomparable purity and integrity that our Singapore clients trust implicitly.",
      authorName: "Mei Ling Tan & Rajesh Nair",
      designation: "Co-Founders, Serangoon Ayurvedic Wellness Singapore"
    },
    websiteUrl: "https://serangoonwellness.sg.example",
    socialUrl: "https://instagram.com/serangoonwellness_sg",
    featured: true,
    published: true,
    displayOrder: 3,
    seoTitle: "HAKKIVEDA \xD7 Serangoon Ayurvedic Wellness Singapore | Case Study",
    seoMetaDescription: "Learn how Singapore wellness studio Serangoon Ayurvedic Wellness adopted HAKKIVEDA authentic tribal hair formulas following an in-person artisan visit.",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-01-20T00:00:00Z"
  },
  {
    id: "story-my-1",
    countryId: "cntry-my",
    title: "HAKKIVEDA \xD7 Nusantara Botanical Emporium",
    slug: "nusantara-botanical-emporium",
    clientName: "Farhan bin Zulkifli",
    businessName: "Nusantara Botanical Emporium",
    city: "Kuala Lumpur",
    clientType: "Distributor",
    relationshipType: "Retail partnership",
    meetingDate: "February 2025",
    shortDescription: "Bringing authentic tribal Indian oils to Southeast Asia\u2019s most discerning botanical lifestyle hub in Bangsar.",
    content: `## Celebrating Indigenous Plant Knowledge Across Borders

In the cosmopolitan quarter of Bangsar, Kuala Lumpur, **Nusantara Botanical Emporium** bridges Southeast Asian and South Asian herbal traditions. When curator Farhan bin Zulkifli sought an uncompromising cold-pressed hair treatment, HAKKIVEDA emerged as the ideal partner.

### Curated Selection for Tropical Climates

The Malaysian collection focuses on balancing scalp moisture without heaviness:
- Weekly overnight scalp oiling with the **108 Herbs Formulation**
- Mild sulfate-free cleansing with tribal herbal preparations
- Scalp cooling for urbanites experiencing stress-induced hair loss

The response from Kuala Lumpur's eco-conscious community has established HAKKIVEDA as an essential recommendation for holistic hair revival.`,
    productsPurchased: "HAKKIVEDA 108 Herbs Hair Oil, Herbal Shampoo Bar",
    linkedProductIds: ["prod-1", "prod-2"],
    coverImage: "/images/hero_tribal_elders.jpg",
    galleryImages: ["/images/hakkiveda_oil_couple_herbs.jpg"],
    videos: [],
    testimonial: {
      quote: "The synergy between traditional Indian tribal wisdom and our Southeast Asian clientele is remarkable. HAKKIVEDA brings a level of purity that speaks for itself.",
      authorName: "Farhan bin Zulkifli",
      designation: "Managing Partner, Nusantara Botanical Emporium"
    },
    websiteUrl: "https://nusantarabotanical.my.example",
    socialUrl: "https://instagram.com/nusantarabotanical_my",
    featured: false,
    published: true,
    displayOrder: 4,
    seoTitle: "HAKKIVEDA \xD7 Nusantara Botanical Emporium Malaysia | Story",
    seoMetaDescription: "Read about our partnership with Nusantara Botanical Emporium in Kuala Lumpur, distributing authentic Hakki-Pikki tribal hair oils.",
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2025-02-15T00:00:00Z"
  },
  {
    id: "story-ae-1",
    countryId: "cntry-ae",
    title: "HAKKIVEDA \xD7 Al Barsha Organic & Herbal Center",
    slug: "al-barsha-organic-herbal",
    clientName: "Tariq Al-Mansoor",
    businessName: "Al Barsha Organic & Herbal Center",
    city: "Dubai",
    clientType: "Distributor",
    relationshipType: "Exhibition meeting",
    meetingDate: "November 2024",
    shortDescription: "Combatting desalinated water effects and intense desert heat with deep tribal scalp saturation in the United Arab Emirates.",
    content: `## Overcoming Desert Dryness with Rich Forest Elixirs

Residents of Dubai face distinctive hair challenges: daily showers with desalinated water combined with high outdoor temperatures and dry indoor air conditioning can weaken the hair cortex and dehydrate the scalp.

At the Dubai International Natural Products Expo in November 2024, **Al Barsha Organic & Herbal Center** partnered with HAKKIVEDA to supply an intensive moisture barrier remedy.

> "Our customers in Dubai have tried every luxury European salon brand, but synthetic silicones only mask the damage temporarily. HAKKIVEDA delivers true lipid replenishment straight from the roots."
> \u2014 *Tariq Al-Mansoor, Director of Procurement*

### Premium Demand & Rapid Adoption

Available in 500ml Master Decanters, HAKKIVEDA quickly became the center's top-selling Ayurvedic oil, favored by both Emirati families and expatriate professionals seeking clean botanical power.`,
    productsPurchased: "108 Herbs Hair Oil Luxury 500ml Edition, Root Density Serum",
    linkedProductIds: ["prod-1", "prod-3"],
    coverImage: "/images/hakkiveda_oil_couple_herbs.jpg",
    galleryImages: [
      "/images/hakkiveda_108_oil_gold.jpg",
      "/images/hero_tribal_elders.jpg"
    ],
    videos: [],
    testimonial: {
      quote: "In our desert environment, hair requires rich, unadulterated botanical nourishment. HAKKIVEDA has become the single most praised scalp formulation on our shelves.",
      authorName: "Tariq Al-Mansoor",
      designation: "Director of Procurement, Al Barsha Organic UAE"
    },
    websiteUrl: "https://albarshaherbal.ae.example",
    socialUrl: "https://instagram.com/albarshaherbal_ae",
    featured: true,
    published: true,
    displayOrder: 5,
    seoTitle: "HAKKIVEDA \xD7 Al Barsha Organic UAE | Dubai Client Case Study",
    seoMetaDescription: "Discover how Al Barsha Organic Center in Dubai addresses desert climate hair challenges with HAKKIVEDA authentic tribal formulations.",
    createdAt: "2024-11-25T00:00:00Z",
    updatedAt: "2024-11-25T00:00:00Z"
  },
  {
    id: "story-lk-1",
    countryId: "cntry-lk",
    title: "HAKKIVEDA \xD7 Ceylon Herbal Traditions",
    slug: "ceylon-herbal-traditions",
    clientName: "Kasun Jayasuriya",
    businessName: "Ceylon Herbal Traditions",
    city: "Colombo",
    clientType: "Wholesale Buyer",
    relationshipType: "Wholesale order",
    meetingDate: "August 2024",
    shortDescription: "Bridging South Indian Hakki-Pikki tribal botany with Sri Lankan Deshiya Chikitsa healing lineages in Colombo.",
    content: `## A Harmonious Confluence of Southern Healing Heritage

Sri Lanka possesses one of the world's most sophisticated indigenous medicine systems (Deshiya Chikitsa). When **Ceylon Herbal Traditions** examined HAKKIVEDA's hand-extracted 108 Herb oil, they found an exceptional companion to their native Ayurvedic offerings.

The combination of wild forest herbs like Gunja, Bhringraj, and Devadaru provides targeted revitalization for thinning crown zones, making it an instant favorite among Colombo holistic wellness seekers.`,
    productsPurchased: "Tribal Scalp Lepa Powder, 108 Hair Oil",
    linkedProductIds: ["prod-1", "prod-4"],
    coverImage: "/images/hakkiveda_108_herbs_infographic.jpg",
    galleryImages: ["/images/hakkiveda_baldness_powder.jpg"],
    videos: [],
    testimonial: {
      quote: "The depth of herbal extraction is evident from the first drop. We are honored to carry HAKKIVEDA in Colombo.",
      authorName: "Kasun Jayasuriya",
      designation: "Managing Director, Ceylon Herbal Traditions"
    },
    websiteUrl: "https://ceylonherbaltraditions.lk.example",
    socialUrl: "https://instagram.com/ceylonherbal_lk",
    featured: false,
    published: true,
    displayOrder: 6,
    seoTitle: "HAKKIVEDA \xD7 Ceylon Herbal Traditions Sri Lanka | Partner Story",
    seoMetaDescription: "Learn about the partnership between HAKKIVEDA and Ceylon Herbal Traditions in Colombo, Sri Lanka.",
    createdAt: "2024-08-14T00:00:00Z",
    updatedAt: "2024-08-14T00:00:00Z"
  },
  {
    id: "story-zm-1",
    countryId: "cntry-zm",
    title: "HAKKIVEDA \xD7 Lusaka Holistic Pharmacy",
    slug: "lusaka-holistic-pharmacy",
    clientName: "Grace Mumba",
    businessName: "Lusaka Holistic Pharmacy",
    city: "Lusaka",
    clientType: "Business Partner",
    relationshipType: "Wholesale order",
    meetingDate: "September 2024",
    shortDescription: "Empowering African textured hair and protective style care with intense scalp hydration from the forests of Mysuru.",
    content: `## Deep Moisture Retention for Textured & Protective Styles

In Zambia, textured hair requires intensive lipid barrier support, especially when wearing braids, twists, and protective locks for extended periods. **Lusaka Holistic Pharmacy**, led by chief pharmacist Grace Mumba, introduced HAKKIVEDA to provide soothing scalp care that prevents traction tightness and follicular dryness.

Clients reported immediate relief from itchy scalp conditions and enhanced strand retention during seasonal shifts.`,
    productsPurchased: "HAKKIVEDA 108 Herbs Hair Oil 500ml",
    linkedProductIds: ["prod-1"],
    coverImage: "/images/hero_tribal_elders.jpg",
    galleryImages: ["/images/hakkiveda_oil_couple_herbs.jpg"],
    videos: [],
    testimonial: {
      quote: "HAKKIVEDA has proven extraordinarily effective for our clients with protective hairstyles. The moisture retention is unmatched by standard commercial products.",
      authorName: "Grace Mumba",
      designation: "Chief Pharmacist, Lusaka Holistic Pharmacy Zambia"
    },
    websiteUrl: "https://lusakaholistic.zm.example",
    socialUrl: "https://instagram.com/lusakaholistic_zm",
    featured: false,
    published: true,
    displayOrder: 7,
    seoTitle: "HAKKIVEDA \xD7 Lusaka Holistic Pharmacy Zambia | International Story",
    seoMetaDescription: "Read how Lusaka Holistic Pharmacy in Zambia utilizes HAKKIVEDA tribal forest oils for textured hair and scalp hydration.",
    createdAt: "2024-09-02T00:00:00Z",
    updatedAt: "2024-09-02T00:00:00Z"
  }
];

// src/server/db.ts
var DEFAULT_HERO_SLIDER_SETTINGS = {
  autoPlay: true,
  autoPlayDelay: 6,
  transitionSpeed: 700,
  pauseOnHover: true,
  infiniteLoop: true,
  swipeSupport: true
};
var dbDir = process.env.DB_DIR || import_path.default.join(process.cwd(), "data");
if (!import_fs.default.existsSync(dbDir)) {
  import_fs.default.mkdirSync(dbDir, { recursive: true });
}
var dbPath = process.env.DB_PATH || import_path.default.join(dbDir, "store.json");
var storeMemoryCache = null;
function loadMemoryFromDisk() {
  if (storeMemoryCache) return storeMemoryCache;
  if (import_fs.default.existsSync(dbPath)) {
    try {
      const raw = import_fs.default.readFileSync(dbPath, "utf-8");
      storeMemoryCache = JSON.parse(raw);
      return storeMemoryCache;
    } catch (err) {
      console.error("[File DB] Error reading store.json, reinitializing:", err);
    }
  }
  storeMemoryCache = {};
  return storeMemoryCache;
}
var isFlushing = false;
var needsFlush = false;
async function flushToDisk() {
  if (!storeMemoryCache) return;
  if (isFlushing) {
    needsFlush = true;
    return;
  }
  isFlushing = true;
  try {
    if (!import_fs.default.existsSync(dbDir)) {
      await import_fs.default.promises.mkdir(dbDir, { recursive: true });
    }
    const tempPath = `${dbPath}.tmp`;
    const dataString = JSON.stringify(storeMemoryCache, null, 2);
    await import_fs.default.promises.writeFile(tempPath, dataString, "utf-8");
    await import_fs.default.promises.rename(tempPath, dbPath);
  } catch (err) {
    console.error("[File DB] Error writing store.json:", err);
  } finally {
    isFlushing = false;
    if (needsFlush) {
      needsFlush = false;
      await flushToDisk();
    }
  }
}
async function getDb() {
  const store = loadMemoryFromDisk();
  if (!store.seeded) {
    console.log("[File DB] First-time startup detected. Seeding initial store data into", dbPath);
    const defaultDataMap = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      hero_slides: INITIAL_HERO_SLIDES,
      hero_slider_settings: {
        autoPlay: true,
        autoPlayDelay: 6,
        transitionSpeed: 700,
        pauseOnHover: true,
        infiniteLoop: true,
        swipeSupport: true
      },
      before_after: INITIAL_BEFORE_AFTER,
      reviews: INITIAL_REVIEWS,
      blogs: INITIAL_BLOGS,
      coupons: INITIAL_COUPONS,
      testimonial_videos: INITIAL_TESTIMONIAL_VIDEOS,
      quiz_questions: INITIAL_QUIZ_QUESTIONS,
      media_items: INITIAL_MEDIA_ITEMS,
      orders: INITIAL_ORDERS,
      b2b_leads: [],
      hair_analysis_leads: [],
      customer_accounts: INITIAL_CUSTOMER_ACCOUNTS,
      site_settings: INITIAL_SITE_SETTINGS,
      brand_identity: INITIAL_BRAND_IDENTITY,
      brand_identity_draft: INITIAL_BRAND_IDENTITY,
      header_layout_settings: INITIAL_HEADER_LAYOUT_SETTINGS,
      nav_links: INITIAL_NAV_LINKS,
      currencies: INITIAL_CURRENCIES,
      current_currency: INITIAL_CURRENCIES[0],
      markets: INITIAL_MARKETS,
      countries: INITIAL_COUNTRIES,
      payment_gateways: INITIAL_PAYMENT_GATEWAYS,
      cod_rules: INITIAL_COD_RULES,
      market_gateways: INITIAL_MARKET_GATEWAYS,
      payment_logs: INITIAL_PAYMENT_LOGS,
      b2b_section_config: INITIAL_B2B_SECTION_CONFIG,
      video_popup_config: INITIAL_VIDEO_POPUP_CONFIG,
      shoppable_reels: INITIAL_SHOPPABLE_REELS,
      category_pages: INITIAL_CATEGORY_PAGES,
      homepage_quiz_banner_config: INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG,
      mobile_nav_config: INITIAL_MOBILE_NAV_CONFIG,
      homepage_editorial_config: INITIAL_HOMEPAGE_EDITORIAL_CONFIG,
      global_client_countries: INITIAL_GLOBAL_CLIENT_COUNTRIES,
      global_client_stories: INITIAL_GLOBAL_CLIENT_STORIES,
      max_bestsellers_count: 8,
      seeded: true
    };
    Object.assign(store, defaultDataMap);
    await flushToDisk();
    console.log("[File DB] Successfully seeded initial store records!");
  } else {
    let needsFlush2 = false;
    if (store.site_settings) {
      const existingLogo = store.site_settings.headerHvLogo || store.site_settings.logoImageUrl || store.brand_identity?.headerHvLogo || INITIAL_SITE_SETTINGS.headerHvLogo;
      store.site_settings = {
        ...INITIAL_SITE_SETTINGS,
        ...store.site_settings,
        headerHvLogo: existingLogo,
        logoImageUrl: store.site_settings.logoImageUrl || existingLogo,
        internationalCountryShippingRates: {
          ...store.site_settings.internationalCountryShippingRates || {}
        }
      };
    } else {
      store.site_settings = INITIAL_SITE_SETTINGS;
      needsFlush2 = true;
    }
    if (store.brand_identity) {
      const existingLogo = store.brand_identity.headerHvLogo || store.site_settings?.headerHvLogo || INITIAL_BRAND_IDENTITY.headerHvLogo;
      store.brand_identity = {
        ...INITIAL_BRAND_IDENTITY,
        ...store.brand_identity,
        headerHvLogo: existingLogo,
        mainLogoLight: store.brand_identity.mainLogoLight || existingLogo
      };
    } else {
      store.brand_identity = INITIAL_BRAND_IDENTITY;
      needsFlush2 = true;
    }
    if (store.header_layout_settings) {
      store.header_layout_settings = { ...INITIAL_HEADER_LAYOUT_SETTINGS, ...store.header_layout_settings };
    } else {
      store.header_layout_settings = INITIAL_HEADER_LAYOUT_SETTINGS;
      needsFlush2 = true;
    }
    if (store.footer_config) {
      store.footer_config = { ...INITIAL_FOOTER_CONFIG, ...store.footer_config };
    } else {
      store.footer_config = INITIAL_FOOTER_CONFIG;
      needsFlush2 = true;
    }
    if (store.hero_slider_settings) {
      store.hero_slider_settings = { ...DEFAULT_HERO_SLIDER_SETTINGS, ...store.hero_slider_settings };
    } else {
      store.hero_slider_settings = DEFAULT_HERO_SLIDER_SETTINGS;
      needsFlush2 = true;
    }
    if (!store.mobile_nav_config) {
      store.mobile_nav_config = INITIAL_MOBILE_NAV_CONFIG;
      needsFlush2 = true;
    } else {
      store.mobile_nav_config = { ...INITIAL_MOBILE_NAV_CONFIG, ...store.mobile_nav_config };
    }
    if (!store.homepage_quiz_banner_config) {
      store.homepage_quiz_banner_config = INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG;
      needsFlush2 = true;
    } else {
      store.homepage_quiz_banner_config = { ...INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG, ...store.homepage_quiz_banner_config };
    }
    if (!store.homepage_editorial_config) {
      store.homepage_editorial_config = INITIAL_HOMEPAGE_EDITORIAL_CONFIG;
      needsFlush2 = true;
    } else {
      store.homepage_editorial_config = { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG, ...store.homepage_editorial_config };
    }
    if (!store.global_client_countries || !Array.isArray(store.global_client_countries)) {
      store.global_client_countries = INITIAL_GLOBAL_CLIENT_COUNTRIES;
      needsFlush2 = true;
    }
    if (!store.global_client_stories || !Array.isArray(store.global_client_stories)) {
      store.global_client_stories = INITIAL_GLOBAL_CLIENT_STORIES;
      needsFlush2 = true;
    }
    if (needsFlush2) {
      await flushToDisk();
    }
    console.log("[File DB] Loaded existing database from", dbPath);
  }
  return store;
}
function isSafeStoreKey(key) {
  if (typeof key !== "string") return false;
  const trimmed = key.trim();
  if (!trimmed || trimmed.length > 128) return false;
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  const lower = trimmed.toLowerCase();
  const dangerousPatterns = [
    "__proto__",
    "constructor",
    "prototype",
    "__definegetter__",
    "__definesetter__",
    "__lookupgetter__",
    "__lookupsetter__",
    "tostring",
    "valueof",
    "hasownproperty",
    "isprototypeof",
    "propertyisenumerable",
    "tolocalestring"
  ];
  for (const pattern of dangerousPatterns) {
    if (lower === pattern || lower.includes(pattern)) {
      return false;
    }
  }
  return true;
}
async function getStoreValue(key) {
  if (!isSafeStoreKey(key)) {
    return null;
  }
  const cleanKey = key.trim();
  const store = loadMemoryFromDisk();
  if (!(cleanKey in store)) {
    if (cleanKey === "site_settings") return INITIAL_SITE_SETTINGS;
    if (cleanKey === "brand_identity") return INITIAL_BRAND_IDENTITY;
    if (cleanKey === "header_layout_settings") return INITIAL_HEADER_LAYOUT_SETTINGS;
    if (cleanKey === "footer_config") return INITIAL_FOOTER_CONFIG;
    if (cleanKey === "homepage_quiz_banner_config") return INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG;
    if (cleanKey === "mobile_nav_config") return INITIAL_MOBILE_NAV_CONFIG;
    if (cleanKey === "homepage_editorial_config") return INITIAL_HOMEPAGE_EDITORIAL_CONFIG;
    if (cleanKey === "global_client_countries") return INITIAL_GLOBAL_CLIENT_COUNTRIES;
    if (cleanKey === "global_client_stories") return INITIAL_GLOBAL_CLIENT_STORIES;
    return null;
  }
  return store[cleanKey];
}
async function setStoreValue(key, value) {
  if (!isSafeStoreKey(key)) {
    throw new Error(`Invalid or dangerous store key: '${String(key)}'`);
  }
  const cleanKey = key.trim();
  const store = loadMemoryFromDisk();
  if (cleanKey === "site_settings" && value && typeof value === "object") {
    const existing = store.site_settings?.headerHvLogo || store.site_settings?.logoImageUrl || store.brand_identity?.headerHvLogo;
    if (existing && (!value.headerHvLogo || value.headerHvLogo === "")) {
      value.headerHvLogo = existing;
    }
    if (existing && (!value.logoImageUrl || value.logoImageUrl === "")) {
      value.logoImageUrl = existing;
    }
  }
  if (cleanKey === "brand_identity" && value && typeof value === "object") {
    const existing = store.brand_identity?.headerHvLogo || store.site_settings?.headerHvLogo;
    if (existing && (!value.headerHvLogo || value.headerHvLogo === "")) {
      value.headerHvLogo = existing;
    }
    if (existing && (!value.mainLogoLight || value.mainLogoLight === "")) {
      value.mainLogoLight = existing;
    }
  }
  store[cleanKey] = value;
  await flushToDisk();
  console.log(`[File DB] setStoreValue updated '${cleanKey}'`);
  return true;
}
async function getAllStoreData() {
  const store = loadMemoryFromDisk();
  const result = {};
  for (const [k, v] of Object.entries(store)) {
    if (k !== "seeded") {
      result[k] = v;
    }
  }
  return result;
}
var PUBLIC_STORE_ALLOWLIST = [
  "products",
  "categories",
  "hero_slides",
  "hero_slider_settings",
  "before_after",
  "reviews",
  "blogs",
  "coupons",
  "testimonial_videos",
  "quiz_questions",
  "media_items",
  "site_settings",
  "brand_identity",
  "header_layout_settings",
  "footer_config",
  "nav_links",
  "currencies",
  "current_currency",
  "markets",
  "countries",
  "b2b_section_config",
  "video_popup_config",
  "shoppable_reels",
  "category_pages",
  "homepage_quiz_banner_config",
  "mobile_nav_config",
  "homepage_editorial_config",
  "global_client_countries",
  "global_client_stories",
  "max_bestsellers_count",
  "cod_rules",
  "market_gateways"
];
async function getPublicStoreData() {
  const store = loadMemoryFromDisk();
  const result = {};
  for (const key of PUBLIC_STORE_ALLOWLIST) {
    if (key in store && store[key] !== void 0) {
      result[key] = store[key];
    }
  }
  return result;
}

// src/server/shiprocketService.ts
var import_dotenv = __toESM(require("dotenv"), 1);

// src/utils/shipping.ts
var INFORMATIONAL_CARRIER_DETAILS = {
  "US": { courierName: "DHL Express Worldwide", estimatedDays: "4\u20137 Business Days" },
  "CA": { courierName: "DHL Express Worldwide", estimatedDays: "4\u20138 Business Days" },
  "GB": { courierName: "DHL Express Worldwide", estimatedDays: "3\u20136 Business Days" },
  "AE": { courierName: "Aramex International / DHL Express", estimatedDays: "3\u20135 Business Days" },
  "AU": { courierName: "DHL Express Worldwide Oceania", estimatedDays: "5\u20138 Business Days" },
  "NZ": { courierName: "DHL Express Worldwide Oceania", estimatedDays: "5\u20139 Business Days" },
  "FJ": { courierName: "DHL International Express Fiji", estimatedDays: "6\u201310 Business Days" },
  "SG": { courierName: "DHL Express Singapore", estimatedDays: "3\u20135 Business Days" },
  "MY": { courierName: "DHL Express Malaysia", estimatedDays: "4\u20136 Business Days" },
  "MU": { courierName: "DHL International Express Mauritius", estimatedDays: "5\u20138 Business Days" },
  "DE": { courierName: "DHL Express Europe", estimatedDays: "4\u20137 Business Days" },
  "FR": { courierName: "DHL Express Europe", estimatedDays: "4\u20137 Business Days" },
  "IT": { courierName: "DHL Express Europe", estimatedDays: "4\u20137 Business Days" },
  "ES": { courierName: "DHL Express Europe", estimatedDays: "4\u20137 Business Days" },
  "NL": { courierName: "DHL Express Europe", estimatedDays: "4\u20136 Business Days" },
  "CH": { courierName: "DHL Express Worldwide", estimatedDays: "4\u20137 Business Days" },
  "SA": { courierName: "Aramex Express GCC", estimatedDays: "3\u20136 Business Days" },
  "QA": { courierName: "Aramex Express GCC", estimatedDays: "3\u20135 Business Days" },
  "KW": { courierName: "Aramex Express GCC", estimatedDays: "3\u20135 Business Days" },
  "OM": { courierName: "Aramex Express GCC", estimatedDays: "3\u20135 Business Days" },
  "BH": { courierName: "Aramex Express GCC", estimatedDays: "3\u20135 Business Days" },
  "TH": { courierName: "DHL Express South East Asia", estimatedDays: "4\u20136 Business Days" },
  "ID": { courierName: "DHL Express Asia", estimatedDays: "4\u20137 Business Days" },
  "PH": { courierName: "DHL Express Asia", estimatedDays: "4\u20137 Business Days" },
  "JP": { courierName: "DHL Express East Asia", estimatedDays: "4\u20137 Business Days" },
  "HK": { courierName: "DHL Express East Asia", estimatedDays: "3\u20135 Business Days" },
  "ZA": { courierName: "DHL Express South Africa", estimatedDays: "5\u20139 Business Days" },
  "KE": { courierName: "DHL Express Africa", estimatedDays: "5\u20138 Business Days" },
  "NP": { courierName: "Air Cargo Express Nepal", estimatedDays: "3\u20136 Business Days" },
  "LK": { courierName: "DHL Express Sri Lanka", estimatedDays: "3\u20135 Business Days" },
  "BD": { courierName: "DHL Express Bangladesh", estimatedDays: "3\u20135 Business Days" },
  "IN": { courierName: "Shiprocket Surface Delivery", estimatedDays: "3\u20135 Business Days" }
};
function isIndiaCountry(countryOrCode) {
  if (!countryOrCode) return true;
  const clean = countryOrCode.trim().toUpperCase();
  return clean === "IN" || clean === "IND" || clean === "INDIA";
}
function normalizeCountryCode(countryOrCode) {
  if (!countryOrCode) return "IN";
  const clean = countryOrCode.trim().toUpperCase();
  if (clean === "INDIA" || clean === "IND" || clean === "IN") return "IN";
  if (clean === "USA" || clean === "UNITED STATES" || clean === "UNITED STATES OF AMERICA" || clean === "US") return "US";
  if (clean === "UK" || clean === "UNITED KINGDOM" || clean === "GREAT BRITAIN" || clean === "GB") return "GB";
  if (clean === "UAE" || clean === "UNITED ARAB EMIRATES" || clean === "AE") return "AE";
  if (clean === "FIJI" || clean === "FJ") return "FJ";
  if (clean === "AUSTRALIA" || clean === "AU") return "AU";
  if (clean === "CANADA" || clean === "CA") return "CA";
  if (clean === "NEW ZEALAND" || clean === "NZ") return "NZ";
  if (clean === "SINGAPORE" || clean === "SG") return "SG";
  if (clean === "MALAYSIA" || clean === "MY") return "MY";
  if (clean === "MAURITIUS" || clean === "MU") return "MU";
  if (clean === "GERMANY" || clean === "DE") return "DE";
  if (clean === "FRANCE" || clean === "FR") return "FR";
  if (clean === "SPAIN" || clean === "ES") return "ES";
  if (clean === "ITALY" || clean === "IT") return "IT";
  if (clean === "NETHERLANDS" || clean === "NL") return "NL";
  if (clean === "SWITZERLAND" || clean === "CH") return "CH";
  if (clean === "SOUTH AFRICA" || clean === "ZA") return "ZA";
  if (clean === "KENYA" || clean === "KE") return "KE";
  if (clean === "NEPAL" || clean === "NP") return "NP";
  if (clean === "SRI LANKA" || clean === "LK") return "LK";
  if (clean === "BANGLADESH" || clean === "BD") return "BD";
  return clean.length === 2 ? clean : clean.slice(0, 2);
}
function getDestinationCourierInfo(countryOrCode) {
  const code = normalizeCountryCode(countryOrCode);
  if (INFORMATIONAL_CARRIER_DETAILS[code]) {
    return INFORMATIONAL_CARRIER_DETAILS[code];
  }
  if (code === "IN") {
    return { courierName: "Shiprocket Surface Delivery", estimatedDays: "3\u20135 Business Days" };
  }
  return { courierName: "DHL Express International", estimatedDays: "5\u20139 Business Days" };
}
function getAuthoritativeShippingQuote(cartSubtotalINR, countryOrCode, customShippingFeeINR, customCourierLabel, siteSettings) {
  const isIndia = isIndiaCountry(countryOrCode);
  const countryCode = normalizeCountryCode(countryOrCode);
  if (isIndia) {
    const thresholdINR2 = 999;
    const isFree2 = cartSubtotalINR >= thresholdINR2;
    const standardRateINR2 = 99;
    const shippingFeeINR2 = isFree2 ? 0 : standardRateINR2;
    const amountNeededForFreeINR2 = Math.max(0, thresholdINR2 - cartSubtotalINR);
    const courierLabel2 = customCourierLabel || "Shiprocket Surface Delivery";
    return {
      isIndia: true,
      countryCode: "IN",
      thresholdINR: thresholdINR2,
      shippingFeeINR: shippingFeeINR2,
      isFree: isFree2,
      amountNeededForFreeINR: amountNeededForFreeINR2,
      standardRateINR: standardRateINR2,
      courierLabel: courierLabel2,
      estimatedDelivery: "3\u20135 Business Days",
      isDynamicQuote: false,
      serviceable: true,
      source: isFree2 ? "DOMESTIC_FREE" : "DOMESTIC_STANDARD"
    };
  }
  const info = getDestinationCourierInfo(countryCode);
  if (siteSettings?.internationalShippingEnabled === false) {
    return {
      isIndia: false,
      countryCode,
      thresholdINR: null,
      shippingFeeINR: 0,
      isFree: false,
      amountNeededForFreeINR: 0,
      standardRateINR: 0,
      courierLabel: "International Shipping Paused",
      estimatedDelivery: void 0,
      isDynamicQuote: false,
      serviceable: false,
      source: "UNSERVICEABLE"
    };
  }
  const freeShippingEnabled = Boolean(
    siteSettings?.internationalFreeShippingEnabled && typeof siteSettings?.internationalFreeShippingThresholdINR === "number" && siteSettings.internationalFreeShippingThresholdINR > 0
  );
  const thresholdINR = freeShippingEnabled ? siteSettings.internationalFreeShippingThresholdINR : null;
  const isFree = Boolean(freeShippingEnabled && thresholdINR !== null && cartSubtotalINR >= thresholdINR);
  const amountNeededForFreeINR = freeShippingEnabled && thresholdINR !== null ? Math.max(0, thresholdINR - cartSubtotalINR) : 0;
  let resolvedRateINR;
  let source;
  if (typeof customShippingFeeINR === "number" && Number.isFinite(customShippingFeeINR) && customShippingFeeINR > 0) {
    resolvedRateINR = Math.round(customShippingFeeINR);
    source = "LIVE_CARRIER";
  } else if (siteSettings?.internationalCountryShippingRates && typeof siteSettings.internationalCountryShippingRates[countryCode] === "number" && Number.isFinite(siteSettings.internationalCountryShippingRates[countryCode]) && siteSettings.internationalCountryShippingRates[countryCode] > 0) {
    resolvedRateINR = Math.round(siteSettings.internationalCountryShippingRates[countryCode]);
    source = "ADMIN_COUNTRY_RATE";
  } else if (typeof siteSettings?.internationalDefaultShippingRateINR === "number" && Number.isFinite(siteSettings.internationalDefaultShippingRateINR) && siteSettings.internationalDefaultShippingRateINR > 0) {
    resolvedRateINR = Math.round(siteSettings.internationalDefaultShippingRateINR);
    source = "ADMIN_DEFAULT_RATE";
  } else {
    return {
      isIndia: false,
      countryCode,
      thresholdINR,
      shippingFeeINR: 0,
      isFree: false,
      amountNeededForFreeINR,
      standardRateINR: 0,
      courierLabel: "International Shipping Unavailable",
      estimatedDelivery: void 0,
      isDynamicQuote: false,
      serviceable: false,
      source: "UNSERVICEABLE"
    };
  }
  const standardRateINR = resolvedRateINR;
  const shippingFeeINR = isFree ? 0 : standardRateINR;
  const courierLabel = customCourierLabel || info.courierName;
  return {
    isIndia: false,
    countryCode,
    thresholdINR,
    shippingFeeINR,
    isFree,
    amountNeededForFreeINR,
    standardRateINR,
    courierLabel,
    estimatedDelivery: info.estimatedDays,
    isDynamicQuote: source === "LIVE_CARRIER",
    serviceable: true,
    source: isFree ? "ADMIN_INTERNATIONAL_FREE" : source
  };
}

// src/server/shiprocketService.ts
import_dotenv.default.config();
var tokenCache = null;
function getCredentials() {
  const email = process.env.SHIPROCKET_EMAIL || "";
  const password = process.env.SHIPROCKET_PASSWORD || "";
  return { email, password };
}
function isShiprocketConfigured() {
  const { email, password } = getCredentials();
  return Boolean(email && password);
}
async function getShiprocketToken() {
  if (!isShiprocketConfigured()) {
    throw new Error("Shiprocket not configured");
  }
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  const { email, password } = getCredentials();
  console.log("[Shiprocket] Authenticating with email:", email);
  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("[Shiprocket Auth Error]:", res.status, errText);
      throw new Error(`Shiprocket Auth failed (${res.status}): ${errText}`);
    }
    const data = await res.json();
    if (!data.token) {
      throw new Error(data.message || "No token returned from Shiprocket API");
    }
    tokenCache = {
      token: data.token,
      expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1e3
    };
    console.log("[Shiprocket] Authentication successful. Token cached.");
    return data.token;
  } catch (err) {
    console.error("[Shiprocket Auth Exception]:", err.message);
    throw err;
  }
}
async function shiprocketFetch(endpoint, options = {}) {
  const token = await getShiprocketToken();
  if (typeof endpoint !== "string") {
    throw new Error("Invalid Shiprocket endpoint: string required.");
  }
  const cleanEndpoint = endpoint.trim();
  if (cleanEndpoint.startsWith("http:") || cleanEndpoint.startsWith("https:") || cleanEndpoint.startsWith("//") || cleanEndpoint.startsWith("file:") || cleanEndpoint.startsWith("ftp:") || !cleanEndpoint.startsWith("/")) {
    throw new Error(`Invalid Shiprocket endpoint '${cleanEndpoint}': relative path starting with '/' required.`);
  }
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers || {}
  };
  const url = `https://apiv2.shiprocket.in/v1/external${cleanEndpoint}`;
  let res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    console.warn("[Shiprocket] Received 401/403. Refreshing token and retrying...");
    tokenCache = null;
    const newToken = await getShiprocketToken();
    headers["Authorization"] = `Bearer ${newToken}`;
    res = await fetch(url, { ...options, headers });
  }
  const responseText = await res.text();
  let json;
  try {
    json = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Invalid JSON response from Shiprocket (${res.status}): ${responseText}`);
  }
  if (!res.ok) {
    const isServiceabilityQuery = cleanEndpoint.includes("serviceability");
    const isClientOrServiceabilityNotice = res.status === 400 || res.status === 404 || res.status === 422;
    if (options.suppressErrorLog || isServiceabilityQuery && isClientOrServiceabilityNotice) {
      const err2 = new Error(
        json?.message || (typeof json?.errors === "string" ? json.errors : JSON.stringify(json?.errors)) || `Shiprocket response HTTP ${res.status}`
      );
      err2.status = res.status;
      err2.data = json;
      throw err2;
    }
    console.error(`[Shiprocket Error ${res.status}] ${url}:`, json);
    const err = new Error(
      json?.message || (typeof json?.errors === "string" ? json.errors : JSON.stringify(json?.errors)) || `Shiprocket API error HTTP ${res.status}`
    );
    err.status = res.status;
    err.data = json;
    throw err;
  }
  return json;
}
async function checkServiceability(params) {
  const pickupPincode = params.pickupPincode || "560001";
  const deliveryPincode = params.deliveryPincode;
  const weight = params.weightInKg || 0.5;
  const cod = params.cod ? 1 : 0;
  console.log(`[Shiprocket] Checking serviceability from ${pickupPincode} to ${deliveryPincode}, weight: ${weight}kg, COD: ${cod}`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        serviceable: false,
        pincode: deliveryPincode,
        availableCouriers: [],
        message: "Shiprocket not configured"
      };
    }
    return {
      success: true,
      simulated: true,
      serviceable: true,
      pincode: deliveryPincode,
      availableCouriers: [
        { courier_name: "Delhivery Surface", courier_company_id: 1, rate: 85, etd: "3-5 Days", cod_available: true },
        { courier_name: "Bluedart Express", courier_company_id: 2, rate: 120, etd: "1-2 Days", cod_available: true },
        { courier_name: "Ekart Logistics", courier_company_id: 3, rate: 75, etd: "4-6 Days", cod_available: true }
      ]
    };
  }
  try {
    const endpoint = `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod}`;
    const data = await shiprocketFetch(endpoint, { method: "GET", suppressErrorLog: true });
    const available = data?.data?.available_courier_companies || [];
    return {
      success: true,
      simulated: false,
      serviceable: available.length > 0,
      pincode: deliveryPincode,
      availableCouriers: available.map((c) => ({
        courier_company_id: c.courier_company_id,
        courier_name: c.courier_name,
        rate: c.rate,
        etd: c.etd,
        cod_available: Boolean(c.cod)
      }))
    };
  } catch (err) {
    return {
      success: true,
      simulated: false,
      serviceable: false,
      pincode: deliveryPincode,
      message: err?.message || "Pincode is not currently serviceable by courier partners.",
      availableCouriers: []
    };
  }
}
async function estimateShippingRate(params) {
  const isIntl = Boolean(
    params.isInternational || params.country && !isIndiaCountry(params.country) || params.countryCode && !isIndiaCountry(params.countryCode)
  );
  if (isIntl) {
    const countryCode = normalizeCountryCode(params.countryCode || params.country);
    const info = getDestinationCourierInfo(countryCode);
    if (isShiprocketConfigured()) {
      try {
        if (params.weightInKg === void 0 || params.weightInKg === null || typeof params.weightInKg !== "number" || !Number.isFinite(params.weightInKg) || params.weightInKg <= 0) {
          throw new Error("International live carrier quote requires positive shipping weight (> 0 kg).");
        }
        const pickupPincode = params.pickupPincode && String(params.pickupPincode).trim() || params.siteSettings?.shiprocketPickupPincode && String(params.siteSettings.shiprocketPickupPincode).trim() || "560001";
        const weight = params.weightInKg;
        const countryParam = encodeURIComponent(countryCode);
        const hasValidPostal = params.deliveryPincode && params.deliveryPincode.trim() !== "" && params.deliveryPincode.trim() !== "00000";
        const postalQuery = hasValidPostal ? `&delivery_postcode=${encodeURIComponent(params.deliveryPincode.trim())}` : "";
        let dimQuery = "";
        if (typeof params.length === "number" && Number.isFinite(params.length) && params.length > 0 && typeof params.breadth === "number" && Number.isFinite(params.breadth) && params.breadth > 0 && typeof params.height === "number" && Number.isFinite(params.height) && params.height > 0) {
          dimQuery = `&length=${encodeURIComponent(params.length)}&breadth=${encodeURIComponent(params.breadth)}&height=${encodeURIComponent(params.height)}`;
        }
        const endpoint = `/courier/international/serviceability?pickup_postcode=${pickupPincode}&delivery_country=${countryParam}${postalQuery}&weight=${weight}&cod=0${dimQuery}`;
        console.log("[Shiprocket International Quote Request]", {
          endpoint,
          pickupPincode,
          countryCode,
          deliveryPincode: params.deliveryPincode || null,
          weightInKg: weight,
          length: params.length ?? null,
          breadth: params.breadth ?? null,
          height: params.height ?? null
        });
        const data = await shiprocketFetch(endpoint, { method: "GET" });
        const available = data?.data?.available_courier_companies || data?.available_couriers || [];
        if (Array.isArray(available) && available.length > 0) {
          const validCouriers = available.filter((c) => Number.isFinite(Number(c.rate)) && Number(c.rate) > 0);
          if (validCouriers.length > 0) {
            const sorted = [...validCouriers].sort((a, b) => Number(a.rate) - Number(b.rate));
            const best = sorted[0];
            const estimatedRate = Math.round(Number(best.rate));
            return {
              success: true,
              isInternational: true,
              serviceable: true,
              codAllowed: false,
              estimatedRateINR: estimatedRate,
              estimatedDays: best.etd || info.estimatedDays,
              courierName: best.courier_name || info.courierName,
              availableCouriers: validCouriers.map((c) => ({
                courier_company_id: c.courier_company_id,
                courier_name: c.courier_name,
                rate: Math.round(Number(c.rate)),
                etd: c.etd || info.estimatedDays,
                cod_available: false
              })),
              source: "LIVE_CARRIER"
            };
          }
        }
      } catch (err) {
        console.error(
          "[Shiprocket International Quote Error]",
          err?.message || err,
          err?.status ? `(HTTP Status: ${err.status})` : "",
          err?.data ? JSON.stringify(err.data) : ""
        );
      }
    }
    let rateINR;
    let source;
    if (params.siteSettings?.internationalCountryShippingRates && typeof params.siteSettings.internationalCountryShippingRates[countryCode] === "number" && Number.isFinite(params.siteSettings.internationalCountryShippingRates[countryCode]) && params.siteSettings.internationalCountryShippingRates[countryCode] > 0) {
      rateINR = Math.round(params.siteSettings.internationalCountryShippingRates[countryCode]);
      source = "ADMIN_COUNTRY_RATE";
    } else if (typeof params.siteSettings?.internationalDefaultShippingRateINR === "number" && Number.isFinite(params.siteSettings.internationalDefaultShippingRateINR) && params.siteSettings.internationalDefaultShippingRateINR > 0) {
      rateINR = Math.round(params.siteSettings.internationalDefaultShippingRateINR);
      source = "ADMIN_DEFAULT_RATE";
    } else {
      return {
        success: false,
        isInternational: true,
        serviceable: false,
        codAllowed: false,
        estimatedRateINR: 0,
        estimatedDays: void 0,
        courierName: void 0,
        availableCouriers: [],
        source: "UNSERVICEABLE",
        message: "Shipping is currently unavailable to this destination. Please contact HAKKIVEDA support."
      };
    }
    return {
      success: true,
      isInternational: true,
      serviceable: true,
      codAllowed: false,
      estimatedRateINR: rateINR,
      estimatedDays: info.estimatedDays,
      courierName: info.courierName,
      availableCouriers: [
        {
          courier_name: info.courierName,
          rate: rateINR,
          etd: info.estimatedDays,
          cod_available: false
        }
      ],
      source
    };
  }
  const domesticPickupPincode = params.pickupPincode && String(params.pickupPincode).trim() || params.siteSettings?.shiprocketPickupPincode && String(params.siteSettings.shiprocketPickupPincode).trim() || "560001";
  const result = await checkServiceability({
    pickupPincode: domesticPickupPincode,
    deliveryPincode: params.deliveryPincode,
    weightInKg: params.weightInKg,
    cod: params.cod
  });
  if (!result.serviceable || result.availableCouriers.length === 0) {
    return {
      success: false,
      serviceable: false,
      message: "Pincode is not currently serviceable by courier partners."
    };
  }
  const lowestCostCourier = [...result.availableCouriers].sort((a, b) => a.rate - b.rate)[0];
  return {
    success: true,
    isInternational: false,
    serviceable: true,
    codAllowed: true,
    estimatedRateINR: lowestCostCourier.rate,
    estimatedDays: lowestCostCourier.etd,
    courierName: lowestCostCourier.courier_name,
    availableCouriers: result.availableCouriers,
    source: "SHIPROCKET_DOMESTIC"
  };
}
async function createShiprocketOrder(order) {
  const isIntl = order.customer?.country && !isIndiaCountry(order.customer.country);
  console.log(`[Shiprocket] Creating shipment for order ${order.orderNumber || order.id} (Intl: ${isIntl})`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Shiprocket not configured"
      };
    }
    const mockShiprocketId = Math.floor(1e7 + Math.random() * 9e7);
    const mockShipmentId = Math.floor(2e7 + Math.random() * 9e7);
    return {
      success: true,
      simulated: true,
      shiprocketOrderId: mockShiprocketId,
      shipmentId: mockShipmentId,
      awbCode: null,
      courierName: null,
      trackingUrl: null,
      shipmentStatus: "NEW",
      message: "Order shipment created successfully (Simulation Mode)."
    };
  }
  const orderDateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
  const paymentMethod = order.paymentMethod === "COD" && !isIntl ? "COD" : "Prepaid";
  const itemsList = order.items || [];
  if (isIntl) {
    if (!itemsList.length) {
      return {
        success: false,
        error: "International shipment weight is missing for one or more products."
      };
    }
    for (const item of itemsList) {
      const prod = item.product || {};
      const rawWeight = typeof prod.shippingWeightKg === "number" && Number.isFinite(prod.shippingWeightKg) && prod.shippingWeightKg > 0 ? prod.shippingWeightKg : typeof prod.weightInKg === "number" && Number.isFinite(prod.weightInKg) && prod.weightInKg > 0 ? prod.weightInKg : typeof item.weightInKg === "number" && Number.isFinite(item.weightInKg) && item.weightInKg > 0 ? item.weightInKg : void 0;
      if (rawWeight === void 0 || rawWeight === null || typeof rawWeight !== "number" || !Number.isFinite(rawWeight) || rawWeight <= 0) {
        return {
          success: false,
          error: "International shipment weight is missing for one or more products."
        };
      }
    }
  }
  let rawLength = order.packageDimensions?.length ?? order.dimensions?.length ?? order.length ?? order.packageDefaults?.defaultLengthCm;
  let rawBreadth = order.packageDimensions?.breadth ?? order.packageDimensions?.width ?? order.dimensions?.breadth ?? order.dimensions?.width ?? order.breadth ?? order.width ?? order.packageDefaults?.defaultWidthCm;
  let rawHeight = order.packageDimensions?.height ?? order.dimensions?.height ?? order.height ?? order.packageDefaults?.defaultHeightCm;
  if (rawLength == null || rawBreadth == null || rawHeight == null) {
    const validLengths = [];
    const validBreadths = [];
    let totalHeight = 0;
    let allHaveDimensions = itemsList.length > 0;
    for (const item of itemsList) {
      const prod = item.product || {};
      const l = typeof prod.shippingLengthCm === "number" && Number.isFinite(prod.shippingLengthCm) && prod.shippingLengthCm > 0 ? prod.shippingLengthCm : void 0;
      const b = typeof prod.shippingBreadthCm === "number" && Number.isFinite(prod.shippingBreadthCm) && prod.shippingBreadthCm > 0 ? prod.shippingBreadthCm : void 0;
      const h = typeof prod.shippingHeightCm === "number" && Number.isFinite(prod.shippingHeightCm) && prod.shippingHeightCm > 0 ? prod.shippingHeightCm : void 0;
      const qty = Math.max(1, Number(item.quantity) || 1);
      if (l !== void 0 && b !== void 0 && h !== void 0) {
        validLengths.push(l);
        validBreadths.push(b);
        totalHeight += h * qty;
      } else {
        allHaveDimensions = false;
      }
    }
    if (allHaveDimensions && itemsList.length > 0) {
      if (rawLength == null) rawLength = Math.max(...validLengths);
      if (rawBreadth == null) rawBreadth = Math.max(...validBreadths);
      if (rawHeight == null) rawHeight = totalHeight;
    }
  }
  const hasValidDimensions = typeof rawLength === "number" && Number.isFinite(rawLength) && rawLength > 0 && typeof rawBreadth === "number" && Number.isFinite(rawBreadth) && rawBreadth > 0 && typeof rawHeight === "number" && Number.isFinite(rawHeight) && rawHeight > 0;
  if (isIntl && !hasValidDimensions) {
    return {
      success: false,
      error: "International shipment package dimensions (length, breadth, height) are required but missing."
    };
  }
  const parcelLength = hasValidDimensions ? Number(rawLength) : 15;
  const parcelBreadth = hasValidDimensions ? Number(rawBreadth) : 12;
  const parcelHeight = hasValidDimensions ? Number(rawHeight) : 10;
  let calculatedSubtotal = 0;
  let totalShipmentWeight = 0;
  const orderItems = itemsList.map((item, index) => {
    const prod = item.product || {};
    const itemName = String(prod.name || item.name || item.title || `HakkiVeda Product ${index + 1}`).trim() || `HakkiVeda Product ${index + 1}`;
    const itemSku = String(prod.sku || prod.id || item.sku || item.productId || item.id || `HKV-SKU-${index + 1}`).trim();
    const itemUnits = Math.max(1, Number(item.quantity) || 1);
    const resolvedPrice = Number(item.unitPriceINR ?? prod.priceINR ?? item.priceINR ?? item.price ?? 0);
    const itemPrice = Number.isFinite(resolvedPrice) && resolvedPrice > 0 ? resolvedPrice : Number(item.totalPriceINR) > 0 ? Math.round(Number(item.totalPriceINR) / itemUnits) : 1;
    const rawWeight = typeof prod.shippingWeightKg === "number" && Number.isFinite(prod.shippingWeightKg) && prod.shippingWeightKg > 0 ? prod.shippingWeightKg : typeof prod.weightInKg === "number" && Number.isFinite(prod.weightInKg) && prod.weightInKg > 0 ? prod.weightInKg : item.weightInKg;
    const itemWeight = isIntl ? Number(rawWeight) : Number(rawWeight ?? 0.5);
    calculatedSubtotal += itemPrice * itemUnits;
    totalShipmentWeight += itemWeight * itemUnits;
    return {
      name: itemName,
      sku: itemSku,
      units: itemUnits,
      selling_price: itemPrice,
      discount: 0,
      tax: 0
    };
  });
  const finalWeight = isIntl ? Math.round(totalShipmentWeight * 100) / 100 : Math.max(0.5, Math.round(totalShipmentWeight * 100) / 100);
  const merchandiseSubtotal = typeof order.subtotalINR === "number" && Number.isFinite(order.subtotalINR) && order.subtotalINR > 0 ? order.subtotalINR : calculatedSubtotal > 0 ? calculatedSubtotal : order.totalAmountINR || 0;
  const payload = {
    order_id: order.orderNumber || order.id,
    order_date: orderDateStr,
    pickup_location: "Primary",
    comment: "Hakkiveda Tribal Ayurvedic Order",
    billing_customer_name: order.customer?.name || "Valued Customer",
    billing_last_name: "",
    billing_address: order.customer?.address || "Main Road",
    billing_city: order.customer?.city || "Bengaluru",
    billing_pincode: order.customer?.pincode || (isIntl ? "00000" : "560001"),
    billing_state: order.customer?.state || (isIntl ? "International" : "Karnataka"),
    billing_country: order.customer?.country || (isIntl ? "International" : "India"),
    billing_email: order.customer?.email || "customer@hakkiveda.com",
    billing_phone: order.customer?.phone || "9999999999",
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: paymentMethod,
    shipping_charges: Math.max(0, Number(order.shippingFeeINR ?? order.shippingChargesINR ?? 0)),
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: Math.max(0, Number(order.discountAmountINR ?? order.discountINR ?? 0)),
    sub_total: merchandiseSubtotal,
    length: parcelLength,
    breadth: parcelBreadth,
    height: parcelHeight,
    weight: finalWeight
  };
  const response = await shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const awb = response.awb_code ? String(response.awb_code).trim() : null;
  const courier = response.courier_name ? String(response.courier_name).trim() : null;
  return {
    success: true,
    simulated: false,
    shiprocketOrderId: response.order_id,
    shipmentId: response.shipment_id,
    awbCode: awb,
    courierName: courier,
    trackingUrl: awb ? `https://shiprocket.co/tracking/${awb}` : null,
    shipmentStatus: response.status || "NEW",
    raw: response
  };
}
async function generateAwb(shipmentId, courierId) {
  console.log(`[Shiprocket] Generating AWB for shipmentId: ${shipmentId}, courierId: ${courierId || "auto"}`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Shiprocket not configured"
      };
    }
    const mockAwb = `HKV${Math.floor(1e9 + Math.random() * 9e9)}`;
    return {
      success: true,
      simulated: true,
      awbCode: mockAwb,
      courierName: "Delhivery Surface",
      trackingUrl: `https://shiprocket.co/tracking/${mockAwb}`,
      status: "AWB_GENERATED"
    };
  }
  const payload = { shipment_id: shipmentId };
  if (courierId) payload.courier_id = courierId;
  const response = await shiprocketFetch("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const awbData = response?.response?.data || response?.data || response;
  const awbCode = awbData?.awb_code || response?.awb_code || null;
  const awbAssignStatus = response?.awb_assign_status ?? (awbCode ? 1 : 0);
  if (!awbCode || awbAssignStatus === 0) {
    const errorMsg = awbData?.awb_assign_error || response?.message || response?.errors || "Shiprocket could not assign an AWB. Please verify courier serviceability or recharge your Shiprocket wallet balance.";
    return {
      success: false,
      simulated: false,
      error: typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
    };
  }
  const cleanAwb = String(awbCode).trim();
  const assignedCourier = awbData.courier_name ? String(awbData.courier_name).trim() : response?.courier_name ? String(response.courier_name).trim() : null;
  return {
    success: true,
    simulated: false,
    awbCode: cleanAwb,
    courierName: assignedCourier,
    shipmentId: awbData.shipment_id || shipmentId,
    trackingUrl: `https://shiprocket.co/tracking/${cleanAwb}`,
    status: "AWB_GENERATED"
  };
}
async function schedulePickup(shipmentId) {
  console.log(`[Shiprocket] Scheduling pickup for shipmentId: ${shipmentId}`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Shiprocket not configured"
      };
    }
    const tomorrow = new Date(Date.now() + 864e5).toISOString().split("T")[0];
    return {
      success: true,
      simulated: true,
      pickupScheduledDate: tomorrow,
      message: `Pickup scheduled successfully for ${tomorrow} (Simulation Mode)`
    };
  }
  try {
    const payload = { shipment_id: [Number(shipmentId)] };
    const response = await shiprocketFetch("/courier/generate/pickup", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const pickupScheduledDate = response?.response?.pickup_scheduled_date || response?.pickup_scheduled_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const message = response?.response?.message || response?.message || "Pickup scheduled successfully with courier.";
    return {
      success: true,
      simulated: false,
      pickupStatus: response?.pickup_status || 1,
      pickupScheduledDate,
      message
    };
  } catch (err) {
    const errText = (err?.message || "").toLowerCase();
    if (errText.includes("already scheduled") || errText.includes("already generated") || errText.includes("pickup scheduled") || errText.includes("in queue")) {
      return {
        success: true,
        simulated: false,
        pickupStatus: 1,
        pickupScheduledDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        message: "Pickup is already scheduled for this shipment."
      };
    }
    throw err;
  }
}
async function syncShiprocketOrder(shiprocketOrderId) {
  const rawId = String(shiprocketOrderId || "").trim();
  if (!rawId || !/^\d+$/.test(rawId)) {
    throw new Error("Invalid shiprocketOrderId: numeric identifier required.");
  }
  console.log(`[Shiprocket] Syncing real order state for shiprocketOrderId: ${rawId}`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Shiprocket not configured"
      };
    }
    return {
      success: true,
      simulated: true,
      shiprocketOrderId: rawId,
      status: "PROCESSING",
      message: "Shiprocket simulation mode active."
    };
  }
  try {
    const response = await shiprocketFetch(`/orders/show/${rawId}`, { method: "GET" });
    const orderData = response?.data || response;
    const shipments = orderData?.shipments || (orderData?.shipment_id ? [orderData] : []);
    const primaryShipment = Array.isArray(shipments) && shipments.length > 0 ? shipments[0] : orderData || {};
    const awbCode = primaryShipment.awb || primaryShipment.awb_code || null;
    const courierName = primaryShipment.courier_name || primaryShipment.courier || null;
    const shipmentId = primaryShipment.id || primaryShipment.shipment_id || null;
    const rawStatus = primaryShipment.status || orderData.status || "NEW";
    const pickupScheduledDate = primaryShipment.pickup_scheduled_date || null;
    const pickupStatus = primaryShipment.pickup_status || null;
    const trackingUrl = awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null;
    let normalizedStatus = "NEW";
    if (rawStatus === "CANCELED" || rawStatus === "CANCELLED") normalizedStatus = "CANCELLED";
    else if (rawStatus === "DELIVERED") normalizedStatus = "DELIVERED";
    else if (rawStatus === "IN TRANSIT" || rawStatus === "IN_TRANSIT" || rawStatus === "OUT FOR DELIVERY") normalizedStatus = "IN_TRANSIT";
    else if (pickupStatus === 1 || rawStatus === "PICKED UP" || rawStatus === "PICKUP SCHEDULED") normalizedStatus = "PICKUP_SCHEDULED";
    else if (awbCode) normalizedStatus = "AWB_GENERATED";
    else if (shipmentId) normalizedStatus = "NEW";
    return {
      success: true,
      simulated: false,
      shiprocketOrderId: rawId,
      shipmentId,
      awbCode,
      courierName,
      shipmentStatus: normalizedStatus,
      rawStatus,
      pickupScheduledDate,
      pickupStatus,
      trackingUrl,
      raw: orderData
    };
  } catch (err) {
    console.error(`[Shiprocket Sync Error for ${rawId}]:`, err?.message || err);
    throw err;
  }
}
async function trackShipment(identifier) {
  if (identifier === null || identifier === void 0) {
    throw new Error("Tracking identifier is required");
  }
  const rawId = String(identifier).trim();
  if (!rawId || rawId.length > 100 || /[\x00-\x1F\x7F]/.test(rawId)) {
    throw new Error("Invalid tracking identifier format.");
  }
  if (rawId.includes("/") || rawId.includes("\\") || rawId.includes("://") || rawId.includes("?") || rawId.includes("#")) {
    throw new Error("Invalid tracking identifier format.");
  }
  const encodedId = encodeURIComponent(rawId);
  console.log(`[Shiprocket] Tracking shipment/AWB: ${encodedId}`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Shiprocket not configured",
        scans: []
      };
    }
    return {
      success: true,
      simulated: true,
      trackingNumber: rawId,
      shipmentStatus: "IN_TRANSIT",
      currentLocation: "Bengaluru Logistics Hub",
      expectedDelivery: "In 2 Business Days",
      courierName: "Delhivery Surface",
      trackingUrl: `https://shiprocket.co/tracking/${encodedId}`,
      scans: [
        { date: (/* @__PURE__ */ new Date()).toISOString(), activity: "Package Picked Up from HakkiPikki Herbal Facility", location: "Bengaluru" },
        { date: (/* @__PURE__ */ new Date()).toISOString(), activity: "In Transit to Destination Hub", location: "Bengaluru Hub" }
      ]
    };
  }
  let endpoint = `/courier/track/awb/${encodedId}`;
  let response;
  try {
    response = await shiprocketFetch(endpoint, { method: "GET" });
  } catch (err) {
    endpoint = `/courier/track/shipment/${encodedId}`;
    response = await shiprocketFetch(endpoint, { method: "GET" });
  }
  const trackData = response?.tracking_data || response;
  const currentStatus = trackData?.shipment_track?.[0]?.current_status || trackData?.track_status || "IN_TRANSIT";
  const trackCourier = trackData?.courier_name ? String(trackData.courier_name).trim() : null;
  return {
    success: true,
    simulated: false,
    trackingNumber: rawId,
    shipmentStatus: currentStatus,
    courierName: trackCourier,
    trackingUrl: trackData?.track_url || `https://shiprocket.co/tracking/${encodedId}`,
    scans: trackData?.shipment_track || [],
    raw: trackData
  };
}
async function downloadLabel(shipmentId) {
  const rawId = String(shipmentId || "").trim();
  if (!rawId || rawId.length > 50 || !/^\d+$/.test(rawId)) {
    throw new Error("Invalid shipmentId: numeric identifier required.");
  }
  console.log(`[Shiprocket] Generating label for shipmentId: ${rawId}`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Shiprocket not configured"
      };
    }
    return {
      success: true,
      simulated: true,
      labelUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      message: "Label generated (Simulation Mode)"
    };
  }
  const payload = { shipment_id: [Number(rawId)] };
  const response = await shiprocketFetch("/courier/generate/label", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const labelUrl = response?.label_url || response?.response?.label_url;
  if (!labelUrl) {
    return {
      success: false,
      error: "Shipping label URL not available from Shiprocket."
    };
  }
  return {
    success: true,
    simulated: false,
    labelUrl
  };
}
async function downloadInvoice(shiprocketOrderId) {
  const rawId = String(shiprocketOrderId || "").trim();
  if (!rawId || rawId.length > 50 || !/^\d+$/.test(rawId)) {
    throw new Error("Invalid orderId: numeric identifier required.");
  }
  console.log(`[Shiprocket] Generating invoice for orderId: ${rawId}`);
  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Shiprocket not configured"
      };
    }
    return {
      success: true,
      simulated: true,
      invoiceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      message: "Invoice generated (Simulation Mode)"
    };
  }
  const payload = { ids: [Number(rawId)] };
  const response = await shiprocketFetch("/orders/print/invoice", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const invoiceUrl = response?.invoice_url || response?.response?.invoice_url;
  if (!invoiceUrl) {
    return {
      success: false,
      error: "Invoice URL not available from Shiprocket."
    };
  }
  return {
    success: true,
    simulated: false,
    invoiceUrl
  };
}

// src/utils/productUtils.ts
var normalizeCountryCode2 = (countryCodeOrName) => {
  if (!countryCodeOrName) return "IN";
  const val = countryCodeOrName.trim().toUpperCase();
  if (val === "IN" || val === "INDIA" || val === "IND") return "IN";
  if (val === "US" || val === "USA" || val === "UNITED STATES" || val === "UNITED STATES OF AMERICA") return "US";
  if (val === "GB" || val === "UK" || val === "UNITED KINGDOM" || val === "GREAT BRITAIN") return "GB";
  if (val === "AE" || val === "UAE" || val === "UNITED ARAB EMIRATES" || val === "DUBAI") return "AE";
  if (val === "SA" || val === "KSA" || val === "SAUDI ARABIA") return "SA";
  if (val === "SG" || val === "SINGAPORE") return "SG";
  if (val === "MY" || val === "MALAYSIA") return "MY";
  if (val === "MU" || val === "MAURITIUS") return "MU";
  if (val === "FJ" || val === "FIJI") return "FJ";
  if (val === "NP" || val === "NEPAL") return "NP";
  if (val === "CA" || val === "CANADA") return "CA";
  if (val === "AU" || val === "AUSTRALIA") return "AU";
  if (val === "NZ" || val === "NEW ZEALAND") return "NZ";
  if (val === "DE" || val === "GERMANY") return "DE";
  if (val === "FR" || val === "FRANCE") return "FR";
  return val.length === 2 ? val : val.slice(0, 2);
};
var isIndiaDestination = (countryCodeOrName) => {
  if (!countryCodeOrName) return true;
  const norm = normalizeCountryCode2(countryCodeOrName);
  const lower = countryCodeOrName.trim().toLowerCase();
  return norm === "IN" || lower === "india" || lower === "in";
};
var isProductAvailableForCountry = (product, countryCodeOrName) => {
  if (!product) {
    return { available: false, reason: "Product not found." };
  }
  if (isIndiaDestination(countryCodeOrName)) {
    if (product.status === "ARCHIVED" || product.status === "DRAFT") {
      return { available: false, reason: "Product is currently unavailable." };
    }
    return { available: true };
  }
  if (product.internationalEnabled === false) {
    return {
      available: false,
      reason: "This herbal formulation is currently not available for international dispatch."
    };
  }
  const destinationIso = normalizeCountryCode2(countryCodeOrName);
  const destinationRaw = (countryCodeOrName || "").trim().toUpperCase();
  if (Array.isArray(product.internationalAllowedCountries) && product.internationalAllowedCountries.length > 0) {
    const allowedList = product.internationalAllowedCountries.map((c) => c.trim().toUpperCase());
    const isAllowed = allowedList.includes(destinationIso) || allowedList.includes(destinationRaw) || allowedList.includes("ALL") || allowedList.includes("*");
    if (!isAllowed) {
      return {
        available: false,
        reason: `This formulation is not permitted for shipping to ${countryCodeOrName || "your destination"}.`
      };
    }
  }
  if (Array.isArray(product.internationalBlockedCountries) && product.internationalBlockedCountries.length > 0) {
    const blockedList = product.internationalBlockedCountries.map((c) => c.trim().toUpperCase());
    const isBlocked = blockedList.includes(destinationIso) || blockedList.includes(destinationRaw);
    if (isBlocked) {
      return {
        available: false,
        reason: `International delivery of this item to ${countryCodeOrName || "your destination"} is currently restricted.`
      };
    }
  }
  return { available: true };
};
var getProductPriceINRForCountry = (product, countryCodeOrName) => {
  if (!product) return 0;
  const basePrice = Number(product.priceINR) || 0;
  if (isIndiaDestination(countryCodeOrName)) {
    return basePrice;
  }
  const mode = product.internationalPricingMode || "SAME_AS_INDIA";
  if (mode === "FIXED_INR") {
    if (product.internationalPriceINR && product.internationalPriceINR > 0) {
      return Math.round(Number(product.internationalPriceINR));
    }
    return basePrice;
  }
  if (mode === "MARKUP_PERCENT") {
    const markupPct = Number(product.internationalMarkupPercent) || 0;
    if (markupPct > 0) {
      return Math.round(basePrice * (1 + markupPct / 100));
    }
    return basePrice;
  }
  return basePrice;
};

// server.ts
var import_razorpay = __toESM(require("razorpay"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
import_dotenv2.default.config();
var CheckoutValidationError = class _CheckoutValidationError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.name = "CheckoutValidationError";
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, _CheckoutValidationError.prototype);
  }
};
var ADMIN_TOKEN_COOKIE = "hakkiveda_admin_token";
var CUSTOMER_TOKEN_COOKIE = "hakkiveda_customer_token";
var uploadDir = process.env.UPLOAD_DIR || import_path2.default.join(process.cwd(), "uploads");
if (!import_fs2.default.existsSync(uploadDir)) {
  import_fs2.default.mkdirSync(uploadDir, { recursive: true });
}
var ALLOWED_IMAGE_MIMES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"]
};
var ALLOWED_VIDEO_MIMES = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"]
};
var ALLOWED_MIMES = {
  ...ALLOWED_IMAGE_MIMES,
  ...ALLOWED_VIDEO_MIMES
};
var DANGEROUS_EXT_REGEX = /\.(html|htm|svg|php|phtml|exe|sh|bash|js|jsx|ts|tsx|bat|cmd|vbs|cgi|pl|py|jar|war|bin|jsp|asp|aspx)$/i;
var storage = import_multer.default.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeUUID = import_crypto.default.randomUUID();
    const rawExt = import_path2.default.extname(file.originalname).toLowerCase();
    const validExts = ALLOWED_MIMES[file.mimetype] || [];
    const safeExt = validExts.includes(rawExt) ? rawExt : validExts[0] || ".jpg";
    cb(null, `upload-${safeUUID}${safeExt}`);
  }
});
var upload = (0, import_multer.default)({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    // 100MB outer limit for high-resolution video
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    const rawExt = import_path2.default.extname(file.originalname).toLowerCase();
    if (file.originalname.includes("\0") || file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\")) {
      return cb(new Error("Invalid characters in filename."));
    }
    if (DANGEROUS_EXT_REGEX.test(file.originalname) || DANGEROUS_EXT_REGEX.test(rawExt)) {
      return cb(new Error("Dangerous or unsupported file extension detected."));
    }
    const validExts = ALLOWED_MIMES[file.mimetype];
    if (!validExts || !validExts.includes(rawExt)) {
      return cb(
        new Error(
          "Unsupported file format or extension mismatch. Allowed formats: JPG, PNG, WEBP, GIF, MP4, WEBM."
        )
      );
    }
    cb(null, true);
  }
});
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.set("trust proxy", 1);
  await getDb();
  app.use((0, import_compression.default)());
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
    }
    const frameAncestorsDirective = isProduction ? "frame-ancestors 'self'" : "frame-ancestors 'self' https://aistudio.google.com https://*.aistudio.google.com https://ai.studio";
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
      frameAncestorsDirective,
      "form-action 'self'"
    ];
    res.setHeader("Content-Security-Policy", cspDirectives.join("; "));
    next();
  });
  app.use((0, import_cookie_parser.default)());
  app.use(
    import_express.default.json({
      limit: "1mb",
      verify: (req, _res, buf) => {
        if (req.originalUrl === "/api/webhooks/razorpay" || req.path === "/api/webhooks/razorpay") {
          req.rawBody = Buffer.from(buf);
        }
      }
    })
  );
  app.use(import_express.default.urlencoded({ limit: "1mb", extended: true }));
  function isAllowedOrigin(originStr, req) {
    if (!originStr || typeof originStr !== "string") return false;
    const isProduction = process.env.NODE_ENV === "production";
    const productionTrustedOrigins = [
      "https://hakkiveda.com",
      "https://www.hakkiveda.com"
    ];
    const normalized = originStr.toLowerCase().trim();
    if (productionTrustedOrigins.includes(normalized)) {
      return true;
    }
    if (req) {
      const forwardedHost = req.headers["x-forwarded-host"]?.split(",")[0]?.toLowerCase()?.trim();
      if (forwardedHost && (normalized === `https://${forwardedHost}` || normalized === `http://${forwardedHost}`)) {
        return true;
      }
      if (req.headers.host) {
        const host = req.headers.host.toLowerCase().trim();
        if (normalized === `https://${host}` || normalized === `http://${host}`) {
          return true;
        }
      }
    }
    try {
      const u = new URL(originStr);
      const hn = u.hostname.toLowerCase();
      if (hn === "localhost" || hn === "127.0.0.1" || hn.endsWith(".run.app") || hn.endsWith(".google.com") || hn.endsWith(".ai.studio") || hn.endsWith(".aistudio.google.com") || hn.endsWith(".web.app") || hn.endsWith(".firebaseapp.com")) {
        return true;
      }
    } catch {
    }
    const devTrustedOrigins = [
      ...productionTrustedOrigins,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "https://aistudio.google.com",
      "https://ai.studio"
    ];
    if (!isProduction && devTrustedOrigins.includes(normalized)) {
      return true;
    }
    return false;
  }
  function validateOriginOrReferer(req, res, next) {
    const method = req.method.toUpperCase();
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
    if (!isMutation) {
      return next();
    }
    const originHeader = req.headers.origin;
    const refererHeader = req.headers.referer;
    if (typeof originHeader === "string" && originHeader.trim()) {
      if (!isAllowedOrigin(originHeader.trim(), req)) {
        return res.status(403).json({
          success: false,
          error: "Request origin is not allowed."
        });
      }
      return next();
    }
    if (typeof refererHeader === "string" && refererHeader.trim()) {
      try {
        const parsedUrl = new URL(refererHeader.trim());
        if (!isAllowedOrigin(parsedUrl.origin, req)) {
          return res.status(403).json({
            success: false,
            error: "Request origin is not allowed."
          });
        }
      } catch {
        return res.status(403).json({
          success: false,
          error: "Request origin is not allowed."
        });
      }
      return next();
    }
    const hasCookieAuth = Boolean(
      req.cookies?.[ADMIN_TOKEN_COOKIE] || req.cookies?.[CUSTOMER_TOKEN_COOKIE] || req.headers.cookie && (req.headers.cookie.includes(ADMIN_TOKEN_COOKIE) || req.headers.cookie.includes(CUSTOMER_TOKEN_COOKIE))
    );
    if (hasCookieAuth) {
      return res.status(403).json({
        success: false,
        error: "Request origin is not allowed."
      });
    }
    next();
  }
  app.use(validateOriginOrReferer);
  function resolveAdminSessionSecret() {
    const isProduction = process.env.NODE_ENV === "production";
    const providedSecret = process.env.ADMIN_SESSION_SECRET?.trim();
    if (isProduction) {
      if (!providedSecret) {
        throw new Error(
          "[Security Configuration Error] ADMIN_SESSION_SECRET environment variable must be configured in production."
        );
      }
      if (providedSecret.length < 32) {
        throw new Error(
          "[Security Configuration Error] ADMIN_SESSION_SECRET in production must be at least 32 characters long (prefer a 64-character hex string)."
        );
      }
      const isWeakRepeated = /^(.)\1+$/.test(providedSecret);
      const isTriviallySimple = [
        "12345678901234567890123456789012",
        "abcdefghijklmnopqrstuvwxyz123456",
        "00000000000000000000000000000000"
      ].includes(providedSecret.toLowerCase());
      if (isWeakRepeated || isTriviallySimple) {
        throw new Error(
          "[Security Configuration Error] ADMIN_SESSION_SECRET is too weak. Please provide a high-entropy secret."
        );
      }
      return providedSecret;
    }
    if (providedSecret && providedSecret.length >= 16) {
      return providedSecret;
    }
    console.warn("[Security] ADMIN_SESSION_SECRET not set. Using ephemeral in-memory development admin session secret.");
    return import_crypto.default.randomBytes(32).toString("hex");
  }
  const ADMIN_SESSION_SECRET = resolveAdminSessionSecret();
  const ADMIN_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1e3;
  function getSafeSessionVersion(account) {
    if (account && typeof account.sessionVersion === "number" && Number.isInteger(account.sessionVersion) && account.sessionVersion >= 0) {
      return account.sessionVersion;
    }
    return 0;
  }
  function createAdminToken(email, sessionVersion = 0) {
    const now = Date.now();
    const payload = {
      email: email.toLowerCase(),
      role: "admin",
      iat: now,
      exp: now + ADMIN_TOKEN_EXPIRY_MS,
      sessionVersion: typeof sessionVersion === "number" && Number.isInteger(sessionVersion) && sessionVersion >= 0 ? sessionVersion : 0
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = import_crypto.default.createHmac("sha256", ADMIN_SESSION_SECRET).update(payloadB64).digest("base64url");
    return `${payloadB64}.${signature}`;
  }
  function verifyAdminToken(token) {
    try {
      if (!token || typeof token !== "string") return null;
      const parts = token.split(".");
      if (parts.length !== 2) return null;
      const [payloadB64, signature] = parts;
      if (!payloadB64 || !signature) return null;
      const expectedSignature = import_crypto.default.createHmac("sha256", ADMIN_SESSION_SECRET).update(payloadB64).digest("base64url");
      const expectedBuf = Buffer.from(expectedSignature);
      const actualBuf = Buffer.from(signature);
      if (actualBuf.length !== expectedBuf.length || !import_crypto.default.timingSafeEqual(actualBuf, expectedBuf)) {
        return null;
      }
      const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
      if (!payload || payload.role !== "admin" || !payload.exp || Date.now() > payload.exp) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
  async function requireAdmin(req, res, next) {
    try {
      let token = req.cookies?.[ADMIN_TOKEN_COOKIE];
      if (!token && req.headers.cookie) {
        const match = req.headers.cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_TOKEN_COOKIE}=([^;]+)`));
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }
      if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.slice(7).trim();
        }
      }
      if (!token && typeof req.headers["x-admin-token"] === "string") {
        token = req.headers["x-admin-token"];
      }
      if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized: Admin session required." });
      }
      const payload = verifyAdminToken(token);
      if (!payload) {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid or expired admin session." });
      }
      const adminAccount = await getAdminAccountFromDb();
      const currentVersion = getSafeSessionVersion(adminAccount);
      const tokenVersion = getSafeSessionVersion(payload);
      if (tokenVersion !== currentVersion) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Admin session revoked. Please log in again."
        });
      }
      req.admin = payload;
      req.adminAccount = adminAccount;
      next();
    } catch (err) {
      console.error("[requireAdmin Error]:", err?.message || err);
      return res.status(500).json({ success: false, error: "Admin session verification error." });
    }
  }
  async function requireAdminForPrivateKey(req, res, next) {
    const key = req.params.key;
    if (!isSafeStoreKey(key)) {
      return res.status(400).json({ success: false, error: "Invalid or forbidden store key." });
    }
    if (PUBLIC_STORE_ALLOWLIST.includes(key.trim())) {
      return next();
    }
    return requireAdmin(req, res, next);
  }
  function resolveCustomerSessionSecret() {
    const isProduction = process.env.NODE_ENV === "production";
    const providedSecret = (process.env.CUSTOMER_SESSION_SECRET || process.env.SESSION_SECRET)?.trim();
    if (isProduction) {
      if (!providedSecret) {
        throw new Error(
          "[Security Configuration Error] CUSTOMER_SESSION_SECRET environment variable must be configured in production."
        );
      }
      if (providedSecret.length < 32) {
        throw new Error(
          "[Security Configuration Error] CUSTOMER_SESSION_SECRET in production must be at least 32 characters long (prefer a 64-character hex string)."
        );
      }
      const trivialSecrets = [
        "default",
        "secret",
        "password",
        "12345678",
        "customer_session_secret",
        "replace_this_with_a_secure_secret",
        "hakkiveda_customer_secret_key_2026",
        "12345678901234567890123456789012",
        "abcdefghijklmnopqrstuvwxyz123456",
        "00000000000000000000000000000000"
      ];
      const isWeakRepeated = /^(.)\1+$/.test(providedSecret);
      if (trivialSecrets.includes(providedSecret.toLowerCase()) || isWeakRepeated) {
        throw new Error(
          "[Security Configuration Error] CUSTOMER_SESSION_SECRET is using a known trivial/insecure placeholder. Provide a high-entropy secret in production."
        );
      }
      return providedSecret;
    }
    if (providedSecret && providedSecret.length >= 16) {
      return providedSecret;
    }
    console.warn(
      "[Security] CUSTOMER_SESSION_SECRET not set. Using ephemeral in-memory development customer session secret."
    );
    return import_crypto.default.randomBytes(32).toString("hex");
  }
  const CUSTOMER_SESSION_SECRET = resolveCustomerSessionSecret();
  const CUSTOMER_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1e3;
  function createCustomerToken(customerId, email, sessionVersion = 0) {
    const now = Date.now();
    const payload = {
      id: customerId,
      email: email.toLowerCase().trim(),
      role: "customer",
      iat: now,
      exp: now + CUSTOMER_TOKEN_EXPIRY_MS,
      sessionVersion: typeof sessionVersion === "number" && Number.isInteger(sessionVersion) && sessionVersion >= 0 ? sessionVersion : 0
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = import_crypto.default.createHmac("sha256", CUSTOMER_SESSION_SECRET).update(payloadB64).digest("base64url");
    return `${payloadB64}.${signature}`;
  }
  function verifyCustomerToken(token) {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    if (!payloadB64 || !signature) return null;
    try {
      const expectedSignature = import_crypto.default.createHmac("sha256", CUSTOMER_SESSION_SECRET).update(payloadB64).digest("base64url");
      const expectedBuf = Buffer.from(expectedSignature);
      const actualBuf = Buffer.from(signature);
      if (expectedBuf.length !== actualBuf.length || !import_crypto.default.timingSafeEqual(expectedBuf, actualBuf)) {
        return null;
      }
      const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
      const payload = JSON.parse(payloadJson);
      if (payload.role !== "customer" || typeof payload.id !== "string" || typeof payload.email !== "string") {
        return null;
      }
      if (Date.now() > payload.exp) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
  function generateSecureTempPassword() {
    const bytes = import_crypto.default.randomBytes(8);
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let result = "HKV-";
    for (let i = 0; i < 8; i++) {
      result += chars[bytes[i] % chars.length];
      if (i === 3) result += "-";
    }
    return result;
  }
  function sanitizeCustomer(customer) {
    if (!customer) return null;
    const { passwordBcrypt, ...safe } = customer;
    return {
      id: safe.id,
      name: safe.name || "",
      email: safe.email || "",
      phone: safe.phone || "",
      avatar: safe.avatar || "",
      addresses: Array.isArray(safe.addresses) ? safe.addresses : [],
      savedPayments: Array.isArray(safe.savedPayments) ? safe.savedPayments : [],
      isAdmin: false,
      status: safe.status || "ACTIVE",
      createdAt: safe.createdAt || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      lastLogin: safe.lastLogin || "",
      loyaltyPoints: typeof safe.loyaltyPoints === "number" ? safe.loyaltyPoints : 100,
      referralCode: safe.referralCode || `HAKKI-${(safe.name || "USER").split(" ")[0].toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
      mustChangePassword: Boolean(safe.mustChangePassword),
      preferences: safe.preferences || {
        country: "India",
        currency: "INR",
        language: "English",
        emailOrders: true,
        whatsappUpdates: true,
        promotional: true
      }
    };
  }
  async function requireCustomer(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      let token = req.cookies?.[CUSTOMER_TOKEN_COOKIE];
      if (!token && req.headers.cookie) {
        const match = req.headers.cookie.match(new RegExp(`(?:^|;\\s*)${CUSTOMER_TOKEN_COOKIE}=([^;]+)`));
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }
      if (!token && authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
      if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized: Customer session required." });
      }
      const payload = verifyCustomerToken(token);
      if (!payload) {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid or expired customer session." });
      }
      const customers = await getStoreValue("customer_accounts") || [];
      const customer = customers.find(
        (c) => c.id && c.id === payload.id || c.email && c.email.toLowerCase() === payload.email.toLowerCase()
      );
      if (!customer) {
        return res.status(401).json({ success: false, error: "Customer account not found." });
      }
      if (customer.status === "BLOCKED") {
        return res.status(403).json({
          success: false,
          error: "Your account has been restricted by administration. Please contact support@hakkiveda.com"
        });
      }
      const currentVersion = getSafeSessionVersion(customer);
      const tokenVersion = getSafeSessionVersion(payload);
      if (tokenVersion !== currentVersion) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Customer session revoked. Please sign in again."
        });
      }
      req.customer = customer;
      req.customerPayload = payload;
      next();
    } catch (err) {
      console.error("[requireCustomer Error]:", err?.message || err);
      return res.status(500).json({ success: false, error: "Customer session verification error." });
    }
  }
  const MAX_GENERIC_RATE_LIMIT_MAP_SIZE = 2e4;
  const MAX_LOGIN_RATE_LIMIT_MAP_SIZE = 1e4;
  const RATE_LIMIT_CLEANUP_INTERVAL_MS = 10 * 60 * 1e3;
  const failedCustomerLoginAttempts = /* @__PURE__ */ new Map();
  const customerRegisterAttempts = /* @__PURE__ */ new Map();
  const forgotPasswordAttempts = /* @__PURE__ */ new Map();
  const adminUploadAttempts = /* @__PURE__ */ new Map();
  const paymentEndpointAttempts = /* @__PURE__ */ new Map();
  const aiEndpointAttempts = /* @__PURE__ */ new Map();
  const failedLoginAttempts = /* @__PURE__ */ new Map();
  function normalizeRateLimitKey(key, maxLength = 128) {
    if (typeof key !== "string") {
      return "unknown-key";
    }
    const clean = key.trim().toLowerCase();
    return clean.length > maxLength ? clean.slice(0, maxLength) : clean;
  }
  function getClientIp(req) {
    let ip = req.ip;
    if (!ip && req.headers["x-forwarded-for"]) {
      const xff = req.headers["x-forwarded-for"];
      if (typeof xff === "string") {
        ip = xff.split(",")[0].trim();
      } else if (Array.isArray(xff) && xff[0]) {
        ip = xff[0].split(",")[0].trim();
      }
    }
    if (!ip && req.socket?.remoteAddress) {
      ip = req.socket.remoteAddress;
    }
    return normalizeRateLimitKey(ip || "unknown-ip", 64);
  }
  function enforceMapSizeLimit(map, maxSize, isExpired) {
    if (map.size <= maxSize) return;
    for (const [k, v] of map.entries()) {
      try {
        if (isExpired(v, k)) {
          map.delete(k);
        }
      } catch {
        map.delete(k);
      }
    }
    if (map.size > maxSize) {
      const excess = map.size - maxSize;
      let count = 0;
      for (const key of map.keys()) {
        map.delete(key);
        count++;
        if (count >= excess) break;
      }
    }
  }
  function checkGenericRateLimit(map, key, maxRequests, windowMs, maxMapSize = MAX_GENERIC_RATE_LIMIT_MAP_SIZE) {
    const normKey = normalizeRateLimitKey(key);
    const now = Date.now();
    const record = map.get(normKey);
    if (!record || !Number.isFinite(record.resetTime) || now > record.resetTime) {
      enforceMapSizeLimit(
        map,
        maxMapSize,
        (val) => !val || !Number.isFinite(val.resetTime) || now > val.resetTime
      );
      map.set(normKey, { count: 1, resetTime: now + windowMs });
      return { allowed: true };
    }
    if (record.count >= maxRequests) {
      const remainingSeconds = Math.ceil((record.resetTime - now) / 1e3);
      return { allowed: false, remainingSeconds };
    }
    record.count += 1;
    return { allowed: true };
  }
  function checkCustomerLoginRateLimit(ip) {
    const normIp = normalizeRateLimitKey(ip, 64);
    const now = Date.now();
    const record = failedCustomerLoginAttempts.get(normIp);
    if (!record || !Number.isFinite(record.blockedUntil)) return { allowed: true };
    if (record.blockedUntil > now) {
      const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1e3);
      return { allowed: false, remainingSeconds };
    }
    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      failedCustomerLoginAttempts.delete(normIp);
    }
    return { allowed: true };
  }
  function recordFailedCustomerLogin(ip) {
    const normIp = normalizeRateLimitKey(ip, 64);
    const now = Date.now();
    const record = failedCustomerLoginAttempts.get(normIp) || { failedAttempts: 0, blockedUntil: 0, lastAttemptTime: now };
    record.failedAttempts = (typeof record.failedAttempts === "number" ? record.failedAttempts : 0) + 1;
    record.lastAttemptTime = now;
    if (record.failedAttempts >= 10) {
      record.blockedUntil = now + 15 * 60 * 1e3;
    }
    enforceMapSizeLimit(
      failedCustomerLoginAttempts,
      MAX_LOGIN_RATE_LIMIT_MAP_SIZE,
      (val) => !val || !Number.isFinite(val.blockedUntil) || val.blockedUntil > 0 && val.blockedUntil <= now
    );
    failedCustomerLoginAttempts.set(normIp, record);
  }
  function recordSuccessfulCustomerLogin(ip) {
    const normIp = normalizeRateLimitKey(ip, 64);
    failedCustomerLoginAttempts.delete(normIp);
  }
  function checkCustomerRegisterRateLimit(ip) {
    const res = checkGenericRateLimit(customerRegisterAttempts, ip, 5, 3600 * 1e3);
    return res.allowed;
  }
  function checkForgotPasswordRateLimit(key) {
    const res = checkGenericRateLimit(forgotPasswordAttempts, key, 5, 3600 * 1e3);
    return res.allowed;
  }
  function checkUploadRateLimit(key) {
    const res = checkGenericRateLimit(adminUploadAttempts, key, 30, 15 * 60 * 1e3);
    return res.allowed;
  }
  function checkPaymentRateLimit(ip) {
    const res = checkGenericRateLimit(paymentEndpointAttempts, ip, 30, 15 * 60 * 1e3);
    return res.allowed;
  }
  function checkAiRateLimit(ip) {
    const res = checkGenericRateLimit(aiEndpointAttempts, ip, 30, 15 * 60 * 1e3);
    return res.allowed;
  }
  function checkAdminLoginRateLimit(ip) {
    const normIp = normalizeRateLimitKey(ip, 64);
    const now = Date.now();
    const record = failedLoginAttempts.get(normIp);
    if (!record || !Number.isFinite(record.blockedUntil)) return { allowed: true };
    if (record.blockedUntil > now) {
      const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1e3);
      return { allowed: false, remainingSeconds };
    }
    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      failedLoginAttempts.delete(normIp);
    }
    return { allowed: true };
  }
  function recordFailedAdminLogin(ip) {
    const normIp = normalizeRateLimitKey(ip, 64);
    const now = Date.now();
    const record = failedLoginAttempts.get(normIp) || { failedAttempts: 0, blockedUntil: 0, lastAttemptTime: now };
    record.failedAttempts = (typeof record.failedAttempts === "number" ? record.failedAttempts : 0) + 1;
    record.lastAttemptTime = now;
    if (record.failedAttempts >= 5) {
      record.blockedUntil = now + 15 * 60 * 1e3;
    }
    enforceMapSizeLimit(
      failedLoginAttempts,
      MAX_LOGIN_RATE_LIMIT_MAP_SIZE,
      (val) => !val || !Number.isFinite(val.blockedUntil) || val.blockedUntil > 0 && val.blockedUntil <= now
    );
    failedLoginAttempts.set(normIp, record);
  }
  function recordSuccessfulAdminLogin(ip) {
    const normIp = normalizeRateLimitKey(ip, 64);
    failedLoginAttempts.delete(normIp);
  }
  function runRateLimitCleanup() {
    const now = Date.now();
    try {
      const genericMaps = [
        customerRegisterAttempts,
        forgotPasswordAttempts,
        adminUploadAttempts,
        paymentEndpointAttempts,
        aiEndpointAttempts
      ];
      for (const map of genericMaps) {
        try {
          for (const [key, record] of map.entries()) {
            if (!record || !Number.isFinite(record.resetTime) || now > record.resetTime) {
              map.delete(key);
            }
          }
        } catch (mapErr) {
          console.error("[Rate Limit Cleanup Error in Generic Map]:", mapErr?.message || mapErr);
        }
      }
      const loginMaps = [failedCustomerLoginAttempts, failedLoginAttempts];
      for (const map of loginMaps) {
        try {
          for (const [key, record] of map.entries()) {
            if (!record || !Number.isFinite(record.blockedUntil)) {
              map.delete(key);
            } else if (record.blockedUntil > 0 && record.blockedUntil <= now) {
              map.delete(key);
            } else if (record.blockedUntil === 0 && record.lastAttemptTime && now - record.lastAttemptTime > 15 * 60 * 1e3) {
              map.delete(key);
            }
          }
        } catch (mapErr) {
          console.error("[Rate Limit Cleanup Error in Login Map]:", mapErr?.message || mapErr);
        }
      }
    } catch (outerErr) {
      console.error("[Rate Limit Cleanup Fatal Error]:", outerErr?.message || outerErr);
    }
  }
  const rateLimitCleanupTimer = setInterval(runRateLimitCleanup, RATE_LIMIT_CLEANUP_INTERVAL_MS);
  if (typeof rateLimitCleanupTimer.unref === "function") {
    rateLimitCleanupTimer.unref();
  }
  async function getAdminAccountFromDb() {
    const existing = await getStoreValue("admin_account");
    const defaultAdminEmail = (process.env.ADMIN_EMAIL || "hakkiveda@gmail.com").toLowerCase();
    if (existing && existing.passwordBcrypt && typeof existing.passwordBcrypt === "string") {
      return {
        email: (existing.email || defaultAdminEmail).toLowerCase(),
        passwordBcrypt: existing.passwordBcrypt,
        sessionVersion: getSafeSessionVersion(existing)
      };
    }
    if (process.env.ADMIN_PASSWORD_HASH) {
      const account2 = {
        email: defaultAdminEmail,
        passwordBcrypt: process.env.ADMIN_PASSWORD_HASH,
        sessionVersion: 0
      };
      await setStoreValue("admin_account", account2);
      return account2;
    }
    const initialPlainPassword = process.env.ADMIN_PASSWORD || "Kamal@2026";
    const bcryptHash = await import_bcryptjs.default.hash(initialPlainPassword, 10);
    const account = {
      email: defaultAdminEmail,
      passwordBcrypt: bcryptHash,
      sessionVersion: 0
    };
    await setStoreValue("admin_account", account);
    return account;
  }
  app.use(
    "/uploads",
    import_express.default.static(uploadDir, {
      maxAge: "30d",
      dotfiles: "deny",
      setHeaders: (res) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
      }
    })
  );
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(`User-agent: *
Allow: /

Disallow: /admin
Disallow: /api/private
Disallow: /temp
Disallow: /uploads/private

Sitemap: https://hakkiveda.com/sitemap.xml`);
  });
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const siteUrl = "https://hakkiveda.com";
      const products = await getStoreValue("products") || [];
      const blogs = await getStoreValue("blogs") || [];
      const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const staticPages = [
        { url: `${siteUrl}/`, priority: "1.0", changefreq: "daily", lastmod: today },
        { url: `${siteUrl}/hair-care`, priority: "0.9", changefreq: "weekly", lastmod: today },
        { url: `${siteUrl}/skin-care`, priority: "0.8", changefreq: "weekly", lastmod: today },
        { url: `${siteUrl}/tribal-wellness`, priority: "0.8", changefreq: "weekly", lastmod: today },
        { url: `${siteUrl}/our-story`, priority: "0.8", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/our-tribal-roots`, priority: "0.8", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/how-hakkiveda-is-made`, priority: "0.8", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/b2b-enquiry`, priority: "0.7", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/video-rituals`, priority: "0.7", changefreq: "weekly", lastmod: today },
        { url: `${siteUrl}/journal`, priority: "0.8", changefreq: "daily", lastmod: today },
        { url: `${siteUrl}/privacy-policy`, priority: "0.6", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/terms-and-conditions`, priority: "0.6", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/shipping-policy`, priority: "0.7", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/refund-policy`, priority: "0.6", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/cancellation-policy`, priority: "0.6", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/disclaimer`, priority: "0.6", changefreq: "monthly", lastmod: today },
        { url: `${siteUrl}/contact`, priority: "0.7", changefreq: "monthly", lastmod: today }
      ];
      const productUrls = products.map((p) => ({
        url: `${siteUrl}/products/${p.slug || slugify(p.name || String(p.id))}`,
        priority: "0.9",
        changefreq: "weekly",
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split("T")[0] : today
      }));
      const blogUrls = blogs.map((b) => ({
        url: `${siteUrl}/journal/${b.slug || slugify(b.title || String(b.id))}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: b.updatedAt ? new Date(b.updatedAt).toISOString().split("T")[0] : b.createdAt ? new Date(b.createdAt).toISOString().split("T")[0] : today
      }));
      const allUrls = [...staticPages, ...productUrls, ...blogUrls];
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      for (const item of allUrls) {
        xml += `  <url>
`;
        xml += `    <loc>${item.url}</loc>
`;
        if (item.lastmod) {
          xml += `    <lastmod>${item.lastmod}</lastmod>
`;
        }
        xml += `    <changefreq>${item.changefreq}</changefreq>
`;
        xml += `    <priority>${item.priority}</priority>
`;
        xml += `  </url>
`;
      }
      xml += `</urlset>`;
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (err) {
      console.error("Sitemap error:", err);
      res.status(500).send("Error generating sitemap");
    }
  });
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.post("/api/admin/login", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const rateCheck = checkAdminLoginRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: `Too many failed login attempts. Please try again in ${Math.ceil(
            (rateCheck.remainingSeconds || 900) / 60
          )} minutes.`
        });
      }
      const { email, password } = req.body;
      if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ success: false, error: "Invalid email or password." });
      }
      const adminAccount = await getAdminAccountFromDb();
      const isEmailMatch = email.trim().toLowerCase() === adminAccount.email.toLowerCase();
      let isPasswordMatch = false;
      if (isEmailMatch) {
        isPasswordMatch = await import_bcryptjs.default.compare(password, adminAccount.passwordBcrypt);
      }
      if (!isEmailMatch || !isPasswordMatch) {
        recordFailedAdminLogin(clientIp);
        return res.status(401).json({ success: false, error: "Invalid email or password." });
      }
      recordSuccessfulAdminLogin(clientIp);
      const adminSessionVersion = getSafeSessionVersion(adminAccount);
      const token = createAdminToken(adminAccount.email, adminSessionVersion);
      res.cookie(ADMIN_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ADMIN_TOKEN_EXPIRY_MS,
        path: "/"
      });
      res.json({
        success: true,
        message: "Admin authentication successful.",
        admin: { email: adminAccount.email, role: "admin" },
        token
      });
    } catch (err) {
      console.error("[Admin Login Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to process admin login." });
    }
  });
  app.get("/api/admin/me", requireAdmin, (req, res) => {
    const admin = req.admin;
    res.json({
      success: true,
      admin: {
        email: admin.email,
        role: "admin"
      }
    });
  });
  app.post("/api/admin/logout", async (_req, res) => {
    try {
      const adminAccount = await getAdminAccountFromDb();
      const newSessionVersion = getSafeSessionVersion(adminAccount) + 1;
      const updatedAccount = {
        ...adminAccount,
        sessionVersion: newSessionVersion
      };
      await setStoreValue("admin_account", updatedAccount);
    } catch (err) {
      console.error("[Admin Logout Revocation Error]:", err?.message || err);
    }
    res.clearCookie(ADMIN_TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });
    res.json({ success: true, message: "Logged out successfully." });
  });
  app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword || typeof oldPassword !== "string" || typeof newPassword !== "string") {
        return res.status(400).json({ success: false, error: "Both current and new passwords are required." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: "New password must be at least 6 characters long." });
      }
      const adminAccount = await getAdminAccountFromDb();
      const isCurrentMatch = await import_bcryptjs.default.compare(oldPassword, adminAccount.passwordBcrypt);
      if (!isCurrentMatch) {
        return res.status(401).json({ success: false, error: "Current password does not match." });
      }
      const newBcryptHash = await import_bcryptjs.default.hash(newPassword, 10);
      const newSessionVersion = getSafeSessionVersion(adminAccount) + 1;
      const updatedAccount = {
        email: adminAccount.email,
        passwordBcrypt: newBcryptHash,
        sessionVersion: newSessionVersion
      };
      await setStoreValue("admin_account", updatedAccount);
      const freshToken = createAdminToken(updatedAccount.email, newSessionVersion);
      res.cookie(ADMIN_TOKEN_COOKIE, freshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ADMIN_TOKEN_EXPIRY_MS,
        path: "/"
      });
      res.json({
        success: true,
        message: "Master password updated successfully.",
        token: freshToken
      });
    } catch (err) {
      console.error("[Admin Change Password Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to update master password." });
    }
  });
  app.post("/api/auth/register", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      if (!checkCustomerRegisterRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: "Too many account creation attempts. Please try again in an hour."
        });
      }
      const { name, firstName, lastName, email, phone, password } = req.body;
      const computedName = (name || `${firstName || ""} ${lastName || ""}`).trim();
      if (!computedName) {
        return res.status(400).json({ success: false, error: "Full name is required." });
      }
      if (!email || typeof email !== "string") {
        return res.status(400).json({ success: false, error: "Valid email address is required." });
      }
      const normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ success: false, error: "Please enter a valid email format." });
      }
      if (!password || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ success: false, error: "Password must be at least 6 characters long." });
      }
      const customers = await getStoreValue("customer_accounts") || [];
      const existing = customers.find((c) => c.email && c.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: "An account with this email already exists. Please Sign In."
        });
      }
      const passwordBcrypt = await import_bcryptjs.default.hash(password, 10);
      const customerId = `usr-${Date.now()}`;
      const nameParts = computedName.split(" ");
      const referralCode = `HAKKI-${(nameParts[0] || "USER").toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;
      const newCustomer = {
        id: customerId,
        name: computedName,
        email: normalizedEmail,
        phone: (phone || "").trim(),
        avatar: "",
        passwordBcrypt,
        sessionVersion: 0,
        addresses: [],
        savedPayments: [],
        isAdmin: false,
        status: "ACTIVE",
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        lastLogin: (/* @__PURE__ */ new Date()).toLocaleString() + " IST",
        loyaltyPoints: 100,
        referralCode,
        preferences: {
          country: "India",
          currency: "INR",
          language: "English",
          emailOrders: true,
          whatsappUpdates: true,
          promotional: true
        },
        loginHistory: [
          {
            id: `log-${Date.now()}`,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleString() + " IST",
            ipLocation: "Web Session",
            device: "Web Browser"
          }
        ]
      };
      const updatedCustomers = [newCustomer, ...customers];
      await setStoreValue("customer_accounts", updatedCustomers);
      const token = createCustomerToken(customerId, normalizedEmail, 0);
      res.cookie(CUSTOMER_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: CUSTOMER_TOKEN_EXPIRY_MS,
        path: "/"
      });
      res.status(201).json({
        success: true,
        message: "Account created successfully! 100 Welcome Points awarded.",
        customer: sanitizeCustomer(newCustomer),
        token
      });
    } catch (err) {
      console.error("[Customer Register Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to create customer account." });
    }
  });
  app.post("/api/auth/login", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const rateCheck = checkCustomerLoginRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: `Too many failed login attempts. Please try again in ${Math.ceil(
            (rateCheck.remainingSeconds || 900) / 60
          )} minutes.`
        });
      }
      const { email, password } = req.body;
      if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        return res.status(400).json({ success: false, error: "Email and password are required." });
      }
      const normalizedEmail = email.trim().toLowerCase();
      const customers = await getStoreValue("customer_accounts") || [];
      const customerIndex = customers.findIndex(
        (c) => c.email && c.email.toLowerCase() === normalizedEmail
      );
      if (customerIndex === -1) {
        recordFailedCustomerLogin(clientIp);
        return res.status(401).json({ success: false, error: "Invalid email or password." });
      }
      const customer = customers[customerIndex];
      if (customer.status === "BLOCKED") {
        return res.status(403).json({
          success: false,
          error: "Your account has been restricted by administration. Please contact support@hakkiveda.com"
        });
      }
      if (!customer.passwordBcrypt) {
        return res.status(403).json({
          success: false,
          error: "Your account requires password setup. Please contact HAKKIVEDA support to secure your account."
        });
      }
      const isPasswordMatch = await import_bcryptjs.default.compare(password, customer.passwordBcrypt);
      if (!isPasswordMatch) {
        recordFailedCustomerLogin(clientIp);
        return res.status(401).json({ success: false, error: "Invalid email or password." });
      }
      recordSuccessfulCustomerLogin(clientIp);
      customer.lastLogin = (/* @__PURE__ */ new Date()).toLocaleString() + " IST";
      customer.loginHistory = [
        {
          id: `log-${Date.now()}`,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleString() + " IST",
          ipLocation: "Web Session",
          device: req.headers["user-agent"]?.slice(0, 80) || "Web Browser"
        },
        ...Array.isArray(customer.loginHistory) ? customer.loginHistory.slice(0, 19) : []
      ];
      customers[customerIndex] = customer;
      await setStoreValue("customer_accounts", customers);
      const customerSessionVersion = getSafeSessionVersion(customer);
      const token = createCustomerToken(customer.id, customer.email, customerSessionVersion);
      res.cookie(CUSTOMER_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: CUSTOMER_TOKEN_EXPIRY_MS,
        path: "/"
      });
      res.json({
        success: true,
        message: `Welcome back, ${customer.name}!`,
        customer: sanitizeCustomer(customer),
        token
      });
    } catch (err) {
      console.error("[Customer Login Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to process login." });
    }
  });
  app.get("/api/auth/me", requireCustomer, (req, res) => {
    const customer = req.customer;
    res.json({
      success: true,
      customer: sanitizeCustomer(customer)
    });
  });
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let token = req.cookies?.[CUSTOMER_TOKEN_COOKIE];
      if (!token && req.headers.cookie) {
        const match = req.headers.cookie.match(new RegExp(`(?:^|;\\s*)${CUSTOMER_TOKEN_COOKIE}=([^;]+)`));
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }
      if (!token && authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
      if (token) {
        const payload = verifyCustomerToken(token);
        if (payload) {
          const customers = await getStoreValue("customer_accounts") || [];
          const customerIndex = customers.findIndex(
            (c) => c.id && c.id === payload.id || c.email && c.email.toLowerCase() === payload.email.toLowerCase()
          );
          if (customerIndex !== -1) {
            const customer = customers[customerIndex];
            customer.sessionVersion = getSafeSessionVersion(customer) + 1;
            customers[customerIndex] = customer;
            await setStoreValue("customer_accounts", customers);
          }
        }
      }
    } catch (err) {
      console.error("[Customer Logout Revocation Error]:", err?.message || err);
    }
    res.clearCookie(CUSTOMER_TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });
    res.json({ success: true, message: "Logged out successfully." });
  });
  app.post("/api/admin/customers/:id/set-password", requireAdmin, async (req, res) => {
    try {
      const customerId = req.params.id;
      const { newPassword, generateRandom } = req.body;
      let passwordToSet = typeof newPassword === "string" ? newPassword.trim() : "";
      if (generateRandom || !passwordToSet) {
        passwordToSet = generateSecureTempPassword();
      }
      if (passwordToSet.length < 6) {
        return res.status(400).json({ success: false, error: "Password must be at least 6 characters long." });
      }
      const customers = await getStoreValue("customer_accounts") || [];
      const customerIndex = customers.findIndex((c) => c.id === customerId);
      if (customerIndex === -1) {
        return res.status(404).json({ success: false, error: "Customer account not found." });
      }
      const customer = customers[customerIndex];
      const passwordBcrypt = await import_bcryptjs.default.hash(passwordToSet, 10);
      customer.passwordBcrypt = passwordBcrypt;
      customer.mustChangePassword = true;
      customer.sessionVersion = getSafeSessionVersion(customer) + 1;
      customer.lastPasswordReset = (/* @__PURE__ */ new Date()).toLocaleString() + " IST";
      customers[customerIndex] = customer;
      await setStoreValue("customer_accounts", customers);
      res.json({
        success: true,
        message: `Secure temporary password established for customer ${customer.name}.`,
        temporaryPassword: passwordToSet
      });
    } catch (err) {
      console.error("[Admin Customer Password Reset Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to establish customer password." });
    }
  });
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ success: false, error: "Email address is required." });
      }
      const normalizedEmail = email.trim().toLowerCase();
      if (!checkForgotPasswordRateLimit(clientIp) || !checkForgotPasswordRateLimit(`email:${normalizedEmail}`)) {
        return res.status(429).json({
          success: false,
          error: "Too many password reset requests. Please try again in an hour."
        });
      }
      const customers = await getStoreValue("customer_accounts") || [];
      const customer = customers.find((c) => c.email && c.email.toLowerCase() === normalizedEmail);
      if (customer) {
        console.log(`[Security] Password reset requested for registered customer: ${normalizedEmail}`);
      }
      res.json({
        success: true,
        message: `If an account exists for ${normalizedEmail}, our customer care concierge has been notified and will assist you with access recovery.`
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to process request." });
    }
  });
  app.get("/api/customer/profile", requireCustomer, (req, res) => {
    const customer = req.customer;
    res.json({
      success: true,
      customer: sanitizeCustomer(customer)
    });
  });
  app.put("/api/customer/profile", requireCustomer, async (req, res) => {
    try {
      const currentCustomer = req.customer;
      const customers = await getStoreValue("customer_accounts") || [];
      const customerIndex = customers.findIndex((c) => c.id === currentCustomer.id);
      if (customerIndex === -1) {
        return res.status(404).json({ success: false, error: "Customer account not found." });
      }
      const { name, phone, avatar, addresses, preferences, savedPayments } = req.body;
      const customer = customers[customerIndex];
      if (name && typeof name === "string") customer.name = name.trim();
      if (phone !== void 0) customer.phone = String(phone).trim();
      if (avatar && typeof avatar === "string") customer.avatar = avatar;
      if (Array.isArray(addresses)) customer.addresses = addresses;
      if (Array.isArray(savedPayments)) customer.savedPayments = savedPayments;
      if (preferences && typeof preferences === "object") {
        customer.preferences = { ...customer.preferences, ...preferences };
      }
      customers[customerIndex] = customer;
      await setStoreValue("customer_accounts", customers);
      res.json({
        success: true,
        message: "Profile updated successfully.",
        customer: sanitizeCustomer(customer)
      });
    } catch (err) {
      console.error("[Customer Profile Update Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to update profile." });
    }
  });
  app.post("/api/customer/change-password", requireCustomer, async (req, res) => {
    try {
      const currentCustomer = req.customer;
      const { oldPassword, currentPassword, newPassword } = req.body;
      const passToVerify = currentPassword || oldPassword;
      if (!passToVerify || !newPassword || typeof newPassword !== "string") {
        return res.status(400).json({ success: false, error: "Current password and new password are required." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: "New password must be at least 6 characters long." });
      }
      const customers = await getStoreValue("customer_accounts") || [];
      const customerIndex = customers.findIndex((c) => c.id === currentCustomer.id);
      if (customerIndex === -1) {
        return res.status(404).json({ success: false, error: "Customer not found." });
      }
      const customer = customers[customerIndex];
      if (customer.passwordBcrypt) {
        const isMatch = await import_bcryptjs.default.compare(passToVerify, customer.passwordBcrypt);
        if (!isMatch) {
          return res.status(400).json({ success: false, error: "Current password is incorrect." });
        }
      }
      customer.passwordBcrypt = await import_bcryptjs.default.hash(newPassword, 10);
      customer.mustChangePassword = false;
      const newSessionVersion = getSafeSessionVersion(customer) + 1;
      customer.sessionVersion = newSessionVersion;
      customer.lastPasswordReset = (/* @__PURE__ */ new Date()).toLocaleString() + " IST";
      customers[customerIndex] = customer;
      await setStoreValue("customer_accounts", customers);
      const freshToken = createCustomerToken(customer.id, customer.email, newSessionVersion);
      res.cookie(CUSTOMER_TOKEN_COOKIE, freshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: CUSTOMER_TOKEN_EXPIRY_MS,
        path: "/"
      });
      res.json({
        success: true,
        message: "Password updated successfully.",
        customer: sanitizeCustomer(customer),
        token: freshToken
      });
    } catch (err) {
      console.error("[Customer Change Password Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to update password." });
    }
  });
  app.get("/api/customer/orders", requireCustomer, async (req, res) => {
    try {
      const customer = req.customer;
      const customerEmail = customer.email.toLowerCase().trim();
      const customerId = customer.id;
      const orders = await getStoreValue("orders") || [];
      const customerOrders = orders.filter((o) => {
        const orderEmail = (o.customer?.email || "").toLowerCase().trim();
        const orderCustomerId = o.customerId;
        return orderEmail === customerEmail || customerId && orderCustomerId === customerId;
      });
      res.json({
        success: true,
        orders: customerOrders
      });
    } catch (err) {
      console.error("[Customer Orders Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to retrieve orders." });
    }
  });
  app.get("/api/customer/orders/:id", requireCustomer, async (req, res) => {
    try {
      const customer = req.customer;
      const customerEmail = customer.email.toLowerCase().trim();
      const customerId = customer.id;
      const orderId = req.params.id;
      const orders = await getStoreValue("orders") || [];
      const order = orders.find(
        (o) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId)
      );
      if (!order) {
        return res.status(404).json({ success: false, error: "Order not found." });
      }
      const orderEmail = (order.customer?.email || "").toLowerCase().trim();
      const orderCustomerId = order.customerId;
      if (orderEmail !== customerEmail && (!customerId || orderCustomerId !== customerId)) {
        return res.status(403).json({
          success: false,
          error: "Access denied: You can only view orders placed by your account."
        });
      }
      res.json({
        success: true,
        order
      });
    } catch (err) {
      console.error("[Customer Order Details Error]:", err.message);
      res.status(500).json({ success: false, error: "Failed to retrieve order details." });
    }
  });
  app.get("/api/store/public", async (_req, res) => {
    try {
      const data = await getPublicStoreData();
      res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch public store data" });
    }
  });
  app.get("/api/store", requireAdmin, async (_req, res) => {
    try {
      const data = await getAllStoreData();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message || "Failed to fetch store data" });
    }
  });
  app.get("/api/store/:key", requireAdminForPrivateKey, async (req, res) => {
    try {
      const key = req.params.key;
      if (!isSafeStoreKey(key)) {
        return res.status(400).json({ success: false, error: "Invalid or forbidden store key." });
      }
      const data = await getStoreValue(key);
      res.json({ success: true, key: key.trim(), data, value: data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  const handleStoreKeySave = async (req, res) => {
    try {
      const key = req.params.key;
      if (!isSafeStoreKey(key)) {
        return res.status(400).json({ success: false, error: "Invalid or forbidden store key." });
      }
      const cleanKey = key.trim();
      const value = req.body.value !== void 0 ? req.body.value : req.body.data !== void 0 ? req.body.data : req.body;
      await setStoreValue(cleanKey, value);
      res.json({
        success: true,
        message: `Key '${cleanKey}' saved successfully.`,
        key: cleanKey,
        data: value,
        value
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  app.put("/api/store/:key", requireAdmin, handleStoreKeySave);
  app.post("/api/store/:key", requireAdmin, handleStoreKeySave);
  app.post("/api/store-bulk", requireAdmin, async (req, res) => {
    try {
      const payload = req.body.value !== void 0 ? req.body.value : req.body.data !== void 0 ? req.body.data : req.body;
      if (typeof payload === "object" && payload !== null) {
        for (const [k, v] of Object.entries(payload)) {
          if (!isSafeStoreKey(k)) {
            return res.status(400).json({ success: false, error: `Invalid or forbidden store key: '${k}'` });
          }
          await setStoreValue(k.trim(), v);
        }
      }
      res.json({ success: true, message: "Bulk store data saved." });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  const updateOrderShiprocketData = async (orderId, updates) => {
    const orders = await getStoreValue("orders") || [];
    const idx = orders.findIndex((o) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId));
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...updates };
      await setStoreValue("orders", orders);
      return orders[idx];
    }
    return null;
  };
  const createShiprocketOrderIfNeeded = async (orderInput) => {
    const targetId = typeof orderInput === "string" ? orderInput : orderInput?.id || orderInput?.orderNumber || orderInput?.orderId;
    if (!targetId) {
      return { success: false, error: "Order reference not provided for Shiprocket fulfillment" };
    }
    const orders = await getStoreValue("orders") || [];
    const latestOrder = orders.find(
      (o) => String(o.id) === String(targetId) || String(o.orderNumber) === String(targetId)
    );
    const orderToUse = latestOrder || (typeof orderInput === "object" ? orderInput : null);
    if (!orderToUse) {
      return { success: false, error: "Order not found in database store" };
    }
    if (orderToUse.shiprocketOrderId) {
      return {
        success: true,
        alreadyCreated: true,
        shiprocketOrderId: orderToUse.shiprocketOrderId,
        shipmentId: orderToUse.shipmentId,
        awbCode: orderToUse.awbCode || null,
        courierName: orderToUse.courierName || null,
        trackingUrl: orderToUse.trackingUrl || null,
        shipmentStatus: orderToUse.shipmentStatus || "NEW",
        fulfillmentStatus: orderToUse.fulfillmentStatus || "SHIPROCKET_CREATED",
        order: orderToUse
      };
    }
    try {
      const result = await createShiprocketOrder(orderToUse);
      if (result && result.success) {
        const hasRealAwb = Boolean(result.awbCode && typeof result.awbCode === "string" && result.awbCode.trim() !== "");
        const hasRealCourier = Boolean(result.courierName && typeof result.courierName === "string" && result.courierName.trim() !== "");
        const hasRealTrackingUrl = Boolean(result.trackingUrl && typeof result.trackingUrl === "string" && result.trackingUrl.trim() !== "");
        const updates = {
          shiprocketOrderId: result.shiprocketOrderId,
          shipmentId: result.shipmentId,
          shipmentStatus: result.shipmentStatus || "NEW",
          fulfillmentStatus: "SHIPROCKET_CREATED",
          trackingStatus: result.shipmentStatus || "NEW"
        };
        if (hasRealAwb) {
          updates.awbCode = result.awbCode;
          updates.trackingNumber = result.awbCode;
        }
        if (hasRealCourier) {
          updates.courierName = result.courierName;
        }
        if (hasRealTrackingUrl) {
          updates.trackingUrl = result.trackingUrl;
        }
        const updated = await updateOrderShiprocketData(orderToUse.id || targetId, updates);
        return {
          ...result,
          fulfillmentStatus: "SHIPROCKET_CREATED",
          order: updated || orderToUse
        };
      } else {
        const failureUpdates = {
          fulfillmentStatus: "FULFILLMENT_RETRY_REQUIRED",
          fulfillmentError: result?.error || "Shiprocket order creation failed"
        };
        await updateOrderShiprocketData(orderToUse.id || targetId, failureUpdates);
        return {
          success: false,
          error: result?.error || "Shiprocket order creation failed",
          fulfillmentStatus: "FULFILLMENT_RETRY_REQUIRED"
        };
      }
    } catch (err) {
      console.warn("[createShiprocketOrderIfNeeded Exception]:", err?.message || err);
      const failureUpdates = {
        fulfillmentStatus: "FULFILLMENT_RETRY_REQUIRED",
        fulfillmentError: err?.message || "Shiprocket service exception"
      };
      await updateOrderShiprocketData(orderToUse.id || targetId, failureUpdates);
      return {
        success: false,
        error: err?.message || "Shiprocket service exception",
        fulfillmentStatus: "FULFILLMENT_RETRY_REQUIRED"
      };
    }
  };
  app.get("/api/shiprocket/status", requireAdmin, (_req, res) => {
    res.json({
      success: true,
      configured: isShiprocketConfigured(),
      message: isShiprocketConfigured() ? "Shiprocket API credentials are configured." : "Shiprocket is running in Simulation Mode (add SHIPROCKET_EMAIL & SHIPROCKET_PASSWORD to .env to enable live API)."
    });
  });
  app.get("/api/shipping/address-lookup", async (req, res) => {
    try {
      const countryRaw = (req.query.country || req.query.countryCode || "").toString().trim();
      const postalCodeRaw = (req.query.postalCode || req.query.pincode || req.query.zip || "").toString().trim();
      if (!postalCodeRaw) {
        return res.status(400).json({
          success: false,
          error: "Postal code is required."
        });
      }
      let countryCode = countryRaw.toUpperCase();
      if (countryCode === "UNITED STATES" || countryCode === "USA" || countryCode === "US") countryCode = "US";
      else if (countryCode === "UNITED KINGDOM" || countryCode === "UK" || countryCode === "GB") countryCode = "GB";
      else if (countryCode === "INDIA" || countryCode === "IN") countryCode = "IN";
      else if (countryCode === "SINGAPORE" || countryCode === "SG") countryCode = "SG";
      else if (countryCode === "MALAYSIA" || countryCode === "MY") countryCode = "MY";
      else if (countryCode === "CANADA" || countryCode === "CA") countryCode = "CA";
      else if (countryCode === "UNITED ARAB EMIRATES" || countryCode === "UAE" || countryCode === "AE") countryCode = "AE";
      else if (countryCode === "FIJI" || countryCode === "FJ") countryCode = "FJ";
      else if (countryCode === "MAURITIUS" || countryCode === "MU") countryCode = "MU";
      else if (countryCode === "NEPAL" || countryCode === "NP") countryCode = "NP";
      let city = "";
      let state = "";
      if (countryCode === "US") {
        const cleanZip = postalCodeRaw.split("-")[0].replace(/\D/g, "").slice(0, 5);
        if (cleanZip.length === 5) {
          try {
            const zipRes = await fetch(`https://api.zippopotam.us/us/${cleanZip}`, {
              signal: AbortSignal.timeout(3e3)
            });
            if (zipRes.ok) {
              const zipData = await zipRes.json();
              if (zipData.places && zipData.places.length > 0) {
                city = zipData.places[0]["place name"] || "";
                state = zipData.places[0]["state"] || "";
              }
            }
          } catch (e) {
            console.warn(`[US ZIP Lookup API Warning for ${cleanZip}]:`, e.message);
          }
          if (!city || !state) {
            const knownUsZips = {
              "10282": { city: "New York", state: "New York" },
              "10001": { city: "New York", state: "New York" },
              "90210": { city: "Beverly Hills", state: "California" },
              "94102": { city: "San Francisco", state: "California" },
              "60601": { city: "Chicago", state: "Illinois" },
              "33101": { city: "Miami", state: "Florida" },
              "98101": { city: "Seattle", state: "Washington" },
              "75001": { city: "Dallas", state: "Texas" }
            };
            if (knownUsZips[cleanZip]) {
              city = knownUsZips[cleanZip].city;
              state = knownUsZips[cleanZip].state;
            }
          }
        }
      } else if (countryCode === "GB") {
        const cleanPostcode = postalCodeRaw.trim();
        try {
          const pcRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`, {
            signal: AbortSignal.timeout(3e3)
          });
          if (pcRes.ok) {
            const pcData = await pcRes.json();
            if (pcData.status === 200 && pcData.result) {
              city = pcData.result.admin_district || pcData.result.parish || pcData.result.parliamentary_constituency || "London";
              state = pcData.result.region || pcData.result.country || "England";
            }
          }
        } catch (e) {
          console.warn(`[UK Postcode Lookup API Warning for ${cleanPostcode}]:`, e.message);
        }
        if (!city || !state) {
          const formattedPc = cleanPostcode.replace(/\s+/g, "").toUpperCase();
          const knownUkPcs = {
            "SW1A1AA": { city: "London", state: "England" },
            "EC1A1BB": { city: "London", state: "England" },
            "M11AE": { city: "Manchester", state: "England" },
            "B11AA": { city: "Birmingham", state: "England" }
          };
          if (knownUkPcs[formattedPc]) {
            city = knownUkPcs[formattedPc].city;
            state = knownUkPcs[formattedPc].state;
          }
        }
      } else if (countryCode === "SG") {
        const cleanSg = postalCodeRaw.replace(/\D/g, "");
        if (cleanSg.length === 6) {
          city = "Singapore";
          state = "Singapore";
        }
      } else if (countryCode === "MY") {
        const cleanMy = postalCodeRaw.replace(/\D/g, "");
        if (cleanMy.length === 5) {
          const knownMy = {
            "50450": { city: "Kuala Lumpur", state: "Kuala Lumpur" },
            "10000": { city: "George Town", state: "Penang" },
            "80000": { city: "Johor Bahru", state: "Johor" }
          };
          if (knownMy[cleanMy]) {
            city = knownMy[cleanMy].city;
            state = knownMy[cleanMy].state;
          } else {
            city = "Kuala Lumpur";
            state = "Malaysia";
          }
        }
      } else if (countryCode === "CA") {
        const cleanCa = postalCodeRaw.replace(/\s+/g, "").toUpperCase();
        if (cleanCa.length >= 3) {
          const f3 = cleanCa.slice(0, 3);
          try {
            const caRes = await fetch(`https://api.zippopotam.us/ca/${f3}`, {
              signal: AbortSignal.timeout(3e3)
            });
            if (caRes.ok) {
              const caData = await caRes.json();
              if (caData.places && caData.places.length > 0) {
                city = caData.places[0]["place name"] || "";
                state = caData.places[0]["state"] || "";
              }
            }
          } catch (e) {
            console.warn(`[CA Postal Lookup Warning for ${cleanCa}]:`, e.message);
          }
          if (!city || !state) {
            if (cleanCa.startsWith("M5V") || cleanCa.startsWith("M")) {
              city = "Toronto";
              state = "Ontario";
            } else if (cleanCa.startsWith("V6B") || cleanCa.startsWith("V")) {
              city = "Vancouver";
              state = "British Columbia";
            }
          }
        }
      } else if (countryCode === "IN") {
        const cleanIn = postalCodeRaw.replace(/\D/g, "");
        if (cleanIn.length === 6) {
          try {
            const postalRes = await fetch(`https://api.postalpincode.in/pincode/${cleanIn}`, {
              signal: AbortSignal.timeout(3e3)
            });
            if (postalRes.ok) {
              const postalData = await postalRes.json();
              if (Array.isArray(postalData) && postalData[0]?.Status === "Success" && postalData[0]?.PostOffice?.length > 0) {
                const po = postalData[0].PostOffice[0];
                city = po.District || po.Block || po.Circle || po.Name || "";
                state = po.State || "";
              }
            }
          } catch (err) {
            console.warn(`[India Post Lookup Warning for ${cleanIn}]:`, err.message);
          }
          if (!city || !state) {
            const knownPincodes = {
              "141008": { city: "Ludhiana", state: "Punjab" },
              "110001": { city: "New Delhi", state: "Delhi" },
              "400001": { city: "Mumbai", state: "Maharashtra" },
              "700001": { city: "Kolkata", state: "West Bengal" },
              "600001": { city: "Chennai", state: "Tamil Nadu" },
              "560001": { city: "Bengaluru", state: "Karnataka" }
            };
            if (knownPincodes[cleanIn]) {
              city = knownPincodes[cleanIn].city;
              state = knownPincodes[cleanIn].state;
            }
          }
        }
      }
      if (city && state) {
        return res.json({
          success: true,
          countryCode,
          postalCode: postalCodeRaw,
          city,
          state
        });
      }
      return res.status(404).json({
        success: false,
        error: "Automatic address lookup is not available for this country. Please enter city and region manually."
      });
    } catch (error) {
      console.error("[API /api/shipping/address-lookup Error]:", error);
      return res.status(500).json({
        success: false,
        error: "Automatic address lookup failed. Please enter city and region manually."
      });
    }
  });
  app.get("/api/shipping/india-pincode/:pincode", async (req, res) => {
    try {
      const pincode = req.params.pincode ? req.params.pincode.trim() : "";
      if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid Indian pincode."
        });
      }
      let city = "";
      let state = "";
      try {
        const postalRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
          signal: AbortSignal.timeout(4e3)
        });
        if (postalRes.ok) {
          const postalData = await postalRes.json();
          if (Array.isArray(postalData) && postalData[0]?.Status === "Success" && postalData[0]?.PostOffice?.length > 0) {
            const po = postalData[0].PostOffice[0];
            city = po.District || po.Block || po.Circle || po.Name || "";
            state = po.State || "";
          }
        }
      } catch (err) {
        console.warn(`[India Post Pincode Lookup Warning for ${pincode}]:`, err.message);
      }
      if ((!city || !state) && isShiprocketConfigured()) {
        try {
          const srRes = await checkServiceability({ deliveryPincode: pincode });
          if (srRes.success && srRes.data) {
            if (srRes.data.city) city = srRes.data.city;
            if (srRes.data.state) state = srRes.data.state;
          }
        } catch (srErr) {
          console.warn(`[Shiprocket Pincode Check Warning for ${pincode}]:`, srErr.message);
        }
      }
      if (!city || !state) {
        const knownPincodes = {
          "141008": { city: "Ludhiana", state: "Punjab" },
          "110001": { city: "New Delhi", state: "Delhi" },
          "400001": { city: "Mumbai", state: "Maharashtra" },
          "700001": { city: "Kolkata", state: "West Bengal" },
          "600001": { city: "Chennai", state: "Tamil Nadu" },
          "560001": { city: "Bengaluru", state: "Karnataka" },
          "500001": { city: "Hyderabad", state: "Telangana" },
          "380001": { city: "Ahmedabad", state: "Gujarat" },
          "302001": { city: "Jaipur", state: "Rajasthan" },
          "570001": { city: "Mysore", state: "Karnataka" },
          "571105": { city: "Hunsur", state: "Karnataka" },
          "201301": { city: "Noida", state: "Uttar Pradesh" },
          "122001": { city: "Gurugram", state: "Haryana" },
          "160017": { city: "Chandigarh", state: "Chandigarh" },
          "411001": { city: "Pune", state: "Maharashtra" },
          "682001": { city: "Kochi", state: "Kerala" }
        };
        if (knownPincodes[pincode]) {
          city = knownPincodes[pincode].city;
          state = knownPincodes[pincode].state;
        }
      }
      if (!city || !state) {
        return res.status(404).json({
          success: false,
          error: "Please enter a valid Indian pincode."
        });
      }
      return res.json({
        success: true,
        pincode,
        city,
        state,
        serviceable: true
      });
    } catch (error) {
      console.error("[API /api/shipping/india-pincode Error]:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to look up pincode details. Please retry."
      });
    }
  });
  app.post("/api/shiprocket/serviceability", async (req, res) => {
    try {
      const { deliveryPincode, pickupPincode, weightInKg, cod } = req.body;
      if (!deliveryPincode) {
        return res.status(400).json({ success: false, error: "deliveryPincode is required" });
      }
      const siteSettings = await getStoreValue("site_settings") || INITIAL_SITE_SETTINGS;
      const resolvedPickupPincode = pickupPincode && String(pickupPincode).trim() || siteSettings?.shiprocketPickupPincode && String(siteSettings.shiprocketPickupPincode).trim() || void 0;
      const result = await checkServiceability({ deliveryPincode, pickupPincode: resolvedPickupPincode, weightInKg, cod });
      res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/serviceability Error]:", err.message);
      res.status(500).json({ success: false, error: err.message || "Failed to check serviceability" });
    }
  });
  app.get("/api/shiprocket/serviceability", async (req, res) => {
    try {
      const deliveryPincode = req.query.pincode || req.query.deliveryPincode;
      if (!deliveryPincode) {
        return res.status(400).json({ success: false, error: "pincode query param is required" });
      }
      const pickupPincode = req.query.pickupPincode;
      const siteSettings = await getStoreValue("site_settings") || INITIAL_SITE_SETTINGS;
      const resolvedPickupPincode = pickupPincode && String(pickupPincode).trim() || siteSettings?.shiprocketPickupPincode && String(siteSettings.shiprocketPickupPincode).trim() || void 0;
      const result = await checkServiceability({ deliveryPincode, pickupPincode: resolvedPickupPincode });
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  const handleEstimateShippingRate = async (req, res) => {
    try {
      const { items, deliveryPincode, country, countryCode, cod, couponCode } = req.body;
      const selectedCountry = country || countryCode || "India";
      const isInternational = !isIndiaCountry(selectedCountry);
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new CheckoutValidationError(400, "Cart items are required to estimate shipping rate.", "INVALID_CART");
      }
      const {
        subtotalINR,
        discountINR,
        taxINR,
        shippingFeeINR,
        grandTotalINR,
        shippingQuote
      } = await calculateOrderTotalServer(
        items,
        selectedCountry,
        couponCode,
        deliveryPincode,
        { validateStock: false, allowUnserviceable: true }
      );
      if (!shippingQuote.serviceable) {
        return res.json({
          success: true,
          serviceable: false,
          isInternational,
          shippingFeeINR: 0,
          estimatedRateINR: 0,
          shippingSource: "UNSERVICEABLE",
          source: "UNSERVICEABLE",
          shippingCourier: null,
          courierName: null,
          estimatedDelivery: void 0,
          estimatedDays: void 0,
          availableCouriers: [],
          subtotalINR,
          discountINR,
          taxINR,
          grandTotalINR,
          message: "Shipping is currently unavailable to this destination. Please contact HAKKIVEDA support.",
          code: "SHIPPING_UNAVAILABLE"
        });
      }
      return res.json({
        success: true,
        serviceable: true,
        isInternational,
        shippingFeeINR,
        estimatedRateINR: shippingFeeINR,
        shippingSource: shippingQuote.source,
        source: shippingQuote.source,
        shippingCourier: shippingQuote.courierLabel || null,
        courierName: shippingQuote.courierLabel || null,
        estimatedDelivery: shippingQuote.estimatedDelivery,
        estimatedDays: shippingQuote.estimatedDelivery,
        subtotalINR,
        discountINR,
        taxINR,
        grandTotalINR,
        codAllowed: !isInternational && Boolean(cod),
        availableCouriers: [
          {
            courier_name: shippingQuote.courierLabel || "Express Courier",
            rate: shippingFeeINR,
            etd: shippingQuote.estimatedDelivery,
            cod_available: !isInternational
          }
        ]
      });
    } catch (err) {
      if (err instanceof CheckoutValidationError) {
        return res.status(err.statusCode).json({
          success: false,
          error: err.message,
          message: err.message,
          code: err.code
        });
      }
      console.error("[API /shiprocket/estimate-rate Error]:", err.message);
      return res.status(500).json({ success: false, error: err.message || "Failed to estimate rate" });
    }
  };
  app.post("/api/shiprocket/estimate-rate", handleEstimateShippingRate);
  app.post("/api/shipping/quote", handleEstimateShippingRate);
  app.post("/api/admin/shiprocket/estimate-rate", requireAdmin, async (req, res) => {
    try {
      const { deliveryPincode, country, countryCode, weightInKg, cod, pickupPincode } = req.body;
      const isInternational = Boolean(
        country && !isIndiaCountry(country) || countryCode && !isIndiaCountry(countryCode)
      );
      const siteSettings = await getStoreValue("site_settings") || INITIAL_SITE_SETTINGS;
      const resolvedPickupPincode = pickupPincode && String(pickupPincode).trim() || siteSettings?.shiprocketPickupPincode && String(siteSettings.shiprocketPickupPincode).trim() || void 0;
      const result = await estimateShippingRate({
        deliveryPincode: deliveryPincode || (isInternational ? "00000" : "110001"),
        pickupPincode: resolvedPickupPincode,
        weightInKg: typeof weightInKg === "number" && weightInKg > 0 ? weightInKg : 0.5,
        cod: isInternational ? false : Boolean(cod),
        isInternational,
        country: country || countryCode,
        countryCode: countryCode || country,
        siteSettings
      });
      return res.json(result);
    } catch (err) {
      console.error("[API /admin/shiprocket/estimate-rate Error]:", err.message);
      return res.status(500).json({ success: false, error: err.message || "Failed to estimate rate" });
    }
  });
  app.post("/api/shiprocket/create-order", requireAdmin, async (req, res) => {
    try {
      const { orderId, orderData } = req.body;
      let targetOrder = orderData;
      if (!targetOrder && orderId) {
        const orders = await getStoreValue("orders") || [];
        targetOrder = orders.find((o) => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId));
      }
      if (!targetOrder) {
        return res.status(400).json({ success: false, error: "Order not found or not provided" });
      }
      const result = await createShiprocketOrderIfNeeded(targetOrder);
      return res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/create-order Error]:", err.message);
      return res.status(500).json({ success: false, error: err.message || "Failed to create Shiprocket shipment" });
    }
  });
  app.post("/api/shiprocket/generate-awb", requireAdmin, async (req, res) => {
    try {
      const { orderId, shipmentId, courierId } = req.body;
      let targetShipmentId = shipmentId;
      let targetOrderId = orderId;
      if (!targetShipmentId && targetOrderId) {
        const orders = await getStoreValue("orders") || [];
        const ord = orders.find((o) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShipmentId = ord.shipmentId;
      }
      if (!targetShipmentId) {
        return res.status(400).json({ success: false, error: "shipmentId is required" });
      }
      const result = await generateAwb(targetShipmentId, courierId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      if (result.success && result.awbCode && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, {
          awbCode: result.awbCode,
          courierName: result.courierName,
          trackingUrl: result.trackingUrl,
          shipmentStatus: "AWB_GENERATED",
          trackingNumber: result.awbCode,
          trackingStatus: "AWB_GENERATED"
        });
      }
      res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/generate-awb Error]:", err.message);
      res.status(500).json({ success: false, error: err.message || "Failed to generate AWB" });
    }
  });
  app.post("/api/shiprocket/schedule-pickup", requireAdmin, async (req, res) => {
    try {
      const { orderId, shipmentId } = req.body;
      let targetShipmentId = shipmentId;
      let targetOrderId = orderId;
      if (!targetShipmentId && targetOrderId) {
        const orders = await getStoreValue("orders") || [];
        const ord = orders.find((o) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShipmentId = ord.shipmentId;
      }
      if (!targetShipmentId) {
        return res.status(400).json({ success: false, error: "shipmentId is required" });
      }
      const result = await schedulePickup(targetShipmentId);
      if (result.success && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, {
          pickupScheduledDate: result.pickupScheduledDate,
          shipmentStatus: "PICKUP_SCHEDULED",
          trackingStatus: "PICKUP_SCHEDULED"
        });
      }
      res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/schedule-pickup Error]:", err.message);
      res.status(500).json({ success: false, error: err.message || "Failed to schedule pickup" });
    }
  });
  app.get("/api/shiprocket/track/:identifier", async (req, res) => {
    try {
      const rawIdentifier = req.params.identifier;
      if (!rawIdentifier || typeof rawIdentifier !== "string") {
        return res.status(400).json({ success: false, error: "Tracking identifier is required." });
      }
      const identifier = rawIdentifier.trim();
      if (!identifier || identifier.length > 100 || /[\x00-\x1F\x7F]/.test(identifier)) {
        return res.status(400).json({ success: false, error: "Invalid tracking identifier format." });
      }
      if (identifier.includes("/") || identifier.includes("\\") || identifier.includes("://") || identifier.includes("?") || identifier.includes("#")) {
        return res.status(400).json({ success: false, error: "Invalid tracking identifier format." });
      }
      const result = await trackShipment(identifier);
      const orders = await getStoreValue("orders") || [];
      const ord = orders.find(
        (o) => String(o.awbCode) === String(identifier) || String(o.shipmentId) === String(identifier) || String(o.id) === String(identifier) || String(o.orderNumber) === String(identifier)
      );
      if (ord) {
        await updateOrderShiprocketData(ord.id, {
          shipmentStatus: result.shipmentStatus,
          courierName: result.courierName || ord.courierName
        });
      }
      res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/track Error]:", err.message);
      res.status(500).json({ success: false, error: err.message || "Failed to track shipment" });
    }
  });
  app.post("/api/shiprocket/generate-label", requireAdmin, async (req, res) => {
    try {
      const { orderId, shipmentId } = req.body;
      let targetShipmentId = shipmentId;
      let targetOrderId = orderId;
      if (!targetShipmentId && targetOrderId) {
        const orders = await getStoreValue("orders") || [];
        const ord = orders.find((o) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShipmentId = ord.shipmentId;
      }
      if (!targetShipmentId) {
        return res.status(400).json({ success: false, error: "shipmentId is required" });
      }
      const result = await downloadLabel(targetShipmentId);
      if (result.success && result.labelUrl && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, { labelUrl: result.labelUrl });
      }
      res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/generate-label Error]:", err.message);
      res.status(500).json({ success: false, error: err.message || "Failed to generate shipping label" });
    }
  });
  app.post("/api/shiprocket/generate-invoice", requireAdmin, async (req, res) => {
    try {
      const { orderId, shiprocketOrderId } = req.body;
      let targetShiprocketOrderId = shiprocketOrderId;
      let targetOrderId = orderId;
      if (!targetShiprocketOrderId && targetOrderId) {
        const orders = await getStoreValue("orders") || [];
        const ord = orders.find((o) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) targetShiprocketOrderId = ord.shiprocketOrderId;
      }
      if (!targetShiprocketOrderId) {
        return res.status(400).json({ success: false, error: "shiprocketOrderId is required" });
      }
      const result = await downloadInvoice(targetShiprocketOrderId);
      if (result.success && result.invoiceUrl && targetOrderId) {
        await updateOrderShiprocketData(targetOrderId, { invoiceUrl: result.invoiceUrl });
      }
      res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/generate-invoice Error]:", err.message);
      res.status(500).json({ success: false, error: err.message || "Failed to generate invoice" });
    }
  });
  app.post("/api/shiprocket/sync-status", requireAdmin, async (req, res) => {
    try {
      const { orderId, shiprocketOrderId } = req.body;
      let targetShiprocketOrderId = shiprocketOrderId;
      let targetOrderId = orderId;
      if (!targetShiprocketOrderId && targetOrderId) {
        const orders = await getStoreValue("orders") || [];
        const ord = orders.find((o) => String(o.id) === String(targetOrderId) || String(o.orderNumber) === String(targetOrderId));
        if (ord) {
          targetShiprocketOrderId = ord.shiprocketOrderId;
        }
      }
      if (!targetShiprocketOrderId) {
        return res.status(400).json({ success: false, error: "shiprocketOrderId is required to sync status" });
      }
      const result = await syncShiprocketOrder(targetShiprocketOrderId);
      if (result.success && targetOrderId) {
        const updatePayload = {};
        if (result.shipmentId) updatePayload.shipmentId = result.shipmentId;
        if (result.awbCode) {
          updatePayload.awbCode = result.awbCode;
          updatePayload.trackingNumber = result.awbCode;
        }
        if (result.courierName) updatePayload.courierName = result.courierName;
        if (result.shipmentStatus) updatePayload.shipmentStatus = result.shipmentStatus;
        if (result.trackingUrl) updatePayload.trackingUrl = result.trackingUrl;
        if (result.pickupScheduledDate) updatePayload.pickupScheduledDate = result.pickupScheduledDate;
        await updateOrderShiprocketData(targetOrderId, updatePayload);
      }
      res.json(result);
    } catch (err) {
      console.error("[API /shiprocket/sync-status Error]:", err.message);
      res.status(500).json({ success: false, error: err.message || "Failed to sync Shiprocket status" });
    }
  });
  app.get("/api/products", async (_req, res) => {
    const products = await getStoreValue("products") || [];
    res.json({ success: true, data: products, value: products });
  });
  app.post("/api/products", requireAdmin, async (req, res) => {
    const products = req.body.value !== void 0 ? req.body.value : req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("products", products);
    res.json({ success: true, message: "Products saved successfully.", data: products, value: products });
  });
  app.get("/api/categories", async (_req, res) => {
    const categories = await getStoreValue("categories") || [];
    res.json({ success: true, data: categories, value: categories });
  });
  app.post("/api/categories", requireAdmin, async (req, res) => {
    const categories = req.body.value !== void 0 ? req.body.value : req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("categories", categories);
    res.json({ success: true, message: "Categories saved successfully.", data: categories, value: categories });
  });
  app.get("/api/hero-slides", async (_req, res) => {
    const slides = await getStoreValue("hero_slides");
    if (slides === null || slides === void 0) {
      await setStoreValue("hero_slides", INITIAL_HERO_SLIDES);
      res.json({ success: true, data: INITIAL_HERO_SLIDES, value: INITIAL_HERO_SLIDES });
    } else {
      res.json({ success: true, data: slides, value: slides });
    }
  });
  const handleHeroSlidesSave = async (req, res) => {
    try {
      const slides = req.body.value !== void 0 ? req.body.value : req.body.data !== void 0 ? req.body.data : req.body;
      await setStoreValue("hero_slides", slides);
      res.json({ success: true, message: "Hero slides saved successfully.", data: slides, value: slides });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  app.put("/api/hero-slides", requireAdmin, handleHeroSlidesSave);
  app.post("/api/hero-slides", requireAdmin, handleHeroSlidesSave);
  app.get("/api/announcements", async (_req, res) => {
    const settings = await getStoreValue("site_settings") || {};
    res.json({ success: true, data: settings.announcementText || "" });
  });
  app.post("/api/announcements", requireAdmin, async (req, res) => {
    const text = req.body.announcementText || req.body.data;
    const settings = await getStoreValue("site_settings") || {};
    settings.announcementText = text;
    await setStoreValue("site_settings", settings);
    res.json({ success: true, message: "Announcement saved successfully." });
  });
  app.get("/api/navigation-menu", async (_req, res) => {
    const navLinks = await getStoreValue("nav_links") || [];
    res.json({ success: true, data: navLinks });
  });
  app.post("/api/navigation-menu", requireAdmin, async (req, res) => {
    const navLinks = req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("nav_links", navLinks);
    res.json({ success: true, message: "Navigation menu saved successfully." });
  });
  app.get("/api/reviews", async (_req, res) => {
    const reviews = await getStoreValue("reviews") || [];
    res.json({ success: true, data: reviews });
  });
  app.post("/api/reviews", requireAdmin, async (req, res) => {
    const reviews = req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("reviews", reviews);
    res.json({ success: true, message: "Reviews saved successfully." });
  });
  app.get("/api/blogs", async (_req, res) => {
    const blogs = await getStoreValue("blogs") || [];
    res.json({ success: true, data: blogs });
  });
  app.post("/api/blogs", requireAdmin, async (req, res) => {
    const blogs = req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("blogs", blogs);
    res.json({ success: true, message: "Blogs saved successfully." });
  });
  app.get("/api/video-testimonials", async (_req, res) => {
    const vids = await getStoreValue("testimonial_videos") || [];
    res.json({ success: true, data: vids });
  });
  app.post("/api/video-testimonials", requireAdmin, async (req, res) => {
    const vids = req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("testimonial_videos", vids);
    res.json({ success: true, message: "Video testimonials saved successfully." });
  });
  app.get("/api/media-gallery", async (_req, res) => {
    const media = await getStoreValue("media_items") || [];
    res.json({ success: true, data: media });
  });
  app.post("/api/media-gallery", requireAdmin, async (req, res) => {
    const media = req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("media_items", media);
    res.json({ success: true, message: "Media gallery saved successfully." });
  });
  app.get("/api/quiz-questions", async (_req, res) => {
    const quiz = await getStoreValue("quiz_questions") || [];
    res.json({ success: true, data: quiz });
  });
  app.post("/api/quiz-questions", requireAdmin, async (req, res) => {
    const quiz = req.body.data !== void 0 ? req.body.data : req.body;
    await setStoreValue("quiz_questions", quiz);
    res.json({ success: true, message: "Quiz questions saved successfully." });
  });
  app.get("/api/inventory", async (_req, res) => {
    const products = await getStoreValue("products") || [];
    const inventory = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || p.id,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity ?? 100
    }));
    res.json({ success: true, data: inventory });
  });
  app.get("/api/settings", async (_req, res) => {
    const siteSettings = await getStoreValue("site_settings") || {};
    const brandIdentity = await getStoreValue("brand_identity") || {};
    const headerLayoutSettings = await getStoreValue("header_layout_settings") || {};
    res.json({ success: true, data: { siteSettings, brandIdentity, headerLayoutSettings } });
  });
  app.post("/api/settings", requireAdmin, async (req, res) => {
    const { siteSettings, brandIdentity, headerLayoutSettings } = req.body;
    if (siteSettings) await setStoreValue("site_settings", siteSettings);
    if (brandIdentity) await setStoreValue("brand_identity", brandIdentity);
    if (headerLayoutSettings) await setStoreValue("header_layout_settings", headerLayoutSettings);
    res.json({ success: true, message: "Website settings saved successfully." });
  });
  app.get("/api/brand/logo", async (_req, res) => {
    const brandIdentity = await getStoreValue("brand_identity") || {};
    const siteSettings = await getStoreValue("site_settings") || {};
    const logoUrl = brandIdentity.headerHvLogo || siteSettings.headerHvLogo || siteSettings.logoImageUrl || "/images/hakkiveda_hv_logo.svg";
    res.json({ success: true, logoUrl });
  });
  app.post("/api/brand/logo", async (req, res) => {
    const { logoUrl, filename } = req.body;
    if (!logoUrl) {
      return res.status(400).json({ success: false, error: "logoUrl is required" });
    }
    const siteSettings = await getStoreValue("site_settings") || {};
    const brandIdentity = await getStoreValue("brand_identity") || {};
    siteSettings.headerHvLogo = logoUrl;
    siteSettings.logoImageUrl = logoUrl;
    brandIdentity.headerHvLogo = logoUrl;
    if (filename) brandIdentity.headerHvLogoFilename = filename;
    brandIdentity.mainLogoLight = logoUrl;
    await setStoreValue("site_settings", siteSettings);
    await setStoreValue("brand_identity", brandIdentity);
    res.json({ success: true, message: "Brand logo updated and persisted successfully", logoUrl });
  });
  async function detectBinaryFileType(filePath) {
    try {
      const { fileTypeFromFile } = await import("file-type");
      const result = await fileTypeFromFile(filePath);
      if (result) {
        return { mime: result.mime, ext: `.${result.ext}` };
      }
    } catch (err) {
      console.error("[Upload Validation] file-type detection error:", err?.message || err);
    }
    try {
      const fd = import_fs2.default.openSync(filePath, "r");
      const buf = Buffer.alloc(64);
      const bytesRead = import_fs2.default.readSync(fd, buf, 0, 64, 0);
      import_fs2.default.closeSync(fd);
      if (bytesRead >= 3 && buf[0] === 255 && buf[1] === 216 && buf[2] === 255) {
        return { mime: "image/jpeg", ext: ".jpg" };
      }
      if (bytesRead >= 8 && buf.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        return { mime: "image/png", ext: ".png" };
      }
      if (bytesRead >= 6 && (buf.subarray(0, 6).toString("ascii") === "GIF87a" || buf.subarray(0, 6).toString("ascii") === "GIF89a")) {
        return { mime: "image/gif", ext: ".gif" };
      }
      if (bytesRead >= 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
        return { mime: "image/webp", ext: ".webp" };
      }
      if (bytesRead >= 8 && buf.subarray(4, 8).toString("ascii") === "ftyp") {
        return { mime: "video/mp4", ext: ".mp4" };
      }
      if (bytesRead >= 4 && buf[0] === 26 && buf[1] === 69 && buf[2] === 223 && buf[3] === 163) {
        return { mime: "video/webm", ext: ".webm" };
      }
    } catch {
    }
    return null;
  }
  app.post("/api/upload", requireAdmin, (req, res) => {
    const admin = req.admin;
    const rateLimitKey = admin?.email ? normalizeRateLimitKey(admin.email) : getClientIp(req);
    if (!checkUploadRateLimit(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        error: "Upload rate limit exceeded. Please wait a few minutes before uploading more media."
      });
    }
    upload.single("file")(req, res, async (err) => {
      if (err instanceof import_multer.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error: "File size exceeds maximum permitted upload limit (100 MB)."
          });
        }
        return res.status(400).json({
          success: false,
          error: "Upload failed due to an invalid request or oversized file."
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: err.message || "Unsupported file type or invalid file upload."
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded."
        });
      }
      const filePath = import_path2.default.resolve(uploadDir, req.file.filename);
      const resolvedUploadRoot = import_path2.default.resolve(uploadDir);
      if (!filePath.startsWith(resolvedUploadRoot)) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        return res.status(403).json({
          success: false,
          error: "Security violation: Path traversal prevented."
        });
      }
      const detectedBinaryType = await detectBinaryFileType(filePath);
      if (!detectedBinaryType) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        return res.status(400).json({
          success: false,
          error: "Invalid file contents. The file does not have a valid image or video binary signature."
        });
      }
      const isAllowedImage = Object.keys(ALLOWED_IMAGE_MIMES).includes(detectedBinaryType.mime);
      const isAllowedVideo = Object.keys(ALLOWED_VIDEO_MIMES).includes(detectedBinaryType.mime);
      if (!isAllowedImage && !isAllowedVideo) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        return res.status(400).json({
          success: false,
          error: "Unsupported media format detected in file binary contents."
        });
      }
      const allowedExtsForDetectedMime = ALLOWED_MIMES[detectedBinaryType.mime] || [];
      const fileExt = import_path2.default.extname(req.file.filename).toLowerCase();
      if (!allowedExtsForDetectedMime.includes(fileExt)) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        return res.status(400).json({
          success: false,
          error: "Mismatched file extension and binary content signature."
        });
      }
      if (isAllowedImage && req.file.size > 10 * 1024 * 1024) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        return res.status(400).json({
          success: false,
          error: "Image file size exceeds the maximum 10 MB limit."
        });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      return res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        mimetype: detectedBinaryType.mime,
        size: req.file.size
      });
    });
  });
  const globalClientVideosDir = import_path2.default.join(uploadDir, "global-clients", "videos");
  if (!import_fs2.default.existsSync(globalClientVideosDir)) {
    import_fs2.default.mkdirSync(globalClientVideosDir, { recursive: true });
  }
  const clientVideoStorage = import_multer.default.diskStorage({
    destination: (_req, _file, cb) => {
      if (!import_fs2.default.existsSync(globalClientVideosDir)) {
        import_fs2.default.mkdirSync(globalClientVideosDir, { recursive: true });
      }
      cb(null, globalClientVideosDir);
    },
    filename: (_req, file, cb) => {
      const safeUUID = import_crypto.default.randomUUID();
      const rawExt = import_path2.default.extname(file.originalname).toLowerCase();
      const safeExt = [".mp4", ".webm", ".mov"].includes(rawExt) ? rawExt : ".mp4";
      cb(null, `client-video-${safeUUID}${safeExt}`);
    }
  });
  const uploadClientVideo = (0, import_multer.default)({
    storage: clientVideoStorage,
    limits: {
      fileSize: 100 * 1024 * 1024,
      // 100MB limit
      files: 1
    },
    fileFilter: (_req, file, cb) => {
      const rawExt = import_path2.default.extname(file.originalname).toLowerCase();
      const allowedExts = [".mp4", ".mov", ".webm"];
      const allowedMimes = ["video/mp4", "video/quicktime", "video/webm"];
      if (file.originalname.includes("\0") || file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\")) {
        return cb(new Error("Invalid characters in filename."));
      }
      if (!allowedExts.includes(rawExt) && !allowedMimes.includes(file.mimetype)) {
        return cb(new Error("Please upload an MP4 video."));
      }
      cb(null, true);
    }
  });
  const handleClientVideoUpload = (req, res) => {
    uploadClientVideo.single("video")(req, res, async (err) => {
      if (err instanceof import_multer.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          console.error("[Global Client Video Upload Error]", {
            filename: req.file?.originalname,
            size: req.headers["content-length"],
            received: false,
            error: "Video exceeds 100MB limit"
          });
          return res.status(400).json({
            success: false,
            code: "VIDEO_TOO_LARGE",
            message: "Video must be 100MB or smaller."
          });
        }
        console.error("[Global Client Video Upload Error]", {
          filename: req.file?.originalname,
          size: req.headers["content-length"],
          received: false,
          error: err.message || "Multer upload error"
        });
        return res.status(400).json({
          success: false,
          code: "UPLOAD_FAILED",
          message: "Video upload failed. Please try again."
        });
      } else if (err) {
        console.error("[Global Client Video Upload Error]", {
          filename: req.file?.originalname,
          size: req.headers["content-length"],
          received: false,
          error: err.message || "Unsupported format"
        });
        return res.status(400).json({
          success: false,
          code: "UNSUPPORTED_FORMAT",
          message: "Please upload an MP4 video."
        });
      }
      if (!req.file) {
        console.error("[Global Client Video Upload Error]", {
          received: false,
          error: "No video file received in request."
        });
        return res.status(400).json({
          success: false,
          code: "NO_FILE",
          message: "Please upload an MP4 video."
        });
      }
      const filePath = import_path2.default.resolve(globalClientVideosDir, req.file.filename);
      const resolvedRoot = import_path2.default.resolve(globalClientVideosDir);
      if (!filePath.startsWith(resolvedRoot)) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        console.error("[Global Client Video Upload Error]", {
          filename: req.file.filename,
          received: true,
          error: "Path traversal prevented"
        });
        return res.status(403).json({
          success: false,
          code: "SECURITY_ERROR",
          message: "Security violation: Path traversal prevented."
        });
      }
      const fileUrl = `/uploads/global-clients/videos/${req.file.filename}`;
      console.log("[Global Client Video Upload]", {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        received: true,
        savedPath: filePath,
        savedUrl: fileUrl
      });
      return res.json({
        success: true,
        url: fileUrl
      });
    });
  };
  app.post("/api/uploads/client-video", handleClientVideoUpload);
  app.post("/api/upload/client-video", handleClientVideoUpload);
  const handleMediaFileDelete = (req, res) => {
    try {
      const filename = req.params.filename || req.body?.filename;
      if (!filename || typeof filename !== "string") {
        return res.status(400).json({ success: false, error: "Filename is required." });
      }
      const baseName = import_path2.default.basename(filename.trim());
      if (!/^[a-zA-Z0-9_\-]+\.(jpg|jpeg|png|webp|gif|mp4|webm)$/i.test(baseName) || baseName.includes("\0") || baseName.includes("..")) {
        return res.status(400).json({ success: false, error: "Invalid filename format." });
      }
      const resolvedUploadRoot = import_path2.default.resolve(uploadDir);
      let targetPath = import_path2.default.resolve(uploadDir, baseName);
      if (!import_fs2.default.existsSync(targetPath)) {
        const clientVideoPath = import_path2.default.resolve(globalClientVideosDir, baseName);
        if (import_fs2.default.existsSync(clientVideoPath)) {
          targetPath = clientVideoPath;
        }
      }
      if (!targetPath.startsWith(resolvedUploadRoot)) {
        return res.status(403).json({ success: false, error: "Access denied: Directory traversal prevented." });
      }
      if (import_fs2.default.existsSync(targetPath)) {
        import_fs2.default.unlinkSync(targetPath);
        return res.json({ success: true, message: "File deleted successfully." });
      } else {
        return res.status(404).json({ success: false, error: "Media file not found." });
      }
    } catch (err) {
      console.error("[Media Delete Error]:", err.message);
      return res.status(500).json({ success: false, error: "Failed to delete media file." });
    }
  };
  app.delete("/api/upload/:filename", requireAdmin, handleMediaFileDelete);
  app.post("/api/upload/delete", requireAdmin, handleMediaFileDelete);
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
      return null;
    }
    return new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  };
  app.post("/api/hair-quiz", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      if (!checkAiRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please wait a few minutes before submitting another hair quiz."
        });
      }
      const { hairType, scalpCondition, primaryConcern, hairLossLevel, hairGoal, lifestyle } = req.body;
      const sanitizeInput = (val) => typeof val === "string" ? val.slice(0, 300) : "";
      const sHairType = sanitizeInput(hairType);
      const sScalpCondition = sanitizeInput(scalpCondition);
      const sPrimaryConcern = sanitizeInput(primaryConcern);
      const sHairLossLevel = sanitizeInput(hairLossLevel);
      const sHairGoal = sanitizeInput(hairGoal);
      const sLifestyle = sanitizeInput(lifestyle);
      const isBaldness = sHairLossLevel && (sHairLossLevel.toLowerCase().includes("advanced") || sHairLossLevel.toLowerCase().includes("receding") || sHairLossLevel.toLowerCase().includes("thinning") || sHairLossLevel.toLowerCase().includes("visible")) || sPrimaryConcern && (sPrimaryConcern.toLowerCase().includes("bald") || sPrimaryConcern.toLowerCase().includes("severe"));
      const isLongHair = sHairGoal && (sHairGoal.toLowerCase().includes("growth") || sHairGoal.toLowerCase().includes("length") || sHairGoal.toLowerCase().includes("long")) || sPrimaryConcern && sPrimaryConcern.toLowerCase().includes("regrowth");
      let recommendationTitle = "HAKKIVEDA Essential Hair Oil & Shampoo Daily Routine";
      let recommendedProductIds = ["prod-1", "prod-2"];
      let defaultRoutine = [
        "Apply HAKKIVEDA Herbal Hair Oil 2-3x weekly before sleep for deep root nourishment",
        "Wash with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo to keep scalp clean without drying"
      ];
      if (isBaldness) {
        recommendationTitle = "HAKKIVEDA 3-Step Baldness & Intensive Scalp Care Kit";
        recommendedProductIds = ["prod-1", "prod-4", "prod-2", "prod-5"];
        defaultRoutine = [
          "Massage HAKKIVEDA Herbal Hair Oil 3x weekly onto scalp and hair roots",
          "Apply HAKKIVEDA Herbal Baldness Care Powder paste directly on sparse scalp areas 2x weekly",
          "Cleanse thoroughly with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo"
        ];
      } else if (isLongHair) {
        recommendationTitle = "HAKKIVEDA Long Hair Growth & Root Strength System";
        recommendedProductIds = ["prod-1", "prod-2"];
        defaultRoutine = [
          "Apply HAKKIVEDA Herbal Hair Oil to scalp and full hair lengths 3x weekly for rich nourishment",
          "Cleanse with HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo to prevent breakage and split ends"
        ];
      }
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: true,
          summary: isBaldness ? `Based on your hair thinning concern, our traditional botanical advisor recommends the 3-Step Intensive System: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA Herbal Baldness Care Powder + HAKKIVEDA Clarifying Shampoo for deep root nourishment.` : isLongHair ? `To achieve long, lush hair, HAKKIVEDA Herbal Hair Oil paired with HAKKIVEDA Clarifying Shampoo provides deep scalp nourishment and strand elasticity.` : `For your hair profile, the combination of HAKKIVEDA Herbal Hair Oil and HAKKIVEDA Clarifying Shampoo is ideal to maintain root health and reduce daily hair fall.`,
          doshaType: sScalpCondition === "Dry / Flaky / Itchy" ? "Vata-Pitta Imbalance" : "Pitta-Kapha",
          recommendationTitle,
          recommendedProductIds,
          recommendedRoutine: defaultRoutine,
          keyHerbs: ["Wild Amla", "Bhringraj", "Gunja Seed Elixir", "Shikakai", "Devadaru Tree Resin"],
          estimatedResultsWeeks: isBaldness ? 8 : 6
        });
      }
      const prompt = `You are the Tribal Botanical Advisor of HAKKIVEDA, an expert in Hakki-Pikki tribal herbal traditions and Ayurvedic wellness philosophy.
Analyze the following customer hair profile:
- Hair Type: ${sHairType}
- Scalp Condition: ${sScalpCondition}
- Primary Concern: ${sPrimaryConcern}
- Hair Loss Level: ${sHairLossLevel}
- Desired Goal: ${sHairGoal}
- Lifestyle / Daily Stress: ${sLifestyle}

IMPORTANT COMPLIANCE & PRODUCT RECOMMENDATION RULES:
1. This is a cosmetic & traditional wellness assessment, NOT a medical diagnosis or disease treatment.
2. Do NOT use medical diagnostic terms (e.g. do not diagnose medical alopecia, dermatitis, fungal infections, or claim medical cures).
3. Frame recommendations around traditional tribal botanical nourishment, scalp care rituals, and cosmetic strand strength.
4. If the user has Baldness / Advanced Thinning / Receding Hairline / Visible Scalp:
   - Recommend the 3-step baldness care protocol: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA Herbal Baldness Care Powder & Lepa + HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo (or Complete Kit prod-5).
   - Set "recommendationTitle": "HAKKIVEDA 3-Step Baldness & Intensive Scalp Care Kit"
   - Set "recommendedProductIds": ["prod-1", "prod-4", "prod-2", "prod-5"]

5. If the user wants Long Hair / Fast Growth / Length:
   - Recommend: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo.
   - Set "recommendationTitle": "HAKKIVEDA Long Hair Growth & Root Strength System"
   - Set "recommendedProductIds": ["prod-1", "prod-2"]

6. If the concern is mild or general maintenance (normal shedding, general hair fall, dry/frizzy hair):
   - Recommend: HAKKIVEDA Herbal Hair Oil + HAKKIVEDA 42 Mountain Herbs Clarifying Shampoo.
   - Set "recommendationTitle": "HAKKIVEDA Essential Hair Oil & Shampoo Routine"
   - Set "recommendedProductIds": ["prod-1", "prod-2"]

Provide a personalized botanical assessment in valid JSON format with keys:
- "summary": A warm 2-3 sentence traditional tribal guidance explaining the recommended products and ritual. (Avoid medical cure/diagnosis language).
- "doshaType": Ayurvedic dosha classification (e.g. Vata-Pitta, Pitta-Kapha).
- "recommendationTitle": String title of the recommended routine.
- "recommendedProductIds": Array of product IDs string.
- "recommendedRoutine": Array of 2-3 specific usage instructions.
- "keyHerbs": Array of 5 herbs.
- "estimatedResultsWeeks": Number between 4 and 12.

Return ONLY raw JSON, no markdown code blocks.`;
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const text = response.text || "";
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        recommendationTitle,
        recommendedProductIds,
        ...parsed
      });
    } catch (error) {
      console.error("Hair Quiz API error:", error?.message);
      return res.status(500).json({
        success: false,
        error: "Failed to generate hair quiz analysis. Please try again later."
      });
    }
  });
  function compareStageWithPhotoInternal(selectedStage, photoStage) {
    if (!selectedStage || selectedStage.toUpperCase().includes("NOT_SURE") || !photoStage || photoStage.toUpperCase().includes("NOT_SURE")) {
      return "We\u2019ll use both your answers and photo to personalize your herbal regimen.";
    }
    const sNum = parseInt(selectedStage.replace(/\D/g, ""), 10);
    const pNum = parseInt(photoStage.replace(/\D/g, ""), 10);
    if (isNaN(sNum) || isNaN(pNum)) {
      return "Your selected stage is consistent with the visible pattern in your photo.";
    }
    if (Math.abs(sNum - pNum) <= 1) {
      return "Your selected stage is consistent with the visible pattern in your photo.";
    } else {
      return "Your photo appears to show a different level of visible thinning than your selected stage. We\u2019ll use both your answers and photo to create your profile.";
    }
  }
  const HAIR_PHOTO_ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const HAIR_PHOTO_ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".webp"];
  const hairPhotoStorage = import_multer.default.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const safeUUID = import_crypto.default.randomUUID();
      const rawExt = import_path2.default.extname(file.originalname).toLowerCase();
      const safeExt = HAIR_PHOTO_ALLOWED_EXTS.includes(rawExt) ? rawExt : file.mimetype.toLowerCase() === "image/png" ? ".png" : file.mimetype.toLowerCase() === "image/webp" ? ".webp" : ".jpg";
      cb(null, `hair-topcrown-${safeUUID}${safeExt}`);
    }
  });
  const hairPhotoUpload = (0, import_multer.default)({
    storage: hairPhotoStorage,
    limits: {
      fileSize: 15 * 1024 * 1024,
      // 15 MB maximum
      files: 1
    },
    fileFilter: (_req, file, cb) => {
      const rawExt = import_path2.default.extname(file.originalname).toLowerCase();
      if (file.originalname.includes("\0") || file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\")) {
        const err = new Error("Please upload a JPG, PNG or WebP image.");
        err.code = "INVALID_IMAGE";
        return cb(err);
      }
      const mime = file.mimetype.toLowerCase();
      const mimeOk = HAIR_PHOTO_ALLOWED_MIMES.includes(mime);
      const extOk = HAIR_PHOTO_ALLOWED_EXTS.includes(rawExt);
      if (!mimeOk && !extOk) {
        const err = new Error("Please upload a JPG, PNG or WebP image.");
        err.code = "INVALID_IMAGE";
        return cb(err);
      }
      cb(null, true);
    }
  });
  async function verifyHairPhotoBinary(filePath) {
    try {
      const detected = await detectBinaryFileType(filePath);
      if (detected && ["image/jpeg", "image/png", "image/webp"].includes(detected.mime)) {
        return detected.mime;
      }
    } catch {
    }
    try {
      if (import_fs2.default.existsSync(filePath)) {
        const fd = import_fs2.default.openSync(filePath, "r");
        const buf = Buffer.alloc(16);
        import_fs2.default.readSync(fd, buf, 0, 16, 0);
        import_fs2.default.closeSync(fd);
        if (buf[0] === 255 && buf[1] === 216 && buf[2] === 255) {
          return "image/jpeg";
        }
        if (buf[0] === 137 && buf[1] === 80 && buf[2] === 78 && buf[3] === 71) {
          return "image/png";
        }
        if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
          return "image/webp";
        }
      }
    } catch {
    }
    return null;
  }
  app.post("/api/hair-analysis/upload-photo", (req, res) => {
    const clientIp = getClientIp(req);
    const rateLimitKey = `hair-photo-${clientIp}`;
    if (!checkUploadRateLimit(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        code: "UPLOAD_FAILED",
        error: "Upload limit reached. Please wait a few moments before trying again.",
        message: "Upload limit reached. Please wait a few moments before trying again."
      });
    }
    hairPhotoUpload.fields([
      { name: "photo", maxCount: 1 },
      { name: "file", maxCount: 1 }
    ])(req, res, async (err) => {
      if (err) {
        let code = "UPLOAD_FAILED";
        let message = "Photo upload failed. Please try a different image.";
        if (err instanceof import_multer.default.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            code = "IMAGE_TOO_LARGE";
            message = "Image must be 15MB or smaller.";
          }
        } else if (err.code === "INVALID_IMAGE") {
          code = "INVALID_IMAGE";
          message = "Please upload a JPG, PNG or WebP image.";
        }
        console.error("[Hair Analysis Upload Error]", {
          fileReceived: false,
          errorMessage: message
        });
        return res.status(400).json({ success: false, code, message, error: message });
      }
      const files = req.files;
      const uploadedFile = files?.photo?.[0] || files?.file?.[0] || req.file;
      if (!uploadedFile) {
        console.error("[Hair Analysis Upload Error]", {
          fileReceived: false,
          errorMessage: "No photo provided in photo or file field."
        });
        return res.status(400).json({
          success: false,
          code: "UPLOAD_FAILED",
          message: "No photo provided. Please upload a clear photo of your top/crown hair.",
          error: "No photo provided. Please upload a clear photo of your top/crown hair."
        });
      }
      const filePath = import_path2.default.resolve(uploadDir, uploadedFile.filename);
      const resolvedUploadRoot = import_path2.default.resolve(uploadDir);
      if (!filePath.startsWith(resolvedUploadRoot)) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        return res.status(403).json({
          success: false,
          code: "UPLOAD_FAILED",
          error: "Security violation: Path traversal prevented.",
          message: "Security violation: Path traversal prevented."
        });
      }
      const verifiedMime = await verifyHairPhotoBinary(filePath);
      if (!verifiedMime) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        console.error("[Hair Analysis Upload Error]", {
          filename: uploadedFile.originalname,
          mimetype: uploadedFile.mimetype,
          size: uploadedFile.size,
          fileReceived: true,
          errorMessage: "Invalid binary image signature."
        });
        return res.status(400).json({
          success: false,
          code: "INVALID_IMAGE",
          message: "Please upload a JPG, PNG or WebP image.",
          error: "Please upload a JPG, PNG or WebP image."
        });
      }
      console.log("[Hair Analysis Upload]", {
        filename: uploadedFile.originalname,
        mimetype: uploadedFile.mimetype,
        size: uploadedFile.size,
        fileReceived: true,
        savedAs: uploadedFile.filename
      });
      const publicUrl = `/uploads/${uploadedFile.filename}`;
      return res.json({
        success: true,
        url: publicUrl,
        filename: uploadedFile.filename
      });
    });
  });
  app.post("/api/hair-analysis/analyze-photo", (req, res) => {
    const isJsonBody = req.is("application/json") || req.headers["content-type"] && req.headers["content-type"].includes("application/json");
    if (isJsonBody) {
      return handleJsonPhotoAnalysis(req, res);
    }
    const clientIp = getClientIp(req);
    const rateLimitKey = `hair-photo-${clientIp}`;
    if (!checkUploadRateLimit(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        code: "UPLOAD_FAILED",
        message: "Upload limit reached. Please wait a few moments before trying again."
      });
    }
    hairPhotoUpload.single("photo")(req, res, async (err) => {
      if (err) {
        let code = "UPLOAD_FAILED";
        let message = "Photo upload failed. Please try a different image.";
        if (err instanceof import_multer.default.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            code = "IMAGE_TOO_LARGE";
            message = "Image must be 15MB or smaller.";
          } else {
            code = "UPLOAD_FAILED";
            message = "Photo upload failed. Please try a different image.";
          }
        } else if (err.code === "INVALID_IMAGE" || err.message?.includes("JPG, PNG or WebP")) {
          code = "INVALID_IMAGE";
          message = "Please upload a JPG, PNG or WebP image.";
        } else {
          message = err.message || "Photo upload failed. Please try a different image.";
        }
        console.error("[Hair Analysis Upload Error]", {
          filename: req.file?.originalname,
          mimetype: req.file?.mimetype,
          size: req.file?.size,
          fileReceived: Boolean(req.file),
          errorMessage: message
        });
        return res.status(400).json({
          success: false,
          code,
          message
        });
      }
      if (!req.file) {
        console.error("[Hair Analysis Upload Error]", {
          fileReceived: false,
          errorMessage: "No photo provided in photo field."
        });
        return res.status(400).json({
          success: false,
          code: "UPLOAD_FAILED",
          message: "No photo provided. Please upload a clear photo of your top/crown hair."
        });
      }
      console.log("[Hair Analysis Upload]", {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        fileReceived: true,
        savedAs: req.file.filename
      });
      const filePath = import_path2.default.resolve(uploadDir, req.file.filename);
      const resolvedUploadRoot = import_path2.default.resolve(uploadDir);
      if (!filePath.startsWith(resolvedUploadRoot)) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        console.error("[Hair Analysis Upload Error]", {
          filename: req.file.originalname,
          fileReceived: true,
          errorMessage: "Path traversal prevented."
        });
        return res.status(403).json({
          success: false,
          code: "UPLOAD_FAILED",
          message: "Security violation: Path traversal prevented."
        });
      }
      const verifiedMime = await verifyHairPhotoBinary(filePath);
      if (!verifiedMime) {
        try {
          if (import_fs2.default.existsSync(filePath)) import_fs2.default.unlinkSync(filePath);
        } catch {
        }
        console.error("[Hair Analysis Upload Error]", {
          filename: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          fileReceived: true,
          errorMessage: "Invalid binary image signature."
        });
        return res.status(400).json({
          success: false,
          code: "INVALID_IMAGE",
          message: "Please upload a JPG, PNG or WebP image."
        });
      }
      const publicUrl = `/uploads/${req.file.filename}`;
      const gender = (req.body?.gender || "").toString();
      const selectedStage = (req.body?.selectedStage || "").toString();
      let imageBuffer;
      try {
        imageBuffer = import_fs2.default.readFileSync(filePath);
      } catch (readErr) {
        console.error("[Hair Analysis Upload Error]", {
          filename: req.file.filename,
          errorMessage: readErr?.message || "Could not read saved image file."
        });
        return res.status(500).json({
          success: false,
          code: "UPLOAD_FAILED",
          message: "Photo upload failed. Please try a different image."
        });
      }
      try {
        const assessmentResult = await performHairPhotoAiAnalysis(
          imageBuffer,
          verifiedMime,
          gender,
          selectedStage,
          req.file.filename,
          req.file.size
        );
        if (!assessmentResult.success) {
          return res.status(200).json({
            success: false,
            code: "ANALYSIS_FAILED",
            url: publicUrl,
            filename: req.file.filename,
            message: "We received your photo, but visual analysis could not be completed. Please retry."
          });
        }
        const visual = assessmentResult.visualAssessment;
        if (visual.imageQualityStatus === "IMAGE_QUALITY_INSUFFICIENT" || visual.analysisStatus === "IMAGE_QUALITY_INSUFFICIENT") {
          return res.json({
            success: true,
            url: publicUrl,
            filename: req.file.filename,
            analysisStatus: "IMAGE_QUALITY_INSUFFICIENT",
            message: "Please retake the photo in brighter light with the crown clearly visible.",
            visualAssessment: visual
          });
        }
        return res.json({
          success: true,
          url: publicUrl,
          filename: req.file.filename,
          analysisStatus: "OK",
          visualAssessment: visual
        });
      } catch (aiErr) {
        console.error("[Hair Analysis AI Error]", {
          filename: req.file.filename,
          mimetype: verifiedMime,
          size: req.file.size,
          errorMessage: aiErr?.message || "Unexpected error in visual analysis"
        });
        return res.status(200).json({
          success: false,
          code: "ANALYSIS_FAILED",
          url: publicUrl,
          filename: req.file.filename,
          message: "We received your photo, but visual analysis could not be completed. Please retry."
        });
      }
    });
  });
  async function performHairPhotoAiAnalysis(imageBuffer, mimeType, gender, selectedStage, savedFilename, fileSize) {
    const ai = getGeminiClient();
    if (!ai) {
      console.error("[Hair Analysis AI Error]", {
        filename: savedFilename,
        mimetype: mimeType,
        size: fileSize,
        errorMessage: "Gemini AI client unavailable (missing GEMINI_API_KEY)"
      });
      return { success: false };
    }
    const base64Data = imageBuffer.toString("base64");
    const promptText = `You are an expert cosmetic trichology and botanical scalp assessment assistant for HAKKIVEDA Ayurvedic hair wellness.
Analyze this top/crown photo of a customer's scalp and hair.
Identified customer gender: "${gender || "Not specified"}".
Customer's self-selected hair stage: "${selectedStage || "Not specified"}".

CRITICAL SAFETY & MEDICAL DISCLAIMER RULES:
- Do NOT diagnose medical conditions or diseases.
- Do NOT say "alopecia confirmed", "fungal infection detected", "psoriasis diagnosed", "medical disorder", or "guaranteed regrowth".
- Always use non-clinical, observational language such as:
  - "The photo appears to show..."
  - "Visible thinning appears..."
  - "The crown area appears..."
  - "This visual pattern may be consistent with..."
  - "A clinician should assess sudden or severe hair loss."

IMAGE QUALITY CHECK:
If the photo does not clearly show a human top/crown or scalp (e.g. it is completely blurry, pitch dark, completely obscured, a non-head object, face-only with no hair, or blank):
Set "imageQualityStatus" to "IMAGE_QUALITY_INSUFFICIENT", "analysisStatus" to "IMAGE_QUALITY_INSUFFICIENT", confidence to 0, suggestedStage to "NOT SURE", and provide an observation explaining that the customer should retake the photo in brighter light with the crown clearly visible.

STRUCTURED OUTPUT PARAMETERS:
- analysisStatus: "OK" or "IMAGE_QUALITY_INSUFFICIENT"
- imageQualityStatus: "OK" or "IMAGE_QUALITY_INSUFFICIENT"
- scalpVisibility: "LOW" (dense coverage, <15% scalp showing) | "MODERATE" (15-40% scalp visible) | "HIGH" (>40% scalp visible)
- crownDensityAppearance: "GOOD" | "MILD_REDUCTION" | "MODERATE_REDUCTION" | "SIGNIFICANT_REDUCTION"
- thinningPattern: "NONE" | "FRONTAL" | "CROWN" | "DIFFUSE" | "PATCHY" | "MIXED"
- visibleFlaking: "NONE" | "MILD" | "MODERATE" | "SIGNIFICANT"
- visibleRedness: "NONE" | "MILD" | "MODERATE"
- confidence: integer from 60 to 95 (or 0 if image quality insufficient)
- suggestedStage: "Stage 1" | "Stage 2" | "Stage 3" | "Stage 4" | "Stage 5" | "Stage 6" | "NOT SURE"
- observations: array of 2 to 4 objective, gentle cosmetic observations describing visible density, scalp coverage, crown area, or hair shaft appearance.

Return ONLY valid JSON matching this schema:
{
  "analysisStatus": "OK",
  "imageQualityStatus": "OK",
  "scalpVisibility": "LOW",
  "crownDensityAppearance": "GOOD",
  "thinningPattern": "NONE",
  "visibleFlaking": "NONE",
  "visibleRedness": "NONE",
  "confidence": 85,
  "suggestedStage": "Stage 2",
  "observations": ["The photo appears to show localized density patterns across the upper vertex."]
}`;
    try {
      const modelsToTry = ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.5-flash"];
      let response = null;
      let lastAiError = null;
      for (const modelCandidate of modelsToTry) {
        try {
          const generatePromise = ai.models.generateContent({
            model: modelCandidate,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                },
                {
                  text: promptText
                }
              ]
            },
            config: {
              responseMimeType: "application/json"
            }
          });
          const timeoutPromise = new Promise(
            (_, reject) => setTimeout(() => reject(new Error(`AI visual analysis timed out on ${modelCandidate}`)), 12e3)
          );
          response = await Promise.race([generatePromise, timeoutPromise]);
          if (response?.text) break;
        } catch (candidateErr) {
          lastAiError = candidateErr;
          console.warn(`[Hair Analysis AI] Model ${modelCandidate} failed or timed out:`, candidateErr?.message || candidateErr);
        }
      }
      if (!response?.text && lastAiError) {
        throw lastAiError;
      }
      const rawText = response.text || "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const m = rawText.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]);
      }
      if (parsed && typeof parsed === "object") {
        const isInsufficient = parsed.imageQualityStatus === "IMAGE_QUALITY_INSUFFICIENT" || parsed.analysisStatus === "IMAGE_QUALITY_INSUFFICIENT";
        const visualAssessment = {
          analysisStatus: isInsufficient ? "IMAGE_QUALITY_INSUFFICIENT" : "OK",
          imageQualityStatus: isInsufficient ? "IMAGE_QUALITY_INSUFFICIENT" : "OK",
          scalpVisibility: ["LOW", "MODERATE", "HIGH"].includes(parsed.scalpVisibility) ? parsed.scalpVisibility : "MODERATE",
          crownDensityAppearance: ["GOOD", "MILD_REDUCTION", "MODERATE_REDUCTION", "SIGNIFICANT_REDUCTION"].includes(parsed.crownDensityAppearance) ? parsed.crownDensityAppearance : "MILD_REDUCTION",
          thinningPattern: ["NONE", "FRONTAL", "CROWN", "DIFFUSE", "PATCHY", "MIXED"].includes(parsed.thinningPattern) ? parsed.thinningPattern : "CROWN",
          visibleFlaking: ["NONE", "MILD", "MODERATE", "SIGNIFICANT"].includes(parsed.visibleFlaking) ? parsed.visibleFlaking : "NONE",
          visibleRedness: ["NONE", "MILD", "MODERATE"].includes(parsed.visibleRedness) ? parsed.visibleRedness : "NONE",
          confidence: isInsufficient ? 0 : typeof parsed.confidence === "number" ? Math.min(98, Math.max(0, parsed.confidence)) : 85,
          suggestedStage: isInsufficient ? "NOT SURE" : parsed.suggestedStage || "Stage 2",
          observations: Array.isArray(parsed.observations) && parsed.observations.length > 0 ? parsed.observations.map(String) : isInsufficient ? ["The photo appears too dark or blurry to evaluate the scalp and crown clearly."] : ["The photo appears to show localized follicle spacing consistent with standard patterns."],
          comparisonNote: isInsufficient ? "" : compareStageWithPhotoInternal(selectedStage, parsed.suggestedStage || "Stage 2")
        };
        return { success: true, visualAssessment };
      }
      return { success: false };
    } catch (genError) {
      console.error("[Hair Analysis AI Error]", {
        filename: savedFilename,
        mimetype: mimeType,
        size: fileSize,
        errorMessage: genError?.message || "Gemini vision analysis call threw an exception"
      });
      return { success: false };
    }
  }
  async function handleJsonPhotoAnalysis(req, res) {
    try {
      const { imageUrl, gender = "", selectedStage = "" } = req.body;
      if (!imageUrl || typeof imageUrl !== "string") {
        return res.status(400).json({ success: false, code: "INVALID_IMAGE", message: "Photo URL is required for visual analysis" });
      }
      let imageBuffer = null;
      let mimeType = "image/jpeg";
      let filename = "json-image";
      if (imageUrl.startsWith("/uploads/")) {
        filename = import_path2.default.basename(imageUrl);
        const filePath = import_path2.default.resolve(uploadDir, filename);
        if (filePath.startsWith(import_path2.default.resolve(uploadDir)) && import_fs2.default.existsSync(filePath)) {
          imageBuffer = import_fs2.default.readFileSync(filePath);
          const ext = import_path2.default.extname(filename).toLowerCase();
          if (ext === ".png") mimeType = "image/png";
          else if (ext === ".webp") mimeType = "image/webp";
        }
      }
      if (!imageBuffer) {
        return res.status(400).json({ success: false, code: "UPLOAD_FAILED", message: "Could not access photo file for analysis" });
      }
      const assessmentResult = await performHairPhotoAiAnalysis(
        imageBuffer,
        mimeType,
        gender,
        selectedStage,
        filename,
        imageBuffer.length
      );
      if (!assessmentResult.success) {
        return res.status(200).json({
          success: false,
          code: "ANALYSIS_FAILED",
          url: imageUrl,
          message: "We received your photo, but visual analysis could not be completed. Please retry."
        });
      }
      const visual = assessmentResult.visualAssessment;
      if (visual.imageQualityStatus === "IMAGE_QUALITY_INSUFFICIENT") {
        return res.json({
          success: true,
          url: imageUrl,
          analysisStatus: "IMAGE_QUALITY_INSUFFICIENT",
          message: "Please retake the photo in brighter light with the crown clearly visible.",
          visualAssessment: visual
        });
      }
      return res.json({
        success: true,
        url: imageUrl,
        analysisStatus: "OK",
        visualAssessment: visual
      });
    } catch (err) {
      console.error("[Hair Analysis AI Error]", {
        errorMessage: err?.message || "JSON analysis handler failed"
      });
      return res.status(500).json({
        success: false,
        code: "ANALYSIS_FAILED",
        message: "Failed to analyze scalp photo"
      });
    }
  }
  app.post("/api/hair-analysis/submit", async (req, res) => {
    try {
      const {
        name,
        mobile,
        countryCode = "+91",
        gender = "",
        ageGroup = "",
        country = "",
        city = "",
        allAnswers = {},
        photoReferences = {},
        generatedProfile = {},
        recommendedProductIds = []
      } = req.body;
      if (!name || !mobile) {
        return res.status(400).json({ success: false, error: "Name and mobile number are required" });
      }
      const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newLead = {
        id: leadId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        name: String(name).slice(0, 100),
        mobile: String(mobile).slice(0, 30),
        countryCode: String(countryCode).slice(0, 10),
        gender: String(gender).slice(0, 30),
        ageGroup: String(ageGroup).slice(0, 30),
        country: String(country).slice(0, 60),
        city: String(city).slice(0, 60),
        allAnswers,
        photoReferences,
        generatedProfile,
        recommendedProductIds: Array.isArray(recommendedProductIds) ? recommendedProductIds : [],
        status: "NEW"
      };
      const leads = await getStoreValue("hair_analysis_leads") || [];
      leads.unshift(newLead);
      const trimmedLeads = leads.slice(0, 2e3);
      await setStoreValue("hair_analysis_leads", trimmedLeads);
      return res.json({ success: true, leadId, lead: newLead });
    } catch (error) {
      console.error("Hair Analysis Submit error:", error?.message);
      return res.status(500).json({ success: false, error: "Failed to record hair analysis lead" });
    }
  });
  app.get("/api/admin/hair-analysis/leads", requireAdmin, async (_req, res) => {
    try {
      const leads = await getStoreValue("hair_analysis_leads") || [];
      return res.json({ success: true, leads });
    } catch (error) {
      console.error("Fetch hair analysis leads error:", error?.message);
      return res.status(500).json({ success: false, error: "Failed to fetch hair analysis leads" });
    }
  });
  app.patch("/api/admin/hair-analysis/leads/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["NEW", "CONTACTED", "CONVERTED"].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid lead status" });
      }
      const leads = await getStoreValue("hair_analysis_leads") || [];
      const leadIndex = leads.findIndex((l) => l.id === id);
      if (leadIndex === -1) {
        return res.status(404).json({ success: false, error: "Lead not found" });
      }
      leads[leadIndex].status = status;
      leads[leadIndex].updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      await setStoreValue("hair_analysis_leads", leads);
      return res.json({ success: true, lead: leads[leadIndex] });
    } catch (error) {
      console.error("Update hair analysis lead status error:", error?.message);
      return res.status(500).json({ success: false, error: "Failed to update lead" });
    }
  });
  app.delete("/api/admin/hair-analysis/leads/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const leads = await getStoreValue("hair_analysis_leads") || [];
      const updated = leads.filter((l) => l.id !== id);
      await setStoreValue("hair_analysis_leads", updated);
      return res.json({ success: true });
    } catch (error) {
      console.error("Delete hair analysis lead error:", error?.message);
      return res.status(500).json({ success: false, error: "Failed to delete lead" });
    }
  });
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      if (!checkAiRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please wait a few moments before asking another question."
        });
      }
      const { messages } = req.body;
      if (!Array.isArray(messages)) {
        return res.status(400).json({ success: false, error: "Messages array is required." });
      }
      const boundedMessages = messages.slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: typeof m.content === "string" ? m.content.slice(0, 1e3) : ""
      }));
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: true,
          reply: `Greetings from HAKKIVEDA! \u{1F64F} I am your Tribal Botanical Advisor. How may I guide your hair wellness journey today? You can ask about our 42 mountain herb oils, ingredient authenticity, global shipping, or hair care rituals.`
        });
      }
      const systemInstruction = `You are the AI Tribal Botanical Advisor for HAKKIVEDA, an authentic botanical and herbal hair wellness brand rooted in the Hakki-Pikki tribal heritage of Mysore, Karnataka, India.
Company Info:
- Address: Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka, India
- WhatsApp Support: +91 76195 36831 | Email: support@hakkiveda.com
- Main Product: Tribal Gold Hair Oil (42 wild herbs slow-cooked in traditional copper cauldrons over woodfire for 21 days).
- Worldwide Express Shipping: India (INR), Singapore (SGD), Malaysia (MYR), Fiji (FJD), Mauritius (MUR), Worldwide (USD).
- Authentic Benefits: Deeply nourishes hair roots, conditions dry and flaky scalp, promotes visible hair density and strand luster, helps manage breakage and split ends.

COMPLIANCE & COMMUNICATION RULES:
1. You are providing traditional herbal hair care guidance and cosmetic product assistance, NOT medical advice, diagnosis, or disease prescriptions.
2. Never claim to "cure" alopecia, baldness, fungal diseases, or guarantee 100% medical regrowth.
3. Frame advice around traditional tribal formulations, healthy scalp maintenance, and regular oiling rituals.
4. Keep responses polite, welcoming, culturally respectful, and concise.`;
      const formattedMessages = boundedMessages.map((m) => `${m.role === "user" ? "Customer" : "Advisor"}: ${m.content}`).join("\n");
      const prompt = `${systemInstruction}

Chat History:
${formattedMessages}
Advisor:`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });
      return res.json({
        success: true,
        reply: response.text || "Namaste! I am here to assist with all your Hakki-Pikki tribal herbal wellness queries."
      });
    } catch (error) {
      console.error("AI Chat API error:", error?.message);
      return res.status(500).json({
        success: false,
        error: "Failed to communicate with AI Botanical Advisor. Please try again later."
      });
    }
  });
  const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables.");
    }
    return new import_razorpay.default({
      key_id: key_id || "rzp_test_placeholder",
      key_secret: key_secret || "placeholder_secret"
    });
  };
  async function calculateOrderTotalServer(items, customerCountry, couponCode, customerPincode, options) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new CheckoutValidationError(400, "Cart items are required.", "INVALID_CART");
    }
    let dbProducts = await getStoreValue("products") || [];
    if (!dbProducts || dbProducts.length === 0) {
      dbProducts = INITIAL_PRODUCTS;
    }
    const siteSettings = await getStoreValue("site_settings") || INITIAL_SITE_SETTINGS;
    const isIndia = isIndiaCountry(customerCountry);
    let subtotalINR = 0;
    let totalWeightKg = 0;
    let allProductsHaveAuthoritativeWeight = true;
    const validatedItems = [];
    for (const item of items) {
      const pId = item.productId || item.id;
      const prod = dbProducts.find((p) => p.id === pId);
      if (!prod) {
        throw new CheckoutValidationError(400, `Product "${pId}" was not found or is currently unavailable.`, "PRODUCT_NOT_FOUND");
      }
      const availCheck = isProductAvailableForCountry(prod, customerCountry);
      if (!availCheck.available) {
        throw new CheckoutValidationError(400, availCheck.reason || `Item "${prod.name}" is not eligible for delivery to ${customerCountry}.`, "DESTINATION_RESTRICTED");
      }
      const rawQty = Number(item.quantity);
      if (!Number.isFinite(rawQty) || rawQty <= 0 || !Number.isInteger(rawQty)) {
        throw new CheckoutValidationError(400, `Invalid quantity for "${prod.name}".`, "INVALID_QUANTITY");
      }
      if (rawQty > 100) {
        throw new CheckoutValidationError(400, `Maximum allowable order quantity for "${prod.name}" is 100 units per order.`, "EXCESSIVE_QUANTITY");
      }
      const qty = rawQty;
      if (options?.validateStock !== false) {
        if (prod.inStock === false) {
          throw new CheckoutValidationError(400, `"${prod.name}" is currently out of stock.`, "OUT_OF_STOCK");
        }
        if (typeof prod.stock === "number" && Number.isFinite(prod.stock) && prod.stock < qty) {
          throw new CheckoutValidationError(
            400,
            `Only ${prod.stock} unit(s) available for "${prod.name}". Please adjust quantity.`,
            "INSUFFICIENT_STOCK"
          );
        }
      }
      const itemPrice = getProductPriceINRForCountry(prod, customerCountry);
      const rawWeight = typeof prod.shippingWeightKg === "number" && Number.isFinite(prod.shippingWeightKg) && prod.shippingWeightKg > 0 ? prod.shippingWeightKg : typeof prod.weightInKg === "number" && Number.isFinite(prod.weightInKg) && prod.weightInKg > 0 ? prod.weightInKg : typeof prod.weight === "number" && Number.isFinite(prod.weight) && prod.weight > 0 ? prod.weight : void 0;
      const hasAuthoritativeWeight = typeof rawWeight === "number" && Number.isFinite(rawWeight) && rawWeight > 0;
      if (!hasAuthoritativeWeight) {
        allProductsHaveAuthoritativeWeight = false;
      }
      const itemWeight = hasAuthoritativeWeight ? rawWeight : isIndia ? 0.5 : 0;
      subtotalINR += itemPrice * qty;
      totalWeightKg += itemWeight * qty;
      validatedItems.push({
        product: prod,
        quantity: qty,
        unitPriceINR: itemPrice,
        totalPriceINR: itemPrice * qty
      });
    }
    if (validatedItems.length === 0 && items.length > 0) {
      throw new CheckoutValidationError(400, "Invalid cart products or unavailable items.", "INVALID_CART");
    }
    let discountINR = 0;
    if (couponCode) {
      const coupons = await getStoreValue("coupons") || [];
      const validCoupon = coupons.find(
        (c) => c.code?.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive !== false
      );
      if (validCoupon) {
        if (validCoupon.discountType === "PERCENTAGE" || validCoupon.type === "PERCENTAGE" || validCoupon.discountType === "PERCENT") {
          discountINR = Math.round(subtotalINR * (validCoupon.discountValue || validCoupon.value || 0) / 100);
        } else {
          discountINR = Math.round(validCoupon.discountValue || validCoupon.value || 0);
        }
        discountINR = Math.min(discountINR, subtotalINR);
      }
    }
    const taxableAmount = Math.max(0, subtotalINR - discountINR);
    const taxINR = Math.round(taxableAmount * 0.05);
    let customLiveRateINR = null;
    let customCourierLabel = void 0;
    if (!isIndia && allProductsHaveAuthoritativeWeight && totalWeightKg > 0 && isShiprocketConfigured()) {
      try {
        let packageLength = void 0;
        let packageBreadth = void 0;
        let packageHeight = void 0;
        const lengths = [];
        const breadths = [];
        let aggregatedHeight = 0;
        let allHaveDims = validatedItems.length > 0;
        for (const item of validatedItems) {
          const prod = item.product || {};
          const l = typeof prod.shippingLengthCm === "number" && Number.isFinite(prod.shippingLengthCm) && prod.shippingLengthCm > 0 ? prod.shippingLengthCm : void 0;
          const b = typeof prod.shippingBreadthCm === "number" && Number.isFinite(prod.shippingBreadthCm) && prod.shippingBreadthCm > 0 ? prod.shippingBreadthCm : void 0;
          const h = typeof prod.shippingHeightCm === "number" && Number.isFinite(prod.shippingHeightCm) && prod.shippingHeightCm > 0 ? prod.shippingHeightCm : void 0;
          const qty = item.quantity || 1;
          if (l !== void 0 && b !== void 0 && h !== void 0) {
            lengths.push(l);
            breadths.push(b);
            aggregatedHeight += h * qty;
          } else {
            allHaveDims = false;
          }
        }
        if (allHaveDims && validatedItems.length > 0) {
          packageLength = Math.max(...lengths);
          packageBreadth = Math.max(...breadths);
          packageHeight = aggregatedHeight;
        }
        const liveRateRes = await estimateShippingRate({
          deliveryPincode: customerPincode || "00000",
          pickupPincode: siteSettings?.shiprocketPickupPincode ? String(siteSettings.shiprocketPickupPincode).trim() : void 0,
          country: customerCountry,
          countryCode: normalizeCountryCode(customerCountry),
          weightInKg: totalWeightKg,
          length: packageLength,
          breadth: packageBreadth,
          height: packageHeight,
          siteSettings
        });
        if (liveRateRes.serviceable && Number.isFinite(liveRateRes.estimatedRateINR) && liveRateRes.estimatedRateINR > 0) {
          customLiveRateINR = liveRateRes.estimatedRateINR;
          customCourierLabel = liveRateRes.courierName;
        }
      } catch (err) {
        console.warn("[Live Shiprocket rate query warning]:", err?.message || err);
      }
    }
    const shippingQuote = getAuthoritativeShippingQuote(
      taxableAmount,
      customerCountry,
      customLiveRateINR,
      customCourierLabel,
      siteSettings
    );
    if (!shippingQuote.serviceable && !options?.allowUnserviceable) {
      throw new CheckoutValidationError(400, `Shipping is currently not available to ${customerCountry}. Please contact support.`, "SHIPPING_UNAVAILABLE");
    }
    const shippingFeeINR = shippingQuote.serviceable ? shippingQuote.shippingFeeINR : 0;
    const grandTotalINR = Math.max(1, Math.round(taxableAmount + shippingFeeINR));
    return {
      subtotalINR,
      discountINR,
      taxINR,
      shippingFeeINR,
      grandTotalINR,
      validatedItems,
      isIndia,
      shippingQuote,
      totalWeightKg,
      courierName: shippingQuote.courierLabel
    };
  }
  app.post("/api/payments/razorpay/create-order", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      if (!checkPaymentRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: "Too many payment requests. Please wait a moment before trying again."
        });
      }
      const {
        items,
        customer,
        couponCode,
        currencyCode,
        expectedShippingFeeINR,
        expectedGrandTotalINR,
        expectedShippingSource
      } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: "Cart items are required." });
      }
      if (!customer || !customer.email || !customer.name) {
        return res.status(400).json({ success: false, error: "Customer details (name & email) are required." });
      }
      const {
        subtotalINR,
        discountINR,
        taxINR,
        shippingFeeINR,
        grandTotalINR,
        validatedItems,
        isIndia,
        shippingQuote
      } = await calculateOrderTotalServer(items, customer.country || "India", couponCode, customer.pincode);
      const hasExpectedQuote = expectedShippingFeeINR !== void 0 && expectedShippingFeeINR !== null || expectedGrandTotalINR !== void 0 && expectedGrandTotalINR !== null;
      if (hasExpectedQuote) {
        const feeDiff = expectedShippingFeeINR !== void 0 && expectedShippingFeeINR !== null ? Math.abs(Number(expectedShippingFeeINR) - shippingFeeINR) : 0;
        const totalDiff = expectedGrandTotalINR !== void 0 && expectedGrandTotalINR !== null ? Math.abs(Number(expectedGrandTotalINR) - grandTotalINR) : 0;
        const sourceDiff = expectedShippingSource && expectedShippingSource !== shippingQuote.source;
        if (feeDiff > 0.01 || totalDiff > 0.01 || sourceDiff) {
          return res.status(409).json({
            success: false,
            code: "QUOTE_CHANGED",
            error: "Shipping rates or order total have updated. Please review the updated total and continue.",
            message: "Shipping rates or order total have updated. Please review the updated total and continue.",
            shippingFeeINR,
            grandTotalINR,
            shippingSource: shippingQuote.source,
            shippingCourier: shippingQuote.courierLabel || null,
            subtotalINR,
            discountINR,
            taxINR
          });
        }
      }
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keyId || !keySecret || keyId === "rzp_test_placeholder" || keySecret === "placeholder_secret") {
        console.warn("[Razorpay Init Warning] Razorpay credentials missing or placeholder.");
        return res.status(400).json({
          success: false,
          error: isIndia ? "Razorpay gateway is not configured on this instance. Please select Cash on Delivery or configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in Settings." : "Razorpay gateway is not configured for online payments. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment settings.",
          code: "RAZORPAY_KEYS_NOT_CONFIGURED"
        });
      }
      const rzp = getRazorpayInstance();
      const dbCurrencies = await getStoreValue("currencies") || INITIAL_CURRENCIES;
      let requestedCurrency = (currencyCode || "").toString().trim().toUpperCase();
      if (!requestedCurrency) {
        requestedCurrency = isIndia ? "INR" : "USD";
      }
      if (isIndia && requestedCurrency !== "INR") {
        throw new CheckoutValidationError(400, "Orders within India must be processed in INR.", "INVALID_CURRENCY");
      }
      let rateToINR = 1;
      if (requestedCurrency !== "INR") {
        const matchedCurrency = dbCurrencies.find((c) => c.code === requestedCurrency) || INITIAL_CURRENCIES.find((c) => c.code === requestedCurrency);
        if (!matchedCurrency || typeof matchedCurrency.rateToINR !== "number" || !Number.isFinite(matchedCurrency.rateToINR) || matchedCurrency.rateToINR <= 0) {
          throw new CheckoutValidationError(400, `Currency "${requestedCurrency}" is not supported or has an invalid exchange rate.`, "INVALID_CURRENCY");
        }
        rateToINR = matchedCurrency.rateToINR;
      }
      const displayCurrency = requestedCurrency;
      let displayAmount = grandTotalINR;
      if (displayCurrency !== "INR") {
        displayAmount = Math.round(grandTotalINR / rateToINR * 100) / 100;
      }
      const validatedChargeCurrency = displayCurrency;
      const chargeAmount = displayAmount;
      let chargeAmountSubunit;
      const zeroDecimalCurrencies = /* @__PURE__ */ new Set(["JPY", "KRW", "UGX", "VND", "CLP", "PYG", "RWF"]);
      const threeDecimalCurrencies = /* @__PURE__ */ new Set(["BHD", "KWD", "OMR"]);
      if (zeroDecimalCurrencies.has(validatedChargeCurrency)) {
        chargeAmountSubunit = Math.round(chargeAmount);
      } else if (threeDecimalCurrencies.has(validatedChargeCurrency)) {
        chargeAmountSubunit = Math.round(chargeAmount * 1e3);
      } else {
        chargeAmountSubunit = Math.round(chargeAmount * 100);
      }
      const selectedCountry = customer.country || (isIndia ? "India" : "International");
      console.log("[Razorpay Order Init] Creating order for country:", selectedCountry, "currency:", validatedChargeCurrency);
      const receipt = `rec_${Date.now()}_${Math.floor(Math.random() * 1e3)}`;
      let razorpayOrder;
      try {
        razorpayOrder = await rzp.orders.create({
          amount: chargeAmountSubunit,
          currency: validatedChargeCurrency,
          receipt,
          notes: {
            customer_email: customer.email,
            customer_name: customer.name,
            customer_phone: customer.phone || "",
            customer_country: selectedCountry,
            display_currency: displayCurrency,
            display_amount: displayAmount,
            charge_currency: validatedChargeCurrency,
            charge_amount: chargeAmount
          }
        });
      } catch (rzpErr) {
        console.error(`[Razorpay Order Creation Error] Failed creating order in ${validatedChargeCurrency}:`, rzpErr?.message || rzpErr);
        const rzpErrMsg = (rzpErr?.error?.description || rzpErr?.message || "").toString();
        let errorMsg = "Failed to create payment order with Razorpay.";
        if (rzpErrMsg.toLowerCase().includes("auth")) {
          errorMsg = "Razorpay authentication failed. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET credentials.";
        } else if (rzpErrMsg.toLowerCase().includes("currency")) {
          errorMsg = `Currency ${validatedChargeCurrency} cannot currently be charged directly via Razorpay. Please choose INR or Cash on Delivery.`;
        } else if (rzpErrMsg) {
          errorMsg = `Razorpay error: ${rzpErrMsg}`;
        }
        return res.status(400).json({
          success: false,
          error: errorMsg,
          code: "RAZORPAY_API_ERROR"
        });
      }
      const localOrderId = `ord-${Date.now()}`;
      const orderNumber = `HV-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const optionalCustomerToken = req.cookies?.[CUSTOMER_TOKEN_COOKIE];
      const optionalPayload = optionalCustomerToken ? verifyCustomerToken(optionalCustomerToken) : null;
      const customerId = optionalPayload?.id;
      const localOrder = {
        id: localOrderId,
        orderNumber,
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        items: validatedItems,
        customer,
        ...customerId ? { customerId } : {},
        subtotalINR,
        taxINR,
        shippingFeeINR,
        discountAmountINR: discountINR,
        totalAmountINR: grandTotalINR,
        // Shipping Quote Metadata
        shippingSource: shippingQuote.source,
        shippingCourier: shippingQuote.courierLabel || null,
        shippingQuotedAt: (/* @__PURE__ */ new Date()).toISOString(),
        // Single Source of Truth Currency Metadata
        displayAmount,
        displayCurrency,
        chargeAmount: razorpayOrder.amount ? razorpayOrder.amount / 100 : chargeAmount,
        chargeCurrency: razorpayOrder.currency || validatedChargeCurrency,
        exchangeRateUsed: rateToINR,
        currencyCode: displayCurrency,
        paymentMethod: "RAZORPAY",
        paymentStatus: "Pending Payment",
        trackingStatus: "ORDER_PLACED",
        razorpayOrderId: razorpayOrder.id,
        receipt,
        trackingNumber: "Awaiting Fulfillment",
        courierName: null
      };
      const existingOrders = await getStoreValue("orders") || [];
      await setStoreValue("orders", [localOrder, ...existingOrders]);
      return res.json({
        success: true,
        keyId: keyId || "rzp_test_placeholder",
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        displayAmount,
        displayCurrency,
        chargeAmount: razorpayOrder.amount ? razorpayOrder.amount / 100 : chargeAmount,
        chargeCurrency: razorpayOrder.currency || validatedChargeCurrency,
        orderId: localOrder.id,
        orderNumber: localOrder.orderNumber,
        grandTotalINR,
        displayOrder: localOrder
      });
    } catch (error) {
      if (error instanceof CheckoutValidationError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.code
        });
      }
      console.error("[Razorpay Create Order Error]:", error?.message);
      return res.status(500).json({
        success: false,
        error: "Failed to create payment order. Please verify your cart details and try again."
      });
    }
  });
  app.post("/api/payments/razorpay/verify", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      if (!checkPaymentRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: "Too many verification attempts. Please wait a moment."
        });
      }
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, localOrderId } = req.body;
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, error: "Missing required Razorpay payment parameters." });
      }
      if (typeof razorpay_payment_id !== "string" || typeof razorpay_order_id !== "string" || typeof razorpay_signature !== "string") {
        return res.status(400).json({ success: false, error: "Invalid payment parameters format." });
      }
      const cleanSignature = razorpay_signature.trim();
      if (!/^[0-9a-fA-F]{64}$/.test(cleanSignature)) {
        return res.status(400).json({
          success: false,
          error: "Invalid Razorpay payment signature format."
        });
      }
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        console.error("[Razorpay Verify Error] RAZORPAY_KEY_SECRET is not configured.");
        return res.status(500).json({
          success: false,
          error: "Payment verification service is temporarily unavailable."
        });
      }
      const hmac = import_crypto.default.createHmac("sha256", keySecret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest("hex");
      const expectedBuf = Buffer.from(generatedSignature, "hex");
      const receivedBuf = Buffer.from(cleanSignature, "hex");
      if (expectedBuf.length !== receivedBuf.length || !import_crypto.default.timingSafeEqual(expectedBuf, receivedBuf)) {
        console.error("[Razorpay Verify] Invalid signature mismatch");
        return res.status(400).json({
          success: false,
          error: "Razorpay payment signature verification failed."
        });
      }
      let paymentDetails = null;
      try {
        const rzp = getRazorpayInstance();
        paymentDetails = await rzp.payments.fetch(razorpay_payment_id);
        if (paymentDetails && paymentDetails.status !== "captured" && paymentDetails.status !== "authorized") {
          return res.status(400).json({
            success: false,
            error: `Razorpay payment is not confirmed (status: ${paymentDetails.status}).`
          });
        }
      } catch (fetchErr) {
        console.warn("[Razorpay Fetch Payment Warning]:", fetchErr?.message || fetchErr);
      }
      const existingOrders = await getStoreValue("orders") || [];
      const orderIndex = existingOrders.findIndex(
        (o) => o.id === localOrderId || o.razorpayOrderId === razorpay_order_id
      );
      if (orderIndex === -1) {
        return res.status(404).json({ success: false, error: "Order reference not found." });
      }
      const orderToUpdate = existingOrders[orderIndex];
      if (orderToUpdate.razorpayOrderId && orderToUpdate.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({ success: false, error: "Razorpay order ID mismatch." });
      }
      if (paymentDetails) {
        const expectedCurrency = (orderToUpdate.chargeCurrency || "INR").toUpperCase();
        let expectedSubunit = Math.round(orderToUpdate.totalAmountINR * 100);
        if (orderToUpdate.chargeCurrency && orderToUpdate.chargeCurrency.toUpperCase() !== "INR" && typeof orderToUpdate.chargeAmount === "number") {
          const zeroDecimalCurrencies = /* @__PURE__ */ new Set(["JPY", "KRW", "UGX", "VND", "CLP", "PYG", "RWF"]);
          const threeDecimalCurrencies = /* @__PURE__ */ new Set(["BHD", "KWD", "OMR"]);
          if (zeroDecimalCurrencies.has(expectedCurrency)) {
            expectedSubunit = Math.round(orderToUpdate.chargeAmount);
          } else if (threeDecimalCurrencies.has(expectedCurrency)) {
            expectedSubunit = Math.round(orderToUpdate.chargeAmount * 1e3);
          } else {
            expectedSubunit = Math.round(orderToUpdate.chargeAmount * 100);
          }
        }
        if (typeof paymentDetails.amount === "number" && paymentDetails.amount !== expectedSubunit) {
          console.error(`[Razorpay Verify Mismatch] Expected ${expectedSubunit} (${expectedCurrency}), received ${paymentDetails.amount}`);
          return res.status(400).json({
            success: false,
            error: "Payment amount mismatch. Payment flagged for security review."
          });
        }
        if (paymentDetails.currency && paymentDetails.currency.toUpperCase() !== expectedCurrency) {
          console.error(`[Razorpay Verify Mismatch] Expected currency ${expectedCurrency}, received ${paymentDetails.currency}`);
          return res.status(400).json({
            success: false,
            error: "Payment currency mismatch."
          });
        }
      }
      if (orderToUpdate.paymentStatus === "PAID" || orderToUpdate.paymentStatus === "Paid") {
        return res.json({
          success: true,
          order: orderToUpdate,
          message: "Order was already verified and marked paid."
        });
      }
      const updatedOrder = {
        ...orderToUpdate,
        paymentStatus: "Paid",
        trackingStatus: "ORDER_PLACED",
        razorpayPaymentId: razorpay_payment_id,
        paidAt: orderToUpdate.paidAt || (/* @__PURE__ */ new Date()).toISOString(),
        stockDeductedAt: orderToUpdate.stockDeductedAt || (/* @__PURE__ */ new Date()).toISOString(),
        isStockDeducted: true
      };
      existingOrders[orderIndex] = updatedOrder;
      await setStoreValue("orders", existingOrders);
      const isAlreadyDeducted = Boolean(orderToUpdate.stockDeductedAt || orderToUpdate.isStockDeducted);
      if (!isAlreadyDeducted && updatedOrder.items && Array.isArray(updatedOrder.items)) {
        const dbProducts = await getStoreValue("products") || [];
        const updatedProducts = dbProducts.map((prod) => {
          const itemMatch = updatedOrder.items.find(
            (i) => i.product && i.product.id === prod.id || i.productId === prod.id || i.id === prod.id
          );
          if (itemMatch) {
            const currentStock = typeof prod.stock === "number" ? prod.stock : 100;
            const newStock = Math.max(0, currentStock - (itemMatch.quantity || 1));
            return {
              ...prod,
              stock: newStock,
              inStock: newStock > 0
            };
          }
          return prod;
        });
        await setStoreValue("products", updatedProducts);
      }
      const paymentLogs = await getStoreValue("payment_logs") || [];
      const newLog = {
        id: `log-${Date.now()}`,
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customer.name,
        customerEmail: updatedOrder.customer.email,
        gateway: "RAZORPAY",
        amount: updatedOrder.totalAmountINR,
        currency: "INR",
        amountINR: updatedOrder.totalAmountINR,
        status: "SUCCESSFUL",
        transactionId: razorpay_payment_id,
        paymentMethodDetails: "Razorpay Secure Checkout",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await setStoreValue("payment_logs", [newLog, ...paymentLogs]);
      if (isShiprocketConfigured()) {
        createShiprocketOrderIfNeeded(updatedOrder).catch((srErr) => {
          console.warn("[Shiprocket Order Creation Error in Razorpay verify]:", srErr?.message || srErr);
        });
      }
      return res.json({
        success: true,
        order: updatedOrder,
        paymentId: razorpay_payment_id
      });
    } catch (error) {
      console.error("[Razorpay Verify Error]:", error?.message || error);
      return res.status(500).json({
        success: false,
        error: "Payment verification failed. Please contact customer support."
      });
    }
  });
  app.post("/api/payments/cod/create-order", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      if (!checkPaymentRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: "Too many order requests. Please wait a moment before trying again."
        });
      }
      const {
        items,
        customer,
        couponCode,
        expectedShippingFeeINR,
        expectedGrandTotalINR,
        expectedShippingSource
      } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: "Cart items are required." });
      }
      if (!customer || !customer.email || !customer.name) {
        return res.status(400).json({ success: false, error: "Customer details are required." });
      }
      const countryNormalized = (customer.country || "").trim().toLowerCase();
      const isIndia = countryNormalized === "india" || countryNormalized === "in";
      if (!isIndia) {
        throw new CheckoutValidationError(
          400,
          "Cash on Delivery (COD) is strictly available only for shipments within India.",
          "COD_NOT_AVAILABLE"
        );
      }
      const {
        subtotalINR,
        discountINR,
        taxINR,
        shippingFeeINR,
        grandTotalINR,
        validatedItems,
        shippingQuote
      } = await calculateOrderTotalServer(items, customer.country || "India", couponCode, customer.pincode);
      const hasExpectedQuote = expectedShippingFeeINR !== void 0 && expectedShippingFeeINR !== null || expectedGrandTotalINR !== void 0 && expectedGrandTotalINR !== null;
      if (hasExpectedQuote) {
        const feeDiff = expectedShippingFeeINR !== void 0 && expectedShippingFeeINR !== null ? Math.abs(Number(expectedShippingFeeINR) - shippingFeeINR) : 0;
        const totalDiff = expectedGrandTotalINR !== void 0 && expectedGrandTotalINR !== null ? Math.abs(Number(expectedGrandTotalINR) - grandTotalINR) : 0;
        const sourceDiff = expectedShippingSource && expectedShippingSource !== shippingQuote.source;
        if (feeDiff > 0.01 || totalDiff > 0.01 || sourceDiff) {
          return res.status(409).json({
            success: false,
            code: "QUOTE_CHANGED",
            error: "Shipping rates or order total have updated. Please review the updated total and continue.",
            message: "Shipping rates or order total have updated. Please review the updated total and continue.",
            shippingFeeINR,
            grandTotalINR,
            shippingSource: shippingQuote.source,
            shippingCourier: shippingQuote.courierLabel || null,
            subtotalINR,
            discountINR,
            taxINR
          });
        }
      }
      const localOrderId = `ord-${Date.now()}`;
      const orderNumber = `HV-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const optionalCustomerToken = req.cookies?.[CUSTOMER_TOKEN_COOKIE];
      const optionalPayload = optionalCustomerToken ? verifyCustomerToken(optionalCustomerToken) : null;
      const customerId = optionalPayload?.id;
      const newOrder = {
        id: localOrderId,
        orderNumber,
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        items: validatedItems,
        customer,
        ...customerId ? { customerId } : {},
        subtotalINR,
        taxINR,
        shippingFeeINR,
        discountAmountINR: discountINR,
        totalAmountINR: grandTotalINR,
        // Shipping Quote Metadata
        shippingSource: shippingQuote.source,
        shippingCourier: shippingQuote.courierLabel || null,
        shippingQuotedAt: (/* @__PURE__ */ new Date()).toISOString(),
        currencyCode: "INR",
        paymentMethod: "COD",
        paymentStatus: "COD Confirmed",
        stockDeductedAt: (/* @__PURE__ */ new Date()).toISOString(),
        isStockDeducted: true,
        trackingStatus: "Pending Fulfillment",
        trackingNumber: "Awaiting Fulfillment",
        courierName: null
      };
      const existingOrders = await getStoreValue("orders") || [];
      await setStoreValue("orders", [newOrder, ...existingOrders]);
      const dbProducts = await getStoreValue("products") || [];
      const updatedProducts = dbProducts.map((prod) => {
        const itemMatch = validatedItems.find((i) => i.product && i.product.id === prod.id || i.productId === prod.id || i.id === prod.id);
        if (itemMatch) {
          const currentStock = typeof prod.stock === "number" ? prod.stock : 100;
          const newStock = Math.max(0, currentStock - (itemMatch.quantity || 1));
          return {
            ...prod,
            stock: newStock,
            inStock: newStock > 0
          };
        }
        return prod;
      });
      await setStoreValue("products", updatedProducts);
      const paymentLogs = await getStoreValue("payment_logs") || [];
      const newLog = {
        id: `log-${Date.now()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customer.name,
        customerEmail: newOrder.customer.email,
        gateway: "COD",
        amount: grandTotalINR,
        currency: "INR",
        amountINR: grandTotalINR,
        status: "PENDING",
        transactionId: `COD_${orderNumber}`,
        paymentMethodDetails: "Cash on Delivery",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await setStoreValue("payment_logs", [newLog, ...paymentLogs]);
      if (isShiprocketConfigured()) {
        createShiprocketOrderIfNeeded(newOrder).catch((srErr) => {
          console.warn("[Shiprocket COD Order Creation Error]:", srErr?.message || srErr);
        });
      }
      return res.json({
        success: true,
        order: newOrder
      });
    } catch (error) {
      if (error instanceof CheckoutValidationError) {
        return res.status(error.statusCode).json({
          success: false,
          error: error.message,
          code: error.code
        });
      }
      console.error("[COD Create Order Error]:", error?.message);
      return res.status(500).json({
        success: false,
        error: "Failed to create Cash on Delivery order. Please try again."
      });
    }
  });
  app.post("/api/webhooks/razorpay", async (req, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error("[Razorpay Webhook Error] RAZORPAY_WEBHOOK_SECRET is not configured.");
        return res.status(500).json({
          success: false,
          error: "Webhook processing is temporarily unavailable."
        });
      }
      const rawBody = req.rawBody;
      if (!rawBody || !Buffer.isBuffer(rawBody)) {
        console.error("[Razorpay Webhook Error] Raw request body not available for signature verification.");
        return res.status(400).json({
          success: false,
          error: "Missing raw webhook payload."
        });
      }
      const signatureHeader = req.headers["x-razorpay-signature"];
      if (!signatureHeader || typeof signatureHeader !== "string") {
        return res.status(400).json({
          success: false,
          error: "Missing webhook signature header."
        });
      }
      const cleanSignature = signatureHeader.trim();
      if (!/^[0-9a-fA-F]{64}$/.test(cleanSignature)) {
        return res.status(400).json({
          success: false,
          error: "Invalid webhook signature format."
        });
      }
      const shasum = import_crypto.default.createHmac("sha256", webhookSecret);
      shasum.update(rawBody);
      const expectedDigest = shasum.digest("hex");
      const expectedBuf = Buffer.from(expectedDigest, "hex");
      const receivedBuf = Buffer.from(cleanSignature, "hex");
      if (expectedBuf.length !== receivedBuf.length || !import_crypto.default.timingSafeEqual(expectedBuf, receivedBuf)) {
        console.error("[Razorpay Webhook] Invalid signature mismatch");
        return res.status(400).json({
          success: false,
          error: "Invalid webhook signature."
        });
      }
      const event = req.body?.event;
      const payload = req.body?.payload;
      if (event === "payment.captured" || event === "order.paid") {
        const paymentEntity = payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id || payload?.order?.entity?.id;
        const razorpayPaymentId = paymentEntity?.id;
        if (razorpayOrderId && typeof razorpayOrderId === "string") {
          const existingOrders = await getStoreValue("orders") || [];
          const orderIdx = existingOrders.findIndex((o) => o.razorpayOrderId === razorpayOrderId);
          if (orderIdx !== -1) {
            const targetOrder = existingOrders[orderIdx];
            const expectedCurrency = (targetOrder.chargeCurrency || "INR").toUpperCase();
            let expectedSubunit = Math.round(targetOrder.totalAmountINR * 100);
            if (targetOrder.chargeCurrency && targetOrder.chargeCurrency.toUpperCase() !== "INR" && typeof targetOrder.chargeAmount === "number") {
              const zeroDecimalCurrencies = /* @__PURE__ */ new Set(["JPY", "KRW", "UGX", "VND", "CLP", "PYG", "RWF"]);
              const threeDecimalCurrencies = /* @__PURE__ */ new Set(["BHD", "KWD", "OMR"]);
              if (zeroDecimalCurrencies.has(expectedCurrency)) {
                expectedSubunit = Math.round(targetOrder.chargeAmount);
              } else if (threeDecimalCurrencies.has(expectedCurrency)) {
                expectedSubunit = Math.round(targetOrder.chargeAmount * 1e3);
              } else {
                expectedSubunit = Math.round(targetOrder.chargeAmount * 100);
              }
            }
            if (paymentEntity?.amount && typeof paymentEntity.amount === "number") {
              if (paymentEntity.amount !== expectedSubunit) {
                console.error(`[Razorpay Webhook Mismatch] Expected amount ${expectedSubunit} (${expectedCurrency}), received ${paymentEntity.amount}`);
                return res.status(400).json({ success: false, error: "Payment amount mismatch in webhook payload." });
              }
            }
            if (paymentEntity?.currency && paymentEntity.currency.toUpperCase() !== expectedCurrency) {
              console.error(`[Razorpay Webhook Mismatch] Expected currency ${expectedCurrency}, received ${paymentEntity.currency}`);
              return res.status(400).json({ success: false, error: "Payment currency mismatch in webhook payload." });
            }
            if (targetOrder.paymentStatus === "Paid" || targetOrder.paymentStatus === "PAID") {
              return res.json({ success: true, message: "Order was already verified and marked paid." });
            }
            const updatedOrder = {
              ...targetOrder,
              paymentStatus: "Paid",
              trackingStatus: "ORDER_PLACED",
              razorpayPaymentId: razorpayPaymentId || targetOrder.razorpayPaymentId,
              paidAt: targetOrder.paidAt || (/* @__PURE__ */ new Date()).toISOString(),
              stockDeductedAt: targetOrder.stockDeductedAt || (/* @__PURE__ */ new Date()).toISOString(),
              isStockDeducted: true
            };
            existingOrders[orderIdx] = updatedOrder;
            await setStoreValue("orders", existingOrders);
            const isAlreadyDeducted = Boolean(targetOrder.stockDeductedAt || targetOrder.isStockDeducted);
            if (!isAlreadyDeducted && targetOrder.items && Array.isArray(targetOrder.items)) {
              const dbProducts = await getStoreValue("products") || [];
              const updatedProds = dbProducts.map((p) => {
                const itemMatch = targetOrder.items.find(
                  (i) => i.product && i.product.id === p.id || i.productId === p.id || i.id === p.id
                );
                if (itemMatch) {
                  const stock = typeof p.stock === "number" ? p.stock : 100;
                  const newStock = Math.max(0, stock - (itemMatch.quantity || 1));
                  return { ...p, stock: newStock, inStock: newStock > 0 };
                }
                return p;
              });
              await setStoreValue("products", updatedProds);
            }
            const paymentLogs = await getStoreValue("payment_logs") || [];
            const existingLog = paymentLogs.find((l) => l.transactionId === razorpayPaymentId);
            if (!existingLog && razorpayPaymentId) {
              const newLog = {
                id: `log-${Date.now()}`,
                orderId: targetOrder.id,
                orderNumber: targetOrder.orderNumber,
                customerName: targetOrder.customer?.name || "Customer",
                customerEmail: targetOrder.customer?.email || "",
                gateway: "RAZORPAY",
                amount: targetOrder.totalAmountINR,
                currency: "INR",
                amountINR: targetOrder.totalAmountINR,
                status: "SUCCESSFUL",
                transactionId: razorpayPaymentId,
                paymentMethodDetails: "Razorpay Webhook Notification",
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              };
              await setStoreValue("payment_logs", [newLog, ...paymentLogs]);
            }
            if (isShiprocketConfigured()) {
              createShiprocketOrderIfNeeded(updatedOrder).catch((srErr) => {
                console.warn("[Shiprocket Webhook Order Creation Error]:", srErr?.message || srErr);
              });
            }
          } else {
            console.warn(`[Razorpay Webhook] Order reference not found for Razorpay order: ${razorpayOrderId}`);
          }
        }
      }
      return res.json({ success: true, message: "Webhook event processed successfully." });
    } catch (err) {
      console.error("[Razorpay Webhook Error]:", err?.message || err);
      return res.status(500).json({ success: false, error: "Webhook processing failed." });
    }
  });
  app.all("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
      code: "ROUTE_NOT_FOUND"
    });
  });
  app.use("/api", (err, req, res, next) => {
    console.error("[API Unhandled Error]:", err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal server error occurred.",
      code: err.code || "INTERNAL_SERVER_ERROR"
    });
  });
  app.get("/sw.js", (_req, res) => {
    const swPath = import_path2.default.join(process.cwd(), process.env.NODE_ENV === "production" ? "dist/sw.js" : "public/sw.js");
    const targetPath = import_fs2.default.existsSync(swPath) ? swPath : import_path2.default.join(process.cwd(), "public/sw.js");
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(targetPath);
  });
  app.get(["/manifest.webmanifest", "/manifest.json"], (req, res) => {
    const manifestPath = import_path2.default.join(process.cwd(), "public", req.path.endsWith(".json") ? "manifest.json" : "manifest.webmanifest");
    res.setHeader("Content-Type", "application/manifest+json");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(manifestPath);
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use("/assets", import_express.default.static(import_path2.default.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true
    }));
    app.use(import_express.default.static(distPath, {
      maxAge: 0,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
