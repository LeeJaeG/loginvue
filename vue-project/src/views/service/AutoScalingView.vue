<template>
  <ConfirmDialog></ConfirmDialog>
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
      <!-- LB ============================================ -->
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
                  <div class="mb-3 text-lg flex">
                    {{ inputKey }}
                    <div v-if="inputValue.need == true" class="text-red-400 ml-1">
                      *
                    </div>
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
              <Button v-if="loadingLBCreating" class="w-1  bg-cyan-700 border-teal-700 mr-3" label="Progress"
                @click="showLBcreateDialog()" />
              <Button class="w-1  bg-cyan-700 border-teal-700 mr-3" :loading="loadingLBCreating" label="Create"
                @click="createLBConfirm()" />
              <Button class="w-1  bg-cyan-700 border-teal-700" label="Cancel" @click="cancelInput" />
            </div>
            <Dialog v-model:visible="creatingLBvisible" modal header="Creating Load Balancer" :style="{ width: '50vw' }">
              <div class="my-3">
                Progress
              </div>
              <div>
                <ProgressBar :value="loadingPercentage" style="height: 50px;"></ProgressBar>
              </div>
              <div v-html="creatingLBMessage" class="mt-3 surface-800 text-white p-4 border-round" style="height: 500px;">
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <!-- Cluster ============================================ -->
      <div v-else-if="viewSelection == 'Cluster'" style="height: 95%">
        <div v-if="menuSelection == 'Cluster list'" style="height: 100%">
          <div class="surface-card p-5 shadow-2 border-round m-4" style="height: 100%">
            <div class="flex" style="height: 10%">
              <button-group :buttons="clusterViewTypeList" :button-style="customeTypeButtonStyle"
                :button-class="['hovercolor', 'flex', 'align-items-center', 'w-4', 'justify-content-center']"
                class="flex justify-content-between w-full border-bottom-1" @button-click="clusterViewClickEvent" />
            </div>
            <div class="m-3 flex overflow-y-auto" style="height: 90%">
              <div v-if="clusterShowMenu">
                <Skeleton v-if="loadingClusterViewList == true" class="mr-2 h-full" />
                <div v-for="list in clusterViewDataList" v-bind:key="list"
                  class="border-0 border-round p-4 shadow-2 mb-3">
                  <!-- {{ list }} -->
                  <div v-for="value, key in list" :key="value" class="flex mt-1">
                    <div
                      class="flex w-1 mr-2 align-items-center bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm font-bold">
                      {{ key }}
                    </div>
                    <div>
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="menuSelection == 'Cluster create'" style="height: 100%">
          <div class="surface-card p-5 shadow-2 border-round m-4" style="height: 100%">
            <div class="flex" style="height: 10%">
              <button-group :buttons="clusterCreateTypeList" :button-style="customeTypeButtonStyle"
                :button-class="['hovercolor', 'flex', 'align-items-center', 'w-4', 'justify-content-center']"
                class="flex justify-content-between w-full border-bottom-1" @button-click="clusterCreateClickEvent" />
            </div>
            <div class="p-3" style="height: 80%">
              <div class="grid">
                <div v-for="inputValue, inputKey in clusterInputs[clusterCreateMenu]" :key="inputValue"
                  class="col-6 h-8rem">
                  <div class="mb-3 text-lg flex">
                    {{ inputKey }}
                    <div v-if="inputValue.need == true" class="text-red-400 ml-1">
                      *
                    </div>
                  </div>
                  <div>
                    <InputText v-if="inputValue.type == 'Input text'" type="text" v-model="inputValue.value"
                      class="w-full" />
                    <SelectButton v-else-if="inputValue.type == 'Select button'" v-model="inputValue.value"
                      :options="inputValue['Select button']" class="w-full" />
                    <Dropdown v-else-if="inputValue.type == 'Dropdown'" v-model="inputValue.value"
                      :options="inputValue['Dropdown']" class="w-full" />
                    <Textarea v-else-if="inputValue.type == 'Textarea'" v-model="inputValue.value" class="w-full" rows="1"
                      cols="1" style="max-height: 400px;" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-content-end align-items-center" style="height: 10%">
              <Button class="w-1  bg-cyan-700 border-teal-700 mr-3" :loading="loadingClusterCreating" label="Create"
                @click="createCluster(0, clusterCreateMenu.toLowerCase())" />
              <Button class="w-1  bg-cyan-700 border-teal-700" label="Cancel" @click="cancelInput" />
            </div>
          </div>
        </div>
      </div>
      <!-- Alarm ============================================ -->
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
import { useConfirm } from "primevue/useconfirm";
import yaml from 'js-yaml'

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
        { id: 'clusterList', label: 'Cluster list', active: false },
        { id: 'clusterCreate', label: 'Cluster create', active: false },
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
const originClusterInputs = ref()
const originAlarmInputs = ref()
onMounted(() => {
  contentBarName.value = 'Service : Autoscaling'
  // 깊은 복사를 위해 JSON.parse(JSON.stringify()) 사용
  originLBInputs.value = JSON.parse(JSON.stringify(loadbalancerInputs.value))
  originClusterInputs.value = JSON.parse(JSON.stringify(clusterInputs.value))
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
    // "Flavor": {
    //   'type': 'Input text',
    //   'value': '',
    // },
    "Subnet": {
      'type': 'Input text',
      'value': '',
      'need': true,
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
      'need': true,
    },
    "Port": {
      'type': 'Input text',
      'value': '',
      'need': true,
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
      'need': true,
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
      'need': true,
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
      'need': true,
    },
    "Max Retries Down": {
      'type': 'Input text',
      'value': '3',
      'need': true,
    },
    "Delay": {
      'type': 'Input text',
      'value': '5',
      'need': true,
    },
    "Max Retries": {
      'type': 'Input text',
      'value': '3',
      'need': true,
    },
    "Timeout": {
      'type': 'Input text',
      'value': '5',
      'need': true,
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

const LBConfirm = useConfirm();
const createLBConfirm = () => {
  LBConfirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      console.log("accept")
      createLB(0)
    },
    reject: () => {
      console.log("reject")
    }
  });
}

const loadingLBCreating = ref(false)
const loadingPercentage = ref(0)
const creatingLBMessage = ref("")
const createLB = (async (retry, ...theArgs) => {
  console.log("createLBs")
  try {
    loadingLBCreating.value = true
    // 1. Create the Load Balancer 
    creatingLBMessage.value = ""
    creatingLBMessage.value += "=> Autoscaling service Init ... done <br />"
    creatingLBMessage.value += "=> Creating Load Balancer"
    var response = await axios.post('/api/openstack-loadbalancer/loadbalancers', {
      'name': loadbalancerInputs.value['Load Balancer Details']['Name'].value,
      'description': loadbalancerInputs.value['Load Balancer Details']['Description'].value,
      'vip_subnet_id': loadbalancerInputs.value['Load Balancer Details']['Subnet'].value,
      'vip_address': loadbalancerInputs.value['Load Balancer Details']['IP address'].value,
      'admin_state_up': loadbalancerInputs.value['Load Balancer Details']['Admin State Up'].value,
      'project_id': userdata.value.selectedProject.project_id,
    })

    console.log("create LB is done", response.data)
    const lb_id = response.data.loadbalancer_id
    creatingLBMessage.value += " ... done <br />"
    creatingLBMessage.value += "=> Load Balancer id" + lb_id + " is " + response.data.loadbalancer_status + '<br />'
    loadingPercentage.value = 25

    // 2. Create the Listener
    creatingLBMessage.value += "=> Creating Listener"
    response = await axios.post('/api/openstack-loadbalancer/listeners', {
      'name': loadbalancerInputs.value['Listener Details']['Name'].value,
      "loadbalancer_id": lb_id,
      "protocol": loadbalancerInputs.value['Listener Details']['Protocol'].value,
      "description": loadbalancerInputs.value['Listener Details']['Description'].value,
      "admin_state_up": loadbalancerInputs.value['Listener Details']['Admin State Up'].value,
      "connection_limit": loadbalancerInputs.value['Listener Details']['Connection Limit'].value,
      "protocol_port": loadbalancerInputs.value['Listener Details']['Port'].value,
      "timeout_client_data": loadbalancerInputs.value['Listener Details']['Client Data Timeout'].value,
      "timeout_member_connect": loadbalancerInputs.value['Listener Details']['Member Connect Timeout'].value,
      "timeout_member_data": loadbalancerInputs.value['Listener Details']['Member Data Timeout'].value,
      "timeout_tcp_inspect": loadbalancerInputs.value['Listener Details']['TCP Inspect Timeout'].value
    })
    console.log("create listener is done", response.data)
    const listener_id = response.data.listener_id
    creatingLBMessage.value += " ... done <br />"
    creatingLBMessage.value += "=> Listener id is " + listener_id + '<br />'

    loadingPercentage.value = 50

    // 3. Create the Pool
    creatingLBMessage.value += "Creating Pool"
    response = await axios.post('/api/openstack-loadbalancer/pools/' + lb_id, {
      'name': loadbalancerInputs.value['Pool Details']['Name'].value,
      "lb_algorithm": loadbalancerInputs.value['Pool Details']['Algorithm'].value,
      "protocol": loadbalancerInputs.value['Listener Details']['Protocol'].value,
      // "session_persistence": loadbalancerInputs.value['Pool Details']['Cookie Name'].value,
      "description": loadbalancerInputs.value['Pool Details']['Description'].value,
      "admin_state_up": loadbalancerInputs.value['Pool Details']['Admin State Up'].value,
      "listener_id": listener_id
    })
    console.log("create pool is done", response.data)
    const pool_id = response.data.pool_id
    loadingPercentage.value = 75
    creatingLBMessage.value += " ... done <br />"
    creatingLBMessage.value += "=> Pool id is " + pool_id + '<br />'

    // 4. Create Monitor Details
    creatingLBMessage.value += "Creating Monitor Details"
    response = await axios.post('/api/openstack-loadbalancer/healthmonitors/' + lb_id, {
      'name': loadbalancerInputs.value['Monitor Details']['Name'].value,
      "admin_state_up": loadbalancerInputs.value['Monitor Details']['Admin State Up'].value,
      "pool_id": pool_id,
      "delay": loadbalancerInputs.value['Monitor Details']['Delay'].value,
      "max_retries": loadbalancerInputs.value['Monitor Details']['Max Retries'].value,
      "timeout": loadbalancerInputs.value['Monitor Details']['Timeout'].value,
      "type": loadbalancerInputs.value['Monitor Details']['Type'].value,
      "max_retries_down": loadbalancerInputs.value['Monitor Details']['Max Retries Down'].value
    })
    console.log("create health monitor is done", response.data)
    loadingPercentage.value = 100
    creatingLBMessage.value += " ... done <br />"
    creatingLBMessage.value += "=> Health Monitor id is " + response.data.healthmonitor.id + '<br />'

    loadingLBCreating.value = false
  } catch (error) {
    creatingLBvisible.value = false
    creatingLBMessage.value += " ... error <br />"
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

const creatingLBvisible = ref(false)
const showLBcreateDialog = () => {
  creatingLBvisible.value = !creatingLBvisible.value
}

// LB 관련 끝 =================
// Cluster 관련 ================


const clusterViewTypeList = ref([
  { id: 'a', label: 'Profiles', active: true },
  { id: 'b', label: 'Nodes', active: false },
  { id: 'c', label: 'Clusters', active: false },
  { id: 'd', label: 'Policies', active: false },
  { id: 'f', label: 'Receivers', active: false }
])

const clusterShowMenu = ref("Clusters")
const clusterViewClickEvent = (async (showCluster) => {
  clusterShowMenu.value = showCluster.label
  await getClusterViewListInProject(0, showCluster.label.toLowerCase())
})

const clusterViewDataList = ref()
const loadingClusterViewList = ref()
const getClusterViewListInProject = (async (retry, ...theArgs) => {
  console.log("getAllClusterView")
  try {
    loadingClusterViewList.value = true
    // const response = await axios.get('/api/openstack-autoscaling/clusters/' + userdata.value.selectedProject.project_id)
    const response = await axios.get('/api/openstack-autoscaling/' + theArgs[0])
    console.log(response.data)
    clusterViewDataList.value = response.data[theArgs[0]];
    loadingClusterViewList.value = false
  } catch (error) {
    console.log(error)
    if (retry <= 2) {
      user.tokenErrorHandler(error, getClusterViewListInProject, retry, theArgs);
    }
  }
})

const loadingClusterCreating = ref(false)
const createCluster = (async (retry, ...theArgs) => {
  console.log("createCluster")
  try {
    loadingClusterCreating.value = true
    var response

    if (theArgs[0] == 'profile') {
      var spec = yaml.load(clusterInputs.value['Profile']['Spec'].value)
      console.log(JSON.stringify(spec))
      response = await axios.post('/api/openstack-autoscaling/create_profile', {
        'name': clusterInputs.value['Profile']['Name'].value,
        'spec': spec,
        // 'metadata': clusterInputs.value['Profile']['Metadata'].value,
        // 'project_id': userdata.value.selectedProject.project_id,
      })
    } else if (theArgs[0] == 'node') {
      return
    } else if (theArgs[0] == 'cluster') {
      response = await axios.post('/api/openstack-autoscaling/create_cluster', {
        'name': clusterInputs.value['Cluster']['Cluster Name'].value,
        'profile_id': clusterInputs.value['Cluster']['Profile'].value,
        'min_size': clusterInputs.value['Cluster']['Min Size'].value,
        'max_size': clusterInputs.value['Cluster']['Max Size'].value,
        'desired_capacity': clusterInputs.value['Cluster']['Desired Capacity'].value,
        'timeout': clusterInputs.value['Cluster']['Timeout'].value,
        'metadata': clusterInputs.value['Cluster']['Metadata'].value,
        // 'project_id': userdata.value.selectedProject.project_id,
      })
    } else if (theArgs[0] == 'policy') {
      response = await axios.post('/api/openstack-autoscaling/create_policy', {
        'name': clusterInputs.value['Policy']['Name'].value,
        'spec': clusterInputs.value['Policy']['Spec'].value,
        // 'project_id': userdata.value.selectedProject.project_id,
      })
    } else if (theArgs[0] == 'receiver') {
      response = await axios.post('/api/openstack-autoscaling/create_receiver', {
        'name': clusterInputs.value['Receiver']['Name'].value,
        'type': clusterInputs.value['Receiver']['Type'].value,
        'cluster_id': clusterInputs.value['Receiver']['Cluster'].value,
        'action': clusterInputs.value['Receiver']['Action'].value,
        'params': clusterInputs.value['Receiver']['Params'].value,
        // 'project_id': userdata.value.selectedProject.project_id,
      })
    }

    console.log(response.data)
    loadingClusterCreating.value = false
  } catch (error) {
    console.log(error)
    if (retry <= 2) {
      user.tokenErrorHandler(error, getClusterViewListInProject, retry, theArgs);
    }
  }
})

const clusterCreateTypeList = ref([
  { id: 'a', label: 'Profile', active: true },
  { id: 'b', label: 'Node', active: false },
  { id: 'c', label: 'Cluster', active: false },
  { id: 'd', label: 'Policy', active: false },
  { id: 'f', label: 'Receiver', active: false }
])

const clusterCreateMenu = ref("Profile")
const clusterCreateClickEvent = ((createCluster) => {
  clusterCreateMenu.value = createCluster.label
})

const clusterInputs = ref({
  "Profile": {
    "Name": {
      'type': 'Input text',
      'value': '',
      'need': true,
    },
    "Spec": {
      'type': 'Textarea',
      'value': '',
      'need': true,
    },
    "Metadata": {
      'type': 'Textarea',
      'value': '',
    },
  },
  "Node": {
    "Name": {
      'type': 'Input text',
      'value': '',
      'need': true,
    },
    "Profile": {
      'type': 'Input text',
      // 'type': 'Dropdown',
      // 'Dropdown': [],
      'need': true,
      'value': '',
    },
    "Cluster": {
      'type': 'Input text',
      // 'type': 'Dropdown',
      // 'Dropdown': [],
      'value': '',
    },
    "Role": {
      'type': 'Input text',
      'value': '',
    },
    "Metadata": {
      'type': 'Textarea',
      'value': '',
    },
  },
  "Cluster": {
    "Cluster Name": {
      'type': 'Input text',
      'value': '',
      'need': true,
    },
    "Profile": {
      // 'type': 'Input text',
      'type': 'Dropdown',
      'Dropdown': [],
      'need': true,
    },
    "Min Size": {
      'type': 'Input text',
      'value': '0',
    },
    "Max Size": {
      'type': 'Input text',
      'value': '-1',
    },
    "Desired Capacity": {
      'type': 'Input text',
      'value': '0',
      'need': true,
    },
    "Timeout": {
      'type': 'Input text',
      'value': '0',
    },
    "Metadata": {
      'type': 'Input text',
      'value': '',
    },
  },
  "Policy": {
    "Name": {
      'type': 'Input text',
      'value': '',
      'need': true,
    },
    "Spec": {
      'type': 'Textarea',
      'value': '',
      'need': true,
    },
  },
  "Receiver": {
    "Name": {
      'type': 'Input text',
      'value': '',
      'need': true,
    },
    "Type": {
      'type': 'Dropdown',
      'Dropdown': ['Webhook', 'Message'],
      'value': '',
      'need': true,
    },
    "Cluster": {
      'type': 'Input text',
      'value': '',
      'need': true,
    },
    "Action": {
      'type': 'Dropdown',
      'Dropdown': ['Scale in the cluster', 'Scale out the cluster'],
      'value': '',
      'need': true,
    },
    "Params": {
      'type': 'Textarea',
      'value': '',
    },
  },
})
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
        window.alert(err + "알람 생성 실패")
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
  clusterInputs.value = JSON.parse(JSON.stringify(originClusterInputs.value))
  alarmInputs.value = JSON.parse(JSON.stringify(originAlarmInputs.value))
}

const alarmInputs = ref({
  "Name": {
    "value": null,
    "description": "Enter name of the alarm",
  },
  "Description": {
    "value": null,
    "description": "Set description for the alarm"
  },
  "Metric type": {
    "value": "cpu",
    "description": "[cpu,memory,disk,network]",
  },
  "Subject type": {
    "value": "Instance",
    "description": "Select Subject type [Single instance or Cluster]",
  },
  "Subject ID": {
    "value": null,
    "description": "Input ID of 'cluster' or 'instance'",
  },
  "Granularity": {
    "value": "60",
    "description": "Input desired granularity for aggregation",
  },
  "Threshold": {
    "value": null,
    "description": "Input your desired threshold",
  },
  "Evaluation periods": {
    "value": '1',
    "description": "Set evaluation periods ex)1,2",
  },
  "Alarm actions": {
    "value": "http://localhost:8080",
    "description": "Endpoint to send notification ex)http://localhost:8080",
  },
  "Repeat actions": {
    "value": false,
    "description": "true or false, if true : alarm will keep sending notification",
  },
  "Aggregation method": {
    "value": "rate:mean",
    "description": "Input aggregation method",
  },
  "Comparison operator": {
    "value": "gt",
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
