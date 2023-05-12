<template>
    <div>
        <div class="flex justify-content-center align-items-center border-1 border-round"
            style="background-color: white; border-color: rgb(100, 100, 100);"
            :style="{ 'width': '200px', 'height': '200px' }">
            <div v-if="props.data.type == 'spine'"
                class="flex flex-column justify-content-center align-items-center bg-yellow-200 border-yellow-800 border-round border-2"
                :style="{ 'width': '150px', 'height': '150px' }">
                <div class="">
                    <img src="@/assets/switch.svg" alt="switch" style="width: 80px; height: 80px;" />
                </div>
                <div class="mt-3">
                    {{ props.label }}
                </div>
            </div>

            <div v-if="props.data.type == 'leaf'"
                class="flex flex-column justify-content-center align-items-center bg-green-100 border-green-800 border-round border-2"
                :style="{ 'width': '150px', 'height': '150px' }">
                <div class="">
                    <img src="@/assets/switch.svg" alt="switch" style="width: 80px; height: 80px;" />
                </div>
                <div class="mt-3">
                    {{ props.label }}
                </div>
            </div>

            <div v-if="props.data.type == 'baremetal'"
                class="flex flex-column justify-content-center align-items-center bg-blue-100 border-blue-800 border-round border-2"
                :style="{ 'width': '150px', 'height': '150px' }">
                <div class="">
                    <img src="@/assets/server.svg" alt="switch" style="width: 80px; height: 80px;" />
                </div>
                <div class="mt-3">
                    {{ props.label }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
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