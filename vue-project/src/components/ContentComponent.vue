<template>
    <!-- content bar-->
    <div class="flex flex-column flex-auto" style="overflow: auto;">
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>