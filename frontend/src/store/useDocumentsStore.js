import { create } from 'zustand'

const initialOptional = {
  itr: null,
  certificate_of_indigency: null,
  national_id: null,
  cor_or_tor: null,
}

const useDocumentsStore = create((set) => ({
  reportCard: null,
  optional: { ...initialOptional },

  setReportCard: (file) => set({ reportCard: file }),
  clearReportCard: () => set({ reportCard: null }),

  setOptionalDocument: (field, file) =>
    set((state) => ({ optional: { ...state.optional, [field]: file } })),

  clearOptionalDocument: (field) =>
    set((state) => ({ optional: { ...state.optional, [field]: null } })),

  resetDocuments: () => set({ reportCard: null, optional: { ...initialOptional } }),
}))

export default useDocumentsStore