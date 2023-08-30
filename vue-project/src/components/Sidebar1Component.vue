<template>
    <div id="app-sidebar-1"
        class="py-2 align-content-center text-white backcolor block flex-shrink-0 static z-1 shadow-3 text-center select-none scroll"
        style="overflow: scroll; width: 88px; height: 100%;">
        <div class="flex justify-content-center align-items-center my-2  hover:text-teal-500" style="height: 3.5rem;"
            @click="$emit('touch')">
            <i class="pi pi-angle-right" style="font-size: 1.2rem"></i>
        </div>
        <!-- ======================================================================================= -->
        <!-- Group Main -->
        <div class=" mb-2 mt-4 sidebar-font font-bold">
            Main
        </div>

        <!-- Main Insight -->
        <router-link to="/cloud-overview" class="mt-3 w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'cloud']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!--Main Search -->
        <router-link to="/" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'magnifying-glass']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Main metric & alarm -->
        <router-link to="/" class="w-full flex justify-content-center align-items-center  mb-6 hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- ======================================================================================= -->
        <!-- Group Physical Layer -->
        <div class=" mb-2 mt-4 sidebar-font font-bold">
            P Layer
        </div>

        <!-- Physical Topology -->
        <router-link to="/physical-topology" class="mt-3 w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon icon="fa-solid fa-circle-nodes" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Physical Detail -->
        <router-link to="/" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Physical Location -->
        <router-link to="/" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'location-crosshairs']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Physical Metric -->
        <router-link to="/" class="w-full flex justify-content-center align-items-center mb-6   hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- ======================================================================================= -->
        <!-- Group Cloud Layer -->
        <div class=" mb-2 mt-6 sidebar-font font-bold">
            C Layer
        </div>

        <!-- Cloud Topology -->
        <router-link to="/cloud-topology" class="mt-3 w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon icon="fa-solid fa-circle-nodes" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!--  Cloud Detail -->
        <router-link to="/cloud" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Cloud Overview
        <router-link to="/cloud-overview" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'cloud']" style="font-size: 1.2rem" />
            </div>
        </router-link> -->

        <!-- Cloud Metric -->
        <router-link to="/cloud-metric" class="w-full flex justify-content-center align-items-center  mb-6  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- ======================================================================================= -->
        <!-- Group Service Layer -->
        <div class=" mb-2 mt-6 sidebar-font font-bold">
            Services
        </div>

        <!-- Service Autoscaling -->
        <router-link to="/autoscaling" class="mt-4  w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'network-wired']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Service Telemetry -->
        <router-link to="/int" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'magnifying-glass-chart']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Service Delay stats -->
        <router-link to="/" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'stopwatch']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <!-- Service KaaS -->
        <router-link to="/kaas" class="w-full flex justify-content-center align-items-center  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <img src="@/assets/svg/kubernetes.svg" style="width: 24px;">
        </router-link>

        <!-- Service Alarm -->
        <router-link to="/alarm" class="w-full flex justify-content-center align-items-center mb-4  hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon icon="fa-regular fa-bell" style="font-size: 1.2rem" />
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
    font-size: 18px;
}
</style>