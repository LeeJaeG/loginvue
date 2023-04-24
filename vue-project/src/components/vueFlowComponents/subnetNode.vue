<template>
    <div class="border-1 border-round p-5 flex justify-content-center align-items-start"
        style=" height: 200px; background-color: white; border-color: rgb(100, 100, 100);" :style="{ 'width': '200px' }">
        {{ props.label }} {{ props.data.width }}
    </div>
</template>

<script setup>
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    }
})
</script>