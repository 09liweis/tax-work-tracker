import { ref } from 'vue'

const user = ref(null)

export function useUser() {
  const fetchMe = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const res = await $fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.success) {
        user.value = res.user
        return user.value
      }
      return null
    } catch (err) {
      return null
    }
  }

  return { user, fetchMe }
}