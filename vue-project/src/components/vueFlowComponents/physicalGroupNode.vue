<template>
    <div>
        <div class="border-round flex justify-content-center align-items-start "
            style="height: 300px; background-color: white; border-color: rgb(100, 100, 100);"
            :style="{ 'width': props.data.width + 'px', 'height': props.data.height + 'px' }">
            <div class="flex w-full justify-content-center h-3rem align-items-center" :style="{ 'backgroundColor': color }">
                {{ props.label }}
            </div>
        </div>
    </div>
</template>

<script setup>
// hard coding for group color
// It must need pre-defined color map randomly or with some rule
const colorMap = {
    'Kaloom Backbone': 'green',
    'Service Baremetal': 'blue',
    'Edge core switch': 'red',
    'App servers': 'blue',
    'VMWare Cluster': 'blue',
    'Kaloom servers': 'blue',
    'Openstack Cluster': 'blue',

}
const documentStyle = getComputedStyle(document.body)
const color = documentStyle.getPropertyValue('--' + colorMap[props.label] + '-200')

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