<template>
  <div class=" flex surface-ground" style="height: 100%">
    <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="height: 100%">
      <div class="text-2xl font-bold mx-4 mt-4 ">
        Select
      </div>
      <div class="m-3">
        <button-group :buttons="kaasViewTypeList" :button-style="customeManuButtonStyle"
          :button-class="['hovercolor', 'px-4', 'py-3']" @button-click="kaasViewClickEvent" />
      </div>
    </div>
    <div class="flex flex-column relative w-8">
      <div class="surface-card p-5 shadow-2 border-round m-4" style="height: 100%">
        <div class="text-2xl font-bold" style="height: 10%">
          {{ kaasMenu }}
        </div>
        <div v-if="kaasMenu == 'K8S cluster create'" class="" style="height: 90%">
          <div class="grid overflow-y-scroll mb-2" style="height: 90%">
            <div v-for="value, key in k8sCreationInputs" :key="key" class="col-6 h-8rem">
              <div class="mb-3 text-lg flex">
                {{ key }}
                <div v-if="value.need == true" class="text-red-400 ml-1">
                  *
                </div>
              </div>
              <div>
                <InputText v-if="value.type == 'Input text'" type="text" v-model="value.value" class="w-full" />
                <SelectButton v-else-if="value.type == 'Select button'" v-model="value.value"
                  :options="value['Select button']" class="w-full" />
                <Dropdown v-else-if="value.type == 'Dropdown'" v-model="value.value" :options="value['Dropdown']"
                  class="w-full" />
                <Textarea v-else-if="value.type == 'Textarea'" v-model="value.value" class="w-full" rows="1" cols="1"
                  style="max-height: 400px;" />
              </div>
            </div>
          </div>
          <div class="flex justify-content-end align-items-center" style="height: 10%">
            <Button class="w-1  bg-cyan-700 border-teal-700 mr-3" :loading="k8sCreating" label="Create"
              @click="console.log('hi')" />
            <Button class="w-1  bg-cyan-700 border-teal-700" label="Cancel" @click="cancelInput" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="height: 100%">

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';
import ButtonGroup from '@/components/ButtonSelectionComponent.vue';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

const originK8SCreationInputs = ref()
onMounted(() => {
  contentBarName.value = 'Service : KaaS'
  originK8SCreationInputs.value = JSON.parse(JSON.stringify(k8sCreationInputs.value))
})

const k8sCreating = ref(false)
const kaasMenu = ref("K8S cluster list")
const kaasViewClickEvent = ((click) => {
  kaasMenu.value = click.label
})

// const customeTypeButtonStyle = ref({
//   'activeColor': '#0bc279',
//   'activeBorderBottom': 'solid thick #0bc279',
// })

const cancelInput = () => {
  window.alert("입력란을 초기화 합니다.")
  k8sCreationInputs.value = JSON.parse(JSON.stringify(originK8SCreationInputs.value))
}


const k8sCreationInputs = ref({
  "Name": {
    'type': 'Input text',
    'value': '',
  },
  "Control Plane Node Count": {
    'type': 'Input text',
    'value': '1',
  },
  "Data Plane Node Count": {
    'type': 'Input text',
    'value': '2',
  },
  "Kubernetes Version": {
    'type': 'Input text',
    'value': '1.27',
  },
  "Network Plugin": {
    'type': 'Input text',
    'value': 'Calico',
  },
  "Service CIDR": {
    'type': 'Input text',
    'value': ''
  },
  "Openstack Network": {
    'type': 'Input text',
    'value': ''
  },
  "Openstack Subnet": {
    'type': 'Input text',
    'value': ''
  },
  "Keypair": {
    'type': 'Input text',
    'value': ''
  },
})

const customeManuButtonStyle = ref({
  'activeBgColor': '#0bc279',
  'activeColor': 'white',
})

const kaasViewTypeList = ref([
  { id: 'a', label: 'K8S cluster list', active: true },
  { id: 'b', label: 'K8S cluster create', active: false },
])

</script>

<style></style>
