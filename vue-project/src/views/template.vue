<template>
  <div class=" flex surface-ground" style="height: 100%">
    <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="height: 100%">

    </div>
    <div class="flex flex-column relative flex-auto">
    </div>
    <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="height: 100%">

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

onMounted(() => {
  contentBarName.value = 'template'
})
</script>

<style></style>
