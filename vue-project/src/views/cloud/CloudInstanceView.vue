
<template>
    <!-- <template>
        <Dialog v-model:visible="httpWorking" :closable=false modal>
            <ProgressSpinner />
        </Dialog>
    </template> -->
    <div class=" flex surface-ground" style="height: 100% ">
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2">
            <div class="text-2xl font-bold mb-4 m-4">
                Actions
            </div>
            <div class="flex flex-column">
                <Button class="mx-4 mb-4 flex justify-content-center " style="font-size: x-large;"> Change Setting
                </Button>
                <Button class="mx-4 mb-4 flex justify-content-center " style=" font-size: x-large;"> Migrate </Button>
                <Button class="mx-4 mb-4 flex justify-content-center " style=" font-size: x-large;"> Add Floating IP
                </Button>
                <Button class="mx-4 mb-4 flex justify-content-center " style=" font-size: x-large;"> Reboot </Button>
                <Button class="mx-4 mb-4 flex justify-content-center " style=" font-size: x-large;"> Delete </Button>
            </div>
        </div>
        <div class="flex flex-column justify-content-between w-5 surface-border border-right-2 p-3">
            <div style="height: 49%;"
                class="flex flex-column p-0 justify-content-start align-items-start surface-card shadow-2 border-round">
                <div class="text-2xl font-bold m-3">
                    세부 사항
                </div>
                <Skeleton v-if="getServerDetailsLoading" style="width:100% ; height:100%" />
                <div v-else class="px-4" style="width:100%; overflow-y: scroll;">
                    <div v-for="value, key in selectedNodeInfo" :key="value">
                        {{ key }} : {{ value }}
                    </div>
                </div>
            </div>
            <div class="flex flex-column flex-grow-0 p-0 surface-card shadow-2 border-round" style="height: 49%;">
                <div class="flex justify-content-between align-items-center">
                    <div class="text-2xl font-bold m-3">
                        log
                    </div>
                    <div class="m-3">
                        길이 : 35 줄
                    </div>
                </div>
                <Skeleton v-if="getServerLogLoading" style="width:100% ; height:100%" />
                <pre v-else class="px-4 m-0 surface-ground" style="overflow-y: scroll;">
                    {{ serverLog }}
                </pre>
            </div>
        </div>
        <div class="flex flex-column w-5 relative flex-auto">
            <div
                class="flex flex-column h-full m-3 p-3 justify-content-start align-items-center surface-card shadow-2 border-round">
                <div style="height: 100% ; width: 100%">
                    <Skeleton v-if="getServerVncUrlLoading" style="width:100% ; height:100%" />
                    <iframe v-else :src="vncUrl" class="w-full border-1" style="height: 100%;" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router'

const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
const { userdata } = storeToRefs(user);
const route = useRoute()

const vmID = ref(route.params.id)

onMounted(() => {
    console.log(vmID.value)
    contentBarName.value = 'Cloud Server details'
    getServerDetails(0)
    getServerVncUrl(0)
    getServerLog(0)
})

const selectedNodeInfo = ref()
const getServerDetailsLoading = ref(false)
const getServerDetails = (async (retry, ...theArgs) => {
    console.log("get Server's detail infomation ")
    try {
        getServerDetailsLoading.value = true
        // + userdata.value.id + '/' + userdata.value.selectedProject.project_id + '/' 
        const response = await axios.get('/api/openstack-server/vm_details/' + vmID.value) // theArgs[0] = server_id
        selectedNodeInfo.value = response.data.data[0][0]
        getServerDetailsLoading.value = false
        // console.log(selectedNodeInfo.value)
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerDetails, retry, theArgs);
        }
    }
})

const getServerVncUrlLoading = ref(false)
const getServerVncUrl = (async (retry, ...theArgs) => {
    console.log("get Server's noVNC infomation ")
    try {
        getServerVncUrlLoading.value = true
        const response = await axios.get('/api/openstack-server/vm_console_vnc/' + vmID.value) // theArgs[0] = server_id
        vncUrl.value = response.data.data[0]
        getServerVncUrlLoading.value = false
        // console.log(selectedNodeInfo.value)
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerDetails, retry, theArgs);
        }
    }
})

const serverLog = ref()
const getServerLogLoading = ref(false)
const getServerLog = (async (retry, ...theArgs) => {
    console.log("get Server's Log infomation ")
    try {
        getServerLogLoading.value = true
        const response = await axios.get('/api/openstack-server/vm_console_log/' + vmID.value) // theArgs[0] = server_id
        // console.log(response)
        const cleanOutput = response.data.data[0]
        // Split the string into lines and get the last 35 lines
        const lines = cleanOutput.split('\n').slice(-35);
        // console.log(lines)
        // Join the lines back together into a string
        serverLog.value = lines.join("\n");
        // console.log(serverLog.value)

        getServerLogLoading.value = false
        // console.log(selectedNodeInfo.value)
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerLog, retry, theArgs);
        }
    }
})

const vncUrl = ref()
</script>

<style scoped>
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
</style>