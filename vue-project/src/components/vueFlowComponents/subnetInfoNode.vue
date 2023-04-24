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
    // left: '35px'
}))
// const sourceHandleStyleB = computed(() => ({
//     backgroundColor: 'white',
//     'border-color': props.data.color,
//     'border-width': '2px',
//     left: '65px',
// }))
// const sourceHandleStyleC = computed(() => ({
//     backgroundColor: 'white',
//     'border-color': props.data.color,
//     'border-width': '2px',
//     left: '95px'
// }))
// const sourceHandleStyleD = computed(() => ({
//     backgroundColor: 'white',
//     'border-color': props.data.color,
//     'border-width': '2px',
//     left: '125px',
// }))
</script>

<template>
    <Handle id="a" type="source" :position="Position.Bottom" :style="sourceHandleStyleA" />
    <!-- <Handle id="a" type="source" :position="Position.Bottom" :style="sourceHandleStyleA" />
            <Handle id="b" type="source" :position="Position.Bottom" :style="sourceHandleStyleB" />
            <Handle id="c" type="source" :position="Position.Bottom" :style="sourceHandleStyleC" />
            <Handle id="d" type="source" :position="Position.Bottom" :style="sourceHandleStyleD" /> -->
    <div class="border-1 border-round flex justify-content-center align-items-center text-center"
        style="width: 160px; height: 60px;"
        :style="{ 'background-color': props.data.color, 'border-color': props.data.color }">
        <!-- {{ props }} -->
        {{ props.label }} <br />
        : {{ props.data.cidr }}
    </div>
</template>