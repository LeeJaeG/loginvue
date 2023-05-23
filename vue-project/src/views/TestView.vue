<template>
    <div>
        <p>Window width: {{ windowWidth }}px</p>
        <p>Value based on window width: {{ computedValue }}</p>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const windowWidth = ref(window.innerWidth);
const computedValue = ref(0);

const updateComputedValue = () => {
    computedValue.value = window.innerWidth * 2; // Example computation based on window width
};

onMounted(() => {
    updateComputedValue(); // Call the method initially
    window.addEventListener('resize', handleResize); // Attach resize event listener
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize); // Remove resize event listener
});

const handleResize = () => {
    windowWidth.value = window.innerWidth; // Update window width on resize
};

watch(windowWidth, () => {
    updateComputedValue(); // Call the method whenever window width changes
});
</script>
  