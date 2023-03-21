<script setup>
import {
    ref
} from "vue";

const braket = ref({
    openstack: 'down',
    cluster: 'down',
    topology: 'down'
})
const changeBracket = (name) => {
    if (braket.value[name] == 'down') {
        braket.value[name] = 'up';
    } else {
        braket.value[name] = 'down';
    }
}
</script>

<template>
    <div id="app-sidebar-2"
        class="text-white backcolor py-2 lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 shadow-3 w-16rem  select-none"
        style="overflow: auto">

        <div class="flex justify-content-start align-items-center mb-2 pl-3 font-bold hover:text-teal-500"
            style="height: 2rem;" @click="$emit('touch')">
            <i class="pi pi-angle-left" style="font-size: 1.2rem"></i>
        </div>

        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Main
        </div>
        <router-link to="/" class="px-4 w-full flex justify-content-between align-items-center  mt-3 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <i class="pi pi-home" style="font-size: 1.2rem"></i>
            </div>
            <div class="w-5">
                Home
            </div>
            <div class="w-3 flex justify-content-end">

            </div>
        </router-link>

        <router-link to="/setting"
            class="px-4 w-full flex justify-content-between align-items-center mb-6 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-gear" style="font-size: 1.2rem" />
            </div>
            <div class="w-5">
                Settings
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>

        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Cloud
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center  mt-4 font-bold hovercolor"
            style="height: 3.5rem;" @click="changeBracket('openstack')"
            v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'slidedown', leaveToClass: 'hidden', leaveActiveClass: 'slideup' }">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                OpenStack
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi"
                    :class="{ 'pi-angle-down': braket['openstack'] === 'down', 'pi-angle-up': braket['openstack'] === 'up' }"
                    style="font-size: 1.2rem"></i>
            </div>
        </div>
        <ul
            class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
            <li class="">
                <div v-ripple
                    class="flex align-items-center cursor-pointer text-white hovercolor transition-duration-150 transition-colors p-ripple"
                    style="height: 3.5rem;">
                    <div class="w-4 pl-3">
                    </div>
                    <div class="w-5 ">
                        Openstack 01
                    </div>
                    <div class="w-3 flex justify-content-end">
                    </div>
                </div>
            </li>
            <li>
                <div v-ripple
                    class="flex align-items-center cursor-pointer text-white hovercolor transition-duration-150 transition-colors p-ripple"
                    style="height: 3.5rem;">
                    <div class="w-4 pl-3">
                    </div>
                    <div class="w-5 ">
                        Openstack 02
                    </div>
                    <div class="w-3 flex justify-content-end">
                    </div>
                </div>
            </li>
        </ul>

        <div class="px-4 w-full flex justify-content-between align-items-center  font-bold hovercolor"
            style="height: 3.5rem;" @click="changeBracket('cluster')"
            v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'slidedown', leaveToClass: 'hidden', leaveActiveClass: 'slideup' }">
            <div class="w-4 pl-3">
                <i class="pi pi-th-large" style="font-size: 1.2rem"></i>
            </div>
            <div class="w-5 ">
                Cluster
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi"
                    :class="{ 'pi-angle-down': braket['cluster'] === 'down', 'pi-angle-up': braket['cluster'] === 'up' }"
                    style="font-size: 1.2rem"></i>
            </div>
        </div>
        <ul
            class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
            <li class="">
                <div v-ripple
                    class="flex align-items-center cursor-pointer text-white hovercolor transition-duration-150 transition-colors p-ripple"
                    style="height: 3.5rem;">
                    <div class="w-4 pl-3">
                    </div>
                    <div class="w-5 ">
                        Cluster 01
                    </div>
                    <div class="w-3 flex justify-content-end">
                    </div>
                </div>
            </li>
            <li>
                <div v-ripple
                    class="flex align-items-center cursor-pointer text-white hovercolor transition-duration-150 transition-colors p-ripple"
                    style="height: 3.5rem;">
                    <div class="w-4 pl-3">
                    </div>
                    <div class="w-5 ">
                        Cluster 02
                    </div>
                    <div class="w-3 flex justify-content-end">
                    </div>
                </div>
            </li>
        </ul>

        <div class="px-4 w-full flex justify-content-between align-items-center font-bold hovercolor"
            @click="changeBracket('topology')" style="height: 3.5rem;"
            v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'slidedown', leaveToClass: 'hidden', leaveActiveClass: 'slideup' }">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-circle-nodes" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                Topology
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi"
                    :class="{ 'pi-angle-down': braket['topology'] === 'down', 'pi-angle-up': braket['topology'] === 'up' }"
                    style="font-size: 1.2rem"></i>
            </div>
        </div>
        <ul
            class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
            <li class="">
                <div v-ripple
                    class="flex align-items-center cursor-pointer text-white hovercolor transition-duration-150 transition-colors p-ripple"
                    style="height: 3.5rem;">
                    <div class="w-4 pl-3">
                    </div>
                    <div class="w-5 ">
                        Topology 01
                    </div>
                    <div class="w-3 flex justify-content-end">
                    </div>
                </div>
            </li>
            <li>
                <div v-ripple
                    class="flex align-items-center cursor-pointer text-white hovercolor transition-duration-150 transition-colors p-ripple"
                    style="height: 3.5rem;">
                    <div class="w-4 pl-3">
                    </div>
                    <div class="w-5 ">
                        Topology 02
                    </div>
                    <div class="w-3 flex justify-content-end">
                    </div>
                </div>
            </li>
        </ul>

        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Metrics
        </div>
        <router-link to="/int"
            class="px-4 w-full flex justify-content-between align-items-center  mt-4 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-globe" style="font-size: 1.2rem" />
            </div>
            <div class="w-5 ">
                INT
            </div>
            <div class="w-3 flex justify-content-end">
            </div>
        </router-link>
        <router-link to="/metric" class="px-4 w-full flex justify-content-between align-items-center  font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div class="w-4 pl-3">
                <i class="pi pi-chart-bar" style="font-size: 1.2rem"></i>
            </div>
            <div class="w-5 ">
                Metric
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
}</style>
