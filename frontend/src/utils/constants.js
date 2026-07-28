export const REGIONS = [
  'NCR (Metro Manila)', 'Region I – Ilocos', 'Region II – Cagayan Valley',
  'Region III – Central Luzon', 'Region IV-A – CALABARZON', 'Region IV-B – MIMAROPA',
  'Region V – Bicol', 'Region VI – Western Visayas', 'Region VII – Central Visayas',
  'Region VIII – Eastern Visayas', 'Region IX – Zamboanga Peninsula',
  'Region X – Northern Mindanao', 'Region XI – Davao', 'Region XII – SOCCSKSARGEN',
  'Region XIII – Caraga', 'BARMM', 'CAR (Cordillera)',
]

export const YEAR_LEVELS = [
  '1st Year College', '2nd Year College', '3rd Year College',
  '4th Year College', '5th Year College', "Master's – 1st Year", "Master's – 2nd Year",
]

export const INCOME_OPTIONS = [
  { label: 'Below ₱80,000 / year', value: 'below-80k', maxIncome: 80000 },
  { label: '₱80,001 – ₱200,000 / year', value: '80k-200k', maxIncome: 200000 },
  { label: '₱200,001 – ₱300,000 / year', value: '200k-300k', maxIncome: 300000 },
  { label: '₱300,001 – ₱480,000 / year', value: '300k-480k', maxIncome: 480000 },
  { label: 'Above ₱480,000 / year', value: 'above-480k', maxIncome: 999999999 },
]

export const OPTIONAL_DOCUMENTS = [
  {
    field: 'itr',
    label: 'BIR ITR or Tax Exemption Certificate',
    hint: "Verifies your family income bracket. Helps unlock income-gated scholarships.",
  },
  {
    field: 'certificate_of_indigency',
    label: 'Certificate of Indigency',
    hint: 'Supplemental proof of financial need — accepted as an alternative to ITR.',
  },
  {
    field: 'national_id',
    label: 'PhilID or PSA Birth Certificate',
    hint: 'Confirms your identity and citizenship for verification.',
  },
  {
    field: 'cor_or_tor',
    label: 'Certificate of Registration / Transcript of Records',
    hint: 'For current college/grad students — an alternate source for GWA and course.',
  },
]