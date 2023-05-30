import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useServerStore = defineStore('server', () => {
  const instances = ref([])
  return { instances,}
}, {
    persist: {
      key: 'server-key',
      storage: sessionStorage, //  탭이 닫힐 때 사라짐, 로그아웃시 스토리지에서 삭제해줘야 함
    },
  },)
