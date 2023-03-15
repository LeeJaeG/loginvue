<template>
    <div id="app-sidebar-2" class="text-white backcolor px-2 py-2 lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 shadow-3 w-16rem border-top-1 select-none">
        
        <div class="flex justify-content-start align-items-center mb-2 pl-2 font-bold" style="height: 2rem;">
            <i class="pi pi-angle-left" style="font-size: 1.2rem"></i>
        </div>
        
        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Main
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center mb-4 mt-4 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <i class="pi pi-home" style="font-size: 1.2rem"></i>
            </div>
            <div class="w-5">
                Home
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>

        <div class="px-4 w-full flex justify-content-between align-items-center mb-6 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-gear" style="font-size: 1.2rem"/>
            </div>
            <div class="w-5">
                Settings
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>
        
        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Cloud
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center mb-4 mt-4 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-layer-group" style="font-size: 1.2rem"/>
            </div>
            <div class="w-5 ">
                OpenStack
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center mb-4 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <i class="pi pi-th-large" style="font-size: 1.2rem"></i>
            </div>
            <div class="w-5 ">
                Cluster
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center mb-6 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-circle-nodes" style="font-size: 1.2rem"/>
            </div>
            <div class="w-5 ">
                Topology
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>

        <div class="px-5 font-bold mb-2 mt-6 text-sm">
            Metrics
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center mb-4 mt-4 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-solid fa-globe" style="font-size: 1.2rem"/>
            </div>
            <div class="w-5 ">
                INT
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center mb-4 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <i class="pi pi-chart-bar" style="font-size: 1.2rem"></i>
            </div>
            <div class="w-5 ">
                Metric
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>
        <div class="px-4 w-full flex justify-content-between align-items-center mb-6 font-bold " style="height: 2rem;">
            <div class="w-4 pl-3">
                <font-awesome-icon icon="fa-regular fa-bell" style="font-size: 1.2rem"/>
            </div>
            <div class="w-5 ">
                Alarm
            </div>
            <div class="w-3 flex justify-content-end">
                <i class="pi pi-angle-down" style="font-size: 1.2rem"></i>
            </div>
        </div>

    </div>
</template>

<style scoped>
    .backcolor {
        /* background: linear-gradient(#2f62f5, #0d00aa); */
        background-color: #2e3341;
      }
</style>