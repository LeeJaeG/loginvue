<template>
  <div class="flex surface-ground" style="height: 100%">
    <!-- ====================================================================================== -->
    <div class="flex flex-column justify-content-between w-2 surface-card surface-border border-right-2 shadow-2 text-700"
      style="height: 100%">
      <div class="m-3">
        <div class="flex justify-content-between" style="height: 60px;">
          <button-group :buttons="viewTypeList" :button-style="customeTypeButtonStyle"
            :button-class="['hovercolor', 'flex', 'align-items-center', 'w-4', 'justify-content-center']"
            class="flex justify-content-between w-full border-bottom-1" @button-click="viewClickEvent" />
        </div>
        <div class="m-3">
          <div v-if="viewSelection">
            <button-group :buttons="sideMenu" :button-style="customeManuButtonStyle"
              :button-class="['hovercolor', 'px-4', 'py-3']" @button-click="menuClickEvent" />
          </div>
        </div>
      </div>
      <div class="px-4 py-2">
        <Checkbox v-model="showAllInOneFlowChart" inputId="AllInOne" name="Show All in one flow chart" :binary="true" />
        <label for="AllInOne" class="ml-2 text-sm"> Show guide-line for Autoscaling </label>
      </div>
    </div>
    <!-- ====================================================================================== -->
    <div class="flex flex-column relative flex-auto w-8" style="height: 100%">
      <div v-if="viewSelection == 'LB'" style="height: 95%">
        <div v-if="menuSelection == 'Load Balancer list'" style="height: 100%">
          <div class="surface-card p-5 shadow-2 border-round m-4" style="height: 100%">
            <Skeleton v-if="loadingLBList == true" class="mr-2 h-full" />
            <div v-else style="height: 100%">
              <div class="flex justify-content-end mb-2">
                <Button class="bg-cyan-700 border-teal-700">delete</Button>
              </div>
              <div class="flex flex-column flex-nowrap overflow-y-scroll pr-3" style="height: 95%">
                <div v-for="lb in loadbalancerList" :key="lb" class="w-full my-3 border-0 border-round p-4 shadow-2">
                  <div class="text-xl text-900 font-medium font-bold mb-3">
                    {{ lb["name"] }}
                  </div>
                  <div v-for="value, key in LBListkeys" :key="value" class="flex mt-1">
                    <div
                      class="flex w-1 mr-2 align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                      {{ value }}
                    </div>
                    <div>
                      {{ lb[key] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="menuSelection == 'Load Balancer create'" style="height: 100%">
          <!-- loadbalancerInputs -->
          <div class="surface-card p-5 shadow-2 border-round m-4" style="height: 100%">
            <div class="flex" style="height: 10%">
              <button-group :buttons="loadbalancerViewTypeList" :button-style="customeTypeButtonStyle"
                :button-class="['hovercolor', 'flex', 'align-items-center', 'w-4', 'justify-content-center']"
                class="flex justify-content-between w-full border-bottom-1" @button-click="loadbalancerViewClickEvent" />
            </div>
            <div class="p-3" style="height: 80%">
              <div class="grid">
                <div v-for="inputValue, inputKey in loadbalancerInputs[loadbalancerCreateMenu]" :key="inputValue"
                  class="col-6 h-8rem">
                  <div class="mb-3 text-lg">
                    {{ inputKey }}
                  </div>
                  <div>
                    <InputText v-if="inputValue.type == 'Input text'" type="text" v-model="inputValue.value"
                      class="w-full" />
                    <SelectButton v-else-if="inputValue.type == 'Select button'" v-model="inputValue.value"
                      :options="inputValue['Select button']" class="w-full" />
                    <Dropdown v-else-if="inputValue.type == 'Dropdown'" v-model="inputValue.value"
                      :options="inputValue['Dropdown']" class="w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-content-end align-items-center" style="height: 10%">
              <Button class="mr-3"> create </Button>
              <Button class="w-1  bg-cyan-700 border-teal-700" label="Cancel" @click="cancelInput" />
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="viewSelection == 'Cluster'" style="height: 95%">
        this is the cluster page
        <div v-if="menuSelection == 'Profiles'" style="height: 100%">
          {{ menuSelection }}
        </div>
        <div v-else-if="menuSelection == 'Nodes'" style="height: 100%">
          {{ menuSelection }}
        </div>
        <div v-else-if="menuSelection == 'Clusters'" style="height: 100%">
          {{ menuSelection }}
        </div>
        <div v-else-if="menuSelection == 'Policies'" style="height: 100%">
          {{ menuSelection }}
        </div>
        <div v-else-if="menuSelection == 'Receivers'" style="height: 100%">
          {{ menuSelection }}
        </div>
      </div>
      <div v-else-if="viewSelection == 'Alarm'" style="height: 95%">
        <div v-if="menuSelection == 'Alarm list'" style="height: 100%">
          <div class="surface-card p-5 shadow-2 border-round m-4" style="height: 100%">
            <Skeleton v-if="loadingalarmList == true" class="mr-2 h-full" />
            <div v-else style="height: 100%">
              <div class="flex justify-content-end mb-2">
                <Button class="bg-cyan-700 border-teal-700">delete</Button>
              </div>
              <div class="flex flex-column flex-nowrap overflow-y-scroll pr-3" style="height: 95%">
                <div v-for="alarm in alarmList" :key="alarm" class="w-full my-3 border-0 border-round p-4 shadow-2">
                  <div class="text-xl text-900 font-medium font-bold mb-3">
                    {{ alarm["name"] }}
                  </div>
                  <div v-for="value, key in alarmListkeys" :key="value" class="flex mt-1">
                    <div
                      class="flex w-1 mr-2 align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                      {{ value }}
                    </div>
                    <div>
                      {{ alarm[key] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- v-if=loadingalarmList then show Skeleton or show alarm list(or console.alarm error )-->
        </div>
        <div v-else-if="menuSelection == 'Alarm create'" style="height: 100%">
          <div class="gap-2 m-4 overflow-y-scroll surface-card p-5 shadow-2 border-round" style="height: 100%">
            <div v-for="inputValue, inputKey in alarmInputs" :key="inputValue" class="flex flex-column ">
              <div class="mb-3">
                <label class="text-xl font-normal">{{ inputKey }}</label>
                :
                <small class="text-sm font-normal">{{ inputValue.description }}</small>
              </div>
              <InputText v-if="inputKey != 'Subject type'" type="text" v-model="inputValue.value" />
              <div v-else class="flex">
                <div v-for="Atype in alarmType" :key="Atype.key" class="flex align-items-center mr-3">
                  <RadioButton v-model="inputValue.value" :value="Atype.name" :inputId="Atype.key" />
                  <label :for="Atype.key" class="ml-2">{{ Atype.name }}</label>
                </div>
              </div>
              <Divider />
            </div>
            <div class="button-container justify-content-end flex">
              <Button class="w-1 mr-3 bg-cyan-700 border-teal-700" label="Apply" @click="submitInput" />
              <Button class="w-1  bg-cyan-700 border-teal-700" label="Cancel" @click="cancelInput" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        this is Autoscaling page
      </div>
    </div>
    <!-- ====================================================================================== -->
    <div v-if="showAllInOneFlowChart == true"
      class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="">
      <div class="px-4 py-2">
        <div>
          All in One Flow chart
        </div>
        <div>
          It is just guide line for building Autoscaling system.
          Please let youself sure about what is the best way for your system.
        </div>
        <ul class="list-none flex flex-column gap-3 justify-content-between p-0">
          <li class="flex align-items-center justify-content-between flex-grow relative w-full" style="height: 120px;">
            <div class="flex justify-content-center align-items-center border-circle bg-primary-100 w-3rem h-3rem z-1">
              <i class="pi pi-check text-xl text-primary-600"></i>
            </div>
            <div class="hidden block absolute bg-primary-500"
              style="transform: rotate(90deg); height: 2px;  width: 50%; left: -16%; top:110%;"></div>
            <div class="flex flex-column align-items-center w-8">
              <h1 class="m-0 font-medium text-900 text-xl line-height-3">Step 1.</h1>
              <span class="text-600 text-base text-center">Create the Load Balancer</span>
            </div>
          </li>
          <li class="flex align-items-center justify-content-between flex-grow relative w-full" style="height: 120px;">
            <div class=" flex justify-content-center align-items-center border-circle bg-primary-100 w-3rem h-3rem
          z-1">
              <i class="pi pi-check text-xl text-primary-600"></i>
            </div>
            <div class="hidden block absolute bg-primary-500"
              style="transform: rotate(90deg); height: 2px;  width: 50%; left: -16%; top:110%;"></div>
            <div class="flex flex-column align-items-center w-8">
              <h1 class="m-0 font-medium text-900 text-xl line-height-3">Step 2.</h1>
              <span class="text-600 text-base text-center">Create the Cluster</span>
            </div>
          </li>
          <li class="flex align-items-center justify-content-between flex-grow relative w-full" style="height: 120px;">
            <div class=" flex justify-content-center align-items-center border-circle bg-primary-100 w-3rem h-3rem
          z-1">
              <i class="pi pi-check text-xl text-primary-600"></i>
            </div>
            <!-- <div class="hidden block absolute bg-primary-500 hidden"
              style="transform: rotate(90deg); height: 2px;  width: 50%; left: -16%; top:110%;"></div> -->
            <div class="flex flex-column align-items-center w-8">
              <h1 class="m-0 font-medium text-900 text-xl line-height-3">Step 3.</h1>
              <span class="text-600 text-base text-center">Create Alarm</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- ====================================================================================== -->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import axios from 'axios';
import ButtonGroup from '@/components/ButtonSelectionComponent.vue';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);
const user = useUserStore();
const { userdata } = storeToRefs(user);

const showAllInOneFlowChart = ref(false)

const customeTypeButtonStyle = ref({
  'activeColor': '#0bc279',
  'activeBorderBottom': 'solid thick #0bc279',
})

const customeManuButtonStyle = ref({
  'activeBgColor': '#0bc279',
  'activeColor': 'white',
})

const viewTypeList = ref([
  { id: 'a', label: 'LB', active: false },
  { id: 'b', label: 'Cluster', active: false },
  { id: 'c', label: 'Alarm', active: false },
])

const viewSelection = ref(null)
const sideMenu = ref([])
const viewClickEvent = ((view) => {
  if (view.active == false) {
    menuSelection.value = null;
    viewSelection.value = view.label;
    if (viewSelection.value == 'LB') {
      sideMenu.value = [
        { id: 'lbList', label: 'Load Balancer list', active: false },
        { id: 'lbCreate', label: 'Load Balancer create', active: false },
      ];
    } else if (viewSelection.value == 'Cluster') {
      sideMenu.value = [
        { id: 'profiles', label: 'Profiles', active: false },
        { id: 'nodes', label: 'Nodes', active: false },
        { id: 'clusters', label: 'Clusters', active: false },
        { id: 'policies', label: 'Policies', active: false },
        { id: 'receivers', label: 'Receivers', active: false },
      ];
    } else {
      sideMenu.value = [
        { id: 'alarmList', label: 'Alarm list', active: false },
        { id: 'alarmCreate', label: 'Alarm create', active: false },
      ];
    }
  } else {
    viewSelection.value = null;
    sideMenu.value = null
  }
})
const menuSelection = ref(null)
const menuClickEvent = ((metric) => {
  // console.log(metric)
  menuSelection.value = metric.label

  if (metric.label == 'Alarm list') {
    getAlarmListInProject(0)
  }
  else if (metric.label == 'Load Balancer list') {
    getLBListInProject(0)
  }
})

const originLBInputs = ref()
const originAlarmInputs = ref()
onMounted(() => {
  contentBarName.value = 'Cloud Autoscaling Service'
  // 깊은 복사를 위해 JSON.parse(JSON.stringify()) 사용
  originLBInputs.value = JSON.parse(JSON.stringify(loadbalancerInputs.value))
  originAlarmInputs.value = JSON.parse(JSON.stringify(alarmInputs.value))
})

// LB 관련 ===================

const loadbalancerViewTypeList = ref([
  { id: 'a', label: 'Load Balancer Details', active: true },
  { id: 'b', label: 'Listener Details', active: false },
  { id: 'c', label: 'Pool Details', active: false },
  { id: 'd', label: 'Pool Members', active: false },
  { id: 'f', label: 'Monitor Details', active: false }
])

const loadbalancerCreateMenu = ref("Load Balancer Details")
const loadbalancerViewClickEvent = ((createLB) => {
  loadbalancerCreateMenu.value = createLB.label
})

const loadbalancerInputs = ref({
  "Load Balancer Details": {
    "Name": {
      'type': 'Input text',
      'value': '',
    },
    "IP address": {
      'type': 'Input text',
      'value': '',
    },
    "Description": {
      'type': 'Input text',
      'value': '',
    },
    "Flavor": {
      'type': 'Input text',
      'value': '',
    },
    "Subnet": {
      'type': 'Input text',
      'value': '',
    },
    "Admin State Up": {
      'type': 'Select button',
      'Select button': ['YES', 'NO'],
      'value': 'YES',
    },
  },
  "Listener Details": {
    "Name": {
      'type': 'Input text',
      'value': '',
    },
    "Description": {
      type: 'Input text',
      value: '',
    },
    "Protocol": {
      'type': 'Input text',
      'value': '',
    },
    "Port": {
      'type': 'Input text',
      'value': '',
    },
    "Client Data Timeout": {
      'type': 'Input text',
      'value': '50000',
    },
    "TCP Inspect Timeout": {
      'type': 'Input text',
      'value': '0',
    },
    "Member Connect Timeout": {
      'type': 'Input text',
      'value': '5000',
    },
    "Member Data Timeout": {
      'type': 'Input text',
      'value': '5000',
    },
    "Connection Limit": {
      'type': 'Input text',
      'value': '-1',
    },
    "Admin State Up": {
      'type': 'Select button',
      'Select button': ['YES', 'NO'],
      'value': 'YES',
    },
  },
  "Pool Details": {
    "Name": {
      'type': 'Input text',
      'value': '',
    },
    "Description": {
      'type': 'Input text',
      'value': '',
    },
    "Algorithm": {
      'type': 'Dropdown',
      'Dropdown': ['ROUND_ROBIN', 'LEAST_CONNECTIONS', 'SOURCE_IP'],
      'value': '',
    },
    "Session Persistence": {
      'type': 'Dropdown',
      'Dropdown': ['None', 'SOURCE_IP', 'HTTP_COOKIE', 'APP_COOKIE'],
      'value': 'None',
    },
    "Admin State Up": {
      'type': 'Select button',
      'Select button': ['YES', 'NO'],
      'value': 'YES',
    },
  },
  "Pool Members": {
  },
  "Monitor Details": {
    "Name": {
      'type': 'Input text',
      'value': '',
    },
    "Type": {
      'type': 'Dropdown',
      'Dropdown': ['HTTP', 'HTTPS', 'PING', 'TCP', 'TLS-HELLO', 'UDP-CONNECT'],
      'value': '',
    },
    "Max Retries Down": {
      'type': 'Input text',
      'value': '3',
    },
    "Delay": {
      'type': 'Input text',
      'value': '5',
    },
    "Max Retries": {
      'type': 'Input text',
      'value': '3',
    },
    "Timeout": {
      'type': 'Input text',
      'value': '5',
    },
    "Admin State Up": {
      'type': 'Select button',
      'Select button': ['YES', 'NO'],
      'value': 'YES',
    },
  },
})

const loadbalancerList = ref()
const loadingLBList = ref(false)
const getLBListInProject = (async (retry, ...theArgs) => {
  console.log("getAllLBs")
  try {
    loadingLBList.value = true
    const response = await axios.get('/api/openstack-loadbalancer/loadbalancers/' + userdata.value.selectedProject.project_id)
    console.log(response.data)
    loadbalancerList.value = response.data.loadbalancers;
    loadingLBList.value = false
  } catch (error) {
    console.log(error)
    if (retry <= 2) {
      user.tokenErrorHandler(error, getLBListInProject, retry, theArgs);
    }
  }
})

const LBListkeys = ref({
  'name': 'Name',
  'operating_status': 'Operation Status',
  'description': 'Description',
  'id': 'ID',
  'listeners': 'Listeners',
  'pools': 'Pools',
  'vip_address': 'VIP Address',
})

// LB 관련 끝 =================
// Cluster 관련 ================

// Cluster 관련 끝 ==============
// Alarm 관련 =================

const alarmType = ref(
  [
    { 'name': 'Instance', 'key': 'instance' },
    { 'name': 'Cluster', 'key': 'cluster' }
  ]
)

//알람 생성
const submitInput = () => {
  // Send input value to the backend server
  const inputData = {
    name: alarmInputs.value["Name"].value,
    description: alarmInputs.value["Description"].value,
    metric: alarmInputs.value["Metric type"].value,
    subjecttype: alarmInputs.value["Subject type"].value,
    subjectid: alarmInputs.value["Subject ID"].value,
    granularity: alarmInputs.value["Granularity"].value,
    threshold: alarmInputs.value["Threshold"].value,
    evaluationperiod: alarmInputs.value["Evaluation periods"].value,
    alarmaction: alarmInputs.value["Alarm actions"].value,
    repeatactions: alarmInputs.value["Repeat actions"].value,
    aggregationmethod: alarmInputs.value["Aggregation method"].value,
    operator: alarmInputs.value["Comparison operator"].value,
    projectid: userdata.value.selectedProject.project_id
  };
  // console.log(Object.keys(inputData))
  console.log(userdata.value)

  axios.post('/api/openstack-autoscaling/alarms-create/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id, inputData)
    .then(() => {
      // Successful submission
      window.alert("알람 생성 완료")
    }).catch(
      (err) => {
        window.alert(err + "알람 삭제 실패")
      }
    );
};

const alarmList = ref()
const loadingalarmList = ref(false)
const getAlarmListInProject = (async (retry, ...theArgs) => {
  console.log("getAllalarms")
  try {
    loadingalarmList.value = true
    const response = await axios.get('/api/openstack-autoscaling/alarm-list/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id)
    alarmList.value = response.data.data[0];
    loadingalarmList.value = false
  } catch (error) {
    console.log(error)
    if (retry <= 2) {
      user.tokenErrorHandler(error, getAlarmListInProject, retry, theArgs);
    }
  }
})

const cancelInput = () => {
  window.alert("입력란을 초기화 합니다.")
  loadbalancerInputs.value = JSON.parse(JSON.stringify(originLBInputs.value))
  alarmInputs.value = JSON.parse(JSON.stringify(originAlarmInputs.value))
}

const alarmInputs = ref({
  "Name": {
    "value": null,
    "description": "Enter name of the alarm",
  },
  "Description": {
    "value": null,
    "description": "Input your desired threshold",
  },
  "Metric type": {
    "value": null,
    "description": "[cpu,memory,disk,network]",
  },
  "Subject type": {
    "value": null,
    "description": "Select Subject type [Instance or Cluster]",
  },
  "Subject ID": {
    "value": null,
    "description": "Input ID of 'cluster' or 'instance'",
  },
  "Granularity": {
    "value": null,
    "description": "Input desired granularity for aggregation",
  },
  "Threshold": {
    "value": null,
    "description": "ex) [cpu,memory,disk,network]",
  },
  "Evaluation periods": {
    "value": null,
    "description": "Set evaluation periods ex)1,2",
  },
  "Alarm actions": {
    "value": null,
    "description": "If 'log://' : save log on local directory",
  },
  "Repeat actions": {
    "value": null,
    "description": "true or false, if true : alarm will keep sending notification",
  },
  "Aggregation method": {
    "value": null,
    "description": "Input aggregation method ex)[mean,rate:mean,sum,max,min]",
  },
  "Comparison operator": {
    "value": null,
    "description": "Input comparison operator ex)[gt,ge,lt,le]",
  },
})

const alarmListkeys = ref({
  'alarm_actions': 'Alarm action',
  'ok_actions': 'ok action',
  'state': 'State',
  'description': 'Description',
  'project_id': 'Project ID',
  'alarm_id': 'ID',
})

// Alarm 관련 끝 ======================

</script>

<style></style>
