<template>
  <div class="flex h-full">
    <div class="flex w-2 surface-card surface-border border-right-2 p-4 shadow-2">

    </div>
    <div class="flex w-10 flex-column py-3 justify-content-start align-items-center surface-ground">
      <div class="text-2xl font-bold mb-4">
        Alarm
      </div>
      <div class="card flex-grow-1 px-4 w-full">
        <DataTable v-model:selection="selectedAlarm" :value="alarmInfo" paginator :rows="10"
          :rowsPerPageOptions="[10, 20, 50]" tableStyle="min-width: 50rem">
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="subject" header="종류"></Column>
          <Column field="id" header="알람 ID"></Column>
          <Column field="timestamp" header="시간">
            <template #body="slotProps">
              {{ changeTime(slotProps.data.timestamp) }}
            </template>
          </Column>
          <Column field="read_mark" header="읽음 여부"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);

const alarmInfo = ref();
const selectedAlarm = ref();
onMounted(() => {
  contentBarName.value = 'Alarm'
  getAllAlarmForUser(0, alarmInfo)
})

const getAllAlarmForUser = (async (retry, ...theArgs) => {
  console.log("getAllProject")
  try {
    const response = await axios.get('/api/nats/errors/all ')
    // console.log(response.data)
    theArgs[0].value = response.data;
  } catch (error) {
    if (retry <= 2) {
      user.tokenErrorHandler(error, getAllAlarmForUser, retry, theArgs);
    }
  }
})

const changeTime = ((time) => {
  const old = Date.parse(time)
  const now = Date.now();

  var timestamp = (now - old)
  const day = parseInt(timestamp / (24 * 60 * 60 * 1000))
  timestamp = timestamp % (24 * 60 * 60 * 1000)
  const hour = parseInt(timestamp / (60 * 60 * 1000))
  timestamp = timestamp % (60 * 60 * 1000)
  const min = parseInt(timestamp / (60 * 1000))
  timestamp = timestamp % (60 * 1000)
  const sec = parseInt(timestamp / (1000))

  if (day >= 1) {
    return day + '일 ' + hour + '시간 ' + '전'
  }
  else {
    return min + '분 ' + sec + '초 ' + '전'
  }
})
</script>
  
<style></style>
  