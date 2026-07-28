import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const defaultProfile = {
  name: '',
  region: '',
  school: '',
  yearLevel: '',
  course: '',
  gpa: '',
  incomeBracket: '',
  citizenship: true,
  track: 'undergraduate',
}

const useProfileStore = create(
  persist(
    (set, get) => ({
      profile: { ...defaultProfile },

      updateField: (key, value) =>
        set((state) => ({ profile: { ...state.profile, [key]: value } })),

      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),

      resetProfile: () => set({ profile: { ...defaultProfile } }),

      isStepValid: (step) => {
        const p = get().profile
        if (step === 1) return p.name.trim().length > 0 && p.region !== '' && p.citizenship
        if (step === 2) return p.yearLevel !== '' && p.gpa !== ''
        if (step === 3) return p.incomeBracket !== ''
        return true
      },
    }),
    {
      name: 'easekolar-profile',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
)

export default useProfileStore