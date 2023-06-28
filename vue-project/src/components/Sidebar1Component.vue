<template>
    <div id="app-sidebar-1"
        class="py-2 align-content-center text-white backcolor block flex-shrink-0 static left-0 top-0 z-1 shadow-3 text-center w-4rem select-none"
        style="overflow: auto">
        <div class="flex justify-content-end align-items-center pr-3 mb-2 font-bold hover:text-teal-500"
            style="height: 2rem;" @click="$emit('touch')">
            <i class="pi pi-angle-right" style="font-size: 1.2rem"></i>
        </div>

        <div class="font-bold mb-2 mt-6 text-sm">
            P Layer
        </div>

        <router-link to="/physical-topology"
            class="w-full flex justify-content-center align-items-center mb-6 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'diagram-project']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <div class="font-bold mb-2 mt-6 text-sm">
            C Layer
        </div>

        <router-link to="/cloud-overview"
            class="w-full flex justify-content-center align-items-center mt-3 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'cloud']" />
            </div>
        </router-link>

        <router-link to="/cloud" class="w-full flex justify-content-center align-items-center font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <router-link to="/cloud-topology" class="w-full flex justify-content-center align-items-center font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon icon="fa-solid fa-circle-nodes" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <router-link to="/cloud-metric" class="w-full flex justify-content-center align-items-center font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'chart-line']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <router-link to="/cloud-loadbalancer"
            class="w-full flex justify-content-center align-items-center mb-6 font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'network-wired']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <div class="font-bold mb-2 mt-6 text-sm">
            Services
        </div>

        <router-link to="/int" class="w-full flex justify-content-center align-items-center mt-4  font-bold hovercolor"
            style="height: 3.5rem; text-decoration: none; color: inherit;">
            <div>
                <font-awesome-icon :icon="['fas', 'magnifying-glass-chart']" style="font-size: 1.2rem" />
            </div>
        </router-link>

        <router-link to="/alarm" class="w-full flex justify-content-center align-items-center mb-4 font-bold hovercolor"
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
</style>