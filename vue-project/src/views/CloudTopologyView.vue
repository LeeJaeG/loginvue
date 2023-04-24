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

const { onPaneReady } = useVueFlow()
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
const loading = ref(false)
const vueFlow = ref()
onMounted(() => {
    contentBarName.value = 'Openstack Topology'
    // console.log(userdata.value, info.value)
    getVueFlowForProject(0)
})

// const elements = ref(mockData)
</script>

<template>
    <div class=" flex relative lg:static surface-ground" style="height: 100%;">
        <div class="flex flex-column relative flex-auto">
            <div class="p-5 flex flex-column flex-auto">
                <div class="border-2 border-dashed surface-border border-round surface-section flex-auto">
                    <Skeleton v-if="!loading" class="mr-2 h-full" />
                    <!--  -->
                    <VueFlow v-else v-model="vueFlow" :node-types="nodeTypes" :default-zoom="1.5" :min-zoom="0.1"
                        :max-zoom="2" :nodes-draggable="true" :elevate-edges-on-select="true">
                        <MiniMap />
                        <Controls />
                        <Background gap="50" bg-color="rgba(255, 255, 255, 0.1)" variant="lines" />

                    </VueFlow>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/theme-default.css';
</style>