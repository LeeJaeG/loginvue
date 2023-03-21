<template>
    <div class="flex justify-content-between backcolor text-white py-2 px-3 w-full shadow-2 border-bottom-1 surface-border"
        style="height:7vh">
        <div class="flex align-content-center w-3">
            <div class="flex align-items-center mr-3">
                <img src="../assets/logo.svg" />
            </div>
            <div class="flex align-items-center mr-2 text-2xl namu" style="color : #0fd977">
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
                    <InputText type="text" class="appearance-none border-none surface-border w-full text-white h-2rem"
                        placeholder="Search" style="background-color: #414653;" />
                </div>
            </div>
            <a class="flex justify-content-center w-1 align-items-center text-xl relative hover:surface-800  v-ripple"
                v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                <font-awesome-icon v-badge.danger class="p-overlay-badge" icon="fa-solid fa-bell text-white"
                    style="font-size: 1.5rem" />
                <!-- <i v-badge.danger class="pi pi-bell p-overlay-badge" style="font-size: 1.5rem" /> -->
                <span class="flex align-items-center justify-content-center note-num"> 5+ </span>
            </a>
            <ul class="list-none py-3 px-6 m-0 lg:px-0 lg:py-0 border-round shadow-0 lg:shadow-2 lg:border-1 border-50 lg:absolute hidden surface-overlay origin-top w-full lg:w-15rem  cursor-pointer z-5"
                style="left:calc( 100% - 26rem); top:6vh">
                <li>
                    <router-link style="text-decoration: none; color: inherit;" to="/" v-ripple
                        class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple">
                        <span class="font-medium">누군가의 알람</span>
                    </router-link>
                </li>
            </ul>

            <a class="flex w-4 justify-content-center align-items-center text-lg hover:surface-800  v-ripple"
                v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                Admin : Cloud A
            </a>
            <ul class="list-none py-3 px-6 m-0 lg:px-0 lg:py-0 border-round shadow-0 lg:shadow-2 lg:border-1 border-50 lg:absolute hidden surface-overlay origin-top w-full lg:w-15rem  cursor-pointer z-5"
                style="left:calc( 100% - 15rem); top:6vh">
                <li>
                    <router-link style="text-decoration: none; color: inherit;" to="/dashboard" v-ripple
                        class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple">
                        <i class="pi pi-home mr-2"></i>
                        <span class="font-medium">Dashboard</span>
                    </router-link>
                </li>
                <li>
                    <router-link style="text-decoration: none; color: inherit;" to="/userinfo" v-ripple
                        class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple">
                        <i class="pi pi-user mr-2"></i>
                        <span class="font-medium">UserInfo</span>
                    </router-link>
                </li>
                <li>
                    <a style="text-decoration: none; color: inherit;" v-ripple @click="logout"
                        class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 transition-colors transition-duration-150 p-ripple">
                        <i class="pi pi-user-minus mr-2"></i>
                        <span class="font-medium">Log out</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import {
    useUserStore
} from '@/stores/user'
import {
    storeToRefs
} from 'pinia';
import {
    useCookies
} from "vue3-cookies";

const {
    cookies
} = useCookies();
const user = useUserStore();
const {
    info
} = storeToRefs(user);

const logout = () => {
    const accessToken = cookies.get('accessToken')
    const refreshToken = cookies.get('accessRefresh')
    console.log(accessToken, "+++++++",refreshToken);
    axios.post('/api/user/logout', {
        "access_token": accessToken,
        "refresh_token": refreshToken,
        "token_type": "bearer"
    }).then((result) => {
        console.log(result);
        cookies.remove('accessToken');
        cookies.remove('accessRefresh');
        info.value.checkLogin = 'logout'
        info.value.checkCloud = 'notSelected'
    }).catch((error) => {
        console.log(error);
        
        
    })
}
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
</style>