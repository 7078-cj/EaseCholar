function computeMissingInputs(scholarshipRaw, studentUsed) {
  const missing = []

  if (scholarshipRaw.min_gwa_percent !== null && scholarshipRaw.min_gwa_percent !== undefined) {
    if (studentUsed?.gwa === null || studentUsed?.gwa === undefined) {
      missing.push({ key: 'gwa', label: 'GWA (Report Card / SF9 / COR)' })
    }
  }

  if (scholarshipRaw.max_family_income !== null && scholarshipRaw.max_family_income !== undefined) {
    if (studentUsed?.family_income === null || studentUsed?.family_income === undefined) {
      missing.push({ key: 'family_income', label: 'BIR ITR or Certificate of Indigency' })
    }
  }

  return missing
}

export function deriveStatus(result, studentUsed) {
  const missingInputs = computeMissingInputs(result.scholarship, studentUsed)
  if (missingInputs.length > 0) return 'missing'
  return result.eligible ? 'eligible' : 'not-eligible'
}

function pickWhyMatch(result) {
  const positive = result.reasons.filter(
    (r) => !/does not meet|exceeds|does not match/i.test(r)
  )
  if (positive.length > 0) return positive.slice(0, 2).join('; ')
  return result.reasons[0] || 'Based on your profile.'
}

function pickNotEligibleReason(result) {
  const failing = result.reasons.find((r) => /does not meet|exceeds|does not match/i.test(r))
  return failing || result.friendly_tips?.[0] || result.tips?.[0] || 'Does not meet a required cutoff.'
}

export function mapMatchResult(result, studentUsed) {
  const s = result.scholarship
  const status = deriveStatus(result, studentUsed)
  const missingInputs = computeMissingInputs(s, studentUsed)

  return {
    id: String(s.id),
    name: s.name,
    provider: s.provider,
    typeLabel: s.category || s.source_name || 'Scholarship',
    sourceName: s.source_name,
    matchPercent: Math.round(result.match_score),
    status, // 'eligible' | 'missing' | 'not-eligible'
    whyMatch: pickWhyMatch(result),
    notEligibleReason: status === 'not-eligible' ? pickNotEligibleReason(result) : null,
    missingInputs, // [{key, label}]
    region: s.region,
    gpaRequirement: s.min_gwa_percent,
    incomeRequirement: s.max_family_income,
    yearLevels: s.year_levels || [],
    courseKeywords: s.course_keywords || [],
    benefits: s.benefits || '',
    requirements: s.requirements || [],
    officialUrl: s.link,
    tips: result.friendly_tips?.length ? result.friendly_tips : result.tips,
    reasons: result.reasons,
    raw: result,
  }
}

export function mapMatchResponse(response) {
  const studentUsed = response.student_used_for_matching || {}
  return (response.results || []).map((r) => mapMatchResult(r, studentUsed))
}