import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePathStore = defineStore('path', () => {
  const contentBarName = ref('DashBoard')
  return { contentBarName, }
})
