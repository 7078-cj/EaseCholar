import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const PREFIX = import.meta.env.VITE_API_PREFIX || '/api'

const apiClient = axios.create({
  baseURL: `${BASE_URL}${PREFIX}`,
  timeout: 45000, 
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null
    const data = error.response?.data ?? null

    let message = 'Something went wrong. Please try again.'
    if (error.code === 'ECONNABORTED') {
      message = "This is taking longer than expected. Check your connection and try again."
    } else if (!error.response) {
      message = "Can't reach the EaseKolar server. Please check your connection."
    } else if (data?.error) {
      message = data.error
    } else if (status === 422) {
      message = "We couldn't read your document clearly. Try a clearer photo."
    } else if (status >= 500) {
      message = 'The server ran into a problem on its end. Please try again shortly.'
    }

    return Promise.reject({ message, status, data, raw: error })
  }
)

export default apiClient