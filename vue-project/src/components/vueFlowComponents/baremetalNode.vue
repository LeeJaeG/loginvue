<template>
    <div>
        <div v-if="handleList.includes(props.data.type)" class="flex justify-content-center align-items-center "
            style="background-color: white; border-color: rgb(100, 100, 100);"
            :style="{ 'width': '200px', 'height': '200px' }">
            <!-- check handle list has data.type -->
            <div class="flex flex-column justify-content-center align-items-center border-round border-2" :style="{
                'width': '200px', 'height': '200px',
                'backgroundColor': getColor(props.data.type).backgroundColor,
                'borderColor': getColor(props.data.type).borderColor
            }">
                <div class="">
                    <img src="@/assets/switch.svg" alt="switch" style="width: 80px; height: 80px;" />
                </div>
                <div class="mt-3">
                    {{ props.label }}
                </div>
            </div>
        </div>

        <div v-else class="flex flex-column justify-content-center align-items-center "
            style="background-color: white; border-color: rgb(100, 100, 100);"
            :style="{ 'width': '200px', 'height': '200px' }">
            <div class="relative flex flex-column justify-content-center align-items-center border-round border-2" :style="{
                'width': '200px', 'height': '200px',
                'backgroundColor': getColor(props.data.type).backgroundColor,
                'borderColor': getColor(props.data.type).borderColor
            }">
                <div class="absolute border-round bg-white shadow-2"
                    style="top:20px; left:25px; height: 40px; width: 150px;">
                    <div class="flex justify-content-center">
                        <div v-for="(metricValue, metricKey) in props.data.metricSummary" :key=metricKey class="mx-2">
                            <div class="flex justify-content-center align-items-center circle my-1 cursor-pointer"
                                :style="{ 'backgroundColor': metricStyleObject(metricValue.total) }"
                                @click="console.log('click')" v-tooltip="handleMetricTooltip(metricKey, metricValue)">
                                <div v-if="metricValue.status == 'err'"
                                    class="relative flex justify-content-center align-items-center"
                                    style="font-size: 30px;">
                                    <img src="@/assets/danger.svg" alt="error"
                                        style="width: 30px; height: 30px; top: -17.6px;" class="absolute" />
                                </div>
                            </div>
                            <div style="font-size: 9px;">
                                {{ metricKey.charAt(0) }} : {{ metricValue.total.toFixed(2) }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-7">
                    <img src="@/assets/server.svg" alt="switch" style="width: 80px; height: 80px;" />
                </div>
                <div class="mt-3">
                    {{ props.label }}
                    <!-- {{ props.id }} -->
                </div>
                <div v-for="id, i in props.data.inboundInterfaceGroup" :key="id">
                    <!-- {{ i }}, {{ id }}, {{ 200 / (props.data.inboundInterfaceGroup.length + 1) * (1 + i) }} -->
                    <Handle :id="id" class="border-noround w-1rem h-1rem bg-primary" :style="{
                        'left': (200 / (props.data.inboundInterfaceGroup.length + 1) * (1 + i)) + 'px',
                        'top': '-5px'
                    }" @click="console.log(id)" v-tooltip="id">
                    </Handle>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
// import { computed } from 'vue'
import { Handle } from '@vue-flow/core'
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

// spine, leaf, node에서 타입이 더 다양하게 늘어남에 따라서
// 지금은 타입을 분기처리로 셋을 나누고 있지만, 랜덤 컬러나 색상표를 만들어야 함.

const getColor = (type) => {
    const colorMap = {
        spine: {
            backgroundColor: '#faedc4', // yellow-100
            borderColor: '#816204' // yellow-800
        },
        leaf: {
            backgroundColor: '#B2DFDB', // Teal-100
            borderColor: '#00796B' // Teal-800
        },
        'openstack': {
            backgroundColor: '#BBDEFB', // Blue-200
            borderColor: '#1E88E5' // Blue-700
        },
        'Compute': {
            backgroundColor: '#BBDEFB', // Blue-200
            borderColor: '#1E88E5' // Blue-700
        },
        'Deployer': {
            backgroundColor: '#BBDEFB', // Blue-200
            borderColor: '#1E88E5' // Blue-700
        },
        'SDN controller': {
            backgroundColor: '#BBDEFB', // Blue-200
            borderColor: '#1E88E5' // Blue-700
        },
        'AI system': {
            backgroundColor: '#BBDEFB', // Blue-200
            borderColor: '#1E88E5' // Blue-700
        },
        'Controller': {
            backgroundColor: '#BBDEFB', // Blue-200
            borderColor: '#1E88E5' // Blue-700
        },
        'ESXi': {
            backgroundColor: '#BBDEFB', // Blue-200
            borderColor: '#1E88E5' // Blue-700
        },
        edge_core: {
            backgroundColor: '#FFCDD2', // Red-200
            borderColor: '#D32F2F' // Red-800
        }
        // Add more cases here if needed
    };

    const colorKeys = Object.keys(colorMap);
    const randomIndex = Math.floor(Math.random() * colorKeys.length);
    const randomColor = colorMap[colorKeys[randomIndex]];

    if (type in colorMap) {
        return colorMap[type];
    } else {
        return randomColor;
    }
};

const handleList = ['leaf', 'spine', 'edge_core'];

const metricStyleObject = ((A) => {
    if (A < 0.4) {
        return '#A7E521';
    } else if (A >= 0.4 && A < 0.7) {
        return '#FFD422';
    } else {
        return '#FF3333';
    }
});

const handleMetricTooltip = ((key, value) => {
    if (value.status == 'ok') {
        return key + ' : ' + value.total.toFixed(2) + '\n' + 'healthy state'
    }
    else if (value.status == 'err' && value.err_desc.msg) {
        const data = key + ' : ' + value.total.toFixed(2) + '\n' + 'error : ' + value.err_desc.msg
        return data;
    }
    else {
        return key + ' : ' + value.total.toFixed(2) + '\n' + 'error : message is not defined'
    }
}
)

</script>

<style scoped>
.circle {
    margin: 0 auto;
    width: 15px;
    height: 15px;
    border: 0px solid;
    border-radius: 50%;
}
</style>