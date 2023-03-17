<template>
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
                            <Button type="button" icon="pi pi-plus" label="Add Cloud" class="bgcolor border-0 p-2"
                                style="height: 2rem; width: 7rem; font-size: small;" />
                        </div>
                    </div>

                    <!-- @click="toggleShowCard" -->
                    <div class="w-full flex-grow-1 p-2">
                        <!-- <div class="field col">
                            <div class="card flex flex-column align-items-center">
                                <ScrollPanel style="width: 100%; height: 200px" class="">
                                    <PanelMenu v-model:expandedKeys="expandedKeys" :model="items" class="w-full md:w-25rem"
                                        @click="toggleShowCard" />
                                </ScrollPanel>
                            </div>
                        </div> -->

                        <!-- tableStyle="min-width: 50rem" -->
                        <DataTable :value="mocks" class="shadow-1">
                            <Column field="no" header="No."></Column>
                            <Column field="name" header="Name"></Column>
                            <Column field="authority" header="Authority"></Column>
                            <Column field="host" header="Host"></Column>
                        </DataTable>

                        <!-- <div v-if="showCard" class="p-4 bg-white rounded-lg shadow-md mt-4">
                            <h2>Cloud A Card</h2>
                            <p>This is the card that appears when Cloud A is clicked.</p>
                        </div> -->
                    </div>
                </div>
                <div class="border-left  shadow-2 flex w-3">

                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import {
    ref
} from "vue";
// import {
//     useCookies
// } from "vue3-cookies";
// import axios from 'axios'
// const {
//     cookies
// } = useCookies();

// const expandedKeys = ref({});
// const items = ref([{
//     key: "0",
//     label: "01. Cloud A",
//     icon: "pi pi-fw pi-file",
// },
// {
//     key: "1",
//     label: "02. Cloud B",
//     icon: "pi pi-fw pi-file",
// },
// {
//     key: "2",
//     label: "03. Cloud C",
//     icon: "pi pi-fw pi-file",
// },
// ]);

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
]);

// const showCard = ref(false);
// const toggleShowCard = () => {
//     showCard.value = !showCard.value;
//     console.log(cookies.get('accessToken'))

//     const res = axios.post('/open/open/openstack', {
//         "cookie": cookies.get('accessToken'),
//     })
//         .then(function (response) {
//             console.log(response);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
//     console.log(res)
// };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@800&display=swap');

.namu {
    font-family: 'Nanum Gothic', sans-serif;
}

.bgcolor {
    background: linear-gradient(to right, #014751 20%, #0bc279 70%, #0fd977);
}

.p-card /deep/ .p-card-body {
    padding: 0px;
}

.p-card /deep/ .p-card-content {
    height: 31.3rem;
    padding: 0px;
}
</style>
