<template>
    <div class=" flex surface-ground" style="height: 100%">
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-3 text-700" style="">
            <div class="text-2xl font-bold mb-4">
                Alarm list
            </div>
            <ul>
                <li v-for="alarm in alarmList" :key="alarm">{{ alarm }}</li>
            </ul>
            <div class="button-container">
                <Button class="w-4" label="create alarm" size="small" @click="clickcreateEvent" />
                <Button class="w-4" label="delete alarm" size="small" @click="clickdeleteEvent" />
                <Button class="w-4" label="update alarm" size="small" />
            </div>
        </div>
        <div class="flex flex-column w-10">
            <div v-if="showInputWindow"
                class="input-window flex flex-column w-4 p-4 surface-card shadow-3 surface-border border-right-2"
                style="top: 0; right: 0; height: 100%; overflow-y: auto;">
                <div class="flex flex-column gap-2">
                    <label class="text-xl font-normal">Alarmname</label>
                    <input type="text" v-model="inputName" />
                    <small class="text-sm font-normal">Enter name of the alarm</small>
                    <Divider />

                    <label class="text-xl font-normal">Description</label>
                    <input type="text" v-model="inputdescription" />
                    <small class="text-sm font-normal">Set description for the alarm</small>
                    <Divider />

                    <label class="text-xl font-normal">Metric type</label>
                    <input type="text" v-model="inputmetric" />
                    <small class="text-sm font-normal">ex) [cpu,memory,disk,network]</small>
                    <Divider />


                    <label class="text-xl font-normal">Subject type</label>
                    <div class="flex align-items-center gap-3">
                        <div>
                            <RadioButton v-model="inputsubjecttype" inputID="inputsubject1" name="subject" value="id" />
                            <label for="inputsubject1" class="ml-2">Instance</label>
                        </div>
                        <div>
                            <RadioButton v-model="inputsubjecttype" inputID="inputsubject2" name="subject"
                                value="cluster_id" />
                            <label for="inputsubject2" class="ml-2">Cluster</label>
                        </div>
                    </div>
                    <small class="text-sm font-normal">Select Subject type [Instance or Cluster]</small>
                    <Divider />

                    <label class="text-xl font-normal">Subject ID</label>
                    <input type="text" v-model="inputsubjectid" />
                    <small class="text-sm font-normal">Input ID of 'cluster' or 'instance'</small>
                    <Divider />

                    <label class="text-xl font-normal">Granularity</label>
                    <input type="number" v-model="inputgranularity" />
                    <small class="text-sm font-normal">Input desired granularity for aggregation</small>
                    <Divider />

                    <label class="text-xl font-normal">Threshold</label>
                    <input type="number" v-model="inputthreshold" />
                    <small class="text-sm font-normal">Input your desired threshold</small>
                    <Divider />

                    <label class="text-xl font-normal">Evaluation periods</label>
                    <input type="number" v-model="inputPeriods" />
                    <small class="text-sm font-normal">Set evaluation periods ex)1,2</small>
                    <Divider />

                    <label class="text-xl font-normal">Alarmaction</label>
                    <input type="text" v-model="inputalarmaction" />
                    <small class="text-sm font-normal">if 'log://' : save log on local directory</small>
                    <Divider />

                    <label class="text-xl font-normal">Repeat actions</label>
                    <input type="text" v-model="inputrepeatactions" />
                    <small class="text-sm font-normal">true or false, if true : alarm will keep sending notification
                    </small>
                    <Divider />

                    <label class="text-xl font-normal">Aggregation method</label>
                    <input type="text" v-model="inputaggregationmethod" />
                    <small class="text-sm font-normal">Input aggregation method ex)[mean,rate:mean,sum,max,min] </small>
                    <Divider />

                    <label class="text-xl font-normal">Comparison operator</label>
                    <input type="text" v-model="inputoperator" />
                    <small class="text-sm font-normal">Input comparison operator ex)[gt,ge,lt,le] </small>
                    <Divider />

                    <div class="button-container">
                        <Button class="w-4" label="Apply" size="small" @click="submitInput" />
                        <Button class="w-4" label="Cancel" size="small" @click="cancelInput" />
                    </div>
                </div>
            </div>

            <div v-if="showInputWindow2"
                class="input-window flex flex-column w-4 p-4 surface-card shadow-3 surface-border border-right-2"
                style="top: 0; right: 0; height: 100%; overflow-y: auto;">
                <div class="flex flex-column gap-2">
                    <label class="text-xl font-normal">AlarmID</label>
                    <input type="text" v-model="inputID" />
                    <small class="text-sm font-normal">Enter ID of the alarm you want to delete</small>
                    <Divider />
                    <div class="button-container">
                        <Button class="w-4" label="Delete" size="small" @click="submitDelete" />
                        <Button class="w-4" label="Cancel" size="small" @click="cancelInput2" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
  
  
  
<script setup>
import { usePathStore } from '@/stores/path';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { onMounted, ref } from 'vue';


//상수 [입력창]
const showInputWindow = ref(false);
const showInputWindow2 = ref(false);


//상수 [Input]
const inputName = ref('');
const inputPeriods = ref('');
const inputthreshold = ref('');
const inputrepeatactions = ref('');
const inputalarmaction = ref('');
const inputsubjectid = ref('');
const inputgranularity = ref('');
const inputdescription = ref('');
const inputmetric = ref('');
const inputaggregationmethod = ref('')
const inputoperator = ref('')
const inputID = ref('');
const inputsubjecttype = ref('');


//창 열기
const clickcreateEvent = () => {
    showInputWindow.value = true;
    showInputWindow2.value = false;
};
const clickdeleteEvent = () => {
    showInputWindow2.value = true;
    showInputWindow.value = false;
};


//알람 생성
const submitInput = () => {
    // Send input value to the backend server
    const inputData = {
        name: inputName.value,
        description: inputdescription.value,
        metric: inputmetric.value,
        subjecttype: inputsubjecttype.value,
        subjectid: inputsubjectid.value,
        granularity: inputgranularity.value,
        threshold: inputthreshold.value,
        evaluationperiod: inputPeriods.value,
        alarmaction: inputalarmaction.value,
        repeatactions: inputrepeatactions.value,
        aggregationmethod: inputaggregationmethod.value,
        operator: inputoperator.value,
        projectid: userdata.value.selectedProject.project_id
    };

    // console.log(Object.keys(inputData))

    axios.post('/test/openstack-alarms/alarms/create', inputData)
        .then(() => {
            // Successful submission
            window.alert("알람 생성 완료")

        });
};


//알람 삭제
const submitDelete = () => {
    const inputData = {
        ID: inputID.value,
        projectid: userdata.value.selectedProject.project_id
    }
    axios.post('/test/openstack-alarms/alarms/delete', inputData)
        .then(() => {
            window.alert("알람 삭제 완료")
        }).catch(
            (err) => {
                window.alert("알람 삭제 실패")
            }
        );

};


//입력 창 닫기
const cancelInput = () => {
    closeInputwindow();
};
const cancelInput2 = () => {
    closeInputwindow2();
};
const closeInputwindow = () => {
    showInputWindow.value = false;
};
const closeInputwindow2 = () => {
    showInputWindow2.value = false;
};


// 상수[참조]
const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
const { userdata } = storeToRefs(user);


//페이지 로딩 시 알람 리스트 불러오기
onMounted(async () => {
    contentBarName.value = 'Setting'
    getAlarmListInProject(0)
})

const alarmList = ref();
const loadingalarmList = ref(false)

const getAlarmListInProject = (async (retry, ...theArgs) => {
    console.log("getAllalarms")
    try {
        loadingalarmList.value = true
        const response = await axios.get('/test/openstack-alarms/alarms/' + userdata.value.selectedProject.project_id)
        alarmList.value = response.data.data[0];
        loadingalarmList.value = false
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getAlarmListInProject, retry, theArgs);
        }
    }
})


</script>
  
<style>
.button-container {
    display: flex;
    justify-content: center;
    gap: 5px;
}

/* .input-window {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .input-window input {
    margin-bottom: 10px;
  }
  
  .input-window .button-container {
    display: flex;
    justify-content: center;
    gap: 5px;
  } */
</style>
  