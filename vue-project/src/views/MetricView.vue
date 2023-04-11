<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";
import { useRouter, useRoute } from 'vue-router'
import { useConfirm } from "primevue/useconfirm";
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';
const path = usePathStore();
const { contentBarName } = storeToRefs(path);

const router = useRouter()
const route = useRoute()
const confirm = useConfirm();
const baseUrl = 'http://192.168.15.129:8000'
const hostPath = '/metric/host/'
const vmPath = '/metric/vm/'
//host api 요청 목록 인덱스 상수화
const CPU_15MIN = 0
const CPU_1MIN = 1
const CPU_5MIN = 2
const CPU_IDLE = 3
const CPU_UTIL = 4
const DISK_SIZE_TOTAL = 5
const DISK_SIZE_USED = 6
const MEM_BUFFER = 7
const MEM_CACHED = 8
const MEM_SWAP_TOTAL = 9
const MEM_SWAP_AVAIL = 10
const MEM_TOTAL = 11
const MEM_USED = 12
const NET_IN_BYTES = 13
const NET_OUT_BYTES = 14
const NET_OUT_ERRORS = 15
//vm api 요청 목록 인덱스 상수화
const VM_CPU = 0
const VM_VCPUS = 1
const VM_DISK_DEVICE_ALLOCATION = 2
const VM_DISK_DEVICE_READ_BYTES = 3
const VM_DISK_DEVICE_READ_LATENCY = 4
const VM_DISK_DEVICE_READ_REQUESTS = 5
const VM_DISK_DEVICE_USAGE = 6
const VM_DISK_DEVICE_WRITE_BYTES = 7
const VM_DISK_DEVICE_WRITE_LATENCY = 8
const VM_DISK_DEVICE_WRITE_REQUESTS = 9
const VM_DISK_EPHEMERAL_SIZE = 10
const VM_DISK_ROOT_SIZE = 11
const VM_MEM_USAGE = 12
const VM_MEMORY = 13
const VM_NET_IN_BYTES = 14
const VM_NET_IN_PACKETS = 15
const VM_NET_IN_PACKETS_DROP = 16
const VM_NET_IN_PACKETS_ERROR = 17
const VM_NET_OUT_BYTES = 18
const VM_NET_OUT_PACKETS = 19
const VM_NET_OUT_PACKTES_DROP = 20
const VM_NET_OUT_PACKTES_ERROR = 21
const VM_DISK_DEVICE_CAPACITY = 22
//host api 요청명 상수 정의
const STR_CPU_15MIN = 'cpu15min'
const STR_CPU_1MIN = 'cpu1min'
const STR_CPU_5MIN = 'cpu5min'
const STR_CPU_IDLE = 'cpu_idle'
const STR_CPU_UTIL = 'cpu_util'
const STR_DISK_SIZE_TOTAL = 'disk_size_total'
const STR_DISK_SIZE_USED = 'disk_size_used'
const STR_MEM_BUFFER = 'mem_buffer'
const STR_MEM_CACHED = 'mem_cached'
const STR_MEM_SWAP_TOTAL = 'mem_swap_total'
const STR_MEM_SWAP_AVAIL = 'mem_swap_avail'
const STR_MEM_TOTAL = 'mem_total'
const STR_MEM_USED = 'mem_used'
const STR_NET_IN_BYTES = 'net_in_bytes'
const STR_NET_OUT_BYTES = 'net_out_bytes'
const STR_NET_OUT_ERRORS = 'net_out_errors'
//vm api 요청명 상수 정의
const STR_VM_CPU = 'cpu'
const STR_VM_VCPUS = 'vcpus'
const STR_VM_DISK_DEVICE_ALLOCATION = 'disk_device_allocation'
const STR_VM_DISK_DEVICE_READ_BYTES = 'disk_device_read_bytes'
const STR_VM_DISK_DEVICE_READ_LATENCY = 'disk_device_read_latency'
const STR_VM_DISK_DEVICE_READ_REQUESTS = 'disk_device_read_requests'
const STR_VM_DISK_DEVICE_USAGE = 'disk_device_usage'
const STR_VM_DISK_DEVICE_WRITE_BYTES = 'disk_device_write_bytes'
const STR_VM_DISK_DEVICE_WRITE_LATENCY = 'disk_device_write_latency'
const STR_VM_DISK_DEVICE_WRITE_REQUESTS = 'disk_device_write_requests'
const STR_VM_DISK_EPHEMERAL_SIZE = 'disk_ephemeral_size'
const STR_VM_DISK_ROOT_SIZE = 'disk_root_size'
const STR_VM_MEM_USAGE = 'mem_usage'
const STR_VM_MEMORY = 'memory'
const STR_VM_NET_IN_BYTES = 'net_in_bytes'
const STR_VM_NET_IN_PACKETS = 'net_in_packets'
const STR_VM_NET_IN_PACKETS_DROP = 'net_in_packets_drop'
const STR_VM_NET_IN_PACKETS_ERROR = 'net_in_packets_error'
const STR_VM_NET_OUT_BYTES = 'net_out_bytes'
const STR_VM_NET_OUT_PACKETS = 'net_out_packets'
const STR_VM_NET_OUT_PACKTES_DROP = 'net_out_packets_drop'
const STR_VM_NET_OUT_PACKTES_ERROR = 'net_out_packtes_error'
const STR_VM_DISK_DEVICE_CAPACITY = 'disk_device_capacity'
//host api 별 상태표시를 위한 변수 목록
var host_form = []
host_form[CPU_15MIN] = ''
host_form[CPU_1MIN] = ''
host_form[CPU_5MIN] = ''
host_form[CPU_IDLE] = ''
host_form[CPU_UTIL] = ''
host_form[DISK_SIZE_TOTAL] = ''
host_form[DISK_SIZE_USED] = ''
host_form[MEM_BUFFER] = ''
host_form[MEM_CACHED] = ''
host_form[MEM_SWAP_TOTAL] = ''
host_form[MEM_SWAP_AVAIL] = ''
host_form[MEM_TOTAL] = ''
host_form[MEM_USED] = ''
host_form[NET_IN_BYTES] = ''
host_form[NET_OUT_BYTES] = ''
host_form[NET_OUT_ERRORS] = ''
//vm api 별 상태표시를 위한 변수 목록
var vm_form = []
vm_form[VM_CPU] = ''
vm_form[VM_VCPUS] = ''
vm_form[VM_DISK_DEVICE_ALLOCATION] = ''
vm_form[VM_DISK_DEVICE_READ_BYTES] = ''
vm_form[VM_DISK_DEVICE_READ_LATENCY] = ''
vm_form[VM_DISK_DEVICE_READ_REQUESTS] = ''
vm_form[VM_DISK_DEVICE_USAGE] = ''
vm_form[VM_DISK_DEVICE_WRITE_BYTES] = ''
vm_form[VM_DISK_DEVICE_WRITE_LATENCY] = ''
vm_form[VM_DISK_DEVICE_WRITE_REQUESTS] = ''
vm_form[VM_DISK_EPHEMERAL_SIZE] = ''
vm_form[VM_DISK_ROOT_SIZE] = ''
vm_form[VM_MEM_USAGE] = ''
vm_form[VM_MEMORY] = ''
vm_form[VM_NET_IN_BYTES] = ''
vm_form[VM_NET_IN_PACKETS] = ''
vm_form[VM_NET_IN_PACKETS_DROP] = ''
vm_form[VM_NET_IN_PACKETS_ERROR] = ''
vm_form[VM_NET_OUT_BYTES] = ''
vm_form[VM_NET_OUT_PACKETS] = ''
vm_form[VM_NET_OUT_PACKTES_DROP] = ''
vm_form[VM_NET_OUT_PACKTES_ERROR] = ''
const DATA_REQ_MSG = 'Data Request...' //api 데이터 요청전 상태 표시 메시지
const DATA_REQ_DONE_MSG = 'Done' //api 데이터 요청 완료 메시지
//api 요청 목록 정의
let host_req_list = [STR_CPU_15MIN, STR_CPU_1MIN, STR_CPU_5MIN, STR_CPU_IDLE, STR_CPU_UTIL
  , STR_DISK_SIZE_TOTAL, STR_DISK_SIZE_USED, STR_MEM_BUFFER, STR_MEM_CACHED, STR_MEM_SWAP_TOTAL
  , STR_MEM_SWAP_AVAIL, STR_MEM_TOTAL, STR_MEM_USED, STR_NET_IN_BYTES, STR_NET_OUT_BYTES, STR_NET_OUT_ERRORS]
let vm_req_list = [STR_VM_CPU, STR_VM_VCPUS, STR_VM_DISK_DEVICE_ALLOCATION, STR_VM_DISK_DEVICE_READ_BYTES
  , STR_VM_DISK_DEVICE_READ_LATENCY, STR_VM_DISK_DEVICE_READ_REQUESTS, STR_VM_DISK_DEVICE_USAGE, STR_VM_DISK_DEVICE_WRITE_BYTES
  , STR_VM_DISK_DEVICE_WRITE_LATENCY, STR_VM_DISK_DEVICE_WRITE_REQUESTS, STR_VM_DISK_EPHEMERAL_SIZE
  , STR_VM_DISK_ROOT_SIZE, STR_VM_MEM_USAGE, STR_VM_MEMORY, STR_VM_NET_IN_BYTES, STR_VM_NET_IN_PACKETS
  , STR_VM_NET_IN_PACKETS_DROP, STR_VM_NET_IN_PACKETS_ERROR, STR_VM_NET_OUT_BYTES, STR_VM_NET_OUT_PACKETS
  , STR_VM_NET_OUT_PACKTES_DROP, STR_VM_NET_OUT_PACKTES_ERROR, STR_VM_DISK_DEVICE_CAPACITY]
let hostGraphList = []
let vmGraphList = []
const proc_host_data = (jsonList, request_name) => {
  var orgId = ''
  var resultList = []
  console.log(jsonList)
  var cnt = 0
  for (var idx in jsonList) {
    cnt++
    if (cnt > 12) //임시로 숫자 제한
      break
    var jsonObj = jsonList[idx]
    var idstr = jsonObj['group']['id']
    orgId = jsonObj['group']['original_resource_id']
    var datasrc = jsonObj['measures']['measures']
    var aggregate = datasrc['aggregated'] ?? 0 //null check
    if (aggregate != 0) //비어 있지 않은 경우 처리
    {
      console.log('case aggregate')
      console.log(aggregate)
      //데이터 처리 결과 
      var rstAggregate = createBasicData(aggregate, idstr) //데이터 처리
      resultList.push(rstAggregate)
      continue
    }
    var callName = datasrc[idstr] ?? 0
    console.log(callName)
    if (callName != 0) //비어있지 않은경우 처리
    {
      console.log('case id')
      var mean = Object.keys(callName)[0]
      var dataList = callName[mean]['mean']
      var rstData = createBasicData(dataList, idstr)
      console.log(dataList)
      resultList.push(rstData)
      continue
    }
  }
  hostGraphList[request_name] = resultList
}
const createBasicData = (dataList, orgId) => {
  console.log('createBasicData ' + orgId)
  var basicData = {} //object 선언
  basicData['labels'] = [] //list 선언
  basicData['datasets'] = [] //list 선언
  var labelList = []
  var dataseries = []
  var datainput = {}
  datainput['label'] = orgId
  datainput['fill'] = false
  datainput['tension'] = .4
  datainput['borderColor'] = '#FFA726'
  var cnt = 0
  for (var item in dataList) {

    cnt++
    if (cnt > 20)
      break
    var datestr = dataList[item][0]
    var dateArr = datestr.split("+")
    var dateTArr = dateArr[0].split("T")
    labelList.push(dateTArr[1])
    var series = dataList[item][2]
    dataseries.push(series)
  }
  datainput['data'] = dataseries
  basicData['labels'] = labelList
  basicData['datasets'].push(datainput)
  return basicData
}
const proc_vm_data = (jsonList, request_name) => {
  var orgId = ''
  var resultList = []
  for (var idx in jsonList) {
    var jsonObj = jsonList[idx]
    console.log(jsonObj)
    var idstr = jsonObj['group']['id']
    orgId = jsonObj['group']['original_resource_id']
    console.log(orgId)
    var datasrc = jsonObj['measures']['measures']
    //aggregate인경우
    var aggregate = datasrc['aggregated'] ?? 0 //null check
    if (aggregate != 0) //비어 있지 않은 경우 처리
    {
      console.log('case aggregate')
      console.log(aggregate)
      //데이터 처리 결과 
      var rstAggregate = createBasicData(aggregate, orgId) //데이터 처리
      resultList.push(rstAggregate)
      continue
    }
    var callName = datasrc[idstr] ?? 0
    console.log(callName)
    if (callName != 0) //비어있지 않은경우 처리
    {
      console.log('case id')
      var mean = Object.keys(callName)[0]
      var dataList = callName[mean]['mean']
      var rstData = createBasicData(dataList, orgId)
      console.log(dataList)
      resultList.push(rstData)
      continue
    }
  }
  vmGraphList[request_name] = resultList
  console.log(vmGraphList)
}
//api를 호출하기 위한 기본 함수 
//form_name = 상태를 표시할 변수명 상단의 host_form
//request_name = 요청 목록 host_req_list배열에서 선택하여 전달
//callIdx = 요청 인덱스
//return axios request 
const request_data_host = async (form_name, request_name, call_idx) => { //비동기 호출
  host_form[call_idx] = DATA_REQ_MSG
  let request_url = baseUrl + hostPath + request_name
  console.log(request_name + '=>' + request_url)
  axios.get(request_url).then((response) => {
    var jsonList = response.data
    console.log(request_name + '=> done')
    proc_host_data(jsonList, request_name) //data 처리s
    host_form[call_idx] = DATA_REQ_DONE_MSG
  })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      else {
        console.log('Error', error)
      }

    })
};
const request_data_vm = async (form_name, request_name, call_idx) => { //비동기 호출
  vm_form[call_idx] = DATA_REQ_MSG
  let request_url = baseUrl + vmPath + request_name
  console.log(request_name + '=>' + request_url)
  axios.get(request_url).then((response) => {
    var jsonList = response.data
    console.log(request_name + '=> done')
    proc_vm_data(jsonList, request_name) //data 처리s
    vm_form[call_idx] = DATA_REQ_DONE_MSG
  })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      else {
        console.log('Error', error)
      }

    })
};
//axios multi request 요청 함수 목록 정의
let request_func_list = [
  request_data_host(host_form[CPU_15MIN], host_req_list[CPU_15MIN], CPU_15MIN),
  request_data_host(host_form[CPU_1MIN], host_req_list[CPU_1MIN], CPU_1MIN),
  request_data_host(host_form[CPU_5MIN], host_req_list[CPU_5MIN], CPU_5MIN),
  request_data_host(host_form[CPU_IDLE], host_req_list[CPU_IDLE], CPU_IDLE),
  request_data_host(host_form[CPU_UTIL], host_req_list[CPU_UTIL], CPU_UTIL),
  request_data_host(host_form[DISK_SIZE_TOTAL], host_req_list[DISK_SIZE_TOTAL], DISK_SIZE_TOTAL),
  request_data_host(host_form[DISK_SIZE_USED], host_req_list[DISK_SIZE_USED], DISK_SIZE_USED),
  request_data_host(host_form[MEM_BUFFER], host_req_list[MEM_BUFFER], MEM_BUFFER),
  request_data_host(host_form[MEM_CACHED], host_req_list[MEM_CACHED], MEM_CACHED),
  request_data_host(host_form[MEM_SWAP_TOTAL], host_req_list[MEM_SWAP_TOTAL], MEM_SWAP_TOTAL),
  request_data_host(host_form[MEM_SWAP_AVAIL], host_req_list[MEM_SWAP_AVAIL], MEM_SWAP_AVAIL),
  request_data_host(host_form[MEM_TOTAL], host_req_list[MEM_TOTAL], MEM_TOTAL),
  request_data_host(host_form[MEM_USED], host_req_list[MEM_USED], MEM_USED),
  request_data_host(host_form[NET_IN_BYTES], host_req_list[NET_IN_BYTES], NET_IN_BYTES),
  request_data_host(host_form[NET_OUT_BYTES], host_req_list[NET_OUT_BYTES], NET_OUT_BYTES),
  request_data_host(host_form[NET_OUT_ERRORS], host_req_list[NET_OUT_ERRORS], NET_OUT_ERRORS),
  request_data_vm(vm_form[VM_CPU], vm_req_list[VM_CPU], VM_CPU),
  request_data_vm(vm_form[VM_VCPUS], vm_req_list[VM_VCPUS], VM_VCPUS),
  request_data_vm(vm_form[VM_DISK_DEVICE_ALLOCATION], vm_req_list[VM_DISK_DEVICE_ALLOCATION], VM_DISK_DEVICE_ALLOCATION),
  request_data_vm(vm_form[VM_DISK_DEVICE_READ_BYTES], vm_req_list[VM_DISK_DEVICE_READ_BYTES], VM_DISK_DEVICE_READ_BYTES),
  request_data_vm(vm_form[VM_DISK_DEVICE_READ_LATENCY], vm_req_list[VM_DISK_DEVICE_READ_LATENCY], VM_DISK_DEVICE_READ_LATENCY),
  request_data_vm(vm_form[VM_DISK_DEVICE_READ_REQUESTS], vm_req_list[VM_DISK_DEVICE_READ_REQUESTS], VM_DISK_DEVICE_READ_REQUESTS),
  request_data_vm(vm_form[VM_DISK_DEVICE_USAGE], vm_req_list[VM_DISK_DEVICE_USAGE], VM_DISK_DEVICE_USAGE),
  request_data_vm(vm_form[VM_DISK_DEVICE_WRITE_BYTES], vm_req_list[VM_DISK_DEVICE_WRITE_BYTES], VM_DISK_DEVICE_WRITE_BYTES),
  request_data_vm(vm_form[VM_DISK_DEVICE_WRITE_LATENCY], vm_req_list[VM_DISK_DEVICE_WRITE_LATENCY], VM_DISK_DEVICE_WRITE_LATENCY),
  request_data_vm(vm_form[VM_DISK_DEVICE_WRITE_REQUESTS], vm_req_list[VM_DISK_DEVICE_WRITE_REQUESTS], VM_DISK_DEVICE_WRITE_REQUESTS),
  request_data_vm(vm_form[VM_DISK_EPHEMERAL_SIZE], vm_req_list[VM_DISK_EPHEMERAL_SIZE], VM_DISK_EPHEMERAL_SIZE),
  request_data_vm(vm_form[VM_DISK_ROOT_SIZE], vm_req_list[VM_DISK_ROOT_SIZE], VM_DISK_ROOT_SIZE),
  request_data_vm(vm_form[VM_MEM_USAGE], vm_req_list[VM_MEM_USAGE], VM_MEM_USAGE),
  request_data_vm(vm_form[VM_MEMORY], vm_req_list[VM_MEMORY], VM_MEMORY),


  request_data_vm(vm_form[VM_NET_IN_BYTES], vm_req_list[VM_NET_IN_BYTES], VM_NET_IN_BYTES),
  request_data_vm(vm_form[VM_NET_IN_PACKETS], vm_req_list[VM_NET_IN_PACKETS], VM_NET_IN_PACKETS),
  request_data_vm(vm_form[VM_NET_IN_PACKETS_DROP], vm_req_list[VM_NET_IN_PACKETS_DROP], VM_NET_IN_PACKETS_DROP),
  request_data_vm(vm_form[VM_NET_IN_PACKETS_ERROR], vm_req_list[VM_NET_IN_PACKETS_ERROR], VM_NET_IN_PACKETS_ERROR),
  request_data_vm(vm_form[VM_NET_OUT_BYTES], vm_req_list[VM_NET_OUT_BYTES], VM_NET_OUT_BYTES),
  request_data_vm(vm_form[VM_NET_OUT_PACKETS], vm_req_list[VM_NET_OUT_PACKETS], VM_NET_OUT_PACKETS),
  request_data_vm(vm_form[VM_NET_OUT_PACKTES_DROP], vm_req_list[VM_NET_OUT_PACKTES_DROP], VM_NET_OUT_PACKTES_DROP),
  request_data_vm(vm_form[VM_NET_OUT_PACKTES_ERROR], vm_req_list[VM_NET_OUT_PACKTES_ERROR], VM_NET_OUT_PACKTES_ERROR),
  request_data_vm(vm_form[VM_DISK_DEVICE_CAPACITY], vm_req_list[VM_DISK_DEVICE_CAPACITY], VM_DISK_DEVICE_CAPACITY)
]
const reqHandler = async () => {
  console.log("Hello Request");
  for (var i = 0; i < request_func_list.length; i++) {
    request_func_list[i] //순서대로 호출
  }
};
onMounted(async () => {
  // console.log("Hello onMounted!");
  contentBarName.value = 'Metric'
  reqHandler() //초기 데이터 호출
});
const expandNode = async (node) => {
  if (node.children && node.children.length) {
    this.expandedKeys[node.key] = true;
    for (let child of node.children) {
      this.expandNode(child);
    }
  }
};
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
            size: 10
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
const contentLength = (data) => {
  var values = data ?? 0
  console.log(values)
  var length = values['labels'].length
  console.log(length)
  return length
}
const dataConvert = (data) => {
  var dataObj = data['datasets'][0]['data'][0]
  console.log(dataObj)

  return dataObj
}
const getLabel = (data) => {
  var dataObj = data['datasets'][0]['label']
  console.log(dataObj)
  return dataObj
}
const getProduct = (data) => {
  var value = data['datasets'][0]['data'][0]
  var id = data['datasets'][0]['label']
  var objrst = {}
  objrst['id'] = id
  objrst['value'] = value
  var rstList = []
  rstList.push(objrst)
  return rstList
}
</script>
<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  width: 200px;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.75rem;
}

h4 {
  font-size: 1.5rem;
}

h5 {
  font-size: 1.25rem;
}

h6 {
  font-size: 1rem;
}

p {
  line-height: 1.5;
  margin: 0 0 1rem 0;
}
</style>
<template>
  <div class="min-h-screen flex relative lg:static surface-ground">
    <div class="min-h-screen flex flex-column relative flex-auto">
      <div class="p-5 flex flex-column flex-auto">
        <!-- this is main page -->
        <div>
          <Accordion>
            <AccordionTab header="HOST Metric Info">
              <Accordion>
                <AccordionTab v-for="tab, qidx in host_req_list" :key="tab" :header="tab">
                  <div class="card" v-for="item, idx in hostGraphList[tab]" :key=item>
                    <div v-if="contentLength(hostGraphList[tab][idx]) == 1" :height="80">
                      <DataTable :value="getProduct(hostGraphList[tab][idx])" :width="900">
                        <Column field="id" header="id"></Column>
                        <Column field="value" header="Value"></Column>
                      </DataTable>
                    </div>
                    <div v-else>
                      <Chart type="line" :data=hostGraphList[tab][idx] :options="graphOptions" :width="900"
                        :height="400" />
                    </div>
                  </div>
                </AccordionTab>
              </Accordion>
            </AccordionTab>
            <AccordionTab header="VM Metric Info">
              <Accordion>
                <AccordionTab v-for="tab in vm_req_list" :key="tab" :header="tab">
                  <div class="card" v-for="item, idx in vmGraphList[tab]" :key=item>
                    <h5>{{ vmGraphList[tab][item] }}</h5>
                    <div v-if="contentLength(vmGraphList[tab][idx]) == 1">
                      <DataTable :value="getProduct(vmGraphList[tab][idx])" :width="900">
                        <Column field="id" header="id"></Column>
                        <Column field="value" header="Value"></Column>
                      </DataTable>
                    </div>
                    <div v-else>
                      <Chart type="line" :data=vmGraphList[tab][idx] :options="graphOptions" :width="1000"
                        :height="200" />
                    </div>
                  </div>
                </AccordionTab>
              </Accordion>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>