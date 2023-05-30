<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";
// import { useRouter, useRoute } from 'vue-router'
// import { useConfirm } from "primevue/useconfirm";
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { useServerStore } from '@/stores/server'
import { storeToRefs } from 'pinia';
import ButtonGroup from '../components/ButtonSelectionComponent.vue';

const path = usePathStore();
const user = useUserStore();
const server = useServerStore();

const { contentBarName } = storeToRefs(path);
const { instances } = storeToRefs(server);
// const { userdata } = storeToRefs(user);

const selected = ref()

const viewSelection = ref('instance')
const metricSelection = ref()


const metricClickEvent = (async (metricName) => {
  console.log(metricName);
  if (!metricSelection.value || metricSelection.value != metricName) { // !metricSelection.value is not need?
    metricSelection.value = metricName;
    await setChartData(0);
  } else {
    metricSelection.value = null
  }
})

const viewClickEvent = ((view) => {
  viewSelection.value = view.label;
  metricSelection.value = null;
  selected.value = null;
  if (viewSelection.value == '인스턴스') {
    metricList.value = [
      { id: 'cpu_memory', label: 'CPU / Memory', active: false, type: 'instance' },
      { id: 'disk', label: 'Disk', active: false, type: 'instance' },
      { id: 'network', label: 'Network Interface', active: false, type: 'instance' },];
  } else if (viewSelection.value == '호스트') {
    metricList.value = [
      { id: 'cpu_memory', label: 'CPU / Memory', active: false, type: 'host' },
      { id: 'disk', label: 'Disk', active: false, type: 'host' },
      { id: 'network', label: 'Network Interface', active: false, type: 'host' },];
  } else {
    metricList.value = [
      { id: 'cpu_memory', label: 'CPU / Memory', active: false, type: 'cluster' },
      { id: 'disk', label: 'Disk', active: false, type: 'cluster' },
      { id: 'network', label: 'Network Interface', active: false, type: 'cluster' },];
  }
})

const metricList = ref()

const viewTypeList = ref([
  { id: 'a', label: '인스턴스', active: false },
  { id: 'b', label: '호스트', active: false },
  { id: 'c', label: '클러스터', active: false },
])

onMounted(async () => {
  contentBarName.value = 'Metric'
  // await setChartData(0);
});

const metricData = ref()
const getMetricLoading = ref(true)
const httpWorking = ref(false)
const setChartData = (async (retry, ...theArgs) => {
  console.log("getMetricChartData", metricSelection.value.id)
  try {
    getMetricLoading.value = true
    httpWorking.value = true
    const response = await axios.get('/api/openstack-metric/server_' + metricSelection.value.id + '_metrics/' + selected.value.id);
    metricData.value = response.data.data[0][selected.value.id];
    for (const index in metricData.value) {
      metricData.value[index]['datasets'][0]['borderColor'] = "rgb(15,217,119)"
    }
    getMetricLoading.value = false
    httpWorking.value = false
  } catch (error) {
    getMetricLoading.value = false
    httpWorking.value = false
    console.log(error)
    if (retry <= 2) {
      user.tokenErrorHandler(error, setChartData, retry, theArgs);
    }
  }
})

const graphOptions = ref(
  {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
          font: {
            size: 8
          }
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057',
          font: {
            size: 8
          }
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  }
);

const customeManuButtonStyle = ref({
  'activeBgColor': '#0bc279',
  'activeColor': 'white',
})

const customeTypeButtonStyle = ref({
  'activeColor': '#0bc279',
  'activeBorderBottom': 'solid thick #0bc279',
})

const dropdownChange = (() => {
  if (viewSelection.value == '인스턴스') {
    metricList.value = [
      { id: 'cpu_memory', label: 'CPU / Memory', active: false, type: 'instance' },
      { id: 'disk', label: 'Disk', active: false, type: 'instance' },
      { id: 'network', label: 'Network Interface', active: false, type: 'instance' },];
  } else if (viewSelection.value == '호스트') {
    metricList.value = [
      { id: 'cpu_memory', label: 'CPU / Memory', active: false, type: 'host' },
      { id: 'disk', label: 'Disk', active: false, type: 'host' },
      { id: 'network', label: 'Network Interface', active: false, type: 'host' },];
  } else {
    metricList.value = [
      { id: 'cpu_memory', label: 'CPU / Memory', active: false, type: 'cluster' },
      { id: 'disk', label: 'Disk', active: false, type: 'cluster' },
      { id: 'network', label: 'Network Interface', active: false, type: 'cluster' },];
  }
  metricSelection.value = null
})

</script>

<template>
  <template>
    <Dialog v-model:visible="httpWorking" :closable=false modal>
      <ProgressSpinner />
    </Dialog>
  </template>
  <div class=" flex surface-ground" style="height: 100%">
    <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2 text-700" style="">
      <div class="flex justify-content-between m-3" style="height: 60px;">
        <button-group :buttons="viewTypeList" :button-style="customeTypeButtonStyle"
          :button-class="['hovercolor', 'flex', 'align-items-center', 'w-4', 'justify-content-center']"
          class="flex justify-content-between w-full border-bottom-1" @button-click="viewClickEvent" />
      </div>

      <div class="mx-3">
        <div v-if="viewSelection == '인스턴스'">
          <div class="flex justify-content-between align-items-center border-bottom-1" style="height: 60px;">
            <Dropdown v-model="selected" :options="instances" optionLabel="name" placeholder="인스턴스 선택" class="w-full"
              @change="dropdownChange" />
          </div>
          <button-group v-if="selected" :buttons="metricList" :button-style="customeManuButtonStyle"
            :button-class="['hovercolor', 'px-4', 'py-3']" @button-click="metricClickEvent" />
        </div>
        <div v-else-if="viewSelection == '호스트'">
          <div class="flex justify-content-between align-items-center border-bottom-1" style="height: 60px;">
            <Dropdown v-model="selected" :options="instances" optionLabel="name" placeholder="호스트 선택" class="w-full" />
          </div>
          <button-group v-if="selected" :buttons="metricList" :button-style="customeManuButtonStyle"
            :button-class="['hovercolor', 'px-4', 'py-3']" @button-click="metricClickEvent" />
        </div>
        <div v-else-if="viewSelection == '클러스터'">
          <div class="flex justify-content-between align-items-center border-bottom-1" style="height: 60px;">
            <Dropdown v-model="selected" :options="instances" optionLabel="name" placeholder="클러스터 선택" class="w-full" />
          </div>
          <button-group v-if="selected" :buttons="metricList" :button-style="customeManuButtonStyle"
            :button-class="['hovercolor', 'px-4', 'py-3']" @button-click="metricClickEvent" />
        </div>
      </div>
    </div>


    <div class="flex flex-column w-10 p-4">
      <div v-if="!metricSelection && !selected">
        <div class=" text-2xl font-bold mb-4">
          Choice proper metric & taget
        </div>
      </div>
      <div v-else-if="!metricSelection && selected">
        <div class=" text-2xl font-bold mb-4">
          Choice Proper metric
        </div>
      </div>
      <div v-else style="height: 100%;" class="flex flex-column">
        <div class=" text-2xl font-bold  mb-4">
          {{ metricSelection.label }}
        </div>
        <div class="flex flex-wrap h-full overflow-y-scroll">
          <!-- 그래프가 모여 있는 곳 -->
          <div v-for="metric_value, metric_key in metricData" :key="metric_value" class="col-6" style="height: 50%;">
            <div class="flex flex-column flex-grow-0 surface-card p-3" style="height: 100%;">
              <div class="surface-400 p-2 font-bold">
                {{ metric_key }}
              </div>
              <div v-if="getMetricLoading" class="flex flex-grow-1">
                <Skeleton class="h-full" />
              </div>
              <Chart v-else type="line" :data=metric_value :options="graphOptions" style="height:90%; width:100%"
                class="flex justify-content-center relative" />
            </div>
          </div>
          <!-- /그래프가 모여 있는 곳 -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hovercolor:hover {
  background-color: #81f18ca5 !important;
}
</style>