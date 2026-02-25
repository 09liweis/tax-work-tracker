import { ref } from 'vue'

// global reactive object for logged-in user
export const loginUser = ref(null)

export function useUser() {
  const fetchMe = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const res: any = await $fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.success && res.user) {
        loginUser.value = res.user
        // Store user in localStorage for middleware access
        localStorage.setItem('user', JSON.stringify(res.user))
        return loginUser.value
      }
      return null
    } catch (err) {
      return null
    }
  }

  return { loginUser, fetchMe }
}