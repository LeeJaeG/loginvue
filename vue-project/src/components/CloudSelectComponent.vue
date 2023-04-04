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
                                    Super manager
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
                        <DataTable v-ripple :value="mocks" class="shadow-1 p-ripple" v-model:selection="selectedCloud"
                            scrollable scrollHeight="400px" selectionMode="single" @click="toggleShowCard">
                            <Column field="no" header="No."></Column>
                            <Column field="name" header="Name"></Column>
                            <Column field="authority" header="Authority"></Column>
                            <Column field="host" header="Host"></Column>
                            <Column style="flex: 0 0 4rem">
                                <template #body="{}">
                                    <div class='pi pi-angle-right hovercolor' @click="goToDashboard" />
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
                            <li v-for="(value, key) in selectedCloud" class="flex flex-row align-items-center"
                                style="height: 2rem;">
                                <div class="flex font-bold w-6 text-lg">
                                    {{ key }}
                                </div>
                                <div class="flex w-6">
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
    ref
} from "vue";

import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
// import { useToast } from "primevue/usetoast";
// const toast = useToast();

const user = useUserStore();
const { info } = storeToRefs(user);

const visible = ref(false);
const cloudName = ref('');

// import {
//     useCookies
// } from "vue3-cookies";
// import axios from 'axios'
// const {
//     cookies
// } = useCookies();
const selectedCloud = ref();
const mocks = ref([
    {
        no: "01",
        name: "Cloud A",
        authority: "Admin",
        host: "192.168.15.40"
    },
    {
        no: "02",
        name: "Cloud B",
        authority: "-",
        host: "192.168.15.41"
    },
    {
        no: "03",
        name: "Cloud C",
        authority: "-",
        host: "192.168.15.42"
    },
    {
        no: "04",
        name: "Cloud D",
        authority: "-",
        host: "192.168.15.43"
    },
    {
        no: "05",
        name: "Cloud E",
        authority: "Admin",
        host: "192.168.15.44"
    },
    {
        no: "06",
        name: "Cloud F",
        authority: "-",
        host: "192.168.15.45"
    },
    {
        no: "07",
        name: "Cloud G",
        authority: "-",
        host: "192.168.15.46"
    },
    {
        no: "08",
        name: "Cloud H",
        authority: "-",
        host: "192.168.15.47"
    },
]);

const showCard = ref(false);
const toggleShowCard = () => {
    // console.log("test print")
    if (!showCard.value) {
        showCard.value = true;
    }
    // console.log(cookies.get('accessToken'))

    // const res = axios.post('/openstack/open/openstack', {
    //     "cookie": cookies.get('accessToken'),
    // })
    //     .then((response) => {
    //         console.log(response);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // res();
};

const goToDashboard = () => {
    info.value.checkCloud = 'selected';
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
