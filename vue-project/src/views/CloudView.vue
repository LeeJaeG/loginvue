<template>
    <!-- This is Cloud view page
    We will show cloud's (project) information like a Virtual Machine or Network list. -->

    <div class="flex h-full p-5">
        <div
            class="flex flex-column w-6 mr-3 py-3 justify-content-start align-items-center surface-card shadow-2 border-round">
            <div class="text-2xl font-bold mb-4">
                VM servers
            </div>
            <div class="card flex-grow-1">
                <DataTable v-model:selection="selectedVM" :value="vmList" paginator :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]" tableStyle="min-width: 50rem">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="ip" header="IP"></Column>
                    <Column field="flavor" header="Flavor"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="age" header="Age"></Column>
                </DataTable>
            </div>
        </div>
        <!-- <div class="w-2">
            <div class="flex relative align-items-center justify-content-center mx-3 py-3 min-h-full">
                <div class="border-left-3 surface-border top-0 left-50 absolute h-full"></div>
            </div>
        </div> -->
        <div class="flex flex-column w-6 py-3 justify-content-start align-items-center surface-card shadow-2 border-round">
            <div class="text-2xl font-bold mb-4">
                Networks
            </div>
            <div class="card flex-grow-1">
                <DataTable v-model:selection="selectedNetwork" :value="networkList" paginator :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]" tableStyle="min-width: 50rem">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="subnet" header="Subnets"></Column>
                    <Column field="shared" header="공유"></Column>
                    <Column field="external" header="외부"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="upStatus" header="관리 상태"></Column>
                    <Column field="availableZone" header="가용성 존"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// import { useUserStore } from '@/stores/user'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';

const path = usePathStore();
// const user = useUserStore();
const { contentBarName } = storeToRefs(path);


onMounted(() => {
    contentBarName.value = 'Openstack Cloud'
    // getVMListInProject(0, vmList)
    // getNetworkListInProject(0, networkList)
})

const selectedVM = ref();
const vmList = ref([
    {
        name: 'Monitoring',
        image: 'centos7',
        ip: 'provider 192.168.53.173',
        flavor: 'm1.medium',
        status: 'Active',
        age: '1개월'
    }, {
        name: 'Open_VPN_Server',
        image: 'vpn_220829',
        ip: 'provider 192.168.53.140',
        flavor: 'm1.large',
        status: 'Active',
        age: '1개월, 3주'
    }, {
        name: 'pss_vm_test',
        image: 'ubuntu18',
        ip: 'provider 192.168.53.185',
        flavor: 'm1.small',
        status: 'Active',
        age: '4개월, 1주'
    }, {
        name: 'Grafana',
        image: 'centos7',
        ip: 'provider 192.168.53.184',
        flavor: 'm1.medium',
        status: 'Active',
        age: '5개월, 1주'
    }, {
        name: 'VPN_Server',
        image: 'vpn_220829',
        ip: 'provider 192.168.53.157',
        flavor: 'm1.medium',
        status: 'Active',
        age: '5개월, 3주'
    }
])

const selectedNetwork = ref();
const networkList = ref([{
    name: 'mgmt',
    subnet: 'mgmt 192.168.15.0/24',
    shared: '아니오',
    external: '예',
    status: 'Active',
    upStatus: 'UP',
    availableZone: 'nova',
}, {
    name: 'provider',
    subnet: 'provider 192.168.53.0/24',
    shared: '예',
    external: '예',
    status: 'Active',
    upStatus: 'UP',
    availableZone: 'nova',
}]);


// const getVMListInProject = (async (retry, ...theArgs) => {
//     console.log("getAllProject")
//     try {
//         const response = await axios.get('/api/openstack/ ~ ')
//         theArgs[0].value = response.data.data[0];
//     } catch (error) {
//         if (retry <= 2) {
//             user.tokenErrorHandler(error, getVMListInProject, retry, theArgs);
//         }
//     }
// })

// const getNetworkListInProject = (async (retry, ...theArgs) => {
//     console.log("getAllProject")
//     try {
//         const response = await axios.get('/api/openstack/ ~ ')
//         theArgs[0].value = response.data.data[0];
//     } catch (error) {
//         if (retry <= 2) {
//             user.tokenErrorHandler(error, getNetworkListInProject, retry, theArgs);
//         }
//     }
// })
</script>