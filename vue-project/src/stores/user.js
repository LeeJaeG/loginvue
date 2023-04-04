import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export const useUserStore = defineStore('user', () => {
  const info = ref({ checkLogin: 'logout', checkCloud:'notSelected'})
  const auth = ref({ accessToken: '', refreshToken: '' })
  function tokenErrorHandler(error, func,retry, theArgs) {
    if (error.response.data.detail === "Token has expired") {
      axios.post('/api/user/refresh_token', {
          "access_token": cookies.get('accessToken'),
          "refresh_token": cookies.get('accessRefresh'),
          "token_type": "bearer"
      })
          .then((response) => {
              console.log(response);
              cookies.set('accessToken', response.data.access_token);
              cookies.set('accessRefresh', response.data.refresh_token);
              retry += 1
              func(retry, theArgs);
          })
          .catch((error) => {
            console.log(error);
          });
  } else {
    alert(error);
  }
}
  return { info, auth, tokenErrorHandler }
}, {
  persist: {
    key: 'user-key',
    storage: sessionStorage, //  탭이 닫힐 때 사라짐, 로그아웃시 스토리지에서 삭제해줘야 함
  },
},)
