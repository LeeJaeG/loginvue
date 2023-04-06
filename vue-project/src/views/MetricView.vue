<script setup>

import { onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

onMounted(() => {
  contentBarName.value = 'Metric'
})

var evtSource = new EventSource("http://192.168.15.47:8000/api/nats/sse");
evtSource.onmessage = function (e) {
  console.log(e.data);
}

evtSource.addEventListener("message", (event) => {
  console.log(event.data);
});
</script>

<template>
  <div>
    <h1>This is an Metric page</h1>
  </div>
</template>
  
<style scoped></style>