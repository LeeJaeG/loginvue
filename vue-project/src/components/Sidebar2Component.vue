<script setup>
// import {
//     ref
// } from "vue";
// const braket = ref({
//     openstack: 'down',
//     cluster: 'down',
//     topology: 'down'
// })
// const changeBracket = (name) => {
//     if (braket.value[name] == 'down') {
//         braket.value[name] = 'up';
//     } else {
//         braket.value[name] = 'down';
//     }
// }
</script>

<template>
    <div id="app-sidebar-2" class="text-white backcolor py-2 block flex-shrink-0 static z-1 shadow-3 w-16rem"
        style="overflow: auto">

        <div class="flex justify-content-start align-items-center my-2 font-bold hover:text-teal-500"
            style="height: 3.5rem; margin-left: 40px;" @click="$emit('touch')">
            <i class="pi pi-angle-left" style="font-size: 1.2rem"></i>
        </div>

        <div class="px-5 font-bold mb-2 mt-4 text-sm">
            Physical Layer
        </div>
        <router-link to="/physical-topology"
            class="px-4 w-full flex justify-content-between align-items-center font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'diagram-project']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                Topology
            </div>
            <div class="w-3 flex justify-content-end">
                <!-- <i class="pi"
                    :class="{ 'pi-angle-down': braket['topology'] === 'down', 'pi-angle-up': braket['topology'] === 'up' }"
                    style="font-size: 1.2rem"></i> -->
            </div>
        </router-link>

        <!-- ====================================== -->

        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Cloud Layer
        </div>

        <router-link to="/cloud-overview"
            class="px-4 w-full flex justify-content-between align-items-center  mt-3 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'cloud']" />
            </div>
            <div class="w-5">
                Overview
            </div>
            <div class="w-3 flex justify-content-end">

            </div>
        </router-link>

        <router-link to="/cloud" class="px-4 w-full flex justify-content-between align-items-center font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                Cloud Info
            </div>
            <div class="w-3 flex justify-content-end">
                <!-- <i class="pi"
                    :class="{ 'pi-angle-down': braket['openstack'] === 'down', 'pi-angle-up': braket['openstack'] === 'up' }"
                    style="font-size: 1.2rem"></i> -->
            </div>
        </router-link>

        <router-link to="/cloud-topology"
            class="px-4 w-full flex justify-content-between align-items-center  font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-circle-nodes" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                Topology
            </div>
            <div class="w-3 flex justify-content-end">
                <!-- <i class="pi"
                    :class="{ 'pi-angle-down': braket['cluster'] === 'down', 'pi-angle-up': braket['cluster'] === 'up' }"
                    style="font-size: 1.2rem"></i> -->
            </div>
        </router-link>

        <router-link to="/cloud-metric"
            class="px-4 w-full flex justify-content-between align-items-center  font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                Metric
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <router-link to="/cloud-loadbalancer"
            class="px-4 w-full flex justify-content-between align-items-center mb-6 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'network-wired']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5">
                Load Balancer
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- ====================================== -->

        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Services
        </div>
        <router-link to="/int"
            class="px-4 w-full flex justify-content-between align-items-center  mt-4 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'magnifying-glass-chart']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                INT
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>
        <router-link to="/alarm"
            class="px-4 w-full flex justify-content-between align-items-center mb-6 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-regular fa-bell" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                Alarm
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

    </div>
</template>

<style scoped>
.backcolor {
    /* background: linear-gradient(#2f62f5, #0d00aa); */
    background-color: #2e3341;
}

.hovercolor:hover {
    background-color: #0bc279;
}
</style>
