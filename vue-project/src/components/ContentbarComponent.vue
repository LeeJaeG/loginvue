<template>
    <div class="flex justify-content-between align-items-center px-5 backcolor text-4xl relative static border-bottom-2 surface-border"
        style="height:55px">
        {{ path.contentBarName }}
    </div>
</template>

<script setup>
import { usePathStore } from '@/stores/path'
// import { storeToRefs } from 'pinia';

const path = usePathStore();
// const { info, userdata } = storeToRefs(user);

</script>

<style scoped>
.backcolor {
    /* background: linear-gradient(#2f62f5, #0d00aa); */
    background-color: #fff;

}
</style>