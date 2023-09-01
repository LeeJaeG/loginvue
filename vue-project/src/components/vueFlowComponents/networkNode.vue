<template>
    <div>
        <div class="border-1 border-round p-5 flex justify-content-center align-items-start"
            style="height: 300px; background-color: rgba(160, 160, 160, 0.1); border-color: rgb(100, 100, 100);"
            :style="{ 'width': props.data.width + 'px' }">
            {{ props.id }}
            <!-- <Handle id="a" type="source" :position="Position.Bottom" /> -->
        </div>
    </div>
</template>

<script setup>
// import { Handle, Position } from '@vue-flow/core'

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