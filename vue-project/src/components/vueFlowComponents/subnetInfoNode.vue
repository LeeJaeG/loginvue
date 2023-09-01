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
</script>

<template>
    <div>
        <Handle id="a" type="source" :position="Position.Bottom" :style="sourceHandleStyleA" />
        <div class="border-1 border-round flex justify-content-center align-items-center text-center"
            style="width: 160px; height: 60px;"
            :style="{ 'background-color': props.data.color, 'border-color': props.data.color }">
            {{ props.label }} <br />
            : {{ props.data.cidr }}
        </div>
    </div>
</template>