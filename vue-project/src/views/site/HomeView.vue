<template>
  <div class="px-5">
    <h1>This is a template page</h1>
    Ready for your content
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

onMounted(() => {
  contentBarName.value = 'Template'
})
</script>

<style></style>
