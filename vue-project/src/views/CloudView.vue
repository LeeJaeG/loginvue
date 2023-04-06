<template>
    This is Cloud view page
    We will show cloud's (project) information like a Virtual Machine or Network list.
</template>

<script setup>
import { onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

onMounted(() => {
    contentBarName.value = 'Openstack Cloud'
})
</script>