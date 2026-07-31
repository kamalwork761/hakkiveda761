export type SupportedCurrencyCode = 'INR' | 'SGD' | 'MYR' | 'FJD' | 'MUR' | 'AED' | 'SAR' | 'NPR' | 'USD';

export interface CountryItem {
  code: string;
  iso2: string;
  name: string;
  flag: string;
  phoneCode: string;
  dialCode: string;
  currencyCode: SupportedCurrencyCode;
  currency: string;
  postalLabel: string;
  postalPlaceholder: string;
  phoneMinDigits: number;
  phoneMaxDigits: number;
  supportsLookup: boolean;
  region?: string;
  marketId?: string;
}

export function getCurrencyForCountry(code: string, name: string = ''): SupportedCurrencyCode {
  const upperCode = code.toUpperCase();
  const lowerName = name.toLowerCase();

  if (upperCode === 'IN' || lowerName.includes('india')) return 'INR';
  if (upperCode === 'SG' || lowerName.includes('singapore')) return 'SGD';
  if (upperCode === 'MY' || lowerName.includes('malaysia')) return 'MYR';
  if (upperCode === 'FJ' || lowerName.includes('fiji')) return 'FJD';
  if (upperCode === 'MU' || lowerName.includes('mauritius')) return 'MUR';
  if (upperCode === 'AE' || lowerName.includes('united arab emirates') || lowerName.includes('dubai') || lowerName.includes('uae')) return 'AED';
  if (upperCode === 'SA' || lowerName.includes('saudi arabia') || lowerName.includes('saudi')) return 'SAR';
  if (upperCode === 'NP' || lowerName.includes('nepal')) return 'NPR';

  return 'USD';
}

export function getMarketForCountry(code: string): string {
  const upperCode = code.toUpperCase();
  switch (upperCode) {
    case 'IN': return 'mkt-in';
    case 'SG': return 'mkt-sg';
    case 'MY': return 'mkt-my';
    case 'MU': return 'mkt-mu';
    case 'FJ': return 'mkt-fj';
    case 'AE': return 'mkt-ae';
    case 'SA': return 'mkt-sa';
    case 'NP': return 'mkt-np';
    default: return 'mkt-int';
  }
}

export function getRegionForCountry(code: string): string {
  const c = code.toUpperCase();
  
  if (['AE', 'SA', 'QA', 'KW', 'OM', 'BH'].includes(c)) return 'GCC';

  if ([
    'IN', 'SG', 'MY', 'NP', 'BD', 'LK', 'PK', 'BT', 'MV', 'TH', 'VN', 'ID', 'PH', 'CN', 'JP', 'KR', 
    'HK', 'TW', 'MO', 'KH', 'LA', 'MM', 'BN', 'TL', 'AF', 'AZ', 'AM', 'GE', 'KZ', 'KG', 'TJ', 'TM', 
    'UZ', 'IQ', 'IR', 'IL', 'JO', 'LB', 'SY', 'YE', 'PS'
  ].includes(c)) return 'Asia';

  if ([
    'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'SE', 'NO', 'FI', 'DK', 'IE', 'PL', 'AT', 'PT', 
    'GR', 'CZ', 'RO', 'HU', 'SK', 'SI', 'BG', 'HR', 'EE', 'LV', 'LT', 'IS', 'LU', 'MT', 'CY', 'AL', 
    'AD', 'BY', 'BA', 'LI', 'MD', 'MC', 'ME', 'MK', 'RS', 'SM', 'VA', 'UA', 'RU', 'FO', 'GI', 'AX', 
    'IM', 'JE', 'GG', 'SJB', 'SJ'
  ].includes(c)) return 'Europe';

  if ([
    'MU', 'ZA', 'EG', 'KE', 'NG', 'MA', 'GH', 'TZ', 'UG', 'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 
    'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GN', 'GW', 
    'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'YT', 'MZ', 'NA', 'NE', 'RE', 'RW', 'SH', 'ST', 'SN', 
    'SC', 'SL', 'SO', 'SS', 'SD', 'TG', 'TN', 'ZM', 'ZW', 'EH'
  ].includes(c)) return 'Africa';

  if ([
    'US', 'CA', 'MX', 'PR', 'JM', 'TT', 'BB', 'BS', 'BM', 'BZ', 'CR', 'CU', 'CW', 'DM', 'DO', 'SV', 
    'GD', 'GP', 'GT', 'HT', 'HN', 'MQ', 'MS', 'NI', 'PA', 'KN', 'LC', 'VC', 'SX', 'TC', 'AG', 'AI', 
    'AW', 'KY', 'MF', 'PM', 'VG', 'VI'
  ].includes(c)) return 'North America';

  if ([
    'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'PY', 'UY', 'BO', 'GY', 'SR', 'GF', 'FK'
  ].includes(c)) return 'South America';

  if ([
    'AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'WS', 'TO', 'AS', 'CK', 'PF', 'GU', 'KI', 'MH', 'FM', 'NR', 
    'NC', 'NU', 'NF', 'MP', 'PW', 'PN', 'TK', 'TV', 'UM', 'WF'
  ].includes(c)) return 'Oceania';

  return 'Asia';
}

export function codeToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌐';
  const uppercase = code.toUpperCase();
  const first = uppercase.charCodeAt(0) + 127397;
  const second = uppercase.charCodeAt(1) + 127397;
  return String.fromCodePoint(first, second);
}

// Map of international calling codes and validation constraints by ISO 2 code
const COUNTRY_CALLING_CODES: Record<string, { dialCode: string; minLen?: number; maxLen?: number; postalPlaceholder?: string }> = {
  IN: { dialCode: '+91', minLen: 10, maxLen: 10, postalPlaceholder: 'e.g. 141008' },
  US: { dialCode: '+1', minLen: 10, maxLen: 10, postalPlaceholder: 'e.g. 10282' },
  GB: { dialCode: '+44', minLen: 10, maxLen: 11, postalPlaceholder: 'e.g. SW1A 1AA' },
  AE: { dialCode: '+971', minLen: 8, maxLen: 9, postalPlaceholder: 'e.g. 00000' },
  SG: { dialCode: '+65', minLen: 8, maxLen: 8, postalPlaceholder: 'e.g. 049318' },
  MY: { dialCode: '+60', minLen: 9, maxLen: 10, postalPlaceholder: 'e.g. 50450' },
  FJ: { dialCode: '+679', minLen: 7, maxLen: 7, postalPlaceholder: 'e.g. 00240' },
  MU: { dialCode: '+230', minLen: 7, maxLen: 8, postalPlaceholder: 'e.g. 742CU001' },
  NP: { dialCode: '+977', minLen: 10, maxLen: 10, postalPlaceholder: 'e.g. 44600' },
  AU: { dialCode: '+61', minLen: 9, maxLen: 9, postalPlaceholder: 'e.g. 2000' },
  CA: { dialCode: '+1', minLen: 10, maxLen: 10, postalPlaceholder: 'e.g. M5V 2T6' },
  BO: { dialCode: '+591', minLen: 8, maxLen: 8, postalPlaceholder: 'e.g. 1234' },
  AF: { dialCode: '+93' }, AX: { dialCode: '+358' }, AL: { dialCode: '+355' }, DZ: { dialCode: '+213' },
  AS: { dialCode: '+1' }, AD: { dialCode: '+376' }, AO: { dialCode: '+244' }, AI: { dialCode: '+1' },
  AQ: { dialCode: '+672' }, AG: { dialCode: '+1' }, AR: { dialCode: '+54' }, AM: { dialCode: '+374' },
  AW: { dialCode: '+297' }, AT: { dialCode: '+43' }, AZ: { dialCode: '+994' }, BS: { dialCode: '+1' },
  BH: { dialCode: '+973' }, BD: { dialCode: '+880' }, BB: { dialCode: '+1' }, BY: { dialCode: '+375' },
  BE: { dialCode: '+32' }, BZ: { dialCode: '+501' }, BJ: { dialCode: '+229' }, BM: { dialCode: '+1' },
  BT: { dialCode: '+975' }, BA: { dialCode: '+387' }, BW: { dialCode: '+267' }, BV: { dialCode: '+47' },
  BR: { dialCode: '+55' }, IO: { dialCode: '+246' }, BN: { dialCode: '+673' }, BG: { dialCode: '+359' },
  BF: { dialCode: '+226' }, BI: { dialCode: '+257' }, KH: { dialCode: '+855' }, CM: { dialCode: '+237' },
  CV: { dialCode: '+238' }, KY: { dialCode: '+1' }, CF: { dialCode: '+236' }, TD: { dialCode: '+235' },
  CL: { dialCode: '+56' }, CN: { dialCode: '+86' }, CX: { dialCode: '+61' }, CC: { dialCode: '+61' },
  CO: { dialCode: '+57' }, KM: { dialCode: '+269' }, CG: { dialCode: '+242' }, CD: { dialCode: '+243' },
  CK: { dialCode: '+682' }, CR: { dialCode: '+506' }, CI: { dialCode: '+225' }, HR: { dialCode: '+385' },
  CU: { dialCode: '+53' }, CW: { dialCode: '+599' }, CY: { dialCode: '+357' }, CZ: { dialCode: '+420' },
  DK: { dialCode: '+45' }, DJ: { dialCode: '+253' }, DM: { dialCode: '+1' }, DO: { dialCode: '+1' },
  EC: { dialCode: '+593' }, EG: { dialCode: '+20' }, SV: { dialCode: '+503' }, GQ: { dialCode: '+240' },
  ER: { dialCode: '+291' }, EE: { dialCode: '+372' }, SZ: { dialCode: '+268' }, ET: { dialCode: '+251' },
  FK: { dialCode: '+500' }, FO: { dialCode: '+298' }, FI: { dialCode: '+358' }, FR: { dialCode: '+33' },
  GF: { dialCode: '+594' }, PF: { dialCode: '+689' }, TF: { dialCode: '+262' }, GA: { dialCode: '+241' },
  GM: { dialCode: '+220' }, GE: { dialCode: '+995' }, DE: { dialCode: '+49' }, GH: { dialCode: '+233' },
  GI: { dialCode: '+350' }, GR: { dialCode: '+30' }, GL: { dialCode: '+299' }, GD: { dialCode: '+1' },
  GP: { dialCode: '+590' }, GU: { dialCode: '+1' }, GT: { dialCode: '+502' }, GG: { dialCode: '+44' },
  GN: { dialCode: '+224' }, GW: { dialCode: '+245' }, GY: { dialCode: '+592' }, HT: { dialCode: '+509' },
  HM: { dialCode: '+672' }, VA: { dialCode: '+39' }, HN: { dialCode: '+504' }, HK: { dialCode: '+852' },
  HU: { dialCode: '+36' }, IS: { dialCode: '+354' }, ID: { dialCode: '+62' }, IR: { dialCode: '+98' },
  IQ: { dialCode: '+964' }, IE: { dialCode: '+353' }, IM: { dialCode: '+44' }, IL: { dialCode: '+972' },
  IT: { dialCode: '+39' }, JM: { dialCode: '+1' }, JP: { dialCode: '+81' }, JE: { dialCode: '+44' },
  JO: { dialCode: '+962' }, KZ: { dialCode: '+7' }, KE: { dialCode: '+254' }, KI: { dialCode: '+686' },
  KP: { dialCode: '+850' }, KR: { dialCode: '+82' }, KW: { dialCode: '+965' }, KG: { dialCode: '+996' },
  LA: { dialCode: '+856' }, LV: { dialCode: '+371' }, LB: { dialCode: '+961' }, LS: { dialCode: '+266' },
  LR: { dialCode: '+231' }, LY: { dialCode: '+218' }, LI: { dialCode: '+423' }, LT: { dialCode: '+370' },
  LU: { dialCode: '+352' }, MO: { dialCode: '+853' }, MG: { dialCode: '+261' }, MW: { dialCode: '+265' },
  MV: { dialCode: '+960' }, ML: { dialCode: '+223' }, MT: { dialCode: '+356' }, MH: { dialCode: '+692' },
  MQ: { dialCode: '+596' }, MR: { dialCode: '+222' }, YT: { dialCode: '+262' }, MX: { dialCode: '+52' },
  FM: { dialCode: '+691' }, MD: { dialCode: '+373' }, MC: { dialCode: '+377' }, MN: { dialCode: '+976' },
  ME: { dialCode: '+382' }, MS: { dialCode: '+1' }, MA: { dialCode: '+212' }, MZ: { dialCode: '+258' },
  MM: { dialCode: '+95' }, NA: { dialCode: '+264' }, NR: { dialCode: '+674' }, NL: { dialCode: '+31' },
  NC: { dialCode: '+687' }, NZ: { dialCode: '+64' }, NI: { dialCode: '+505' }, NE: { dialCode: '+227' },
  NG: { dialCode: '+234' }, NU: { dialCode: '+683' }, NF: { dialCode: '+672' }, MK: { dialCode: '+389' },
  MP: { dialCode: '+1' }, NO: { dialCode: '+47' }, OM: { dialCode: '+968' }, PK: { dialCode: '+92' },
  PW: { dialCode: '+680' }, PS: { dialCode: '+970' }, PA: { dialCode: '+507' }, PG: { dialCode: '+675' },
  PY: { dialCode: '+595' }, PE: { dialCode: '+51' }, PH: { dialCode: '+63' }, PN: { dialCode: '+64' },
  PL: { dialCode: '+48' }, PT: { dialCode: '+351' }, PR: { dialCode: '+1' }, QA: { dialCode: '+974' },
  RE: { dialCode: '+262' }, RO: { dialCode: '+40' }, RU: { dialCode: '+7' }, RW: { dialCode: '+250' },
  BL: { dialCode: '+590' }, SH: { dialCode: '+290' }, KN: { dialCode: '+1' }, LC: { dialCode: '+1' },
  MF: { dialCode: '+590' }, PM: { dialCode: '+508' }, VC: { dialCode: '+1' }, WS: { dialCode: '+685' },
  SM: { dialCode: '+378' }, ST: { dialCode: '+239' }, SA: { dialCode: '+966' }, SN: { dialCode: '+221' },
  RS: { dialCode: '+381' }, SC: { dialCode: '+248' }, SL: { dialCode: '+232' }, SX: { dialCode: '+1' },
  SK: { dialCode: '+421' }, SI: { dialCode: '+386' }, SB: { dialCode: '+677' }, SO: { dialCode: '+252' },
  ZA: { dialCode: '+27' }, GS: { dialCode: '+500' }, SS: { dialCode: '+211' }, ES: { dialCode: '+34' },
  LK: { dialCode: '+94' }, SD: { dialCode: '+249' }, SR: { dialCode: '+597' }, SJ: { dialCode: '+47' },
  SE: { dialCode: '+46' }, CH: { dialCode: '+41' }, SY: { dialCode: '+963' }, TW: { dialCode: '+886' },
  TJ: { dialCode: '+992' }, TZ: { dialCode: '+255' }, TH: { dialCode: '+66' }, TL: { dialCode: '+670' },
  TG: { dialCode: '+228' }, TK: { dialCode: '+690' }, TO: { dialCode: '+676' }, TT: { dialCode: '+1' },
  TN: { dialCode: '+216' }, TR: { dialCode: '+90' }, TM: { dialCode: '+993' }, TC: { dialCode: '+1' },
  TV: { dialCode: '+688' }, UG: { dialCode: '+256' }, UA: { dialCode: '+380' }, UM: { dialCode: '+1' },
  UY: { dialCode: '+598' }, UZ: { dialCode: '+998' }, VU: { dialCode: '+678' }, VE: { dialCode: '+58' },
  VN: { dialCode: '+84' }, VG: { dialCode: '+1' }, VI: { dialCode: '+1' }, WF: { dialCode: '+681' },
  EH: { dialCode: '+212' }, YE: { dialCode: '+967' }, ZM: { dialCode: '+260' }, ZW: { dialCode: '+263' },
};

function getPostalLabel(code: string): string {
  if (code === 'US') return 'ZIP Code';
  if (code === 'IN') return 'Pincode';
  if (code === 'GB') return 'Postcode';
  return 'Postal Code';
}

const LOOKUP_SUPPORTED_CODES = new Set(['IN', 'US', 'GB', 'SG', 'MY', 'CA', 'AU']);

// Complete list of ISO 3166-1 alpha-2 countries and territories worldwide
const RAW_COUNTRIES: { code: string; name: string }[] = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AX', name: 'Åland Islands' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua & Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia & Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo - Brazzaville' },
  { code: 'CD', name: 'Congo - Kinshasa' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CW', name: 'Curaçao' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard & McDonald Islands' },
  { code: 'VA', name: 'Vatican City' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong SAR China' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'North Korea' },
  { code: 'KR', name: 'South Korea' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao SAR China' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar (Burma)' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestinian Territories' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn Islands' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'St. Barthélemy' },
  { code: 'SH', name: 'St. Helena' },
  { code: 'KN', name: 'St. Kitts & Nevis' },
  { code: 'LC', name: 'St. Lucia' },
  { code: 'MF', name: 'St. Martin' },
  { code: 'PM', name: 'St. Pierre & Miquelon' },
  { code: 'VC', name: 'St. Vincent & Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'São Tomé & Príncipe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SX', name: 'Sint Maarten' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia & South Sandwich Islands' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard & Jan Mayen' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad & Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks & Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UM', name: 'U.S. Outlying Islands' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'VG', name: 'British Virgin Islands' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
  { code: 'WF', name: 'Wallis & Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

export const WORLD_COUNTRIES: CountryItem[] = RAW_COUNTRIES.map((c) => {
  const meta = COUNTRY_CALLING_CODES[c.code] || { dialCode: '+1' };
  const currencyCode = getCurrencyForCountry(c.code, c.name);
  return {
    code: c.code,
    iso2: c.code,
    name: c.name,
    flag: codeToFlag(c.code),
    phoneCode: meta.dialCode,
    dialCode: meta.dialCode,
    currencyCode: currencyCode,
    currency: currencyCode,
    postalLabel: getPostalLabel(c.code),
    postalPlaceholder: meta.postalPlaceholder || 'Postal / ZIP Code',
    phoneMinDigits: meta.minLen || 6,
    phoneMaxDigits: meta.maxLen || 12,
    supportsLookup: LOOKUP_SUPPORTED_CODES.has(c.code),
    region: getRegionForCountry(c.code),
    marketId: getMarketForCountry(c.code),
  };
});

export const DEFAULT_COUNTRY: CountryItem = WORLD_COUNTRIES.find((c) => c.code === 'IN') || {
  code: 'IN',
  iso2: 'IN',
  name: 'India',
  flag: '🇮🇳',
  phoneCode: '+91',
  dialCode: '+91',
  currencyCode: 'INR',
  currency: 'INR',
  postalLabel: 'Pincode',
  postalPlaceholder: 'e.g. 141008',
  phoneMinDigits: 10,
  phoneMaxDigits: 10,
  supportsLookup: true,
};

export function getCountryDetails(query: string): CountryItem {
  if (!query) return DEFAULT_COUNTRY;
  const q = query.trim().toLowerCase();

  const exact = WORLD_COUNTRIES.find(
    (c) => c.name.toLowerCase() === q || c.code.toLowerCase() === q || c.iso2.toLowerCase() === q
  );
  if (exact) return exact;

  const partial = WORLD_COUNTRIES.find(
    (c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())
  );

  return partial || DEFAULT_COUNTRY;
}

export function formatE164(dialCode: string, rawPhone: string): string {
  if (!rawPhone) return '';
  const cleanDigits = rawPhone.replace(/\D/g, '').replace(/^0+/, '');
  if (!cleanDigits) return '';
  const cleanDialCode = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return `${cleanDialCode}${cleanDigits}`;
}
