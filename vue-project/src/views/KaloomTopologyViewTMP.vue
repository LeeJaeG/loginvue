<script setup>
// import mockNodeData from "@/mock/physicalNode.json"
// import mockEdgeData from "@/mock/physicalEdge.json"
import liveDeviceMetric from "@/mock/liveDeviceMetric.json"
import { ref, markRaw, onMounted } from 'vue'
import axios from 'axios'
import baremetalNode from '../components/vueFlowComponents/baremetalNode.vue'
import physicalGroupNode from '../components/vueFlowComponents/physicalGroupNode.vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/additional-components'
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

const vueFlow = ref()
const loading = ref(false)
const httpWorking = ref(false)
const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
// const { userdata } = storeToRefs(user);

const { onPaneReady, findEdge, fitView, zoomIn, zoomOut } = useVueFlow()

const nodeTypes = {
    baremetal: markRaw(baremetalNode),
    group: markRaw(physicalGroupNode),
}

onPaneReady(({ fitView }) => {
    fitView()
})

onMounted(() => {
    contentBarName.value = 'Kaloom Topology'
    // console.log(userdata.value, info.value)
    getVueFlowForKaloom(0)
})

const nodeTableForGroup = ref({})
const groupCategories = ref([{ 'name': 'All', 'key': 'A' }]);
const nodeCategories = ref([{ 'name': 'All', 'key': 'A' }]);
const interfaceCategories = ref([{ 'name': 'All', 'key': 'A' }]);
const groupCategoryChecked = ref('A')
const interfaceCategoryChecked = ref('All')
const nodeCategoryChecked = ref('All')
const originEdgeData = ref()
const originNodeData = ref()
const getVueFlowForKaloom = (async (retry, ...theArgs) => {
    console.log("getKaloomTopology")
    try {
        const response = await axios.get('/api/physical_topology/topology')
        vueFlow.value = []
        const mockEdgeData = response.data.front_edge_list
        const mockNodeData = response.data.front_node_list
        originEdgeData.value = mockEdgeData
        originNodeData.value = mockNodeData

        // group 별 toggle list 만들기 (그룹을 제외한 다른 노드와 엣지를 안 보이게 하는 용도)
        for (const item of mockNodeData) {
            if (item.label && item.type == 'group') {
                const interfaceValue = {
                    "name": item.label,
                    "key": item.id
                };
                const isDuplicate = groupCategories.value.some((existingValue) => {
                    return existingValue.name === interfaceValue.name;
                });
                if (!isDuplicate) {
                    groupCategories.value.push(interfaceValue);
                    nodeTableForGroup.value[item.id] = [];
                }
            }
        }

        // node 별 toggle list 만들기
        for (const item of mockNodeData) {
            // group 별 node list 만들기
            if (item.parentNode && item.type != 'group') {
                nodeTableForGroup.value[item.parentNode].push(item.id)
            }
            if (item.label && item.type != 'group') {
                const interfaceValue = {
                    "name": item.label,
                    "key": item.id,
                    "parent": item.parentNode,
                    "interfaces": item.data.interfaceGroup
                };
                const isDuplicate = nodeCategories.value.some((existingValue) => {
                    return existingValue.name === interfaceValue.name;
                });
                if (!isDuplicate) {
                    nodeCategories.value.push(interfaceValue);
                }
            }
        }

        // 인터페이스 그룹 toggle list 만들기
        for (const item of mockEdgeData) {
            if (item.data && item.data.interface) {
                const interfaceValue = {
                    "name": item.data.interface,
                    "key": "A"
                };
                const isDuplicate = interfaceCategories.value.some((existingValue) => {
                    return existingValue.name === interfaceValue.name;
                });
                if (!isDuplicate) {
                    interfaceCategories.value.push(interfaceValue);
                }
            }
        }

        vueFlow.value.push(...originNodeData.value);
        vueFlow.value.push(...originEdgeData.value);
        // console.log(JSON.stringify(vueFlow.value))
        vueFlow.value.forEach((e) => (e.data.watched = 0))

        // inject live Device Metric data to vueFlow data inside 'data' key 
        for (const deviceMetric in liveDeviceMetric[0]) {
            // Found deviceMetric in VueFlow 
            const foundDeviceMetric = vueFlow.value.find((e) => e.id == deviceMetric);
            if (foundDeviceMetric) {
                foundDeviceMetric.data = {
                    ...foundDeviceMetric.data,
                    ...liveDeviceMetric[0][deviceMetric]
                }
            }
        }
        liveDeviceMetric
        loading.value = true;
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getVueFlowForKaloom, retry, theArgs);
        }
    }
})

const clickGroupCategories = (checkedValue, beforeValue) => {
    if (checkedValue == beforeValue) {
        return
    }
    vueFlow.value.forEach((e) => {
        // console.log(e)
        if (e.data.type != 'edge') {
            e.data.watched = 0
            e.hidden = false
        }
    })
    if (nodeTableForGroup.value[checkedValue]) {
        for (let i = 0; i < vueFlow.value.length; i++) {
            if (!Object.values(nodeTableForGroup.value[checkedValue]).map(String).includes(vueFlow.value[i].id)) {
                if (vueFlow.value[i].type == 'baremetal') {
                    vueFlow.value[i].hidden = 'true';
                    vueFlow.value[i].data.watched += 1;
                }
            }
        }
    }
}

const clickNodeCategories = (checkedValue, beforeValue) => {
    if (checkedValue == beforeValue) {
        return
    }
    for (const nodeObject of originNodeData.value) {
        if (nodeObject.data.interfaceGroup != null && nodeObject.label == beforeValue && checkedValue != beforeValue) {
            for (const nodeInterface of nodeObject.data.interfaceGroup) {
                const tempEdge = findEdge(nodeInterface)
                if (tempEdge.data.watched > 1) {
                    tempEdge.data.watched -= 1
                } else {
                    tempEdge.animated = false
                    tempEdge.style = { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' }
                    tempEdge.data.watched -= 1
                }
            }
        }
        else if (nodeObject.data.interfaceGroup != null && nodeObject.label == checkedValue) {
            for (const nodeInterface of nodeObject.data.interfaceGroup) {
                const tempEdge = findEdge(nodeInterface)
                tempEdge.animated = true;
                tempEdge.style = { stroke: 'grey', strokeWidth: 5, 'stroke-dasharray': '5,5' };
                tempEdge.data.watched += 1
            }
        }
    }
}

const clickInterfaceCategories = (checkedValue, beforeValue) => {
    if (checkedValue == beforeValue) {
        return
    }
    for (const edgeObject of originEdgeData.value) {
        if (edgeObject.data.interface && edgeObject.data.interface == beforeValue) {
            const tempEdge = findEdge(edgeObject.id)
            if (tempEdge.data.watched > 1) {
                tempEdge.data.watched -= 1
            } else {
                tempEdge.animated = false
                tempEdge.style = { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' }
                tempEdge.data.watched -= 1
            }
        }
        else if (edgeObject.data.interface && edgeObject.data.interface == checkedValue) {
            const tempEdge = findEdge(edgeObject.id)
            tempEdge.style = { stroke: 'grey', strokeWidth: 5, 'stroke-dasharray': '5,5' };
            tempEdge.animated = true;
            tempEdge.data.watched += 1
        }
    }
    return
}

const selectedGroupInNavbar = ref(null)
const selectedNodeInNavbar = ref(null)
const selectedInterfaceInNavbar = ref(null)

</script>

<template>
    <template>
        <Dialog v-model:visible="httpWorking" :closable=false modal>
            <ProgressSpinner />
        </Dialog>
    </template>
    <div class=" flex surface-ground" style="height: 100%">
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="">
            <!-- Make tree navigation bar as like 'Device Group > Node > Interface' sequence -->
            <div class="m-4 flex">
                <div class="relative mr-2 cursor-pointer" v-ripple
                    v-styleclass="{ selector: '.grouplist', enterClass: 'hidden', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                    Group >
                    <div class="absolute grouplist hidden border-round shadow-2"
                        style="width : 200px; top: 30px; z-index: 999;">
                        <template v-for="group in groupCategories" :key="group">
                            <Button v-if="group.key != 'A'" @click="selectedGroupInNavbar = group"
                                class="text-sm text-color w-full flex justify-content-start align-items-center bg-white border-0 border-noround hover:bg-green-200">
                                {{ group.name }}
                            </Button>
                        </template>
                    </div>
                </div>
                <div v-if="selectedGroupInNavbar" class="relative mr-2 cursor-pointer" v-ripple
                    v-styleclass="{ selector: '.nodelist', enterClass: 'hidden', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                    Node >
                    <div class="absolute nodelist hidden border-round shadow-2"
                        style="width : 200px; top: 30px; z-index: 999;">
                        <template v-for="node in nodeCategories" :key="node">
                            <Button v-if="node.key != 'A' && node.parent == selectedGroupInNavbar.key"
                                @click="selectedNodeInNavbar = node"
                                class="text-sm text-color w-full flex justify-content-start align-items-center bg-white border-0 border-noround hover:bg-green-200">
                                {{ node.name }}
                            </Button>
                        </template>
                    </div>
                </div>
                <div v-if="selectedNodeInNavbar" class="relative mr-2 cursor-pointer" v-ripple
                    v-styleclass="{ selector: '.interfacelist', enterClass: 'hidden', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                    Interface
                    <div class="absolute interfacelist hidden border-round shadow-2"
                        style="width : 200px; top: 30px; z-index: 999;">
                        <template v-for="Interface in selectedNodeInNavbar.interfaces" :key="Interface">
                            <Button v-if="Interface != 'A'" @click="selectedInterfaceInNavbar = Interface"
                                class="text-sm text-color w-full flex justify-content-start align-items-center bg-white border-0 border-noround hover:bg-green-200">
                                {{ Interface }}
                            </Button>
                        </template>
                    </div>
                </div>
            </div>
            <div class="mx-4">
                {{ selectedGroupInNavbar ? selectedGroupInNavbar.name : '' }} <br />
                {{ selectedNodeInNavbar ? selectedNodeInNavbar.name : '' }} <br />
                {{ selectedInterfaceInNavbar ? selectedInterfaceInNavbar : '' }}
            </div>
        </div>
        <div class="flex flex-column relative flex-auto">
            <div class=" flex flex-column flex-auto">
                <div class="flex controls mx-5 mt-5">
                    <div class="flex ">
                        <Button class="border-noround border-0 mr-4"
                            style="height: 2.8rem; background-color: #2e3341; color: white; z-index: 99;">실시간
                            패킷 레이트 (5초)</Button>
                        <Button class="border-0 border-noround"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341" @click="zoomOut">
                            <i :class="'pi pi-minus'"></i>
                        </Button>
                        <Button class="border-0 border-noround"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341" @click="zoomIn">
                            <i :class="'pi pi-plus'"></i>
                        </Button>
                        <Button class="border-0 border-noround"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341" @click="fitView">
                            <i :class="'pi pi-stop'"></i>
                        </Button>
                    </div>
                </div>
                <div class="flex flex-grow-1 m-1">
                    <Skeleton v-if="!loading" class="mr-2 h-full" />
                    <VueFlow v-else v-model="vueFlow" class="basicflow" :node-types="nodeTypes" :default-zoom="1.5"
                        :min-zoom="0.1" :max-zoom="2" :nodes-draggable="true" :elevate-edges-on-select="true">
                        <Background gap="50" class="surface-ground" />
                    </VueFlow>
                </div>
            </div>
        </div>
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="">
            <div class=" text-2xl font-bold mx-4 mt-4">
                Toggle
            </div>
            <div class="mx-4" style="height: 30%;">
                <div class="text-lg font-medium my-3">
                    Group
                </div>
                <div class="overflow-y-scroll p-1" style="height: 80%;">
                    <div v-for="category of groupCategories" :key="category.key" class="field-radiobutton text-800 mb-4">
                        <RadioButton :inputId="category.key" name="category" :value="category.key"
                            v-model="groupCategoryChecked" :disabled="category.key === 'R'"
                            @click="clickGroupCategories(category.key, groupCategoryChecked)" />
                        <label :for="category.key">{{ category.name }}</label>
                    </div>
                </div>
            </div>
            <div class="mx-4" style="height: 30%;">
                <div class="text-lg font-medium my-3">
                    Node
                </div>
                <div class="overflow-y-scroll p-1" style="height: 80%;">
                    <div v-for="category of nodeCategories" :key="category.key" class="field-radiobutton text-800 mb-4">
                        <RadioButton :inputId="category.key" name="category" :value="category.name"
                            v-model="nodeCategoryChecked" :disabled="category.key === 'R'"
                            @click="clickNodeCategories(category.name, nodeCategoryChecked)" />
                        <label :for="category.key">{{ category.name }}</label>
                    </div>
                </div>
            </div>
            <div class="mx-4 " style="height: 30%;">
                <div class="text-lg font-medium my-3">
                    Interface
                </div>
                <div class="overflow-y-scroll p-1" style="height: 80%;">
                    <div v-for="category of interfaceCategories" :key="category.key"
                        class="field-radiobutton text-800 mb-4">
                        <RadioButton :inputId="category.key" name="category" :value="category.name"
                            v-model="interfaceCategoryChecked" :disabled="category.key === 'R'"
                            @click="clickInterfaceCategories(category.name, interfaceCategoryChecked)" />
                        <label :for="category.key">{{ category.name }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/theme-default.css';

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

.p-progressbar {
    background: #f0b4b4;
}

::v-deep(.p-progressbar) {
    .p-progressbar-value {
        background: #a7d99a;
    }
}
</style>