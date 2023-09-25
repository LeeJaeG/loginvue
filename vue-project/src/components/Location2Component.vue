<template>
    <div>
        <div class="mt-3 mb-3 text-xl font-bold"> Device Location Manager </div>
        <div id="serverMap" class="border-0 shadow-2 border-round p-3 m-3 surface-card" style="height: 500px;">

            <div class="flex justify-content-end">

                <Button label="Create" :pt="{

                    root: {

                        class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',

                        style: 'width: 60px; height: 30px !important;'

                    },

                    label: {

                        class: 'text-white', style: 'font-size: 12px;'

                    }

                }" @click="visible = true" />

                <Dialog v-model:visible="visible" modal header="Create" style="width: 50vw; height: 70%;">

                    <div class="flex justify-content-center flex-column overflow-y-auto ">

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
                                    @click="deleteCreateFloor(i)" />

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

                                    <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"
                                        @click="deleteCreateRoom(i, j)" />

                                </div>

                                <div v-for="(rack, k) in room.rack" :key="k">

                                    <div class="card flex justify-content-start mb-2 w-full ">

                                        <div class="flex justify-content-center align-items-center mr-1 w-9">Rack</div>

                                        <InputText class="border-round w-9" type="text" v-model="rack.name" />

                                        <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"
                                            @click="deleteCreateRack(i, j, k)" />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <Button label="Done" :pt="{

                        root: {

                            class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',

                            style: 'width: 60px; height: 30px !important;'

                        },

                        label: {

                            class: 'text-white', style: 'font-size: 12px;'

                        }

                    }" @click="postDataFromServer" />

                </Dialog>



                <Button label="Update" :pt="{

                    root: {

                        class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',

                        style: 'width: 60px; height: 30px !important;'

                    },

                    label: {

                        class: 'text-white', style: 'font-size: 12px;'

                    }

                }" @click="getUpdateServerData" class="ml-2" />

                <Dialog v-model:visible="visible2" modal header="Update" style="width: 50vw; height: 70%;">

                    <div class="flex justify-content-center flex-column overflow-y-auto ">

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

                            }" @click="updateFloor" />

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

                                }" @click="updateRoom(i)" />

                                <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"
                                    @click="deleteUpdateFloor(i)" />



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

                                    }" @click="updateRack(i, j)" />

                                    <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"
                                        @click="deleteUpdateRoom(i, j)" />

                                </div>

                                <div v-for="(rack, k) in room.rack" :key="k">

                                    <div class="card flex justify-content-start mb-2 w-full ">

                                        <div class="flex justify-content-center align-items-center mr-1 w-9">Rack</div>

                                        <InputText class="border-round w-9" type="text" v-model="rack.name" />

                                        <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel"
                                            @click="deleteUpdateRack(i, j, k)" />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <Button label="Done" :pt="{

                        root: {

                            class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',

                            style: 'width: 60px; height: 30px !important;'

                        },

                        label: {

                            class: 'text-white', style: 'font-size: 12px;'

                        }

                    }" @click="updateDataFromServer" />

                </Dialog>

                <Button label="Delete" :pt="{

                    root: {

                        class: 'bg-green-400 border-green-400 hover:bg-green-600 hover:border-green-600 border-1 border-round z-2 flex justify-content-center align-items-center',

                        style: 'width: 60px; height: 30px !important;'

                    },

                    label: {

                        class: 'text-white', style: 'font-size: 12px;'

                    }

                }" @click="deleteDataFromServer" class="ml-2" />

            </div>

            <div class="flex" style="height: 90%;">

                <div v-for=" tableValue  in  serverTable " :key="tableValue"
                    class="flex flex-column justify-content-center align-items-center surface-100 shadow-2 border-round p-2 m-2 w-3">

                    <div class="w-full flex justify-content-start align-items-center font-bold" style="height: 10%;">

                        {{ tableValue.name }}

                    </div>

                    <div class="border-1 surface-border border-round m-2 w-full surface-card overflow-y-auto"
                        style="height: 90%;">

                        <div v-for="(data, index)  in  tableValue.data" :key="index"
                            class="flex justify-content-start align-items-center px-3 hover:text-green-400 cursor-pointer "
                            :class="{ 'bg-green-100 text-green-400': checkSelected(tableValue, data) }"
                            style="height: 40px;" @click="listClick(tableValue.name, data)">

                            {{ data }}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    </div>
</template>

<script setup>



import { onMounted, ref } from 'vue';

// import { useRouter } from 'vue-router';



import axios from 'axios';



// const router = useRouter();




onMounted(async () => {

    // mockData를 불러오고 변수에 저장

    mockData.value = await getDataFromServer()
    serverTable.value.building.data = extractBuildingList(mockData.value)

})



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



const getUpdateServerData = () => {

    visible2.value = true

    //forEach 돌리기

    //selectedBuildingIdForDelete.value = buildingID

    //console.log(updateServerData.value[0]._id)

    for (var i = 0; i < totalServerData.value.length; i++) {

        if (totalServerData.value[i]._id == selectedBuildingIdForDelete.value) {

            updateServerData.value = totalServerData.value[i]

            //console.log(updateServerData.value)

            break

        }

    }

}



const deleteDataFromServer = async () => {

    // console.log(selectedBuildingIdForDelete.value)

    try {

        await axios.delete('/api/physical_layer/locations/' + selectedBuildingIdForDelete.value)
        window.alert('Location successfully Deleted')
        mockData.value = await getDataFromServer()
        serverTable.value.building.data = extractBuildingList(mockData.value)
        //console.log(response)

        // router.go(0)

    } catch (err) {
        console.log(err)
        window.alert('Location Delete process Failed')
    }

}



const updateDataFromServer = async () => {

    const update = updateServerData.value



    try {

        await axios.put('/api/physical_layer/locations/' + selectedBuildingIdForDelete.value, update)
        window.alert('Location succesfully Updated')
        mockData.value = await getDataFromServer()
        serverTable.value.building.data = extractBuildingList(mockData.value)
        //console.log(response)
        visible2.value = false;
        // router.go(0)

    } catch (err) {
        console.log(err)
        window.alert('Location Updating process Failed')
    }

}

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



    for (var i = 0; i < data.length; i++) {

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

// create창 boolean
const visible = ref(false);

// update창 boolean
const visible2 = ref(false);



const postDataFromServer = async () => {



    const post = create.value.building



    // console.log(post, JSON.stringify(post))

    try {

        await axios.post('/api/physical_layer/locations', post)
        window.alert('Location Succesfully Added')
        mockData.value = await getDataFromServer()
        serverTable.value.building.data = extractBuildingList(mockData.value);
        visible.value = false;
        //console.log(response)

        // router.go(0);

    } catch (err) {
        console.log(err)
        window.alert('Location Adding process Failed')
    }



}



const create = ref({

    building: {

        building: "",

        floor: []

    }



    //빌딩 위치의 add라는게 클릭이 되면 그 위치 안에 floor자식을 추가해라.

})



const addFloor = () => {

    const floor = {

        name: "",

        room: []

    }

    create.value.building.floor.push(floor)

    //console.log(create.value.building)

    //console.log(create.value.building.floor)

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



const deleteCreateFloor = (i) => {

    create.value.building.floor.splice(i, 1)



}



const deleteCreateRoom = (i, j) => {

    create.value.building.floor[i].room.splice(j, 1)

}



const deleteCreateRack = (i, j, k) => {

    create.value.building.floor[i].room[j].rack.splice(k, 1)

}



const deleteUpdateFloor = (i) => {

    updateServerData.value.floor.splice(i, 1)

}



const deleteUpdateRoom = (i, j) => {

    updateServerData.value.floor[i].room.splice(j, 1)

}



const deleteUpdateRack = (i, j, k) => {

    updateServerData.value.floor[i].room[j].rack.splice(k, 1)

}



const updateFloor = () => {

    const floor = {

        name: "",

        room: []

    }

    updateServerData.value.floor.push(floor)

    //i번째에 들어가야 할듯 하다

}



const updateRoom = (i) => {

    //const test = floor

    //console.log(test)

    const room = {

        name: "",

        rack: []

    }

    // console.log(create.value.building.floor[i].room.push(room))

    updateServerData.value.floor[i].room.push(room)

}



const updateRack = (i, j) => {



    const rack = {

        name: ""

    }

    updateServerData.value.floor[i].room[j].rack.push(rack)

}



const addBublingData = ref();

const addFloorData = ref();

const addRoomData = ref();

const addRackData = ref();

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