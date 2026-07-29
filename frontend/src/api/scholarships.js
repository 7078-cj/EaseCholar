import apiClient from './client'

export async function extractAndMatch({ reportCard, optionalDocuments = {}, overrides = {} }) {
  if (!reportCard) {
    throw { message: 'A report card / academic record image is required.', status: null, data: null }
  }

  const formData = new FormData()
  formData.append('report_card', reportCard)

  for (const [field, file] of Object.entries(optionalDocuments)) {
    if (file) formData.append(field, file)
  }

  for (const [field, value] of Object.entries(overrides)) {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(field, value)
    }
  }

  const { data } = await apiClient.post('/find/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  console.log('API response:', data) // Debugging: log the API response
  return data
}

export async function pingBackend() {
  const { data } = await apiClient.get('/test/')
  return data
}