<template>
    <div>
        <div id="serverMap" class="border-0 shadow-2 border-round p-3 m-3 surface-card" style="height: 500px;">
            <div class="flex justify-content-end">
                <Dialog v-model:visible="visible" modal header="Create" style="width: 50vw; height: 70%;">
                    <div class="flex justify-content-center flex-column overflow-y-auto">
                        <div class="card flex justify-content-start mb-2 w-full">
                            <div class="flex justify-content-center align-items-center mr-1 w-3">Building</div>
                            <InputText class="border-round w-9" type="text" v-model="create.building.building" />
                            <button label="+" :pt="{
                                root: {
                                    class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',
                                    style: 'width: 60px; height: 30px !important;'
                                },
                                label: {
                                    class: 'text-white', style: 'font-size: 12px;'
                                }
                            }" @click="addFloor" />

                        </div>
                        <div v-for="(floor, i) in create.building.floor" :key="i">
                            <div class="card flex justify-content-start mb-2 w-full ">
                                <div class="flex justify-content-center align-items-center mr-1 w-5">Floor</div>
                                <!-- <div> {{ i }}, {{ floor }}</div> -->
                                <InputText class="border-round w-9" type="text" v-model="floor.name" />
                                <button label="+" :pt="{
                                    root: {
                                        class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',
                                        style: 'width: 60px; height: 30px !important;'
                                    },
                                    label: {
                                        class: 'text-white', style: 'font-size: 12px;'
                                    }
                                }" @click="addRoom(i)" />
                                <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"
                                    @click="deleteList" />
                            </div>
                            <div v-for="(room, j) in floor.room" :key="j">
                                <div class="card flex justify-content-start mb-2 w-full ">
                                    <div class="flex justify-content-center align-items-center mr-1 w-7">Room</div>
                                    <InputText class="border-round w-9" type="text" v-model="room.name" />
                                    <button label="+" :pt="{
                                        root: {
                                            class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',
                                            style: 'width: 60px; height: 30px !important;'
                                        },
                                        label: {
                                            class: 'text-white', style: 'font-size: 12px;'
                                        }
                                    }" @click="addRack(i, j)" />
                                    <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" />
                                </div>
                                <div v-for="(rack, k) in room.rack" :key="k">
                                    <div class="card flex justify-content-start mb-2 w-full ">
                                        <div class="flex justify-content-center align-items-center mr-1 w-9">Rack</div>
                                        <InputText class="border-round w-9" type="text" v-model="rack.name" />
                                        <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <Dialog v-model:visible="visible2" modal header="Update" :style="{ width: '50vw' }">
                    <div class="flex justify-content-center flex-column overflow-y-auto">
                        <div class="card flex justify-content-start mb-2 w-full">
                            <div class="flex justify-content-center align-items-center mr-1 w-3">Building</div>
                            <InputText class="border-round w-9" type="text" v-model="updateServerData.building" />
                            <button label="+" :pt="{
                                root: {
                                    class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',
                                    style: 'width: 60px; height: 30px !important;'
                                },
                                label: {
                                    class: 'text-white', style: 'font-size: 12px;'
                                }
                            }" /> <!-- 클릭이벤트 있었음 -->
                        </div>
                        <div v-for="(floor, i) in updateServerData.floor" :key="i">
                            <div class="card flex justify-content-start mb-2 w-full ">
                                <div class="flex justify-content-center align-items-center mr-1 w-5">Floor</div>
                                <!-- <div> {{ i }}, {{ floor }}</div> -->
                                <InputText class="border-round w-9" type="text" v-model="floor.name" />
                                <button label="+" :pt="{
                                    root: {
                                        class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',
                                        style: 'width: 60px; height: 30px !important;'
                                    },
                                    label: {
                                        class: 'text-white', style: 'font-size: 12px;'
                                    }
                                }" @click="addRoom(i)" />

                            </div>
                            <div v-for="(room, j) in floor.room" :key="j">
                                <div class="card flex justify-content-start mb-2 w-full ">
                                    <div class="flex justify-content-center align-items-center mr-1 w-7">Room</div>
                                    <InputText class="border-round w-9" type="text" v-model="room.name" />
                                    <button label="+" :pt="{
                                        root: {
                                            class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',
                                            style: 'width: 60px; height: 30px !important;'
                                        },
                                        label: {
                                            class: 'text-white', style: 'font-size: 12px;'
                                        }
                                    }" @click="addRack(i, j)" />
                                </div>
                                <div v-for="(rack, k) in room.rack" :key="k">
                                    <div class="card flex justify-content-start mb-2 w-full ">
                                        <div class="flex justify-content-center align-items-center mr-1 w-9">Rack</div>
                                        <InputText class="border-round w-9" type="text" v-model="rack.name" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
            <div class="flex" style="height: 90%;">
                <div v-for=" tableValue  in  serverTable " :key="tableValue"
                    class="flex flex-column justify-content-center align-items-center surface-100 shadow-2 border-round p-2 m-2 w-3">
                    <div class="w-full flex justify-content-start align-items-center font-bold" style="height: 10%;">
                        {{ tableValue.name }}
                    </div>
                    <div class="border-1 surface-border border-round m-2 w-full surface-card overflow-y-auto"
                        style="height: 90%;">
                        <div v-for="(data, index) in tableValue.data" :key="index"
                            class="flex justify-content-start align-items-center px-3 hover:text-green-400 cursor-pointer "
                            :class="{ 'bg-green-100 text-green-400': checkSelected(tableValue, data) }"
                            style="height: 40px;" @click="listClick(tableValue.name, data)">
                            {{ data }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Button label="Submit" severity="success" text raised @click="emitValues"></Button>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
// import { useRouter } from 'vue-router';

import axios from 'axios';

// const router = useRouter();
// const metaKey = ref(true);

onMounted(async () => {
    // mockData
    mockData.value = await getDataFromServer()
    // mockData의 리스트 각각의 name을 serverTable name: '건물'에 data 리스트 안으로 넣어주기
    serverTable.value.building.data = extractBuildingList(mockData.value)
})

const props = defineProps({
    emitValue: Function
})

const emitValues = () => {
    const building = selectedBuilding.value;
    const floor = selectedFloor.value;
    const room = selectedRoom.value;
    const rack = selectedRack.value;

    if (building !== '' && floor !== '' && room !== '' && rack !== '') {
        console.log('it is working', building, floor, room, rack)
        props.emitValue(building, floor, room, rack);
    } else {
        console.log('it seems weird', building, floor, room, rack)
        window.alert('You MUST select all subsets to submit');
    }
};

const getDataFromServer = async () => {
    try {
        const response = await axios.get('/api/physical_layer/locations')
        //console.log(response.data)
        totalServerData.value = response.data
        return response.data
    } catch (err) {
        console.log(err)
    }
}

const totalServerData = ref()
const updateServerData = ref()

const selectedBuildingIdForDelete = ref()
const extractBuildingList = (data) => {
    const buildList = []
    data.forEach((building) => {
        buildList.push(building.building)
    })
    return buildList
}

const extractFloorList = (data, buildingName) => {
    var building
    const floorList = []


    for (var i = 0; i < data.length; i++) {
        if (data[i].building == buildingName) {
            building = data[i]
            break
        }
    }
    // delete 버튼이 바라보고 있는 변수에 _id
    selectedBuildingIdForDelete.value = building._id
    //console.log(selectedBuildingIdForDelete.value)

    building.floor.forEach((floor) => {
        floorList.push(floor.name)
    })

    return floorList
}

const extractRoomList = (data, buildingName, floorName) => {
    var building
    var floor
    const roomList = []

    for (let i = 0; i < data.length; i++) {
        if (data[i].building == buildingName) {
            building = data[i]
            break
        }
    }

    for (let i = 0; i < building.floor.length; i++) {
        if (building.floor[i].name == floorName) {
            floor = building.floor[i]
            break
        }
    }

    //console.log(floor)


    floor.room.forEach((room) => {
        roomList.push(room.name)
    })

    return roomList
}

const extractRackList = (data, buildingName, floorName, roomList) => {
    var building
    var floor
    var room
    const rackList = []

    for (let i = 0; i < data.length; i++) {
        if (data[i].building == buildingName) {
            building = data[i]
            break
        }
    }

    for (let i = 0; i < building.floor.length; i++) {
        if (building.floor[i].name == floorName) {
            floor = building.floor[i]
            break
        }
    }

    for (let i = 0; i < floor.room.length; i++) {
        if (floor.room[i].name == roomList) {
            room = floor.room[i]
            break
        }
    }
    room.rack.forEach((rack) => {
        rackList.push(rack.name)
    })

    return rackList
}

const selectedBuilding = ref('')
const selectedFloor = ref('')
const selectedRoom = ref('')
const selectedRack = ref('')

const addBublingData = ref();
const addFloorData = ref();
const addRoomData = ref();
const addRackData = ref();

const listClick = (type, data) => {
    if (type == '건물') {
        selectedFloor.value = ''
        selectedRoom.value = ''
        serverTable.value.floor.data = []
        serverTable.value.room.data = []
        serverTable.value.rack.data = []
        selectedBuilding.value = data
        addBublingData.value = selectedBuilding.value
        clickBuilding(data)
    } else if (type == '층') {
        selectedRoom.value = ''
        serverTable.value.room.data = []
        serverTable.value.rack.data = []
        selectedFloor.value = data
        addFloorData.value = selectedFloor.value
        clickFloor(selectedBuilding.value, data)
    } else if (type == '방') {
        selectedRack.value = ''
        serverTable.value.rack.data = []
        selectedRoom.value = data
        addRoomData.value = selectedRoom.value
        clickRoom(selectedBuilding.value, selectedFloor.value, data)
    } else if (type == '랙') {
        selectedRack.value = data
        addRackData.value = selectedRack.value
        clickRack(selectedBuilding.value, selectedFloor.value, selectedRoom.value, data)
    }
}

const clickBuilding = (buildingName) => {
    serverTable.value.floor.data = extractFloorList(mockData.value, buildingName)
}

const clickFloor = (buildingName, floorName) => {
    serverTable.value.room.data = extractRoomList(mockData.value, buildingName, floorName)
}

const clickRoom = (buildingName, floorName, roomName) => {
    serverTable.value.rack.data = extractRackList(mockData.value, buildingName, floorName, roomName)
}

const clickRack = (buildingName, floorName, roomName, rackName) => {
    serverTable.value.rack.data = extractRackList(mockData.value, buildingName, floorName, roomName, rackName)
}

const checkSelected = (tableValue, data) => {
    return (data == selectedBuilding.value && tableValue.name == '건물') || (data == selectedFloor.value && tableValue.name == '층') || (data == selectedRoom.value && tableValue.name == '방' || (data == selectedRack.value && tableValue.name == '랙'))
}

const serverTable = ref({
    building: {
        name: '건물',
        data: []
    },
    floor: {
        name: '층',
        data: []
    },
    room: {
        name: '방',
        data: []
    },
    rack: {
        name: '랙',
        data: []
    }
})

const mockData = ref();
const visible = ref(false);
const visible2 = ref(false);

const create = ref({
    building: {
        building: "",
        floor: []
    },
    //빌딩 위치의 add라는게 클릭이 되면 그 위치 안에 floor자식을 추가해라. 
})

const addFloor = () => {
    const floor = {
        name: "",
        room: []
    }
    create.value.building.floor.push(floor)
}

const addRoom = (i) => {
    //const test = floor
    //console.log(test)
    const room = {
        name: "",
        rack: []
    }
    // console.log(create.value.building.floor[i].room.push(room))
    create.value.building.floor[i].room.push(room)
}

const addRack = (i, j) => {
    const rack = {
        name: ""
    }
    create.value.building.floor[i].room[j].rack.push(rack)
}

const deleteList = () => {
    console.log("test")
}

// const check = () => {
//     console.log(serverTable, '서버테이블')
//     console.log(selectedBuilding, 'building')
//     console.log(selectedFloor, 'floor')
//     console.log(selectedRoom, 'room')
//     console.log(selectedRack, 'Rack')
// }

</script>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>