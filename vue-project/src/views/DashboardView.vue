<template>
    <div>
        <div class="mb-3 flex flex-row-reverse flex-wrap">
            <Button type="button" icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2" />
            <Button type="button" icon="pi pi-minus" label="Collapse All" @click="collapseAll" class="mr-2" />
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <div class="card flex flex-column align-items-center">
                    <ScrollPanel style="width: 100%; height: 200px" class="custombar1 p-2">
                        <PanelMenu v-model:expandedKeys="expandedKeys" :model="items" class="w-full md:w-25rem"
                            @click="toggleShowCard" />
                    </ScrollPanel>
                </div>
            </div>

            <div v-if="showCard" class="p-4 bg-white rounded-lg shadow-md mt-4">
                <h2>Cloud A Card</h2>
                <p>This is the card that appears when Cloud A is clicked.</p>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import { useCookies } from "vue3-cookies";
import axios from 'axios'
const { cookies } = useCookies();

const expandedKeys = ref({});
const items = ref([
    {
        key: "0",
        label: "01. Cloud A",
        icon: "pi pi-fw pi-file",
    },
    {
        key: "1",
        label: "02. Cloud B",
        icon: "pi pi-fw pi-file",
    },
    {
        key: "2",
        label: "03. Cloud C",
        icon: "pi pi-fw pi-file",
    },
]);

const showCard = ref(false);

const expandAll = () => {
    for (let node of items.value) {
        expandNode(node);
    }

    expandedKeys.value = { ...expandedKeys.value };
};

const collapseAll = () => {
    expandedKeys.value = {};
};

const expandNode = (node) => {
    if (node.items && node.items.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.items) {
            expandNode(child);
        }
    }
};

const toggleShowCard = () => {
    showCard.value = !showCard.value;
    console.log(cookies.get('accessToken'))

    const res = axios.post('/open/open/openstack', {
        "cookie": cookies.get('accessToken'),
    })
        .then(function (response) {
             console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    console.log(res)


};
</script>