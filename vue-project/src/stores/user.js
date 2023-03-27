import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const info = ref({ checkLogin: 'logout', checkCloud:'notSelected'})
  const auth = ref({ accessToken: '', refreshToken: '' })
  // function tokenErrorHandler(error, func_name ) {
  // if (error.code == 403 && error.body == 'please refresh access token'){
  //  // call func for api 
  //   console.log(error);
  // } 
  // }
  return { info, auth }
}, {
  persist: {
    key: 'user-key',
    storage: sessionStorage, //  탭이 닫힐 때 사라짐, 로그아웃시 스토리지에서 삭제해줘야 함
  },
},)
