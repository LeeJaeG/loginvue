<template>
    <Handle id="0" type="source" :position="Position.Top" :style="sourceHandleStyleA" />
    <Handle id="1" type="source" :position="Position.Top" :style="sourceHandleStyleB" />
    <div class="border-1 border-round flex justify-content-center align-items-center " style="width: 60px; height: 200px; "
        :style="{ 'background-color': props.data.color, 'border-color': props.data.color }">
        <div class="text-center p-0 m-0 rotate-text">
            {{ props.label }} <br />
            : {{ props.data.ip }}
        </div>
    </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'

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

const sourceHandleStyleA = computed(() => ({
    backgroundColor: 'white',
    'border-color': props.data.color,
    'border-width': '2px',
    left: '20px'
}))
const sourceHandleStyleB = computed(() => ({
    backgroundColor: 'white',
    'border-color': props.data.color,
    'border-width': '2px',
    left: '40px',
}))
</script>

<style scoped>
.rotate-text {
    /* display: inline-block; */
    transform: rotate(-90deg);
    /* Rotate text counterclockwise by 90 degrees */
    transform-origin: right left;
    /* Set the rotation origin to the top right corner */
    white-space: nowrap;
    /* Prevent text from wrapping */
}
</style>