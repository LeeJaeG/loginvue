<script setup>
import { ref, markRaw, onMounted } from 'vue'
import axios from 'axios'
import networkNode from '../components/vueFlowComponents/networkNode.vue'
import hostNode from '../components/vueFlowComponents/hostNode.vue'
import subnetNode from '../components/vueFlowComponents/subnetNode.vue'
import subnetInfoNode from '../components/vueFlowComponents/subnetInfoNode.vue'
import vmNode from '../components/vueFlowComponents/vmNode.vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
const { userdata } = storeToRefs(user);

const { onPaneReady, onNodeDoubleClick } = useVueFlow()

onPaneReady(({ fitView }) => {
    fitView()
})

const nodeTypes = {
    network: markRaw(networkNode),
    host: markRaw(hostNode),
    vm: markRaw(vmNode),
    subnet: markRaw(subnetNode),
    subnetInfo: markRaw(subnetInfoNode),
}

const getVueFlowForProject = (async (retry, ...theArgs) => {
    console.log("getTopology")
    try {
        const response = await axios.get('/api/openstack/openstack_topology/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id)
        vueFlow.value = response.data.data[0];
        loading.value = true;
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getVueFlowForProject, retry, theArgs);
        }
    }
})

const getLiveByteMetricForAllEdge = (async (retry, ...theArgs) => {
    console.log("getLiveByteMetric ")
    try {
        const response = await axios.get('/api/openstack-metric/live_byte/' + userdata.value.selectedProject.project_id)
        // data : key(original_resource_id) : value(incoming byte + outcoming byte) 
        const source = response.data.data[0];
        for (var object in source) {
            var colorObject = pickColorbyValue(source[object].data);
            const objectForAddColorInfo = vueFlow.value.find((item) => {
                if (item.id.trim() == object.trim()) {
                    return item
                }
            })
            if (objectForAddColorInfo) {
                objectForAddColorInfo.data["colorObject"] = colorObject
            }
        }
        // change vueFlow Edge object's color, by value 
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getLiveByteMetricForAllEdge, retry, theArgs);
        }
    }
})

const live = ref(false)
const liveByte = (async () => {
    httpWorking.value = true
    if (live.value == false) {
        await getLiveByteMetricForAllEdge(0)
        changeColorOfEdges()
    } else {
        changeBackColorOfEdges()
    }
    httpWorking.value = false
    live.value = !live.value
})

const changeColorOfEdges = (() => {
    const EdgeObjects = onlyEdgeInVueFlow(vueFlow.value)
    console.log(EdgeObjects)
    for (var edgeIndex in EdgeObjects) {
        EdgeObjects[edgeIndex].animated = true;
        EdgeObjects[edgeIndex].style = { stroke: EdgeObjects[edgeIndex].data.colorObject.color, strokeWidth: 4 };
        // EdgeObjects[edgeIndex].label = EdgeObjects[edgeIndex].data.colorObject.value
        EdgeObjects[edgeIndex].labelBgPadding = [8, 4];
        EdgeObjects[edgeIndex].labelBgBorderRadius = 4;
        EdgeObjects[edgeIndex].labelBgStyle = { fill: EdgeObjects[edgeIndex].data.colorObject.color, color: '#fff', fillOpacity: 1.0 };
    }
})

const changeBackColorOfEdges = (() => {
    const EdgeObjects = onlyEdgeInVueFlow(vueFlow.value)
    for (var edgeIndex in EdgeObjects) {
        EdgeObjects[edgeIndex].animated = false;
        EdgeObjects[edgeIndex].style = { strokeWidth: 2 };
        // delete EdgeObjects[edgeIndex].label
    }
})

const getServerMetrics = (async (retry, ...theArgs) => {
    console.log("getLiveByteMetric ")
    try {
        const response = await axios.get('/api/openstack-metric/server_detail/' + theArgs[0]) // theArgs[0] = server_id
        selectedNodeMetric.value = response.data.data[0]
        // console.log(selectedNodeMetric.value)
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerMetrics, retry, theArgs);
        }
    }
})

const getServerDetails = (async (retry, ...theArgs) => {
    console.log("get Server's detail infomation ")
    try {
        const response = await axios.get('/api/openstack-server/vm_details/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id + '/' + theArgs[0]) // theArgs[0] = server_id
        selectedNodeInfo.value = response.data.data[0][0]
        // console.log(selectedNodeInfo.value)
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerDetails, retry, theArgs);
        }
    }
})

const pickColorbyValue = (value) => {
    const round = value.toFixed(0);
    const digit = round.toString();
    var number = ''
    let object = {}
    let temp = ''
    // console.log('check : ', value, digit.length);
    if (digit.length >= 10) {
        object.value = (value * 1e-9).toFixed(2) + 'Gbps'
        object.color = '#FF0000'
        return object
    } else if (10 > digit.length && digit.length >= 7) {
        object.value = (value * 1e-6).toFixed(2) + 'Mbps'
        temp = logConverterRY(value);
        number = Number(temp).toString(16).toUpperCase()
        if (number.length == 1) {
            number = '0' + number;
        }
        object.color = '#FF' + number + '00'
        return object
    } else if (7 > digit.length && digit.length >= 4) {
        object.value = (value * 1e-3).toFixed(2) + 'Kbps'
        temp = logConverterYG(value);
        number = Number(temp).toString(16).toUpperCase()
        if (number.length == 1) {
            // console.log("warning", number);
            number = '0' + number;
        }
        object.color = '#' + number + 'FF00'
        return object
    } else {
        object.value = value.toFixed(2) + 'bps'
        object.color = '#00FF00'
        return object
    }
}
const logConverterRY = (value) => {
    const number = -(255 / 3) * Math.log10(value) + (3 * 255)
    return number.toFixed(0)
}
const logConverterYG = (value) => {
    const number = (255 / 3) * Math.log10(value) - (255)
    return number.toFixed(0)
}

const displayNodeInfo = ref(false)
const displayNodeInfoName = ref()
const selectedNodeInfo = ref()
const selectedNodeMetric = ref()

const openNodeInfo = (async (id) => {
    try {
        httpWorking.value = true
        await Promise.all([getServerDetails(0, id), getServerMetrics(0, id)]);
        // displayNodeInfo.value = true;
        httpWorking.value = false
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

onNodeDoubleClick(({ node }) => {
    if (node.type == 'vm') {
        displayNodeInfoName.value = node.label;
        openNodeInfo(node.id);
    }
})

const loading = ref(false)
const vueFlow = ref([])
onMounted(() => {
    contentBarName.value = 'Openstack Topology'
    // console.log(userdata.value, info.value)
    getVueFlowForProject(0)
})

const graphOptions = ref(
    {
        responsive: false,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057',
                    font: {
                        size: 8
                    }
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057',
                    font: {
                        size: 8
                    }
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    }
);
const onlyVMInVueFlow = ((list) => {
    return list.filter(item => item.type === 'vm')
})
const onlyEdgeInVueFlow = ((list) => {
    return list.filter(item => item.data.type === 'edge')
})
const selectedObject = ref();
const httpWorking = ref(false);
</script>

<template>
    <template>
        <Dialog v-model:visible="httpWorking" :closable=false modal>
            <ProgressSpinner />
        </Dialog>
    </template>
    <div class=" flex surface-ground" style="height: 100% ">
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="">
            <div class="flex flex-none text-2xl font-bold mb-1 p-4">
                Detail Info
            </div>
            <div class="flex flex-column flex-grow-1" style="overflow-y: scroll;">
                <div v-for="value, key in selectedNodeInfo" class="flex flex-column list-none pl-2" :key='value'>
                    <div class="text-800 border-round font-semibold text-lg mb-1">
                        [ {{ key }} ] :
                    </div>
                    <div class="text-600 font-medium py-1 pl-1 mb-2">
                        {{ value }}
                    </div>
                </div>
            </div>
            <div class="flex flex-none text-2xl font-bold p-4">
                View Toggler
            </div>
            <div class="flex justify-content-between pb-4 px-6">
                <Button class="border-noround bg-teal-500 border-teal-500 hover:bg-teal-800 hover:border-teal-800"></Button>
                <Button class="border-noround"></Button>
                <Button class="border-noround"></Button>
            </div>
        </div>
        <div class="flex flex-column relative flex-auto">
            <div class="p-5 flex flex-column flex-auto">
                <div class="border-2 border-dashed surface-border border-round surface-section flex-auto">
                    <Skeleton v-if="!loading" class="mr-2 h-full" />
                    <VueFlow v-else v-model="vueFlow" :node-types="nodeTypes" class="basicflow" :default-zoom="1.5"
                        :min-zoom="0.1" :max-zoom="2" :nodes-draggable="true" :elevate-edges-on-select="true">
                        <MiniMap />
                        <Controls />
                        <Background gap="50" bg-color="rgba(255, 255, 255, 0.1)" variant="lines" />

                        <div class="controls">
                            <button style="background-color: #113285; color: white" @click="liveByte()">실시간 패킷 레이트
                                (20초)</button>
                        </div>

                        <Dialog v-bind:header="displayNodeInfoName" v-model:visible="displayNodeInfo" class="w-8">
                            <!-- <div class="flex justify-content-center">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="w-11 border-400 border-bottom-1 "></div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div> -->
                            <!-- <div class="py-3 px-6 flex justify-content-between">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <Dropdown v-model="selectedNode" :options="parentNodesName" optionLabel="name"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                placeholder="Select a node (Optional)" class="w-7" />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <Button label="실시간 마이그레이션" @click="liveMigration(displayNodeInfoDetail)" />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div> -->
                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>
                            <!-- VM detail information -->
                            <ul v-for="value, key in selectedNodeInfo" :key='value' class="list-none">
                                <div class="flex">
                                    <div class="bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                        {{ key }} :
                                    </div>
                                    <div class="text-600 font-medium  py-1 px-2">
                                        {{ value }}
                                    </div>
                                </div>
                            </ul>

                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>

                            <!-- <div class="my-2 px-6">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div v-if="checkELS">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="flex justify-content-between align-items-center">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        class="bg-blue-50 text-blue-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        RxTx Detail : </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <Button label="Show Detail" @click="showELS(displayNodeInfoDetail.vm_id)"></Button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div v-if="!checkELS">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="flex justify-content-end">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <Button label="Close Detail" @click="closeELS"></Button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="mt-2 flex justify-content-center">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <iframe v-bind:src="url" height="600" width="800"></iframe>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div> -->

                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>

                            <div v-for="value1, key1 in selectedNodeMetric" :key="value1">
                                <div class="text-lg text-600 font-medium px-6 my-2 flex justify-content-center">
                                    original resource id = {{ key1 }}
                                </div>
                                <!-- data 구조 : label = x 좌표 리스트 , datasets = [{label : ~ , data : y 좌표 리스트, fill : false}] -->
                                <ul v-for="graphData, key in value1" class="list-none w-full" :key="graphData">
                                    <div class="bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                        {{ key }}
                                    </div>
                                    <div class="card w-full flex justify-content-center">
                                        <Chart type="line" :data="graphData" :options="graphOptions" :width="800"
                                            :height="600" />
                                    </div>
                                </ul>
                                <div class="flex justify-content-center">
                                    <div class="w-11 border-400 border-bottom-1 "></div>
                                </div>
                            </div>
                        </Dialog>
                    </VueFlow>
                </div>
            </div>
        </div>
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 p-4 shadow-2">
            <div class="text-2xl font-bold mb-6">
                Detail List
            </div>
            <div v-for="object in onlyVMInVueFlow(vueFlow)" :key="object.label" class="flex align-items-center mb-4">
                <RadioButton v-model="selectedObject" :inputId="object.id" :value="object.label" />
                <label :for="object.key" class="ml-2 text-700">{{ object.label }}</label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/theme-default.css';

.vue-flow__minimap {
    transform: scale(75%);
    transform-origin: bottom right;
}

.basicflow .controls {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 4;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px
}

.basicflow .controls button {
    padding: 5px;
    border-radius: 5px;
    font-weight: 500;
    -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .3);
    box-shadow: 0 5px 10px #0000004d;
    cursor: pointer
}

.basicflow .controls button:hover {
    opacity: .8;
    transform: scale(105%);
    transition: .25s all ease
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #cbcaca;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.p-dialog .p-dialog-content {
    background-color: #6a5454;
}
</style>