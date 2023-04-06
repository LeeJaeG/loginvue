<template>
    <div>
        <h1>This is an Kaloom Topology page</h1>
    </div>
</template>
    
<script setup>
import { onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

onMounted(() => {
    contentBarName.value = 'Kaloom Topology'
})
</script>
    
<style></style>
    