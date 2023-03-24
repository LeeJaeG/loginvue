<template>
    <div class="surface-card shadow-2 border-round p-4">
        <div class="flex justify-content-between align-items-center">
            <span class="text-xl text-900 font-medium">Members</span>
            <div>
                <Button v-if="showUserList" icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                    @click="$refs.menu1.toggle($event)"></Button>
                <Button v-else icon="pi pi-chevron-down" class="p-button-text p-button-plain p-button-rounded"
                    @click="showUser" />

                <Menu ref="menu1" :popup="true" :model="items"></Menu>
            </div>
        </div>
        <ul v-if="showUserList" class="list-none p-0 m-0 mt-5">
            <li v-for="list in mocks" :key="list"
                class="flex flex-column md:flex-row md:align-items-center cursor-pointer md:justify-content-between p-3 hover:bg-green-100 pointer-events-auto p-ripple"
                @click="showUser(list)" v-ripple>
                <div class="flex">
                    <Avatar label="O" class="mr-2 bg-teal-100 text-white" style="width: 45px; height: 45px" />
                    <div class="mr-0 md:mr-8">
                        <span class="block text-900 font-medium mb-1">{{ list.name }}</span>
                        <div class="text-600">{{ list.authority }} : {{ list.etc }} </div>
                    </div>
                </div>
                <div class="mt-2 md:mt-0 flex flex-nowrap">
                    <Button class="p-button-text p-button-plain p-button-rounded mr-1" icon="pi pi-pencil"></Button>
                </div>
            </li>
        </ul>
    </div>
    <div v-if="!showUserList" class="surface-card shadow-2 border-round mt-4 p-4">
        <div class="flex justify-content-between align-items-center mb-3">
            <span class="text-xl text-900 font-medium"> {{ selectedUser.name }}'s Projects</span>
        </div>
        <div class="grid">
            <div v-for="project in projectMocks" :key="project" class="col-12 md:col-6 xl:col-3 p-3">
                <div class="surface-card shadow-2 border-round p-4">
                    <div class="flex flex-column align-items-center mb-3">
                        <span class="font-medium text-900 text-xl mb-2">{{ project.name }}</span>
                        <span class="text-600 font-medium mb-2">{{ project.etc }}</span>
                        <span v-ripple class="p-ripple text-600 surface-200 p-2 border-round">Horizon</span>
                    </div>
                    <div class="pt-3 border-top-1 surface-border flex">
                        <Button type="button" label="Details" class="flex-auto mr-2 p-button-outlined p-button-plain"
                            style="border-radius: 30px"></Button>
                        <Button type="button" label="Delete" class="flex-auto ml-2 p-button-outlined p-button-plain"
                            style="border-radius: 30px"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { usePrimeVue } from "primevue/config";
const $primevue = usePrimeVue();
defineExpose({
    $primevue
})
// import axios from "axios"

const mocks = ref([
    {
        name: "Admin",
        authority: "Admin",
        rcPath: "somewhere",
        etc: "This is Admin account"
    },
    {
        name: "User1",
        authority: "general",
        rcPath: "somewhere",
        etc: "This is user account"
    },
    {
        name: "User2",
        authority: "general",
        rcPath: "somewhere",
        etc: "This is user account"
    },
    {
        name: "User3",
        authority: "general",
        rcPath: "somewhere",
        etc: "This is user account"
    },
    {
        name: "User4",
        authority: "general",
        rcPath: "somewhere",
        etc: "This is user account"
    },
    {
        name: "User5",
        authority: "general",
        rcPath: "somewhere",
        etc: "This is user account"
    },
    {
        name: "User6",
        authority: "general",
        rcPath: "somewhere",
        etc: "This is user account"
    },
    {
        name: "User8",
        authority: "general",
        rcPath: "somewhere",
        etc: "This is user account"
    },
]);
const projectMocks = ref([
    {
        name: "project1",
        etc: "This is project1"
    },
    {
        name: "project2",
        etc: "This is user project2"
    },
    {
        name: "project3",
        etc: "This is project3"
    },
    {
        name: "project4",
        etc: "This is user project4"
    },
]);
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                command: () => {
                    console.log("New button")
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    console.log("update button")
                }
            }
        ]
    },
]);

const showUserList = ref(true);
const selectedUser = ref('');

const showUser = (user) => {
    console.log(selectedUser.value);
    showUserList.value = !showUserList.value
    if (selectedUser.value == '') {
        selectedUser.value = user;
        console.log(selectedUser.value);
    }
    else {
        selectedUser.value = ''
    }
}

</script>

<style scoped>
.logincolor {
    background-color: #014751;
}
</style>