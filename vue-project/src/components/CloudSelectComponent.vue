<!-- eslint-disable vue/require-v-for-key -->
<template>
    <Toast />

    <Card style="width: 60rem; height: 35rem;">
        <template #header>
            <div class="flex align-items-center px-6 text-white text-2xl namu bgcolor" style="height: 3.7rem;">
                Select Cloud
            </div>
        </template>
        <template #content>
            <div class="flex h-full">
                <div class="flex flex-column w-9">
                    <div class="my-3 px-4 flex justify-content-between flex-wrap" style="height: 4rem;">
                        <div class="flex font-bold align-items-center w-6 text-xl pl-4">
                            Cloud List
                        </div>
                        <div class="w-6 flex align-items-center justify-content-end">
                            <div class="flex align-items-center font-bold mr-3" style="font-size: small;">
                                <Avatar icon="pi pi-user" class="mr-1" shape="circle" />
                                <div class="align-items-center">
                                    {{ userdata.username }}
                                </div>
                            </div>
                            <Dialog v-model:visible="visible" modal header="Header" :style="{ width: '25vw' }">
                                <template #header>
                                    <div class="font-bold text-xl">
                                        Add Cloud
                                    </div>
                                </template>

                                <div class="font-bold text-lg">
                                    Name
                                </div>
                                <div class="mt-2">
                                    <div class="flex flex-column gap-2 text-sm text-500">
                                        <label for="cloudname">Cloud Name</label>
                                        <InputText id="cloudname" v-model="cloudName" />
                                    </div>
                                </div>

                                <div class="font-bold text-lg mt-3">
                                    Host
                                </div>
                                <div class="mt-2">
                                    <div class="flex flex-column gap-2 text-sm text-500">
                                        <Dropdown v-model="selectedIP" :options="ips" optionLabel="ip"
                                            placeholder="IP address" class="w-full" />
                                    </div>
                                </div>

                                <template #footer>
                                    <div class="flex justify-content-center align-items-center" style="height: 4rem;">
                                        <Button label="취소" class="bg-white text-color border-300" @click="visible = false"
                                            text style="height: 2rem;" />
                                        <Button label="확인" class="bg-green-700" @click="visible = false"
                                            style="height: 2rem;" />
                                    </div>
                                </template>
                            </Dialog>
                            <Button type="button" icon="pi pi-plus" label="Add Cloud" @click="visible = true"
                                class="bgcolor border-0 p-2" style="height: 2rem; width: 7rem; font-size: small;" />
                        </div>
                    </div>

                    <div class="w-full flex-grow-1 p-2">
                        <!-- tableStyle="min-width: 50rem" -->
                        <DataTable v-ripple :value="allProjectList" class="shadow-1 p-ripple"
                            v-model:selection="selectedCloud" scrollable scrollHeight="400px" selectionMode="single"
                            @click="toggleShowCard">
                            <!-- <Column field="no" header="No."></Column> -->
                            <Column field="project_name" header="Name"></Column>
                            <Column field="project_description" header="Description"></Column>
                            <!-- <Column field="host" header="Host"></Column> -->
                            <Column style="flex: 0 0 4rem">
                                <template #body="slotProps">
                                    <div class='pi pi-angle-right hovercolor' @click="goToDashboard(slotProps)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>

                <div class="border-left  shadow-2 flex flex-column w-3  text-900">
                    <div class="flex justify-content-start align-items-center my-3 px-3 font-bold text-xl "
                        style="height:4rem">
                        Cloud Info
                    </div>
                    <div v-if="showCard" class="flex flex-grow-1 bg-white rounded-lg shadow-md">
                        <ul class="px-3 w-full">
                            <li v-for="(value, key) in selectedCloud" class="flex flex-column align-items-start"
                                style="height: 5rem;">
                                <div class="font-bold text-lg">
                                    {{ key }} <br />
                                </div>
                                <div class="">
                                    {{ value }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import {
    ref, onMounted
} from "vue";

import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

onMounted(() => {
    // console.log(userdata.value.projects)
    allProjectList.value = userdata.value.projects
})

const allProjectList = ref([]);
const user = useUserStore();
const { info, userdata } = storeToRefs(user);

const visible = ref(false);
const cloudName = ref('');

const selectedCloud = ref();

const showCard = ref(false);
const toggleShowCard = () => {
    if (!showCard.value) {
        showCard.value = true;
    }
};

const goToDashboard = (list) => {
    info.value.checkCloud = 'selected';
    console.log(list)
    userdata.value.selectedProject = list.data;
    // console.log(selectedCloud.value);
}

const selectedIP = ref();
const ips = ref([
    { ip: '192.168.53.50/24' },
    { ip: '192.168.53.51/24' },
    { ip: '192.168.53.52/24' },
    { ip: '192.168.53.53/24' },
    { ip: '192.168.53.54/24' },
    { ip: '192.168.53.-/24' }
]);

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@800&display=swap');

.namu {
    font-family: 'Nanum Gothic', sans-serif;
}

.bgcolor {
    background: linear-gradient(to right, #014751 20%, #0bc279 70%, #0fd977);
}

.p-card :deep(.p-card-body) {
    padding: 0px;
}

.p-card :deep(.p-card-content) {
    height: 31.3rem;
    padding: 0px;
}

.hovercolor:hover {
    /* background-color: #0bc279; */
    color: #0bc279;
    font-style: bold;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
    height: 5rem;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
    background: #daf5e5;
    color: #000000;
    font-weight: bold;
}

:deep(.p-datatable .p-datatable-tbody > tr:focus) {
    outline: 0.15rem solid #01c445;
    outline-offset: -0.15rem;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-selectable-row:hover) {
    background: #e8f6ed;
}

.p-button:hover {
    background: #014751;
}

:deep(.p-inputtext:focus) {
    outline: none;
}
</style>
