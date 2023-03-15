<template>
    <div class="flex justify-content-between backcolor text-white py-2 px-3 w-full" style="height:7vh">
        <div class="flex align-content-center w-3">
            <div class="flex align-items-center mr-3">
                <img src="../assets/logo.svg"/>
            </div>
            <div class="flex align-items-center mr-2 text-2xl text-bold namu" style="color : #0fd977">
                Management platform
            </div>
        </div>
        <div class="flex align-items-center w-4 justify-content-between">
                <div class="w-4 text-center text-xl">
                    Openstack
                </div>
                <div class=" w-4  text-center text-xl selected-color">
                    Topology
                </div>
                <div class="w-4 text-center text-xl">
                    Cluster
                </div>
        </div>
        <div class="flex w-3 justify-content-between">
            <div class="flex w-7 align-items-center justify-content-end pr-3">
                <div class="p-input-icon-left w-9  text-white">
                    <i class="pi pi-search  text-white"></i>
                    <InputText type="text" class="appearance-none border-none surface-border w-full text-white h-2rem" placeholder="Search" style="background-color: #414653;"/>
                </div>
            </div>
            <div class="flex justify-content-center w-1 align-items-center text-xl relative">
                <font-awesome-icon v-badge.danger class="p-overlay-badge" icon="fa-solid fa-bell text-white" style="font-size: 1.5rem"/>
                <!-- <i v-badge.danger class="pi pi-bell p-overlay-badge" style="font-size: 1.5rem" /> -->
                <span class="flex align-items-center justify-content-center note-num"> 5+ </span>
            </div>
            <div class="flex w-4 justify-content-center align-items-center text-lg">
                Admin : Cloud A
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@800&display=swap');
    .backcolor {
        /* background: linear-gradient(#2f62f5, #0d00aa); */
        background-color: #2e3341;
      }
      .namu {
        font-family: 'Nanum Gothic', sans-serif;
      }
      ::placeholder{
        color: white;
      }
      .note-num {
        position: absolute;
        top: 10px;
        right: 2px;
        z-index: 3;
        height: 15px;
        width: 15px;
        background-color: red;
        border-radius: 15px;
        display: inline-block;
        font-size: 13px;
    }
    .selected-color {
        color : #0fd977;
    }

</style>