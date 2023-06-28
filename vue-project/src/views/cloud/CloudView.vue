<template>
    <!-- This is Cloud view page
    We will show cloud's (project) information like a Virtual Machine or Network list. -->

    <div class="flex h-full p-5">
        <div
            class="flex flex-column w-6 mr-3 pt-3 justify-content-start align-items-center surface-card shadow-2 border-round">
            <div class="text-2xl font-bold mb-4">
                VM servers
            </div>
            <div class="flex card flex-grow-1 w-full justify-content-center overflow-x-scroll">
                <Skeleton v-if="loadingServerList" class="mx-4" style="width:100% ; height:100%" />
                <DataTable v-else v-model:selection="selectedVM" :value="vmList" paginator :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]" tableStyle="">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="server_name" header="Name">
                        <template #body="slotProps">
                            <div class="font-medium cursor-pointer" @click="goToServerDetailView(slotProps.data.server_id)"
                                v-ripple>
                                {{ slotProps.data.server_name }}
                            </div>
                        </template>
                    </Column>
                    <Column field="server_ip" header="IP"></Column>
                    <Column field="server_flavor" header="Flavor"></Column>
                    <Column field="server_status" header="Status"></Column>
                    <Column field="server_age" header="Age"></Column>
                </DataTable>
            </div>
        </div>
        <!-- <div class="w-2">
            <div class="flex relative align-items-center justify-content-center mx-3 py-3 min-h-full">
                <div class="border-left-3 surface-border top-0 left-50 absolute h-full"></div>
            </div>
        </div> -->
        <div class="flex flex-column w-6 pt-3 justify-content-start align-items-center surface-card shadow-2 border-round">
            <div class="text-2xl font-bold mb-4">
                Networks
            </div>
            <div class="flex card flex-grow-1 w-full justify-content-center overflow-x-scroll">
                <Skeleton v-if="loadingNetworkList" class="mx-4" style="width:100% ; height:100%" />
                <DataTable v-else v-model:selection="selectedNetwork" :value="networkList" paginator :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]" tableStyle="">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="network_name" header="Name"></Column>
                    <Column field="subnets" header="Subnets"></Column>
                    <Column field="shared" header="공유"></Column>
                    <Column field="external" header="외부"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="upStatus" header="관리 상태"></Column>
                    <Column field="availabilityZone" header="가용성 존"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment'
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { useUserStore } from '@/stores/user'
import { usePathStore } from '@/stores/path'
import { useServerStore } from '@/stores/server'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'

const router = useRouter()

const path = usePathStore();
const user = useUserStore();
const server = useServerStore();
const { contentBarName } = storeToRefs(path);
const { userdata } = storeToRefs(user);
const { instances } = storeToRefs(server);


onMounted(() => {
    contentBarName.value = 'Cloud Info'
    getVMListInProject(0)
    getNetworkListInProject(0)
})

const selectedVM = ref();
const selectedNetwork = ref();


const vmList = ref()
const loadingServerList = ref(true)
const getVMListInProject = (async (retry, ...theArgs) => {
    console.log("getAllVM")
    try {
        loadingServerList.value = true
        const response = await axios.get('/api/openstack-server/vm/' + userdata.value.selectedProject.project_id)
        vmList.value = response.data.data[0];
        var servers = []
        for (const i in vmList.value) {
            vmList.value[i].server_age = moment(vmList.value[i].server_age, 'YYYY-MM-DD HH:mm:ss').fromNow();
            servers.push(
                {
                    name: vmList.value[i].server_name,
                    id: vmList.value[i].server_id,
                }
            )
        }
        instances.value = servers
        loadingServerList.value = false
        // console.log(vmList.value)
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getVMListInProject, retry, theArgs);
        }
    }
})

const networkList = ref();
const loadingNetworkList = ref(false)
const getNetworkListInProject = (async (retry, ...theArgs) => {
    console.log("getAllNetwork")
    try {
        loadingNetworkList.value = true
        const response = await axios.get('/api/openstack-network/networks/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id)
        networkList.value = response.data.data[0];
        for (const i in networkList.value) {
            var sumOfSubnets = ''
            for (const subnet in networkList.value[i].subnets) {
                sumOfSubnets += subnet + ':' + networkList.value[i].subnets[subnet] + '\n'
            }
            networkList.value[i].subnets = sumOfSubnets
        }
        loadingNetworkList.value = false
        // console.log(networkList.value)
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getNetworkListInProject, retry, theArgs);
        }
    }
})

const goToServerDetailView = ((id) => {
    const path = '/cloud/instance/' + id;
    router.push({ path: path })
})
</script>

<style scoped>
.hovercolor:hover {
    /* background-color: #0bc279; */
    color: #0bc279;
    font-style: bold;
}
</style>