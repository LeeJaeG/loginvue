<template>
  <template>
    <Dialog v-model:visible="httpWorking" :closable=false modal>
      <ProgressSpinner />
    </Dialog>
  </template>
  <div class=" flex surface-ground" style="height: 100% ">
    <div class="flex flex-column w-12 p-4" style="overflow-x: scroll;">
      <div class="text-2xl mx-3 mb-4 font-bold "> Limit Summary </div>
      <Skeleton v-if="getOverviewLoading" class="flex flex-grow-1" />
      <div v-else class="">
        <div v-for="(overviewValue, overviewKey) in graphData" :key="overviewValue"
          class="surface-card mb-3 border-round shadow-2">
          <!-- overview Key : ex) Compute, Volume,  Network -->
          <div class="border-round border-bottom-1 border-400 shadow-2 text-xl py-3 px-4 surface-200"> {{ overviewKey }}
          </div>
          <div class="flex flex-wrap ">
            <!-- key : ex) instance, VCPU, RAM in  overview Key 'Compute'-->
            <div v-for="val, key in overviewValue" :key="val" class="flex flex-column col-2">
              <div class="flex  justify-content-center mb-3">
                <Chart type="doughnut" :data="val" :options="graphOptions"
                  class="flex  justify-content-center align-contents-center align-items-center" :width=150 :height=150 />
              </div>
              <div class="flex justify-content-center font-semibold text-800"> {{ key }} </div>
              <div class="flex justify-content-center text-600"> Used in {{ val.datasets[0].data[0] }} of {{
                val.datasets[0].data[1] + val.datasets[0].data[0] }} </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-2xl mx-3 my-4 font-bold "> Usage Summary </div>
      <div class="mx-2 surface-card border-round shadow-2 p-3 mb-3">
        <div class="text-xl mx-3 my-2"> Select a period of time to query its usage: </div>
        <div class="text-400 mx-3 mt-1 mb-3"> The date should be in YYYY-MM-DD format. </div>
        <div class="">
          <form @submit="onSubmit" class="flex justify-content-start align-items-start">
            <div class="flex flex-column justify-content-start align-items-start">
              <Calendar v-model="startDate" :class="{ 'p-invalid': errorMessage_startDate }" aria-describedby="date-error"
                showIcon class="mx-3" dateFormat="yy-mm-dd" />
              <small class="p-error mx-3" id="date-error">{{ errorMessage_startDate || '&nbsp;' }}</small>
            </div>
            <i class="pi pi-arrow-right pt-3"></i>
            <div class="flex flex-column justify-content-start align-items-start">
              <Calendar v-model="endDate" :class="{ 'p-invalid': errorMessage_endDate }" aria-describedby="date-error"
                showIcon class="mx-3" dateFormat="yy-mm-dd" />
              <small class="p-error mx-3" id="date-error">{{ errorMessage_endDate || '&nbsp;' }}</small>
            </div>
            <Button type="submit" label="Submit"></Button>
          </form>
          <!-- <div>
          {{ endDate }}
        </div> -->
        </div>
      </div>
      <div v-if="getUsageLoading" class="mx-2">
        <Skeleton class="flex h-15rem"> test </Skeleton>
      </div>
      <div v-else>
        <div class="flex flex-column mx-2 surface-card border-round shadow-2 p-3">
          <div class="mx-3">
            <div class="flex mb-2">
              <div class="mr-2 font-bold">
                가동한 인스턴스 :
              </div>
              <div>
                {{ usageData.server_usages.length }}
              </div>
            </div>
            <div class="flex mb-2">
              <div class="mr-2 font-bold">
                총 메모리 사용량 :
              </div>
              <div>
                {{ Number(usageData.total_memory_mb_usage) != 0 ? (Number(usageData.total_memory_mb_usage) /
                  (Number(usageData.total_hours) * 1000)).toFixed(3) : 0
                }} GB
              </div>
            </div>
            <div class="flex mb-2">
              <div class="mr-2 font-bold">
                이 기간 동안의 VCPU-시간 :
              </div>
              <div class="mr-2">
                {{ Number(usageData.total_vcpus_usage).toFixed(1) }}
              </div>
              <div class="text-400 text-sm">
                (Multiplying the number of virtual
                CPUs of the server by
                hours the server exists, and then adding that all together for each server.)
              </div>
            </div>
            <div class="flex mb-2">
              <div class="mr-2 font-bold">
                이 기간 동안의 GB-시간:
              </div>
              <div class="mr-2 ">
                {{ Number(usageData.total_local_gb_usage).toFixed(1) }} GB
              </div>
              <div class="text-400 text-sm">
                (Multiplying the server disk size (in
                GiB) by hours the
                server exists, and then adding that all together for each server.)
              </div>
            </div>
            <div class="flex mb-2">
              <div class="mr-2 font-bold">
                이 기간 동안의 RAM-시간 :
              </div>
              <div class="mr-2">
                {{ Number(usageData.total_memory_mb_usage).toFixed(1) }} MB
              </div>
              <div class="text-400 text-sm">
                (Multiplying the server memory
                size
                (in MiB) by hours
                the server exists, and then adding that all together for each server.)
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-column mx-2 my-2 surface-card border-round shadow-2 p-3">
          <div class="text-xl mx-3 mt-2 mb-3 font-bold"> Usage :</div>
          <div class="mx-3 mb-3"> Displaying {{ }} items </div>
          <!-- name, VCPUS, Disk, RAM, Age -->
          <DataTable :value="usageInstance" tableStyle="min-width: 50rem" class="mx-3 ">
            <Column field="name" header="name"></Column>
            <!-- 이름 누르면 server detail로 들어갈 수 있게 -->
            <Column field="vcpus" header="VCPUS"></Column>
            <Column field="local_gb" header="Disk(GB)"></Column>
            <Column field="memory_mb" header="RAM(MB)"></Column>
            <Column field="uptime" header="Age(s?)"></Column>
            <!-- 적절한 시간 단위로 변환 -->
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from "axios";
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

import { useField, useForm } from 'vee-validate';
// import { now } from 'moment';
const { handleSubmit } = useForm();

// const { value: startDate, errorMessage } = useField('startDate', ValidateField);
const { value: startDate, errorMessage: errorMessage_startDate } = useField('startDate', startDateValidateField);
const { value: endDate, errorMessage: errorMessage_endDate } = useField('endDate', endDateValidateField);

const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
const { userdata } = storeToRefs(user);

const httpWorking = ref(false);
const getOverviewLoading = ref(true);
const getUsageLoading = ref(true);
const graphData = ref();
const getProjectOverview = (async (retry, ...theArgs) => {
  console.log("getTopology")
  try {
    // httpWorking.value = true;
    const response = await axios.get('/api/openstack/openstack_overview/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id)
    graphData.value = response.data;
    // httpWorking.value = false;
    getOverviewLoading.value = false;
  } catch (error) {
    if (retry <= 2) {
      user.tokenErrorHandler(error, getProjectOverview, retry, theArgs);
    }
  }
})

const documentStyle = getComputedStyle(document.body);
const graphOptions = ref(
  {
    backgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--blue-300')],
  }
)

function startDateValidateField(value) {
  if (!value) {
    return 'Start Date is required.';
  }
  // 1. 현재 보다 앞의 날짜를 선택 할 수 없음

  if (endDate.value) {
    // console.log(endDate.value, endDate.value.getTime(), value.getTime())
    if (endDate.value.getTime() + 1000 < value.getTime()) { // minus 1000ms is for 1 sec order error
      return "Cannot select a date after the end date"
    }
  }

  return true;
}

function endDateValidateField(value) {
  if (!value) {
    return 'End Date is required.';
  }

  // 1. 현재 보다 뒤의 날짜를 선택 할 수 없음
  if (value.getTime() > new Date().getTime()) {
    return "Cannot select a date after today.";
  }
  // 2. start date 보다 앞의 날짜를 선택 할 수 없음
  if (startDate.value) {
    // console.log(startDate.value, startDate.value.getTime(), value.getTime())
    if (startDate.value.getTime() - 1000 > value.getTime()) { // minus 1000ms is for 1 sec order error
      return "Cannot select a date prior to the start date.";
    }
  }
  return true;
}

const changDateFormat = ((dateString, isEnd) => {
  const currentDate = new Date(); // Current date in local timezone
  // const utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000);
  // const time_diff = 9 * 60 * 60 * 1000;
  // const kstCurrentDate = new Date(utc + (time_diff));
  // var getDate = new Date(dateString); 
  var getDate = new Date(dateString.setMilliseconds(0));

  const isToday = currentDate.getFullYear() === getDate.getFullYear()
    && currentDate.getMonth() === getDate.getMonth()
    && currentDate.getDate() === getDate.getDate();

  if (isToday && isEnd) {
    const currentDateString = currentDate.toISOString().replace("Z", "00");
    return currentDateString
  }
  else if (!isToday && isEnd) {
    getDate.setDate(getDate.getDate() + 1);
    // toISOString is for UTC timezone
    const formattedDateString = getDate.toISOString().replace("Z", "00");
    return formattedDateString
  } else {
    const formattedDateString = getDate.toISOString().replace("Z", "00");
    return formattedDateString
  }
})

const onSubmit = handleSubmit((values) => {
  console.log(values)
  if (values.startDate && values.endDate) {
    // openstack api가 원하는 형태에 맞게 데이터 수정 필요
    values.startDate = changDateFormat(values.startDate, false)
    values.endDate = changDateFormat(values.endDate, true)
    getUsageLoading.value = true;
    // api call
    getUsageOverview(0, values)
  }
});

const usageData = ref()
const usageInstance = ref([])
const getUsageOverview = (async (retry, ...theArgs) => {
  console.log("getUsageOverview in UTC", theArgs)
  try {
    const body = {
      start_time: theArgs[0].startDate,
      end_time: theArgs[0].endDate,
      project_id: userdata.value.selectedProject.project_id,
    }
    const response = await axios.post('/api/openstack/openstack_usage_overview', body)
    usageData.value = response.data.tenant_usage;

    usageInstance.value = usageData.value.server_usages.filter(item => item.state === "active");
    // console.log(usageData.value.server_usages, usageInstance.value)

    getUsageLoading.value = false;
  } catch (error) {
    if (retry <= 2) {
      user.tokenErrorHandler(error, getUsageOverview, retry, theArgs);
    }
  }
})

onMounted(async () => {
  contentBarName.value = 'Project Overview'
  getProjectOverview(0)

  // In most cases, when creating a Date object with new Date(),
  // the returned value is based on the local time zone of
  // the user's system or the environment where the code is running.
  const currentDate = new Date();
  endDate.value = currentDate;
  currentDate.setHours(0, 0, 0); // Set the KST time to 0:00:00
  // console.log(currentDate)
  startDate.value = currentDate;
  var initialValue = {}
  initialValue.startDate = changDateFormat(startDate.value, false)
  initialValue.endDate = changDateFormat(endDate.value, true)
  getUsageOverview(0, initialValue)
})
</script>

<style></style>
