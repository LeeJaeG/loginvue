<template>
    <div class=" flex surface-ground" style="height: 100% ">
        <div class="flex flex-column w-12 p-4" style="overflow-x: auto;">
            <div class="w-2 flex align-items-center justify-content-center  relative">
                <Button label="Physical" severity="success" text class="justify-content-center"
                    @click="showContent('Physical')" />
                <Button label="Cloud" severity="success" text class="justify-content-center"
                    @click="showContent('Cloud')" />
                <Button label="Service" severity="success" text class="justify-content-center"
                    @click="showContent('Service')" />
            </div>
            <div class="content">
                <div v-if="selectedPage === 'Physical'">
                    <div v-for="(_, index) in totalNodesRange" :key="index" class="node-block">
                        <div class="card p-4 bg-gray-200 border-1 border-300 border-round mt-3 relative">
                            <div class="relative card-container gray-container flex auto">
                                <div class="inline-block w-8rem h-12rem text-center">
                                    <div class="mt-5">
                                        <img src="@/assets/server.svg" style="width:70px; height:70px;" />
                                        <div class="flex-auto"> {{ linux_nodes_detail[index].name }}
                                        </div>
                                        <i class="pi pi-circle-fill mt-2" style="color: #26EA34"></i>
                                    </div>
                                </div>
                                <div class="inline-block w-20rem h-12rem ml-5">
                                    <p class="text-sm font-bold m-0">Latest metric</p>
                                    <ScrollPanel v-if="latestMetrics[index]" style="width: 100%; height: 100%;"
                                        class="text-xs mt-1 custombar1">
                                        CPU Usage : {{ latestMetrics[index]['metrics'][0]['value'] }}<br>
                                        Memory Usage : {{ latestMetrics[index]['metrics'][1]['value'] }}<br>
                                        Network In : [ <br>
                                        <span v-for="(value, count) in latestMetrics[index]['metrics'][2]['value']"
                                            :key="count">
                                            {{ Object.keys(value)[0] }}: {{ value[Object.keys(value)[0]] }}<br>
                                        </span>
                                        ]<br>
                                        Network Out : [ <br>
                                        <span v-for="(value, count) in latestMetrics[index]['metrics'][3]['value']"
                                            :key="count">
                                            {{ Object.keys(value)[0] }}: {{ value[Object.keys(value)[0]] }}<br>
                                        </span>
                                        ]<br>
                                        Disk load : [ <br>
                                        <span v-for="(value, count) in latestMetrics[index]['metrics'][4]['value']"
                                            :key="count">
                                            {{ Object.keys(value)[0] }}: {{ value[Object.keys(value)[0]] }}<br>
                                        </span>
                                        ]<br>
                                        Status : {{ latestMetrics[index]['metrics'][5]['value'] }}<br>
                                        Uptime : {{ latestMetrics[index]['metrics'][6]['value'] }}
                                    </ScrollPanel>
                                </div>
                                <Divider layout="vertical" />
                                <div class="inline-block w-18rem h-12rem">
                                    <p class="text-sm font-bold m-0">History</p>
                                    <div class="flex flex-wrap gap-3 mt-3">
                                        <div class="flex align-tiems-center">
                                            <RadioButton v-model="metrics[index]" :inputID="'metric1-' + index"
                                                name="CPU Usage" :value="'CPU usage-' + index" />
                                            <label :for="'metric1-' + index" class="ml-2 mt-1 text-xs">CPU usage</label>
                                        </div>
                                        <div class="flex align-tiems-center">
                                            <RadioButton v-model="metrics[index]" :inputID="'metric2-' + index"
                                                name="Memory Usage" :value="'Memory usage-' + index" />
                                            <label :for="'metric2-' + index" class="ml-2 mt-1 text-xs">Memory usage</label>
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        <div class="flex align-tiems-center">
                                            <RadioButton v-model="metrics[index]" :inputID="'metric3-' + index"
                                                name="Network" :value="'Network-' + index" />
                                            <label :for="'metric3-' + index" class="ml-2 mt-1 text-xs">Interface I/O</label>
                                        </div>
                                        <div class="flex align-tiems-center">
                                            <RadioButton v-model="metrics[index]" :inputID="'metric4-' + index" name="Disk"
                                                :value="'Disk-' + index" />
                                            <label :for="'metric4-' + index" class="ml-2 mt-1 text-xs">Disk load</label>
                                        </div>
                                    </div>
                                    <p class="text-xs">Select start time</p>
                                    <div class="card flex -mt-2">
                                        <Calendar v-model="dates[index]" :manualInput="false" :inputID="'date-' + index"
                                            showTime hourFormat="24" @hide="updateTimestamp(index, dates[index])"
                                            style="height: 30%; width: 80%;" />
                                    </div>
                                    <Button type="button" icon="pi pi-search" label="Search" class="mt-1"
                                        :loading="loadings[index]" @click="load(index)" style="height: 40px;"
                                        severity="secondary" />
                                </div>
                                <div class="inline-block w-24rem h-12rem">
                                    <ScrollPanel v-if="history[index]" style="width: 100%; height: 100%;"
                                        class="text-xs custombar1">
                                        <div v-for="(dataElement, dataIndex) in history[index]['data'][0]" :key="dataIndex">
                                            <div v-for="(value, count) in dataElement" :key="count">
                                                <p> {{ value }} </p>
                                            </div>
                                        </div>
                                    </ScrollPanel>
                                </div>
                                <div class="inline-block w-60rem h-12rem ml-3">
                                    <ScrollPanel v-if="chartData[index]" style="width: 100%; height: 100%;"
                                        class="custombar1">
                                        <div v-if="chartData[index]">
                                            <Chart type="line" :data="chartData[index]" :options="chartOptions"
                                                :id="'chart-' + index" :canvasProps="{ width: 800, height: 200 }" />
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="selectedPage === 'Cloud'">
                    Cloud metric summary
                </div>
                <div v-if="selectedPage === 'Service'">
                    Service metric summary
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { usePathStore } from '@/stores/path';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import 'primeicons/primeicons.css';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import ScrollPanel from 'primevue/scrollpanel';
import { onMounted, ref, watch } from 'vue';

onMounted(async () => {

    // Page title onMounted
    contentBarName.value = 'Metric Summary'



    // Current status onMounted
    const current = await axios.get('/api/zabbix-metric/zabbixmetric_linuxhosts')
    const [totalNodes, nodesDetail] = current.data;
    const totalNodesValue = parseInt(totalNodes.split(':')[1].trim(), 10);
    const parsedNodesDetail = nodesDetail.map((node) => {
        const name = Object.keys(node)[0];
        const hostId = node[name];
        return { name, hostId };
    });

    number_of_linux_nodes.value = totalNodesValue;
    linux_nodes_detail.value = parsedNodesDetail;
    totalNodesRange.value = Array.from({ length: number_of_linux_nodes.value }, (_, index) => index);

    // create bindings for Radio buttons



    // Call Latest metrics onMounted
    for (let index = 0; index < number_of_linux_nodes.value; index++) {
        const node = linux_nodes_detail.value[index];
        const { name } = node;

        try {
            const responseLatest = await axios.get('/api/zabbix-metric/zabbixmetric_current/' + name);
            const dataLatest = responseLatest.data;
            latestMetrics.value[index] = {
                node: name,
                metrics: [
                    { label: 'CPU Usage', value: dataLatest['data'][0]['cpu usage'] },
                    { label: 'Memory Usage', value: dataLatest['data'][0]['memory usage'] },
                    { label: 'Network In', value: dataLatest['data'][0]['network_in'] },
                    { label: 'Network Out', value: dataLatest['data'][0]['network_out'] },
                    { label: 'Disk load', value: dataLatest['data'][0]['disk load'] },
                    { label: 'Status', value: dataLatest['data'][0]['status'] },
                    { label: 'Uptime', value: dataLatest['data'][0]['uptime'] },

                ],
            };
        } catch (error) {
            console.error('Failed to fetch latest metric data for ${name}:', error);
            console.error(error.stack);
        }

    }
    // console.log(chartData)
});

// Global
const path = usePathStore();
const { contentBarName } = storeToRefs(path);

// Layer Select
const selectedPage = ref(null);
const showContent = (page) => {
    selectedPage.value = page;
};

// Curruent status
const totalNodesRange = ref([]);
const number_of_linux_nodes = ref(null);
const linux_nodes_detail = ref([]);
const latestMetrics = ref([]);

// History part (time selection)
const dates = ref([]);
const formatted_dates = ref([]);

// History part (radio)
const metrics = ref([]);
// History & Chart part (Search button)
const loadings = ref([]);
const history = ref([]);
const chartData = ref([]);

watch(number_of_linux_nodes, (newValue) => {
    // Create the loadings array with the correct length once number_of_linux_nodes is updated
    loadings.value = Array.from({ length: newValue }, () => false);
    dates.value = Array.from({ length: newValue }, () => '');
    formatted_dates.value = Array.from({ length: newValue }, () => '');
    history.value = Array.from({ length: newValue }, () => '');
    metrics.value = Array.from({ length: newValue }, () => '');
});


const updateTimestamp = (index, event) => {
    // console.log('updateTimestamp function called with index:', index);
    // console.log('Event:', event);
    // console.log('dates[index]', dates.value[index])
    if (dates.value[index]) {
        // console.log('Unix timestamp:', Math.floor(event.getTime() / 1000));
        formatted_dates.value[index] = Math.floor(event.getTime() / 1000);
    } else {
        console.warn('dates[index] is empty or undefined');
    }
    // console.log('formatted_dates[index]:', formatted_dates.value[index]);
};

const load = async (index) => {
    // console.log('linux_nodes_detail:', linux_nodes_detail.value[index].name);
    // console.log('dates:', formatted_dates.value[index]);
    loadings.value[index] = true;
    try {
        var endpoint = '';

        if (metrics.value[index] === 'CPU usage-' + index) {
            endpoint = '/api/zabbix-metric/zabbixmetric_history_cpu/' + linux_nodes_detail.value[index].name + '/' + formatted_dates.value[index];
        }
        else if (metrics.value[index] === 'Memory usage-' + index) {
            endpoint = '/api/zabbix-metric/zabbixmetric_history_memory/' + linux_nodes_detail.value[index].name + '/' + formatted_dates.value[index];
        }
        else if (metrics.value[index] === 'Network-' + index) {
            endpoint = '/api/zabbix-metric/zabbixmetric_history_network/' + linux_nodes_detail.value[index].name + '/' + formatted_dates.value[index];
        }
        else if (metrics.value[index] === 'Disk-' + index) {
            endpoint = '/api/zabbix-metric/zabbixmetric_history_disk/' + linux_nodes_detail.value[index].name + '/' + formatted_dates.value[index];
        }
        const history_response = await axios.get(endpoint);
        history.value[index] = history_response.data;
        chartData.value[index] = { labels: [], datasets: [] };
        chartData.value[index].labels = [];
        chartData.value[index].datasets = [];

        if (metrics.value[index] === 'Network-' + index) {
            const dataByInterface = {};
            // console.log('history:', history.value);
            // console.log('history[index]:', history.value[index]);
            // console.log('history[index]["data"]:', history.value[index]['data']);
            // console.log('history[index]["data"][0]:', history.value[index]['data'][0]);
            // console.log(history.value[index]['data'][0][0])
            // console.log(history.value[index]['data'][0][1])
            history.value[index]['data'][0][0].forEach((item) => {
                const [time, interfaceData] = item.split(', ');
                const interfaceName = interfaceData.split('()')[0].trim();
                const value = parseInt((interfaceData.split(': ')[1]).split(':')[1]);
                // console.log((interfaceData.split(': ')[1]).split(':')[1])
                if (!dataByInterface[interfaceName]) {
                    dataByInterface[interfaceName] = {
                        bitsSent: [],
                        bitsReceived: [],
                    };
                }
                dataByInterface[interfaceName].bitsSent.push({ x: time, y: value });
            });

            history.value[index]['data'][0][1].forEach((item) => {
                const [time, interfaceData] = item.split(', ');
                const interfaceName = interfaceData.split('()')[0].trim();
                const value = parseInt((interfaceData.split(': ')[1]).split(':')[1]);

                if (!dataByInterface[interfaceName]) {
                    dataByInterface[interfaceName] = {
                        bitsSent: [],
                        bitsReceived: [],
                    };
                }
                dataByInterface[interfaceName].bitsReceived.push({ x: time, y: value });

            });

            const datasets = [];
            Object.keys(dataByInterface).forEach((interfaceName, i) => {
                const sentData = dataByInterface[interfaceName].bitsSent.map((item) => ({ x: item.x, y: item.y }));
                const receivedData = dataByInterface[interfaceName].bitsReceived.map((item) => ({ x: item.x, y: item.y }));

                datasets.push(
                    {
                        label: `${interfaceName} sent`,
                        borderColor: labelColors[i % labelColors.length],
                        data: sentData,
                    },
                    {
                        label: `${interfaceName} received`,
                        borderColor: labelColors[i % labelColors.length],
                        data: receivedData,
                    }
                );
            });
            // console.log(dataByInterface)

            chartData.value[index].datasets = datasets;
            chartData.value[index].labels = dataByInterface[Object.keys(dataByInterface)[0]].bitsSent.map(
                (item) => item.x
            )
            console.log(chartData.value[index].datasets)
            console.log(chartData.value[index].labels)
        }
        else if (metrics.value[index] === 'Disk-' + index) {
            const dataBydisk = {};
            history.value[index]['data'][0][0].forEach((item) => {
                const time = item.split(', ')[0];
                const diskName = (item.split(', ')[1]).split(':')[1];
                const value = ((item.split(', ')[2]).split(': ')[1]).split('%')[0];

                if (!dataBydisk[diskName]) {
                    dataBydisk[diskName] = {
                        diskload: [],
                    };
                }
                dataBydisk[diskName].diskload.push({ x: time, y: value });
            });

            const datasets = [];
            Object.keys(dataBydisk).forEach((diskName, i) => {
                const diskloadData = dataBydisk[diskName].diskload.map((item) => ({ x: item.x, y: item.y }));

                datasets.push(
                    {
                        label: `${diskName}`,
                        borderColor: labelColors[i % labelColors.length],
                        data: diskloadData,
                    }
                );
            });

            chartData.value[index].datasets = datasets;
            chartData.value[index].labels = dataBydisk[Object.keys(dataBydisk)[0]].diskload.map(
                (item) => item.x
            )
            console.log(chartData.value[index].datasets)
            console.log(chartData.value[index].labels)

        }
        else {
            const cmData = [];
            history.value[index]['data'][0][0].forEach((item) => {
                const time = item.split(', ')[0];
                const value = parseFloat((item.split(': ')[2]).split('%')[0]);

                cmData.push({ x: time, y: value });
            });

            const datasets = [
                {
                    label: 'Usage',
                    borderColor: labelColors[0],
                    data: cmData,
                },
            ];

            chartData.value[index].datasets = datasets;
            chartData.value[index].labels = cmData.map((item) => item.x);

            console.log(chartData.value[index].datasets);
            console.log(chartData.value[index].labels);
        }



    } catch (error) {
        console.error('Error:', error);
    } finally {
        loadings.value[index] = false;
    }
};

const labelColors = ['#8BC34A', '#FF9800', '#2196F3', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'];

const chartOptions = ref({
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: '#495057',
            },
            layout: 'horizontal',
            position: 'right',
        },
    },
    scales: {
        x: {
            ticks: {
                color: '#495057',
                font: {
                    size: 8,
                },
            },
            grid: {
                color: '#ebedef',
            },
        },
        y: {
            ticks: {
                color: '#495057',
                font: {
                    size: 8,
                },
            },
            grid: {
                color: '#ebedef',
            },
        },
    },
});


</script>

<style scoped>
::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-wrapper) {
    border-right: 10px solid var(--surface-ground);
}

::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-bar) {
    background-color: var(--green-300);
    opacity: 1;
    transition: background-color 0.3s;
}
</style>