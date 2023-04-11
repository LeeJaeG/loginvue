<template>
    <div class="flex flex-nowrap justify-content-between backcolor text-white py-2 px-3 w-full surface-border"
        style="height:54px">
        <router-link to="/" style="text-decoration: none; color: inherit;"
            class="flex flex-shrink-0 align-content-center w-4">
            <div class="flex align-items-center mr-3">
                <img src="../assets/logo.svg" />
            </div>
            <div class="flex flex-shrink-0 flex-grow-1 align-items-center mr-2 text-2xl namu" style="color : #0fd977">
                Echo-e Management platform
            </div>
        </router-link>
        <div class="flex flex-shrink-0 align-items-center w-4 justify-content-between">
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
        <div class="flex flex-grow-1 flex-nowrap flex-shrink-0 justify-content-between relative">
            <div class="flex w-7 align-items-center justify-content-end pr-3">
                <div class="p-input-icon-left w-9  text-white">
                    <i class="pi pi-search  text-white"></i>
                    <InputText type="text" class="appearance-none border-none surface-border w-full text-white h-2rem"
                        placeholder="Search" style="background-color: #414653;" />
                </div>
            </div>

            <a class="flex flex-shrink-0 flex-grow-1 justify-content-center align-items-center text-lg hover:surface-800"
                v-ripple
                v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                {{ userdata.username }} : {{ userdata.selectedProject.project_name }}
            </a>
            <ul class="list-none m-0 px-0 py-0 border-round shadow-2 backcolor absolute hidden text-white origin-top w-15rem cursor-pointer z-5"
                style="right: 1vh; top:8vh">
                <li>
                    <router-link style="text-decoration: none; color: inherit;" to="/cloud" v-ripple
                        @click="info.checkCloud = 'notSelected'"
                        class="flex p-3 align-items-center  hover:bg-teal-400 transition-colors transition-duration-150 p-ripple">
                        <i class="pi pi-align-justify mr-2"></i>
                        <span class="font-medium">Projects</span>
                    </router-link>
                </li>
                <li v-if="userdata.role == 'admin'">
                    <router-link style="text-decoration: none; color: inherit;" to="/users" v-ripple
                        class="flex p-3 align-items-center hover:bg-teal-400 transition-colors transition-duration-150 p-ripple">
                        <i class="pi pi-user mr-2"></i>
                        <span class="font-medium">Users</span>
                    </router-link>
                </li>
                <li>
                    <a style="text-decoration: none; color: inherit;" v-ripple @click="logout"
                        class="flex p-3 align-items-center hover:bg-teal-400 transition-colors transition-duration-150 p-ripple">
                        <i class="pi pi-user-minus mr-2"></i>
                        <span class="font-medium">Log out</span>
                    </a>
                </li>
            </ul>

            <a class="flex justify-content-center w-1 align-items-center text-xl  hover:surface-800 p-ripple" v-ripple
                v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                <font-awesome-icon v-badge.danger class="p-overlay-badge" icon="fa-solid fa-bell text-white"
                    style="font-size: 1.5rem" />
                <!-- <i v-badge.danger class="pi pi-bell p-overlay-badge" style="font-size: 1.5rem" /> -->
                <span class="flex align-items-center justify-content-center note-num"> 5+ </span>
            </a>
            <div class="m-0 px-0 py-0 backcolor border-round shadow-2 absolute hidden origin-top w-20rem  cursor-pointer z-5"
                style="right: 1vh;; top:8vh">
                <div class="">
                    <div class="mt-4 mb-2 mx-3 text-2xl">
                        Notifications
                    </div>
                    <ul class="list-none py-0 px-3 m-0 mb-3">
                        <li v-for="error in errors" :key="error"
                            class="flex justify-content-between my-2 align-items-center  text-white hover:bg-teal-400 transition-colors transition-duration-150 p-ripple"
                            style="height: 7vh; background-color: #414859;">
                            <!-- router-link style="text-decoration: none; color: inherit;" to="/" v-ripple -->
                            <div
                                :class="'w-5 px-1 flex align-items-center text-' + NotificationColors[error.kind] + '-400'">
                                <div :class="'circle mx-2 bg-' + NotificationColors[error.kind] + '-400'"></div>
                                {{ error.kind }}
                            </div>
                            <div class="w-4">
                                {{ error.content }}
                            </div>
                            <div class="w-3 flex justify-content-center px-2">
                                {{ error.duration }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import { useCookies } from "vue3-cookies";
// import router from '../router';

import { useRouter } from 'vue-router'
const router = useRouter()

const {
    cookies
} = useCookies();
const user = useUserStore();
const { info, userdata, } = storeToRefs(user);

const NotificationColors = {
    'ERROR': 'red',
    'WARNING': 'yellow',
    'NORMAL': 'green'
}

const logout = () => {
    const accessToken = cookies.get('accessToken')
    const refreshToken = cookies.get('accessRefresh')

    if (accessToken == null && refreshToken == null) {
        info.value.checkLogin = 'logout'
        info.value.checkCloud = 'notSelected'
        router.push('/');
        return
    }

    axios.post('/api/user/logout', {
        "access_token": accessToken,
        "refresh_token": refreshToken,
        "token_type": "bearer"
    }).then((result) => {
        console.log(result);
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
        info.value.checkLogin = 'logout'
        info.value.checkCloud = 'notSelected'
        router.push('/');
    }).catch((error) => {
        console.log(error);
    })
}

const errors = ref([
    {
        "kind": "WARNING",
        "content": "Notification",
        "duration": "1min"
    },
    {
        "kind": "ERROR",
        "content": "Notification",
        "duration": "2min"
    },
    {
        "kind": "WARNING",
        "content": "Notification",
        "duration": "3min"
    },
    {
        "kind": "NORMAL",
        "content": "Notification",
        "duration": "4min"
    },
    {
        "kind": "ERROR",
        "content": "Notification",
        "duration": "5min"
    },
    {
        "kind": "NORMAL",
        "content": "Notification",
        "duration": "6min"
    },
])

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@800&display=swap');

.backcolor {
    /* background: linear-gradient(#2f62f5, #0d00aa); */
    background-color: #2e3341;
}

.namu {
    font-family: 'Nanum Gothic', sans-serif;
}

::placeholder {
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
    color: #0fd977;
}

.circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
</style>