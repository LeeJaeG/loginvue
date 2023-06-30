<template>
    <!-- content bar-->
    <div class="flex flex-column flex-none" style="height: calc(100% - 64px)">
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>