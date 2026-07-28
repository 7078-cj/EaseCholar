import { create } from 'zustand'
import { extractAndMatch } from '../api/scholarships'
import { mapMatchResponse } from '../utils/mapResults'
import { INCOME_OPTIONS } from '../utils/constants'

function incomeBracketToNumber(bracketValue) {
  const opt = INCOME_OPTIONS.find((o) => o.value === bracketValue)
  return opt ? opt.maxIncome : undefined
}

const useMatchStore = create((set, get) => ({
  status: 'idle', 
  error: null,
  results: [],
  needsReview: false,
  reviewMessage: null,
  eligibleCount: 0,
  totalChecked: 0,
  rawResponse: null,

  runMatch: async (profile, documents) => {
    set({ status: 'loading', error: null })
    try {
      const response = await extractAndMatch({
        reportCard: documents.reportCard,
        optionalDocuments: documents.optional,
        overrides: {
          gwa: profile.gpa,
          family_income: incomeBracketToNumber(profile.incomeBracket),
          year_level: profile.yearLevel,
          course_interest: profile.course,
          region: profile.region,
        },
      })

      const results = mapMatchResponse(response)

      set({
        status: 'success',
        results,
        needsReview: !!response.needs_review,
        reviewMessage: response.review_message || null,
        eligibleCount: response.eligible_count ?? results.filter((r) => r.status === 'eligible').length,
        totalChecked: response.total_scholarships_checked ?? results.length,
        rawResponse: response,
      })

      return results
    } catch (err) {
      set({ status: 'error', error: err.message || 'Something went wrong while matching.' })
      throw err
    }
  },

  reset: () =>
    set({
      status: 'idle',
      error: null,
      results: [],
      needsReview: false,
      reviewMessage: null,
      eligibleCount: 0,
      totalChecked: 0,
      rawResponse: null,
    }),

  getById: (id) => get().results.find((r) => r.id === id) || null,
}))

export default useMatchStore