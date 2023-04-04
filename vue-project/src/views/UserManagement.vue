<!-- eslint-disable vue/no-ref-as-operand -->
<!-- eslint-disable vue/no-ref-as-operand -->
<template>
    <div class="surface-card shadow-2 border-round p-4">
        <div class="flex justify-content-between align-items-center">
            <span class="text-xl text-900 font-medium">Members</span>
            <div>
                <Button v-if="showUserList" icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                    @click="$refs.menu1.toggle($event)"></Button>
                <Button v-else icon="pi pi-chevron-down" class="p-button-text p-button-plain p-button-rounded"
                    @click="showUser" />
                <Menu ref="menu1" :popup="true" :model="items"></Menu>
            </div>
            <Dialog v-model:visible="addUserVisible" modal header="Add User" :style="{ width: '50vw' }">
                <div>
                    <Panel header="User Info">
                        <div class="m-0">
                            <div class="grid formgrid p-fluid">
                                <div class="field mb-4 col-12 md:col-6">
                                    <label for="username" class="font-medium text-900">Username</label>
                                    <InputText id="username" type="text" v-model="addUser.username" />
                                </div>
                                <div class="field mb-4 col-12 md:col-6">
                                    <label for="password" class="font-medium text-900">Password</label>
                                    <InputText id="password" type="password" v-model="addUser.password" />
                                </div>
                                <div class="field mb-4 col-12 md:col-6">
                                    <label for="email" class="font-medium text-900">Email</label>
                                    <InputText id="email" type="text" v-model="addUser.email" />
                                </div>
                                <div class="field mb-4 col-12 md:col-6">
                                    <label for="fullName" class="font-medium text-900">Name</label>
                                    <InputText id="fullName" type="text" v-model="addUser.fullName" />
                                </div>
                                <div class="field mb-4 col-12 md:col-6">
                                    <label for="role" class="font-medium text-900">Role</label>
                                    <Dropdown v-model="addUser.role" :options="roles" optionLabel="role" optionValue="role"
                                        placeholder="Select a Role" id="role" />
                                </div>
                            </div>
                        </div>
                    </Panel>
                    <Panel header="Add Project" class="mt-3">
                        <div class="m-0 ">
                            <div class="grid formgrid p-fluid">
                                <div class="field mb-4 col-12 md:col-6">
                                    <label for="project" class="font-medium text-900">Default Project</label>
                                    <Dropdown v-model="addUser.projectID" :options="allProjectList" optionValue="project_id"
                                        optionLabel="project_name" placeholder="Select a Project" id="project" />
                                </div>
                                <div class="field mb-4 col-12 md:col-6">
                                    <label for="projectRole" class="font-medium text-900">Project Role</label>
                                    <Dropdown v-if="addUser.projectID == 'null'" disabled v-model="addUser.projectRole"
                                        :options="roles" optionLabel="role" placeholder="Select a Project role"
                                        id="projectRole" />
                                    <Dropdown v-else v-model="addUser.projectRole" :options="roles" optionLabel="role"
                                        placeholder="Select a Project role" id="projectRole" />
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" @click="cancelAddUser" text />
                    <Button label="Yes" icon="pi pi-check" @click="postAddUser(0)" autofocus />
                </template>
            </Dialog>
        </div>
        <ul v-if="showUserList" class="list-none p-0 m-0 mt-5">
            <li v-for="list in tenantUserList[0]" :key="list"
                class="flex flex-column md:flex-row md:align-items-center cursor-pointer md:justify-content-between p-3 hover:bg-green-100 pointer-events-auto">
                <div class="flex w-full p-ripple" @click="showUser(list)" v-ripple>
                    <Avatar label="O" class="mr-2 bg-teal-100 text-white" style="width: 45px; height: 45px" />
                    <div class="mr-0 md:mr-8">
                        <span class="block text-900 font-medium mb-1">{{ list.username }}</span>
                        <div class="text-600">{{ list.role }} : {{ list.email }} </div>
                    </div>
                </div>
                <div class="mt-2 md:mt-0 flex flex-nowrap">
                    <Button class="p-button-text p-button-plain p-button-rounded mr-1" icon="pi pi-pencil"
                        @click="editUserDetail(list)"></Button>
                </div>
            </li>
        </ul>
        <Dialog v-model:visible="editUserVisible" modal header="Edit User Setting" :style="{ width: '50vw' }">
            <div>
                <!-- {{ selectedUser }} -->
                <div class="text-900 font-semibold text-lg mt-3">Profile</div>
                <Divider></Divider>
                <div class="flex gap-5 flex-column-reverse md:flex-row">
                    <div class="flex-auto p-fluid">
                        <div class="mb-4">
                            <label for="editUsername" class="block font-medium text-900 mb-2">Username</label>
                            <InputText id="editUsername" v-model="selectedUser.username" type="text" />
                        </div>
                        <div class="mb-4">
                            <label for="editFullname" class="block font-medium text-900 mb-2">Name</label>
                            <InputText id="editFullname" v-model="selectedUser.full_name" type="text"></InputText>
                        </div>
                        <div class="mb-4">
                            <label for="editEmail" class="block font-medium text-900 mb-2">Email</label>
                            <div class="p-inputgroup">
                                <InputText id="editEmail" type="email" v-model="selectedUser.email" />
                                <!-- <span class="p-inputgroup-addon">@</span>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     <InputText type="text" /> -->
                            </div>
                        </div>
                        <div class="mb-4">
                            <label for="editRole" class="block font-medium text-900 mb-2">Role</label>
                            <Dropdown id="editRole" type="text" v-model="selectedUser.role" :options="roles"
                                optionLabel="role" optionValue="role" placeholder="Select a Role" />
                        </div>
                        <div class="flex justify-content-end">
                            <Button label="Update Profile" class="w-auto mr-2" severity="success"></Button>
                            <Button label="Delete Profile" class="w-auto " severity="danger"
                                @click="deleteUser(0, selectedUser.id)"></Button>
                        </div>
                    </div>
                    <div class="flex flex-column align-items-center flex-or">
                        <span class="font-medium text-900 mb-2">Profile Picture</span>
                        <img src="profile.png" class="h-10rem w-10rem" />
                        <Button type="button" icon="pi pi-pencil" class="p-button-rounded -mt-4"
                            severity="success"></Button>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
    <div v-if="!showUserList" class="surface-card shadow-2 border-round mt-4 p-4">
        <div class="flex justify-content-between align-items-center mb-3 ">
            <div>
                <span class="text-xl font-medium bg-green-50 text-green-400 border-round"> {{ selectedUser.full_name
                }}</span>
                <span class="text-xl text-900 font-medium"> 's Projects</span>
            </div>
            <Button icon="pi pi-fw pi-plus" class="p-button-text p-button-plain p-button-rounded"
                @click="addProjectToUser()"></Button>
        </div>
        <Dialog v-model:visible="addProjectToUserVisible" modal header="Add Project to user"
            style="width: 50vw; max-height: 800px;">
            <div class="flex justify-content-between">
                <div class="w-5">
                    <Panel header="Available projects" style="height: 600px; overflow: scroll;">
                        <ul class="p-0 m-0">
                            <li v-ripple v-for="list in allProjectListForUser[0]" :key="list" tabindex="1"
                                @focus="addFocusEvent(list.project_id, $event)" @blur="addBlurEvent"
                                class="p-ripple list-none hover:bg-green-100 addList">
                                <div class=" flex flex-wrap px-4 align-items-center gap-3" style="height: 60px;">
                                    <div class="flex-1 flex flex-column gap-2">
                                        <span class="font-bold">{{ list.project_name }}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </Panel>
                </div>

                <div v-if="!working" class="flex flex-column justify-content-center align-items-center w-2 ">
                    <Button v-if="!working && (projectIdForAddToUser != null) && (isFocusedForAdd == true)"
                        class="flex justify-content-center align-items-center m-1" style="width: 50px; height: 50px;"
                        @click="addProjectFromAvailableListToUser(0)">Add</Button>
                    <Button v-else disabled class="flex justify-content-center align-items-center m-1"
                        style="width: 50px; height: 50px;">Add</Button>

                    <Button v-if="(projectIdForDeleteFromUser != null) && (isFocusedForDelete == true)"
                        class="flex justify-content-center align-items-center m-1" style="width: 50px; height: 50px;"
                        @click="deleteProjectFromUser(0)">Delete</Button>
                    <Button v-else disabled class="flex justify-content-center align-items-center m-1"
                        style="width: 50px; height: 50px;">Delete</Button>
                </div>
                <div v-else class="flex flex-column justify-content-center align-items-center w-2 ">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                </div>

                <div class="w-5">
                    <Panel header="User's project" style="height: 600px; overflow: scroll;">
                        <ul class="p-0 m-0">
                            <li v-ripple v-for="list in allProjectListForUser[1]" :key="list" tabindex="1"
                                @focus="deleteFocusEvent(list.project_id, $event)"
                                class="p-ripple list-none  hover:bg-green-100 addList">
                                <div class=" flex flex-wrap px-4 align-items-center gap-3" style="height: 60px;">
                                    <div class="flex-1 flex flex-column gap-2">
                                        <span class="font-bold">{{ list.project_name }}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </Panel>
                </div>
            </div>
        </Dialog>
        <div class="grid">
            <div v-for="project in userProjects" :key="project" class="col-12 md:col-6 xl:col-3 p-3">
                <div class="surface-card shadow-2 border-round p-4">
                    <div class="flex flex-column align-items-center mb-3">
                        <span class="font-medium text-900 text-xl mb-2">{{ project.project_name }}</span>
                        <span class="text-600 font-medium mb-2">{{ project.project_description }}</span>
                        <span v-ripple class="p-ripple text-600 surface-200 p-2 border-round">Horizon</span>
                    </div>
                    <div class="pt-3 border-top-1 surface-border flex">
                        <Button type="button" label="Details" class="flex-auto mr-2 p-button-outlined p-button-plain"
                            @click="showProjectDetail(project.project_id)" style="border-radius: 30px"></Button>
                        <Button type="button" label="Delete" class="flex-auto ml-2 p-button-outlined p-button-plain"
                            style="border-radius: 30px"
                            @click="deleteProjectFromUserInSimple(0, project.project_id, project.project_user_role)"></Button>
                    </div>
                </div>
            </div>

            <Dialog v-model:visible="projectDetailsVisible" modal header="Project Details : " class="w-8"
                :style="{ 'min-width': '600px' }">
                <div class="mb-4 pb-3 shadow-2  border-round border-1 surface-border">
                    <div class="flex justify-content-start align-items-center border-radius font-medium text-xl text-900 px-3"
                        style="height: 5vh;">
                        {{ projectDetails[0]['project']['name'] }}</div>
                    <div v-for="(detail, key ) in projectDetails[0]['project']" :key="detail"
                        class="flex surface-card px-3">
                        <div
                            class="flex align-items-center w-2 bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                            {{ key }}
                        </div>
                        <div class=" w-10 text-600 font-medium  py-1 px-2">{{ detail }} </div>
                    </div>
                </div>
                <div class="mb-4 pb-3 shadow-2  border-round border-1 surface-border ">
                    <div class="flex justify-content-start align-items-center border-radius font-medium text-xl text-900 px-3"
                        style="height: 5vh;">
                        유저 </div>
                    <div class="flex justify-content-start">
                        <div class="flex w-2 justify-content-center">
                            <div
                                class="flex align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                                사용자 이름
                            </div>
                        </div>
                        <div class="flex w-2  justify-content-center">
                            <div
                                class="flex align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                                역할
                            </div>
                        </div>
                        <div class="flex w-4  justify-content-center">
                            <div
                                class="flex align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                                사용자 ID
                            </div>
                        </div>
                        <div class="flex w-2 justify-content-center">
                            <div
                                class="flex align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                                활성화 여부
                            </div>
                        </div>
                        <div class="flex w-2 justify-content-center">
                            <div
                                class="flex align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                                Email
                            </div>
                        </div>
                    </div>
                    <div v-for=" user in projectDetails[0]['users']" :key="user" class="flex justify-content-start">
                        <div class="flex w-2 justify-content-center">
                            <div class="flex align-items-center  text-600 font-medium py-1 px-2">
                                {{ user.user.name }}
                            </div>
                        </div>
                        <div class="flex w-2 justify-content-center">
                            <div class="flex align-items-center  text-600 font-medium py-1 px-2">
                                {{ user.role }}
                            </div>
                        </div>
                        <div class="flex w-4 justify-content-center">
                            <div class="flex align-items-center text-600 font-medium py-1 px-2  text-xs">
                                {{ user.user.id }}
                            </div>
                        </div>
                        <div class="flex w-2 justify-content-center">
                            <div class="flex align-items-center  text-600 font-medium py-1 px-2">
                                {{ user.user.is_enabled }}
                            </div>
                        </div>
                        <div class="flex w-2 justify-content-center">
                            <div class="flex align-items-center  text-600 font-medium py-1 px-2">
                                {{ user.user.email }}
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { usePrimeVue } from "primevue/config";
import axios from 'axios'
import { useUserStore } from '@/stores/user'
const user = useUserStore();
// import { useCookies } from "vue3-cookies";
// const { cookies } = useCookies();
const working = ref(false);
const $primevue = usePrimeVue();
defineExpose({
    $primevue
})

onMounted(() => {
    getUserList(0);
})

const addUserVisible = ref(false);
const editUserVisible = ref(false);
const projectDetailsVisible = ref(false);

const tenantUserList = ref('')
const getUserList = ((retry) => {
    axios.get('/api/user/')
        .then((response) => {
            tenantUserList.value = response.data.data
        })
        .catch((error) => {
            // It is recurisive action. If error occurs continuously, It should have a circuit breaker.
            if (retry <= 2) {
                user.tokenErrorHandler(error, getUserList, retry);
            }
        });
})

const projectDetails = ref('');

const showProjectDetail = ((projectID) => {
    getProjectDetails(0, projectID);
})

const getProjectDetails = ((retry, ...theArgs) => {
    axios.post('/api/openstack/openstack_project_find', {
        "project_id": theArgs[0], // projectID,
    })
        .then((response) => {
            projectDetails.value = response.data.data
            projectDetailsVisible.value = true;
            // console.log(projectDetails.value);
        })
        .catch((error) => {
            if (retry <= 2) {
                user.tokenErrorHandler(error, getUserList, retry, theArgs); // 이 부분 수정 필요, 함수에 추가 인자가 붙을 경우 처리 고민 ...
            }
        });
})

const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                command: () => {
                    // console.log("New button");
                    getAllProject(0).then(() => {
                        allProjectList.value.push({
                            "project_name": "None",
                            "project_id": 'null',
                        })
                        addUserVisible.value = true;
                    });
                }
            },
            // {
            //     label: 'Delete',
            //     icon: 'pi pi-times',
            //     command: () => {
            //         console.log("update button")
            //     }
            // }
        ]
    },
]);

const showUserList = ref(true);
const selectedUser = ref('');
const userProjects = ref('')

const editUserDetail = ((user) => {
    if (selectedUser.value == '') {
        selectedUser.value = user;
        editUserVisible.value = true;
        console.log(selectedUser.value);
    }
    else {
        selectedUser.value = ''
        editUserDetail(user);
    }
})

const showUser = (user) => {

    // console.log(showUserList.value);
    if (selectedUser.value == '') {
        selectedUser.value = user;
        userProjects.value = user.projects;
        showUserList.value = !showUserList.value;
    }
    else {
        selectedUser.value = ''
        showUser(user);
    }
}

const roles = ref([
    {
        'role': 'admin'
    }, {
        'role': 'member'
    }, {
        'role': 'guest'
    }
])

const addUser = ref(
    {
        "username": '',
        "password": '',
        "email": '',
        "fullName": '',
        "role": '',
        "projectID": 'null',
        "projectRole": '',
    }
)

const addProjectToUserVisible = ref(false)
const allProjectListForUser = ref([[], []])
const addProjectToUser = (async () => {
    await getAllProject(0);

    const dataX = JSON.parse(JSON.stringify(allProjectList.value));
    const dataY = selectedUser.value.projects;

    const availableProjects = dataX.filter((x) => {
        // !selectedUser._rawValue.projects.project_id.includes(x.project_id);
        return !dataY.some((y) => {
            if (y.project_id == x.project_id) {
                return true
            }
        });
    })
    allProjectListForUser.value = [availableProjects, selectedUser.value.projects]
    addProjectToUserVisible.value = true;
})

const cancelAddUser = (() => {
    addUserVisible.value = false;
    addUser.value = {
        "username": '',
        "password": '',
        "email": '',
        "fullName": '',
        "role": '',
        "projectID": 'null',
        "projectRole": '',
    }
}
)

const postAddUser = ((retry) => {
    if (addUser.value.projectID == 'null') {
        addUser.value.projectID = null
    }
    axios.post('/api/user/add', {
        "username": addUser.value.username,
        "password": addUser.value.password,
        "email": addUser.value.email,
        "full_name": addUser.value.fullName,
        "role": addUser.value.role,
        "projects": addUser.value.projectID,
    })
        .then((response) => {
            console.log(response.data);
            addUserVisible.value = false;
            cancelAddUser;
        })
        .catch((error) => {
            // It is recurisive action. If error occurs continuously, It should have a circuit breaker.
            if (retry <= 2) {
                user.tokenErrorHandler(error, postAddUser, retry);
            }
        });
})

const deleteUser = ((retry, userID) => {
    axios.delete('/api/user/delete/' + userID,)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            // It is recurisive action. If error occurs continuously, It should have a circuit breaker.
            if (retry <= 2) {
                user.tokenErrorHandler(error, deleteUser, retry);
            }
        });
})

const allProjectList = ref('');
const getAllProject = (async (retry) => {
    try {
        const response = await axios.get('/api/openstack/openstack_projects')
        allProjectList.value = response.data.data[0];
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getAllProject, retry);
        }
    }
})


const addProjectFromAvailableListToUser = (async (retry) => {
    working.value = true;
    console.log({
        "username": selectedUser.value.username,
        "project_id": projectIdForAddToUser,
        "project_role": "member",
    })
    try {
        await axios.post('/api/user/add_project_user', {
            "username": selectedUser.value.username,
            "project_id": projectIdForAddToUser.value,
            "project_role": "member",
        })
        const newList = ref(JSON.parse(JSON.stringify(allProjectListForUser.value[0].filter((x) => {
            if (x.project_id == projectIdForAddToUser.value) {
                return true
            }
        }))))
        selectedUser.value.projects.push(newList.value[0]); // newList must have only one object
        await addProjectToUser();
        projectIdForAddToUser.value = null;
        isFocusedForAdd.value = false;
        working.value = false;
    } catch (error) {
        working.value = false;
        if (retry <= 2) {
            user.tokenErrorHandler(error, addProjectFromAvailableListToUser, retry);
        }
    }
})

const deleteProjectFromUserInSimple = (async (retry, ...theArgs) => {
    console.log(theArgs);
    working.value = true;
    try {
        await axios.post('/api/user/delete_project_user', {
            "username": selectedUser.value.username,
            "project_id": theArgs[0], // project_id
            "project_role": theArgs[1] // project_role
        })
        const idx = selectedUser.value.projects.findIndex((item) => { return item.project_id === theArgs[0] });
        if (idx > -1) selectedUser.value.projects.splice(idx, 1);
    } catch (error) {
        working.value = false;
        if (retry <= 2) {
            user.tokenErrorHandler(error, deleteProjectFromUserInSimple, retry, theArgs);
        }
    }
})

const deleteProjectFromUser = (async (retry) => {
    working.value = true;
    try {
        await axios.post('/api/user/delete_project_user', {
            "username": selectedUser.value.username,
            "project_id": projectIdForDeleteFromUser.value,
            "project_role": "member",
        })
        const newList = ref(JSON.parse(JSON.stringify(allProjectListForUser.value[1].filter((x) => {
            if (x.project_id == projectIdForDeleteFromUser.value) {
                return true
            }
        }))))
        const idx = selectedUser.value.projects.findIndex((item) => { return item.project_id === newList.value[0].project_id });
        if (idx > -1) selectedUser.value.projects.splice(idx, 1);
        await addProjectToUser();
        projectIdForDeleteFromUser.value = null;
        isFocusedForDelete.value = false;
        working.value = false;
    } catch (error) {
        working.value = false;
        if (retry <= 2) {
            user.tokenErrorHandler(error, deleteProjectFromUser, retry);
        }
    }
})

const isFocusedForAdd = ref(false)
const isFocusedForDelete = ref(false)
const projectIdForAddToUser = ref(null)
const addFocusEvent = ((id, event) => {
    projectIdForDeleteFromUser.value = null;
    isFocusedForDelete.value = false;
    var buttons = document.getElementsByClassName("addList");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("list-focus");
    }
    const targetId = event.currentTarget;
    targetId.classList.add('list-focus');
    projectIdForAddToUser.value = id;
    isFocusedForAdd.value = true;
})

const projectIdForDeleteFromUser = ref(null)
const deleteFocusEvent = ((id, event) => {
    projectIdForAddToUser.value = null;
    isFocusedForAdd.value = false;
    var buttons = document.getElementsByClassName("addList");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("list-focus");
    }
    const targetId = event.currentTarget;
    targetId.classList.add('list-focus');
    projectIdForDeleteFromUser.value = id
    isFocusedForDelete.value = true;
})
</script>

<style scoped>
.logincolor {
    background-color: #014751;
}

:deep(.p-panel .p-panel-content) {
    min-height: 538px;
    padding: 0%;
}

/* .list-focus:focus {
    background-color: #e8f6ed;
    border: thin solid #01c445;
    border-radius: 5px;
    font-style: bold;
    color: black;
} */

.list-focus {
    background-color: #e8f6ed;
    border: thin solid #01c445;
    border-radius: 5px;
    font-style: bold;
    color: black;
}
</style>