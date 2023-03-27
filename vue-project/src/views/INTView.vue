<script setup>

import { ref, onMounted } from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router'
import { useConfirm } from "primevue/useconfirm";

const router = useRouter()
// const route = useRoute()
const confirm = useConfirm();

let form = {
  flowName: '', // name of the flow to register,
  priorityNum: '', // priority number,
  ethernetNum: '', // protocol number,
  samplePercentage: '', //1 ~ 100 (sampling percentage),
  cidr: '', // dst ip in the format of x.x.x.x/x
  password: '',
}
let json = ref([]);
let fCollector = ref([]);
let fFlow = ref([]);
let fEnabled = ref();
onMounted(async () => {
  await axios.get('http://192.168.15.131:8000/api/ksdf/telemetry/info').then((result) => {
    json.value = result.data;

    fEnabled.value = json.value["fabrics:enabled"];
    fCollector.value = json.value["fabrics:collector"];
    fFlow.value = json.value["fabrics:flow"];

  }).catch(error => {
    console.log(error);
  });
});

const intControl = async () => {
  console.log(fEnabled.value, typeof (fEnabled.value));
  let call = fEnabled.value == 'true' ? false : true;
  console.log(call);
  await axios.post('http://192.168.15.131:8000/api/ksdf/telemetry/configure', {
    'enabled': call,
  }).then((result) => {
    console.log(result);
    router.go(router.currentRoute);
  }).catch(error => {
    console.log(error);
  });
}

const addFlow = async () => {
  await axios.post('http://192.168.15.131:8000/api/ksdf/telemetry/add_flow', {
    "flow_name": form.flowName,
    "priority_num": form.priorityNum,
    "ethernet_num": form.ethernetNum,
    "sample_percentage": form.samplePercentage,
    "cidr": form.cidr,
  }).then((result) => {
    console.log(result);
    router.go(router.currentRoute);
  }).catch(error => {
    console.log(error);
  });
}

const removeFlow = async (flowName) => {
  await axios.post('http://192.168.15.131:8000/api/ksdf/telemetry/remove_flow', {
    "flow_name": flowName,
  }).then((result) => {
    console.log(result);
    router.go(router.currentRoute);
  }).catch(error => {
    console.log(error);
  });
}

const removeConfirm = (flowName, password) => {
  console.log(flowName, password);
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Remove Flow',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      removeFlow(flowName)
    },
    reject: () => {
    },
    onHide: () => {
    }
  });
}

</script>
 

<template>
  <div class="min-h-screen flex relative lg:static surface-ground">
    <DashSidebar></DashSidebar>

    <div class="min-h-screen flex flex-column relative flex-auto">
      <div
        class="flex justify-content-between align-items-center px-5 surface-section shadow-2 relative lg:static border-bottom-1 surface-border"
        style="height:60px">
        INT Setting
      </div>
      <div class="p-5 flex flex-column flex-auto">
        <div class="border-2 border-dashed surface-border border-round surface-section flex-auto">

          <!-- this is main page -->

          <div class="surface-ground md-2">
            <div class="surface-card shadow-2 border-rounded p-4">
              <div class="flex border-bottom-1 surface-border pb-2">
                <div class="flex flex-column align-items-start">
                  <span class="text-lg text-900 font-medium mb-1"> INT ON OFF</span>
                </div>
              </div>
              <div class="surface-ground p-2">
                <div class="flex justify-content-start shadow-2  border-round surface-0 p-4">
                  <div v-if="fEnabled === 'true'" class="flex justify-content-between w-full">
                    <div class="flex align-items-center">INT is Ready</div>
                    <Button icon="pi pi-power-off" class="p-button-danger" @click="intControl" />
                  </div>
                  <div v-else-if="fEnabled === 'false'" class="flex justify-content-between w-full">
                    <div class="flex align-items-center">INT is Not Ready</div>
                    <Button icon="pi pi-power-off" class="p-button-success" @click="intControl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="surface-card">
            <div class="surface-card shadow-2 border-rounded p-4">
              <div class="flex border-bottom-1 surface-border pb-2">
                <div class="flex flex-column align-items-start">
                  <span class="text-lg text-900 font-medium mb-1"> Add Flow </span>
                </div>
              </div>
              <div class="surface-ground p-2">
                <div class=" shadow-2  border-round surface-0 p-4">
                  <div class="flex-column flex justify-content-start mt-3">
                    <label for="form1" class="text-justify font-medium text-900">Flow
                      Name</label>
                    <InputText class="mt-1 p-inputtext-sm" id="form1" v-model.trim="form.flowName" type="text"
                      placeholder="Name of the flow to register" />
                  </div>
                  <div class="flex-column flex justify-content-start mt-3">
                    <label for="form2" class="text-justify font-medium text-900">Priority Number
                    </label>
                    <InputText class="mt-1 p-inputtext-sm" id="form2" v-model.trim="form.priorityNum" type="text" />
                  </div>
                  <div class="flex-column flex justify-content-start mt-3">
                    <label for="form3" class="text-justify font-medium text-900">Ethernet
                      Number</label>
                    <InputText class="mt-1 p-inputtext-sm" id="form3" v-model.trim="form.ethernetNum" type="text" />
                  </div>
                  <div class="flex-column flex justify-content-start mt-3">
                    <label for="form4" class="text-justify font-medium text-900">Sample
                      Percentage</label>
                    <InputText class="mt-1 p-inputtext-sm" id="form4" v-model.trim="form.samplePercentage" type="text"
                      placeholder="1 ~ 100 (sampling percentage)" />
                  </div>
                  <div class="flex-column flex justify-content-start mt-3">
                    <label for="form5" class="text-justify font-medium text-900">CIDR</label>
                    <InputText class="mt-1 p-inputtext-sm" id="form5" v-model.trim="form.cidr" type="text"
                      placeholder=" Destination IP in the format of x.x.x.x/x" />
                  </div>
                  <div class="flex justify-content-end mt-3">
                    <Button class="p-button-success" @click="addFlow"> Add </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="surface-card">
            <div class="surface-card shadow-2 border-rounded p-4">
              <div class="flex border-bottom-1 surface-border pb-2">
                <div class="flex flex-column align-items-start">
                  <span class="text-lg text-900 font-medium mb-1"> Collector </span>
                </div>
              </div>
              <div class="surface-ground p-2">
                <div class=" shadow-2  border-round surface-0 p-4">
                  <div v-for="(content, index) in fCollector" class="flex flex-column align-items-start pt-2">
                    <span class="bg-blue-50 text-blue-400 border-round inline-flex mb-1 py-1 px-2 text-sm">{{
                      index
                    }} </span>
                    <span class="text-600 font-medium  py-1 px-2">{{ content }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <ConfirmDialog />
          <div class="surface-card">
            <div class="surface-card shadow-2 border-rounded p-4">
              <div class="flex border-bottom-1 surface-border pb-2">
                <div class="flex flex-column align-items-start">
                  <span class="text-lg text-900 font-medium mb-1"> Flow </span>
                </div>
              </div>

              <div class="surface-ground p-2">
                <div class="grid">
                  <div v-for="list in  fFlow" class="col-12 md:col-6 xl:col-4 p-3">
                    <div class="surface-card shadow-2 border-rounded p-4">
                      <div class="flex border-bottom-1 surface-border pb-4 flex justify-content-between">
                        <div class="flex flex-column align-items-start text-lg text-900 font-medium mb-1">
                          {{ list["fabrics:name"] }}
                          <!-- <InputText v-model.trim="form.password"></InputText> -->
                        </div>
                        <div class="flex align-content-center">
                          <Button icon="pi pi-trash"
                            class="align-self-center p-button-sm p-button-danger p-button-outlined"
                            @click="removeConfirm(list['fabrics:name'], form.password)" />
                        </div>
                      </div>
                      <div v-for="(content, index) in list" class="flex flex-column align-items-start pt-4">
                        <span class="bg-blue-50 text-blue-400 border-round inline-flex mb-1 py-1 px-2 text-sm">{{
                          index
                        }} </span>
                        <span class="text-600 font-medium  py-1 px-2">{{ content }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>