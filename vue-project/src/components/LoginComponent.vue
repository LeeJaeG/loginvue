<template>
    <div class="">
        <Dialog v-model:visible="showMessage" :breakpoints="{ '960px': '80vw' }" :style="{ width: '30vw' }" position="top">
            <div class="flex align-items-center flex-column pt-6 px-3">
                <i class="pi pi-check-circle" :style="{ fontSize: '5rem', color: 'var(--green-500)' }"></i>
                <h5>Registration Successful!</h5>
                <p :style="{ lineHeight: 1.5, textIndent: '1rem' }">
                    Your account is registered under name <b>{{ state.name }}</b> ; it'll be valid next 30 days without
                    activation. Please check <b>{{ state.email }}</b> for activation instructions.
                </p>
            </div>
            <template #footer>
                <div class="flex justify-content-center">
                    <Button label="OK" @click="toggleDialog" class="p-button-text" />
                </div>
            </template>
        </Dialog>

        <div class="flex justify-content-center">
            <div class="">
                <div class="flex card-container overflow-hidden">
                    <div
                        class="flex-grow-0 md:flex-grow-0 flex align-items-center justify-content-center flex-column  font-bold text-gray-900 m-3 px-2 py-1 border-round">
                        <!-- logo + Management platform  -->
                        <div class="flex  align-content-center  flex-column w-auto">
                            <img src="@/assets/BI/PNG/BI_세로형_플랫폼적용.png" alt="logo" class="h-15rem mb-3" />
                        </div>

                        <!-- login card -->
                        <Card style="width: 22rem; height: 27rem;" class=" text-gray-900 bg-white-500">
                            <template #content>
                                <div class="flex align-items-center justify-content-center font-bold text-2xl mb-5"
                                    style="height: 5rem;">
                                    로그인 하세요
                                </div>
                                <form @submit.prevent="handleSubmit(!v$.$invalid)"
                                    class="flex flex-column justify-content-between p-fluid">
                                    <div>
                                        <div class="" style="height: 4rem;">
                                            <div class="p-float-label p-input-icon-right">
                                                <i class="pi pi-envelope" />
                                                <InputText id="email" v-model="v$.email.$model"
                                                    :class="{ 'p-invalid': v$.email.$invalid && submitted }"
                                                    aria-describedby="email-error" />
                                                <label for="email" :class="{ 'p-error': v$.email.$invalid && submitted }">
                                                    <i class="pi pi-user"></i> 아이디를 입력하세요</label>
                                            </div>
                                            <span v-if="v$.email.$error && submitted">
                                                <span id="email-error" v-for="(error, index) of v$.email.$errors"
                                                    :key="index">
                                                    <small class="p-error">{{ error.$message }}</small>
                                                </span>
                                            </span>
                                            <small
                                                v-else-if="(v$.email.$invalid && submitted) || v$.email.$pending.$response"
                                                class="p-error">{{ v$.email.required.$message.replace('Value', 'Email')
                                                }}</small>
                                        </div>

                                        <div class="mt-1" style="height: 4rem;">
                                            <div class="p-float-label">
                                                <Password id="password" v-model="v$.password.$model"
                                                    :class="{ 'p-invalid': v$.password.$invalid && submitted }" toggleMask>
                                                    <template #header>
                                                        <h6>비밀번호를 입력하세요</h6>
                                                    </template>
                                                    <template #footer="sp">
                                                        {{ sp.level }}
                                                        <Divider />
                                                        <p class="mt-2">추천 비밀 번호</p>
                                                        <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                                            <li>최소 한 글자 이상의 소문자</li>
                                                            <li>최소 한 글자 이상의 대문자</li>
                                                            <li>최소 하나 이상의 숫자</li>
                                                            <li>최소 8글자</li>
                                                        </ul>
                                                    </template>
                                                </Password>
                                                <label for="password"
                                                    :class="{ 'p-error': v$.password.$invalid && submitted }">
                                                    <i class="pi pi-lock"></i> 비밀번호를 입력하세요</label>
                                            </div>
                                            <small
                                                v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response"
                                                class="p-error">{{ v$.password.required.$message.replace('Value',
                                                    'Password')
                                                }}</small>
                                        </div>
                                        <div>
                                            <Checkbox id="accept" v-model="checked" value="true" class="mx-2" />
                                            <label for="accept"> 아이디 기억하기 </label>
                                        </div>
                                    </div>
                                    <!-- <div class="">
                                    <Checkbox id="accept" name="accept" value="Accept" v-model="v$.accept.$model" :class="{ 'p-invalid': v$.accept.$invalid && submitted }" />
                                    <label for="accept" :class="{ 'p-error': v$.accept.$invalid && submitted }">자동로그인</label>
                                </div> -->
                                    <div>
                                        <Button type="submit" label="로그인"
                                            class="mt-4 logincolor border-noround border-green-700 hover:bg-green-400 hover:border-green-400" />
                                    </div>
                                </form>

                            </template>
                        </Card>

                        <!-- Forwiz system -->
                        <div class="flex flex-column justify-content-center align-items-center text-white mt-5">
                            <div class="flex text-2xl font-bold">
                                Forwiz System
                            </div>
                            <div class="flex mt-1">
                                Copyright 2023. Forwiz System. All rights reserved
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import axios from 'axios'

import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import { useCookies } from "vue3-cookies";

export default {
    setup() {
        const state = reactive({
            email: '',
            password: '',
            // accept: null
        });

        const rules = {
            email: {
                required,
                // email
            },
            password: {
                required
            },
            // accept: { required }
        };

        onMounted(() => {
            const autoLogin = localStorage.getItem('autoLogin');
            if (autoLogin) {
                // console.log(state.email);
                state.email = autoLogin;
                checked.value = ['true']
            } else {
                console.log("no email remembered");
            }
        })

        const checked = ref(['false']);
        const submitted = ref(false);
        const showMessage = ref(false);

        const user = useUserStore();
        const { info, userdata } = storeToRefs(user);
        const { cookies } = useCookies();


        const v$ = useVuelidate(rules, state);

        const handleSubmit = (async (isFormValid) => {
            submitted.value = true;

            if (!isFormValid) {
                return;
            }

            try {
                const result = await getToken()
                userdata.value = await getUserData(0, state.email)  // email = username ...
                // console.log('after get login : ', userdata.value);
                cookies.set('accessToken', result.data.access_token);
                cookies.set('accessRefresh', result.data.refresh_token);
                // change pinia user info value
                info.value.checkLogin = 'login'
                if (checked.value == 'true') {
                    localStorage.setItem("autoLogin", state.email);
                } else {
                    localStorage.removeItem("autoLogin");
                }
            }
            catch {
                console.log("login is not completed")
            }
        })

        const getToken = (async () => {
            try {
                const result = await axios.post('/api/user/token', {
                    "username": state.email,
                    "password": state.password,
                })
                return result
            }
            catch (error) {
                console.log(error)
            }
        })

        const getUserData = (async (retry, ...theArgs) => {
            try {
                const result = await axios.get('/api/user/find_user/{id}?username=' + theArgs[0],)
                return result.data.data[0]
            }
            catch (error) {
                if (retry <= 2) {
                    user.tokenErrorHandler(error, getUserData, retry, theArgs);
                }
            }
        })

        const toggleDialog = () => {
            showMessage.value = !showMessage.value;

            if (!showMessage.value) {
                resetForm();
            }
        }
        const resetForm = () => {
            state.email = '';
            state.password = '';
            // state.accept = null;
            submitted.value = false;
        }

        return {
            onMounted,
            state,
            v$,
            handleSubmit,
            toggleDialog,
            submitted,
            showMessage,
            checked,
        }
    }
}
</script>

<style lang="scss" scoped>
.logincolor {
    background-color: #014751;
}
</style>
