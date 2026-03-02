import { ref } from 'vue'
import { apiGet } from '~/utils/api'

// global reactive object for logged-in user
export const loginUser = ref(null)

export function useUser() {
  const fetchMe = async () => {
    try {
      const res: any = await apiGet('/api/users/me')
      if (res.success && res.user) {
        loginUser.value = res.user
        // Update token if refreshToken is provided
        if (res.refreshToken) {
          localStorage.setItem('token', res.refreshToken)
        }
        return loginUser.value
      }
      return null
    } catch (err) {
      return null
    }
  }

  return { loginUser, fetchMe }
}