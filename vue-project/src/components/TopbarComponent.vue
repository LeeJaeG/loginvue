<template>
    <div class="flex flex-nowrap justify-content-between backcolor text-white px-3 w-full surface-border"
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
            <div v-if="contentBarName.split(' ')[0] == 'Openstack'"
                class="w-4 text-center text-xl selected-color h-full flex align-items-center justify-content-center">
                Openstack
            </div>
            <div v-else class="w-4 text-center text-xl">
                Openstack
            </div>
            <div v-if="contentBarName.split(' ')[0] == 'Kaloom'"
                class="w-4 text-center text-xl selected-color h-full flex align-items-center justify-content-center">
                Kaloom
            </div>
            <div v-else class="w-4 text-center text-xl">
                Kaloom
            </div>
            <div v-if="contentBarName.split(' ')[0] == 'Metric'"
                class="w-4 text-center text-xl selected-color h-full flex align-items-center justify-content-center">
                Metric
            </div>
            <div v-else class="w-4 text-center text-xl">
                Metric
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
            <div class="m-0 px-0 py-0 backcolor border-round shadow-2 absolute hidden origin-top cursor-pointer z-5"
                style="right: 1vh; top:8vh; width: 26rem;">
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
                                :class="'w-5 px-1 flex align-items-center text-' + NotificationColors[error.level.toUpperCase()] + '-400'">
                                <div :class="'circle mx-2 bg-' + NotificationColors[error.level.toUpperCase()] + '-400'">
                                </div>
                                {{ error.level.toUpperCase() }}
                            </div>
                            <div class="w-4">
                                {{ error.shortData }}
                            </div>
                            <div class="w-3 flex justify-content-center px-2">
                                <!-- {{ changeTime(error.timestamp) }} -->
                                {{ error.countedTime }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import { useCookies } from "vue3-cookies";
import { usePathStore } from '@/stores/path'
// import router from '../router';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

import { useRouter } from 'vue-router'
const router = useRouter()

const intervalId = ref(null);
onMounted(() => {
    getErrorsForAlarm(0, errors);
    var ws = new WebSocket("ws://192.168.15.47:8000/api/nats/ws/" + userdata.value.id);
    ws.addEventListener('open', (event) => { onWebsocketOpen(event) });
    ws.addEventListener('close', () => {
        console.log('The connection has been closed');
        router.go(0);
    })

    ws.onmessage = function (event) {
        const json = (event.data);
        var data = JSON.parse(json);
        const newAlarm = {
            'subject': data['subject'],
            'data': data.message,
            'shortData': (data.message.length > 10) ? data.message.slice(0, 10) + '...' : data.message,
            'id': data._id,
            'read_mark': data.read_mark,
            'timestamp': data.timestamp,
        }
        // console.log(newAlarm);
        clearInterval(intervalId.value);
        errors.value.pop();
        errors.value.unshift(newAlarm);
        intervalId.value = setInterval(() => { updateTime(errors) }, 1000);
    };
})

const updateTime = (data) => {
    data.value.forEach(obj => {
        obj.countedTime = changeTime(obj.timestamp)
    })
}

const onWebsocketOpen = function () {
    console.log("connected to WS in topbar !");
}

const errors = ref();

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

const getErrorsForAlarm = (async (retry, ...theArgs) => {
    console.log("getErrorsForAlarm")
    try {
        const response = await axios.get('/api/nats/errors/limit ')
        // console.log(response.data)
        theArgs[0].value = response.data;
        const maxLength = 10
        // console.log(errors.value);
        theArgs[0].value.forEach(obj => {
            if (obj.message.length > maxLength) {
                obj.shortData = obj.message.slice(0, maxLength) + '...'
            }
        })
        intervalId.value = setInterval(() => { updateTime(errors) }, 1000);
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getErrorsForAlarm, retry, theArgs);
        }
    }
})

const changeTime = ((time) => {
    const old = Date.parse(time)
    const now = Date.now();
    var timestamp = now - old

    const min = parseInt(timestamp / (60 * 1000))
    timestamp = timestamp % (60 * 1000)
    const sec = parseInt(timestamp / (1000))

    if (min >= 10) {
        return '10분 이상'
    }
    else {
        return min + '분 ' + sec + '초 ' + '전'
    }
})
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
    border-top: solid thick #0bc279;
}

.circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
</style>