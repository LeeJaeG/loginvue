<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from "axios";
// import { useRouter, useRoute } from 'vue-router'
// import { useConfirm } from "primevue/useconfirm";
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import ButtonGroup from '../components/ButtonSelectionComponent.vue';

const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
// const { userdata } = storeToRefs(user);

const viewSelection = ref('instance')
const metricSelection = ref('b')
const instanceSelection = ref('b')

const metricClickEvent = ((metricName) => {
  metricSelection.value = metricName
})

const viewClickEvent = ((viewName) => {
  viewSelection.value = viewName
  metricList.value = [
    { id: 'a', label: 'CPU / Memory', active: false },
    { id: 'b', label: 'Disk', active: false },
    { id: 'c', label: 'Network Interface', active: false },];
  // console.log(viewSelection.value)
})

const metricList = ref([
  { id: 'a', label: 'CPU / Memory', active: false },
  { id: 'b', label: 'Disk', active: false },
  { id: 'c', label: 'Network Interface', active: false },
]);

const viewTypeList = ref([
  { id: 'a', label: '인스턴스', active: false },
  { id: 'b', label: '호스트', active: false },
  { id: 'c', label: '클러스터', active: false },
])

onMounted(async () => {
  contentBarName.value = 'Metric'
  await setChartData(0);
  // console.log(metricData.value['memory.usage'], metricData.value['cpu'])
});

const metricData = ref()
const getMetricLoading = ref(true)
const setChartData = (async (retry, ...theArgs) => {
  console.log("getMetricChartData")
  try {
    getMetricLoading.value = true
    const response = await axios.get('/api/openstack-metric/server_metrics/' + '2f70f301-b039-42cc-b043-1ed47011e1a8');
    metricData.value = response.data.data[0]['2f70f301-b039-42cc-b043-1ed47011e1a8'];
    for (const index in metricData.value) {
      metricData.value[index]['datasets'][0]['borderColor'] = "rgb(15,217,119)"
    }
    getMetricLoading.value = false
  } catch (error) {
    console.log(error)
    if (retry <= 2) {
      user.tokenErrorHandler(error, setChartData, retry, theArgs);
    }
  }
})

const graphOptions = ref(
  {
    responsive: false,
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



</script>

<template>
  <div class=" flex surface-ground" style="height: 100%">
    <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2 text-700" style="">
      <div class="flex justify-content-between m-3" style="height: 60px;">
        <button-group :buttons="viewTypeList" :button-style="customeTypeButtonStyle"
          :button-class="['hovercolor', 'flex', 'align-items-center', 'w-4', 'justify-content-center']"
          class="flex justify-content-between w-full border-bottom-1" @button-click="viewClickEvent" />
      </div>
      <div class="flex justify-content-between m-3 border-bottom-1" style="height: 40px;">
        인스턴스 선택
      </div>
      <div class=" m-3">
        <div v-if="viewSelection == '인스턴스'">
          <button-group :buttons="metricList" :button-style="customeManuButtonStyle"
            :button-class="['hovercolor', 'px-4', 'py-3']" @button-click="metricClickEvent" />
        </div>
        <div v-else-if="viewSelection == '호스트'">
          host metric list
        </div>
        <div v-else-if="viewSelection == '클러스터'">
          cluster metric list
        </div>
      </div>
    </div>
    <div class="flex flex-column w-10 p-4">
      <div v-if="!metricSelection && !instanceSelection">
        <div class=" text-2xl font-bold mb-4">
          Choice Proper metric & instance
        </div>
      </div>
      <div v-else style="height: 100%;" class="flex flex-column">
        <div class=" text-2xl font-bold  mb-4">
          {{ metricSelection }}
        </div>
        <div class="flex flex-wrap h-full">
          <div class="col-6" style="height: 50%;">
            <div class="surface-card p-3" style="height: 100%;">
              <div class="surface-400 p-2 font-bold">
                물리 CPU 현황 및 VCPU 할당 개수
              </div>
            </div>
          </div>
          <div class="col-6" style="height: 50%;">
            <div class="surface-card p-3" style="height: 100%;">
              <div class="surface-400 p-2 font-bold">
                Memory 할당량
              </div>
            </div>
          </div>
          <div class="col-6" style="height: 50%;">
            <div class="flex flex-column surface-card p-3" style="height: 100%;">
              <div class="surface-400 p-2 font-bold">
                CPU utilization ()
              </div>
              <Skeleton v-if="getMetricLoading" class="flex flex-grow-1" />
              <Chart v-else type="line" :data="metricData['cpu']" :options="graphOptions" :width=600 :height=300
                class="flex justify-content-center" />
            </div>
          </div>
          <div class="col-6" style="height: 50%;">
            <div class="flex flex-column flex-grow-0 surface-card p-3" style="height: 100%;">
              <div class="surface-400 p-2 font-bold">
                Memory 사용량
              </div>
              <Skeleton v-if="getMetricLoading" class="flex flex-grow-1" />
              <Chart v-else type="line" :data="metricData['memory.usage']" :options="graphOptions" :width=600 :height=300
                class="flex justify-content-center" />
            </div>
          </div>
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