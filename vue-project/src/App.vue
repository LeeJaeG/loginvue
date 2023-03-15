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

const offSidebar2 = ref(false);
</script>

<template>

<!-- Before login -->
<!-- <login></login> -->

<!-- After login -->
<div class="border-round-xl border-1 surface-border">

  <!-- Top bar -->
  <topbar></topbar>

   <!-- below Top bar -->
  <div>
    <!-- without sidebar 2 -->
    <div v-if="offSidebar2" class="flex relative lg:static surface-ground" style="height:93vh">
      <sidebar1></sidebar1>
      <div class="flex flex-column relative flex-auto">
        <contentbar></contentbar>
        <content></content>
      </div>
    </div>
    <!-- with sidebar 2 -->
    <div v-else class="flex relative lg:static surface-ground" style="height:93vh">
      <sidebar1></sidebar1>
      <sidebar2></sidebar2>
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

