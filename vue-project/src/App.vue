<script setup>
// css 참고자료 https://nykim.work/85 

import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

// import login from "./components/LoginComponent.vue"
import sidebar1 from './components/Sidebar1Component.vue'
import sidebar2 from './components/Sidebar2Component.vue'
import content from './components/ContentComponent.vue'
import contentbar from './components/ContentbarComponent.vue'
import topbar from './components/TopbarComponent.vue'
import { ref } from "vue";

const offSidebar1 = ref(false);
const offSidebar2 = ref(true);

const changeSidebar1 = () => {
  if (offSidebar1.value == false) {
    offSidebar1.value = true ;
  }
  else {
    offSidebar1.value = false ;
  }
  
}

const changeSidebar2 = () => {
  if (offSidebar2.value == false) {
    offSidebar2.value = true ;
  }
  else {
    offSidebar2.value = false ;
  }
  
}
</script>

<template>

<!-- Before login -->
<!-- <login></login> -->

<!-- After login -->
<div class="border-round-xl surface-border">

  <!-- Top bar -->
  <topbar></topbar>

   <!-- below Top bar -->
  <div>
    <!-- without sidebar 2 -->
    <div v-if="offSidebar1==false && offSidebar2==true" class="flex relative lg:static surface-ground" style="height:93vh">
      <sidebar1 @touch="changeSidebar2"></sidebar1>
      <div class="flex flex-column relative flex-auto">
        <contentbar></contentbar>
        <content></content>
      </div>
    </div>
    <!-- without sidebar 1 -->
    <div v-if="offSidebar1==true && offSidebar2==false" class="flex relative lg:static surface-ground" style="height:93vh">
      <sidebar2 @touch="changeSidebar1"></sidebar2>
      <div class="flex flex-column relative flex-auto">
        <contentbar></contentbar>
        <content></content>
      </div>
    </div>
    <!-- both sidebars -->
    <div v-else class="flex relative lg:static surface-ground" style="height:93vh">
      <sidebar1 @touch="changeSidebar1" class="mr-2"></sidebar1>
      <sidebar2 @touch="changeSidebar2"></sidebar2>
      <div class="flex flex-column relative flex-auto">
        <contentbar></contentbar>
        <content></content>
      </div>
    </div>
  </div>
</div>

</template>

<style scoped>
</style>

