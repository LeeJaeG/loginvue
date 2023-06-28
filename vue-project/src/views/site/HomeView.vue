<template>
  <div>
    <h1>This is a template page</h1>
    Three card for navigating to three different pages, Physical, Cloud, and Services are displayed here.
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

onMounted(() => {
  contentBarName.value = 'Home'
})
</script>

<style></style>
