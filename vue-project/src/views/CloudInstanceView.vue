
<template>
    <template>
        <Dialog v-model:visible="httpWorking" :closable=false modal>
            <ProgressSpinner />
        </Dialog>
    </template>
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
        <div class="flex flex-column w-5 surface-border border-right-2" style="">
            <div
                class="flex flex-column h-full m-3 p-3 justify-content-start align-items-center surface-card shadow-2 border-round">
                <div class="text-2xl font-bold mb-4">
                    세부 사항
                </div>
                <Skeleton v-if="getServerDetailsLoading" class="mx-4" style="width:100% ; height:100%" />
                <div v-else class="" style="width:100%">
                    <div v-for="value, key in selectedNodeInfo" :key="value">
                        {{ key }} : {{ value }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-column w-5 relative flex-auto">
            <div
                class="flex flex-column h-full m-3 p-3 justify-content-start align-items-center surface-card shadow-2 border-round">
                <Splitter style="height: 100% ; width: 100%" layout="vertical">
                    <SplitterPanel :size="80" class="flex align-items-center justify-content-center">
                        <Skeleton v-if="getServerVncUrlLoading" class="mx-4" style="width:100% ; height:100%" />
                        <iframe v-else :src="vncUrl" class="w-full border-1" style="height: 100%;" />
                    </SplitterPanel>
                    <SplitterPanel :size="20" class="flex align-items-center justify-content-center"> Panel 2
                    </SplitterPanel>
                </Splitter>
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
    contentBarName.value = 'Server details'
    getServerDetails(0)
    getServerVncUrl(0)
})

const selectedNodeInfo = ref()
const getServerDetailsLoading = ref(false)
const getServerDetails = (async (retry, ...theArgs) => {
    console.log("get Server's detail infomation ")
    try {
        getServerDetailsLoading.value = true
        const response = await axios.get('/api/openstack-server/vm_details/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id + '/' + vmID.value) // theArgs[0] = server_id
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
    console.log("get Server's detail infomation ")
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

const vncUrl = ref()
</script>