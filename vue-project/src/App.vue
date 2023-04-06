<script setup>
// css 참고자료 https://nykim.work/85 

// import login from "./components/LoginComponent.vue"


import sidebar1 from './components/Sidebar1Component.vue'
import sidebar2 from './components/Sidebar2Component.vue'
import content from './components/ContentComponent.vue'
import contentbar from './components/ContentbarComponent.vue'
import topbar from './components/TopbarComponent.vue'
import { ref, onMounted } from "vue";
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import LoginComponent from "@/components/LoginComponent.vue"
import CloudSelectComponent from "@/components/CloudSelectComponent.vue"
import { useCookies } from "vue3-cookies";
import { usePrimeVue } from "primevue/config";
const $primevue = usePrimeVue();
defineExpose({
  $primevue
})

const { cookies } = useCookies();

const user = useUserStore();
const { info } = storeToRefs(user);

const offSidebar1 = ref(false);
const offSidebar2 = ref(true);

const changeSidebar = () => {
  if (offSidebar1.value == false) {
    offSidebar1.value = true;
  }
  else {
    offSidebar1.value = false;
  }

  if (offSidebar2.value == false) {
    offSidebar2.value = true;
  }
  else {
    offSidebar2.value = false;
  }
}

onMounted(() => {
  if (cookies.get('refreshToken') != null) {
    console.log(cookies.get('refreshToken'));
    info.value.checkLogin = 'login'
    // console.log("onMounted", info.value.checkLogin)
  }
})

</script>

<template>
  <!-- Before login -->
  <div v-if="info.checkLogin == 'logout'">
    <div class="flex justify-content-center align-items-center min-h-screen"
      style="background-image: url('wallpaper.jpg'); background-size: cover;">
      <LoginComponent />
    </div>
  </div>
  <div v-else-if="info.checkLogin == 'login' && info.checkCloud == 'notSelected'">
    <div class="flex justify-content-center align-items-center min-h-screen"
      style="background-image: url('wallpaper.jpg'); background-size: cover;">
      <CloudSelectComponent />
    </div>
  </div>
  <!-- After login -->
  <div v-else class="border-round-xl surface-border overflow-x-scroll" style="min-width: 1800px;">
    <!-- Top bar -->
    <topbar></topbar>
    <!-- below Top bar -->
    <div class="flex relative static surface-ground" style="min-height: calc(100vh - 50px);">
      <!-- without sidebar 2 -->
      <div v-if="offSidebar1 == false && offSidebar2 == true">
        <sidebar1 class="min-h-full" @touch="changeSidebar"></sidebar1>
      </div>
      <!-- without sidebar 1 -->
      <div v-else-if="offSidebar1 == true && offSidebar2 == false">
        <sidebar2 class="min-h-full" @touch="changeSidebar"></sidebar2>
      </div>
      <div class="flex flex-column relative flex-auto">
        <contentbar></contentbar>
        <content></content>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

