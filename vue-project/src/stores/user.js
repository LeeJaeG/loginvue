import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const info = ref({ checkLogin: 'logout' })
  const auth = ref({ accessToken: '', refreshToken: '' })
  return { info, auth }
}, {
  persist: {
    key: 'user-key',
    storage: sessionStorage, //  탭이 닫힐 때 사라짐, 로그아웃시 스토리지에서 삭제해줘야 함
  },
},)
