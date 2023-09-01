<template>
    <div class="flex justify-content-between align-items-center backcolor topbar-font relative static border-bottom-2 surface-border"
        style="height:64px; padding-left: 40px;">
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

.topbar-font {
    font-size: 1.5rem;
    font-weight: bold;
}
</style>