<template>
    <!-- content bar-->
    <div class="p-5 flex flex-column flex-auto" style="overflow: auto;">
        <RouterView />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>