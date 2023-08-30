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
    <div id="app-sidebar-2" class="text-white backcolor py-2 block flex-shrink-0 static z-1 shadow-3 w-16rem scroll"
        style="overflow: scroll; height: 100%;">
        <div class="flex justify-content-start align-items-center my-2 hover:text-teal-500"
            style="height: 3.5rem; margin-left: 40px;" @click="$emit('touch')">
            <i class="pi pi-angle-left" style="font-size: 1.2rem"></i>
        </div>

        <!-- ======================================================================================= -->
        <!-- Group Main -->
        <div class="px-5 font-bold mb-2 mt-4 sidebar-font ">
            Main
        </div>

        <!-- Main Insight -->
        <router-link to="/cloud-overview" class="mt-3 w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'cloud']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font ">
                Overview
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Main Search -->
        <router-link to="/" class="w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'magnifying-glass']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Search
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Main metric & alarm -->
        <router-link to="/" class="w-full flex justify-content-between align-items-center mb-6 hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Metric
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- ======================================================================================= -->
        <!-- Group Physical Layer -->
        <div class="px-5 font-bold mb-2 mt-4 sidebar-font">
            Physical Layer
        </div>

        <!-- Physical Topology -->
        <router-link to="/physical-topology" class="mt-3 w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'circle-nodes']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Topology
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Physical Detail -->
        <router-link to="/" class=" w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Detail
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Physical Location -->
        <router-link to="/" class="w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'location-crosshairs']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Location
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Physical Metric -->
        <router-link to="/" class="w-full flex justify-content-between align-items-center mb-6 hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Metric
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- ======================================================================================= -->
        <!-- Cloud Topology -->
        <div class="px-5 font-bold mb-2 mt-6 sidebar-font">
            Cloud Layer
        </div>

        <!-- Cloud Topology -->
        <router-link to="/cloud-topology" class="mt-3 w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-circle-nodes" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Topology
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!--  Cloud Detail -->
        <router-link to="/cloud" class="w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Detail
            </div>
            <div class="w-3 flex justify-content-end">
                <!-- <i class="pi"
                    :class="{ 'pi-angle-down': braket['openstack'] === 'down', 'pi-angle-up': braket['openstack'] === 'up' }"
                    style="font-size: 1.2rem"></i> -->
            </div>
        </router-link>

        <!-- Cloud Overview
        <router-link to="/cloud-overview"
            class="w-full flex justify-content-between align-items-center font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'cloud']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5">
                Overview
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link> -->

        <!-- Cloud Metric -->
        <router-link to="/cloud-metric" class="w-full flex justify-content-between align-items-center mb-6 hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Metric
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- ======================================================================================= -->
        <!-- Group Service Layer -->
        <div class="px-5 font-bold mb-2 mt-6 sidebar-font">
            Services
        </div>

        <!-- Service Autoscaling -->
        <router-link to="/autoscaling" class="w-full flex justify-content-between align-items-center mt-4 hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'network-wired']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Autoscaling
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Service Telemetry -->
        <router-link to="/int" class="w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon :icon="['fas', 'magnifying-glass-chart']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Service Telemetry
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Service Delay stats -->
        <router-link to="/" class="w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3 ">
                <font-awesome-icon :icon="['fas', 'stopwatch']" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
                Delay Stats
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Service KaaS -->
        <router-link to="/kaas" class="w-full flex justify-content-between align-items-center hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3 flex ">
                <img src="@/assets/svg/kubernetes.svg" style="width: 24px;">
            </div>
            <div class="w-5 sidebar-font">
                KaaS
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <!-- Service Alarm -->
        <router-link to="/alarm" class="w-full flex justify-content-between align-items-center mb-6 hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit; padding-left: 20px;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-regular fa-bell" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 sidebar-font">
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

.scroll::-webkit-scrollbar {
    display: none;
}

.sidebar-font {
    font-size: 18px
}
</style>
