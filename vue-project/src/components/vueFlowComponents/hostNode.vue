<template>
    <div>
        <div class="border-1 border-round p-5 flex justify-content-center align-items-end"
            style="height: 300px; background-color: white; border-color: rgb(100, 100, 100);"
            :style="{ 'width': props.data.width + 'px' }">
            {{ props.label }}
        </div>
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