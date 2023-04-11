<script setup>
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})
const sourceHandleStyleA = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    top: '10px'
}))
const sourceHandleStyleB = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    bottom: '5px',
    top: 'auto',
}))
const sourceHandleStyleC = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    top: '10px'
}))
const sourceHandleStyleD = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    bottom: '5px',
    top: 'auto',
}))
</script>

<template>
    <div>
        {{ props.data.label }}
        <div v-for="ip in props.data.data.ip">
            <div class="text-xs text-600 font-light">
                {{ ip }}
            </div>
        </div>
    </div>

    <Handle id="a" type="source" :position="Position.Left" :style="sourceHandleStyleA" />
    <Handle id="b" type="source" :position="Position.Left" :style="sourceHandleStyleB" />
    <!-- <Handle id="c" type="source" :position="Position.Right" :style="sourceHandleStyleC" />
                <Handle id="d" type="source" :position="Position.Right" :style="sourceHandleStyleD" /> -->
</template>

<!-- <script setup>
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
    left: '3px'
}))
const sourceHandleStyleB = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    left: '51px',
}))
const sourceHandleStyleC = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    left: '99px'
}))
const sourceHandleStyleD = computed(() => ({
    backgroundColor: props.data.color,
    // filter: 'invert(100%)',
    left: '147px',
}))
</script>
<template>
    <div>{{ props.data.label }}</div>
</div> -->

<!-- <Handle id="a" type="source" :position="Position.Top" :style="sourceHandleStyleA" />
<Handle id="b" type="source" :position="Position.Top" :style="sourceHandleStyleB" />
<Handle id="c" type="source" :position="Position.Top" :style="sourceHandleStyleC" />
    <Handle id="d" type="source" :position="Position.Top" :style="sourceHandleStyleD" />
</template> -->