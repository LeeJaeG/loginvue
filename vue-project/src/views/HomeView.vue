<template>
  <div>
    <h1>This is a Home page</h1>
    <!-- <cubeComponent></cubeComponent> -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';
// import cubeComponent from '../components/ThreejsCUBEComponent.vue'

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

onMounted(() => {
  contentBarName.value = 'Dashboard'
})
</script>

<style></style>
