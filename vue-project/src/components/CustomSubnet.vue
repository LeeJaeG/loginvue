<script setup>
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
// const  position = props.data.dimensions.width
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
const sourceHandleStyleA = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    top: '5px'
}))
const sourceHandleStyleB = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    top: '15px',
}))
const sourceHandleStyleC = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    top: '25px'
}))
const sourceHandleStyleD = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    top: '35px',
}))
</script>

<template>
    <div>{{ props.data.label }}</div>
    <!-- <div>{{ props.data.dimensions.height }}</div> -->

    <Handle id="a" type="source" :position="Position.Right" :style="sourceHandleStyleA" />
    <Handle id="b" type="source" :position="Position.Right" :style="sourceHandleStyleB" />
    <Handle id="c" type="source" :position="Position.Right" :style="sourceHandleStyleC" />
    <Handle id="d" type="source" :position="Position.Right" :style="sourceHandleStyleD" />
</template>