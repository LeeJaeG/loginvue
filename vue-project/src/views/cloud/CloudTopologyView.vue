<script setup>
import { ref, markRaw, onMounted } from 'vue'
import axios from 'axios'
import networkNode from '@/components/vueFlowComponents/networkNode.vue'
import hostNode from '@/components/vueFlowComponents/hostNode.vue'
import subnetNode from '@/components/vueFlowComponents/subnetNode.vue'
import subnetInfoNode from '@/components/vueFlowComponents/subnetInfoNode.vue'
import vmNode from '@/components/vueFlowComponents/vmNode.vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/additional-components'
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
const { userdata } = storeToRefs(user);

const { onPaneReady, onNodeDoubleClick, findNode, zoomIn, zoomOut, fitView } = useVueFlow()

onPaneReady(({ fitView }) => {
    fitView()
})

const nodeTypes = {
    network: markRaw(networkNode),
    host: markRaw(hostNode),
    vm: markRaw(vmNode),
    subnet: markRaw(subnetNode),
    subnetInfo: markRaw(subnetInfoNode),
}

const getVueFlowForProject = (async (retry, ...theArgs) => {
    console.log("getTopology")
    try {
        const response = await axios.get('/api/openstack/openstack_topology/' + userdata.value.id + '/' + userdata.value.selectedProject.project_id)
        vueFlow.value = response.data.data[0];
        loading.value = true;
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getVueFlowForProject, retry, theArgs);
        }
    }
})

const getLiveByteMetricForAllEdge = (async (retry, ...theArgs) => {
    console.log("getLiveByteMetric ", userdata.value.selectedProject.project_id)
    try {
        const response = await axios.get('/api/openstack-metric/live_byte/' + userdata.value.selectedProject.project_id)
        // data : key(original_resource_id) : value(incoming byte + outcoming byte) 
        const source = response.data.data[0];
        for (var object in source) {
            var colorObject = pickColorbyValue(source[object].data);
            const objectForAddColorInfo = vueFlow.value.find((item) => {
                if (item.id.trim() == object.trim()) {
                    return item
                }
            })
            if (objectForAddColorInfo) {
                objectForAddColorInfo.data["colorObject"] = colorObject
            }
        }
        // change vueFlow Edge object's color, by value 
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getLiveByteMetricForAllEdge, retry, theArgs);
        }
    }
})

const live = ref(false)
const timeForLiveUpdate = ref(20)
const intervalID = ref(null);
const timer = (() => {
    intervalID.value = setInterval(async () => {
        timeForLiveUpdate.value -= 1;
        if (timeForLiveUpdate.value < 0) {
            timeForLiveUpdate.value = 20;
            httpWorking.value = true;
            clearInterval(intervalID.value);
            // getServerMetrics(0, selectedNodeInfo.value.vm_id);
            if (selectedNodeInfo.value != undefined) {
                getServerMetricsForPanel(0, selectedNodeInfo.value.vm_id);
            }
            await getLiveByteMetricForAllEdge(0);
            if (!displayLiveInfoForChosenVM.value) {
                changeColorOfEdges();
            } else {
                changeColorOfEdgeForVM(selectedNodeInfo.value.vm_id);
            }
            timer()
            httpWorking.value = false;
        }
    }, 1000)
})
const liveByte = (async () => {
    httpWorking.value = true
    if (live.value == false) {
        if (selectedNodeInfo.value) {
            // getServerMetrics(0, selectedNodeInfo.value.vm_id);
            getServerMetricsForPanel(0, selectedNodeInfo.value.vm_id);
        }
        await getLiveByteMetricForAllEdge(0);
        if (!displayLiveInfoForChosenVM.value) {
            changeColorOfEdges();
        } else {
            changeColorOfEdgeForVM(selectedNodeInfo.value.vm_id)
        }
        timer()
    } else {
        if (!displayLiveInfoForChosenVM.value) {
            changeBackColorOfEdges();
        }
        clearInterval(intervalID.value);
        timeForLiveUpdate.value = 20;
    }
    httpWorking.value = false
    live.value = !live.value
})

const changeColorOfEdges = (() => {
    const EdgeObjects = onlyEdgeInVueFlow(vueFlow.value)
    // console.log(EdgeObjects)
    for (var edgeIndex in EdgeObjects) {
        var edge = EdgeObjects[edgeIndex]
        edge.animated = true;
        edge.style = { stroke: edge.data.colorObject.color, strokeWidth: 4 };
        // edge.label = edge.data.colorObject.value
        edge.labelBgPadding = [8, 4];
        edge.labelBgBorderRadius = 4;
        edge.labelBgStyle = { fill: edge.data.colorObject.color, color: '#fff', fillOpacity: 1.0 };
    }
})

const changeColorOfEdgeForVM = ((vm_id) => {
    // console.log(vm_id)
    const EdgeObjects = vueFlow.value.filter(item => {
        return item.target === vm_id;
    });
    // console.log(EdgeObjects, vueFlow.value)
    for (var edgeIndex in EdgeObjects) {
        var edge = EdgeObjects[edgeIndex]
        edge.animated = true;
        edge.style = { stroke: edge.data.colorObject.color, strokeWidth: 4, 'z-index': 9999 };
        edge.label = edge.data.colorObject.value
        edge.labelBgPadding = [8, 4];
        edge.labelBgBorderRadius = 4;
        edge.labelBgStyle = { fill: edge.data.colorObject.color, color: '#fff', fillOpacity: 1.0 };
    }
})

const changeBackColorOfEdges = (() => {
    const EdgeObjects = onlyEdgeInVueFlow(vueFlow.value)
    for (var edgeIndex in EdgeObjects) {
        var edge = EdgeObjects[edgeIndex]
        edge.animated = false;
        edge.style = { strokeWidth: 2 };
        delete edge.label
    }
})

const changeBackColorOfEdgeForVM = ((vm_id) => {
    const EdgeObjects = vueFlow.value.filter(item => {
        return item.target === vm_id;
    });
    for (var edgeIndex in EdgeObjects) {
        var edge = EdgeObjects[edgeIndex]
        delete edge.label
    }
})

const getServerMetrics = (async (retry, ...theArgs) => {
    console.log("getServerMetric")
    try {
        const response = await axios.get('/api/openstack-metric/server_detail/' + theArgs[0]) // theArgs[0] = server_id
        selectedNodeMetric.value = response.data.data[0]

        for (var name in selectedNodeMetric.value) {
            const splitName = name.split('-')
            let edgeID = '';
            for (let i = 2; i <= 8; i++) {
                edgeID += splitName[i];
                if (i < 8) {
                    edgeID += '-';
                }
            }
            const incomingByte = parseInt(selectedNodeMetric.value[name]["network.incoming.bytes"]["datasets"][0]["data"].at(-1))
            const outgoingByte = parseInt(selectedNodeMetric.value[name]["network.outgoing.bytes"]["datasets"][0]["data"].at(-1))
            const value = (incomingByte + outgoingByte)
            var colorObject = pickColorbyValue(value);
            const objectForAddColorInfo = vueFlow.value.find((item) => {
                if (item.id.trim() == edgeID.trim()) { //vmID.trim()
                    // console.log(item)
                    return item
                }
            })
            if (objectForAddColorInfo) {
                objectForAddColorInfo.data["colorObject"] = colorObject
            }
        }
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerMetrics, retry, theArgs);
        }
    }
})

const selectedNodeMetricForPanel = ref({})
const panelData = ref({})
const getServerMetricsForPanel = (async (retry, ...theArgs) => {
    // console.log("getServerMetricsForPanel", '/api/openstack-metric/server_panel_detail/' + theArgs[0])
    try {
        const response = await axios.get('/api/openstack-metric/server_panel_detail/' + theArgs[0]) // theArgs[0] = server_id
        selectedNodeMetricForPanel.value = response.data.data[0]
        for (var name in selectedNodeMetricForPanel.value) {
            panelData.value[name] = {}
            var incoming = parseInt(selectedNodeMetricForPanel.value[name]["network.incoming.bytes"]["data"])
            var outgoing = parseInt(selectedNodeMetricForPanel.value[name]["network.outgoing.bytes"]["data"])
            var value = (incoming + outgoing)
            panelData.value[name]["총 Byte 수"] = [incoming, outgoing, value]
            if (!live.value) {
                const splitName = name.split('-')
                let edgeID = '';
                for (let i = 2; i <= 8; i++) {
                    edgeID += splitName[i];
                    if (i < 8) {
                        edgeID += '-';
                    }
                }
                var colorObject = pickColorbyValue(value);
                const objectForAddColorInfo = vueFlow.value.find((item) => {
                    if (item.id.trim() == edgeID.trim()) { //vmID.trim()
                        // console.log(item)
                        return item
                    }
                })
                if (objectForAddColorInfo) {
                    objectForAddColorInfo.data["colorObject"] = colorObject
                }
            }
            incoming = parseInt(selectedNodeMetricForPanel.value[name]["network.incoming.packets"]["data"])
            outgoing = parseInt(selectedNodeMetricForPanel.value[name]["network.outgoing.packets"]["data"])
            value = (incoming + outgoing)
            panelData.value[name]["총 Packet 수"] = [incoming, outgoing, value]
            incoming = parseInt(selectedNodeMetricForPanel.value[name]["network.incoming.packets.drop"]["data"])
            outgoing = parseInt(selectedNodeMetricForPanel.value[name]["network.outgoing.packets.drop"]["data"])
            value = (incoming + outgoing)
            panelData.value[name]["총 Packet Drop 수"] = [incoming, outgoing, value]
            incoming = parseInt(selectedNodeMetricForPanel.value[name]["network.incoming.packets.error"]["data"])
            outgoing = parseInt(selectedNodeMetricForPanel.value[name]["network.outgoing.packets.error"]["data"])
            value = (incoming + outgoing)
            panelData.value[name]["총 Packet Error  수"] = [incoming, outgoing, value]
        }
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerMetricsForPanel, retry, theArgs);
        }
    }
})

const getServerDetailsLoading = ref(false)
const getServerDetails = (async (retry, ...theArgs) => {
    console.log("get Server's detail infomation ")
    try {
        getServerDetailsLoading.value = true
        const response = await axios.get('/api/openstack-server/vm_details/' + theArgs[0]) // theArgs[0] = server_id
        selectedNodeInfo.value = response.data.data[0][0]
        getServerDetailsLoading.value = false
        // console.log(selectedNodeInfo.value)
    } catch (error) {
        if (retry <= 2) {
            user.tokenErrorHandler(error, getServerDetails, retry, theArgs);
        }
    }
})

const pickColorbyValue = (value) => {
    const round = value.toFixed(0);
    const digit = round.toString();
    var number = ''
    let object = {}
    let temp = ''
    // console.log('check : ', value, digit.length);
    if (digit.length >= 10) {
        object.value = (value * 1e-9).toFixed(2) + 'Gbps'
        object.color = '#FF0000'
        return object
    } else if (10 > digit.length && digit.length >= 7) {
        object.value = (value * 1e-6).toFixed(2) + 'Mbps'
        temp = logConverterRY(value);
        number = Number(temp).toString(16).toUpperCase()
        if (number.length == 1) {
            number = '0' + number;
        }
        object.color = '#FF' + number + '00'
        return object
    } else if (7 > digit.length && digit.length >= 4) {
        object.value = (value * 1e-3).toFixed(2) + 'Kbps'
        temp = logConverterYG(value);
        number = Number(temp).toString(16).toUpperCase()
        if (number.length == 1) {
            // console.log("warning", number);
            number = '0' + number;
        }
        object.color = '#' + number + 'FF00'
        return object
    } else {
        object.value = value.toFixed(2) + 'bps'
        object.color = '#00FF00'
        return object
    }
}
const logConverterRY = (value) => {
    const number = -(255 / 3) * Math.log10(value) + (3 * 255)
    return number.toFixed(0)
}
const logConverterYG = (value) => {
    const number = (255 / 3) * Math.log10(value) - (255)
    return number.toFixed(0)
}

const displayNodeInfo = ref(false)
const displayNodeInfoName = ref()
const selectedNodeInfo = ref()
const selectedNodeMetric = ref()

const openNodeInfo = (async (id) => {
    try {
        httpWorking.value = true
        // getServerMetricsForPanel(0, id);
        // getServerDetails(0, id)
        // await getServerMetrics(0, id)
        await Promise.all([getServerDetails(0, id), getServerMetrics(0, id), getServerMetricsForPanel(0, id)]);

        // displayNodeInfo.value = true;
        httpWorking.value = false
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

onNodeDoubleClick(({ node }) => {
    console.log(node)
    if (node.type == 'vm') {
        displayNodeInfoName.value = node.label;
        openNodeInfo(node.id);
    }
})

const loading = ref(false)
const vueFlow = ref([])
onMounted(() => {
    contentBarName.value = 'Cloud Topology'
    // console.log(userdata.value, info.value)
    getVueFlowForProject(0)
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
const onlyVMInVueFlow = ((list) => {
    return list.filter(item => item.type === 'vm')
})
const onlyEdgeInVueFlow = ((list) => {
    return list.filter(item => item.data.type === 'edge')
})

const httpWorking = ref(false);

const displayNodeInfoToggle = (() => {
    if (selectedNodeInfo.value && displayNodeInfo.value == false) {
        displayNodeInfo.value = true
    } else if (displayNodeInfo.value == true) {
        displayNodeInfo.value = false
    } else {
        alert("인스턴스를 선택 해주세요")
    }
})

const clickRadioButtonForVM = ((id) => {
    const node = findNode(id)
    if (node.type == 'vm') {
        displayNodeInfoName.value = node.label;
        openNodeInfo(node.id);
    }
})

const displayLiveInfoForChosenVM = ref(false)
const displayLiveInfoForChosenVMToggle = (() => {
    if (selectedNodeInfo.value && displayLiveInfoForChosenVM.value == false && live.value == false) {
        displayLiveInfoForChosenVM.value = true
        changeColorOfEdgeForVM(selectedNodeInfo.value.vm_id)
    } else if (selectedNodeInfo.value && displayLiveInfoForChosenVM.value == false && live.value == true) {
        displayLiveInfoForChosenVM.value = true
        changeBackColorOfEdges()
        changeColorOfEdgeForVM(selectedNodeInfo.value.vm_id)
    } else if (displayLiveInfoForChosenVM.value == true && live.value == false) {
        displayLiveInfoForChosenVM.value = false
        changeBackColorOfEdges()
    } else if (displayLiveInfoForChosenVM.value == true && live.value == true) {
        displayLiveInfoForChosenVM.value = false
        changeBackColorOfEdgeForVM(selectedNodeInfo.value.vm_id)
        changeColorOfEdges()
    } else {
        alert("인스턴스를 선택 해주세요")
    }
})

const displayLiveInfoPanel = ref(false)
const displayLiveInfoPanelToggle = (async () => {
    if (selectedNodeInfo.value && displayLiveInfoPanel.value == false) {
        // await getServerMetricsForPanel(0, selectedNodeInfo.value.vm_id);
        displayLiveInfoPanel.value = true;
    } else if (displayLiveInfoPanel.value == true) {
        displayLiveInfoPanel.value = false;
    } else {
        alert("인스턴스를 선택 해주세요")
    }
})

const ProgressBarRate = ((incoming, outgoing) => {
    if ((incoming + outgoing) != 0) {
        const rate = (incoming) / (incoming + outgoing) * 100
        return rate
    }
    else {
        return 50
    }
})

const url = ref();
const checkELS = ref(true)
const showELS = (vmID) => {
    checkELS.value = false;
    // vmID = 'c1fca4a0-6930-11ed-9d97-373723c9a1cb'; 
    url.value = "http://192.168.15.140:5601/app/dashboards#/view/c1fca4a0-6930-11ed-9d97-373723c9a1cb?embed=true&_g=(filters:!(),refreshInterval:(pause:!f,value:10000),time:(from:now-30m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'6a4bde80-68c0-11ed-9d97-373723c9a1cb',key:vm_id.keyword,negate:!f,params:(query:'" + vmID + "'),type:phrase),query:(match_phrase:(vm_id.keyword:'" + vmID + "')))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(enhancements:(),savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(customLabel:rx_byte,field:rx_byte),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:'20s',min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-60m,to:now),useNormalizedEsInterval:!t,used_interval:'30s'),schema:segment,type:date_histogram),(enabled:!t,id:'3',params:(customLabel:tx_byte,field:tx_byte),schema:metric,type:avg),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:5),schema:split,type:terms)),searchSource:(filter:!(),index:'6a4bde80-68c0-11ed-9d97-373723c9a1cb',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,grid:(categoryLines:!f),labels:(show:!f),legendPosition:top,maxLegendLines:1,palette:(name:kibana_palette,type:palette),radiusRatio:0,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:rx_byte),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:histogram,valueAxis:ValueAxis-1),(circlesRadius:3,data:(id:'3',label:tx_byte),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:histogram,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:'Average%20rx_byte'),type:value))),title:vm_rx_tx_bytes,type:histogram,uiState:())),gridData:(h:24,i:a491ab0b-6f8a-44e7-8a18-1bfe6e8db1e3,w:24,x:0,y:0),panelIndex:a491ab0b-6f8a-44e7-8a18-1bfe6e8db1e3,type:visualization,version:'7.15.0'),(embeddableConfig:(enhancements:(),hidePanelTitles:!f,savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(customLabel:drop_rx,field:rx_drop),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:auto,min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-30m,to:now),useNormalizedEsInterval:!t,used_interval:'30s'),schema:segment,type:date_histogram),(enabled:!t,id:'3',params:(customLabel:drop_tx,field:tx_drop),schema:metric,type:avg),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:5),schema:split,type:terms)),searchSource:(filter:!(),index:'6a4bde80-68c0-11ed-9d97-373723c9a1cb',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,grid:(categoryLines:!f),labels:(show:!f),legendPosition:top,maxLegendLines:1,palette:(name:kibana_palette,type:palette),radiusRatio:0,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:drop_rx),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-1),(circlesRadius:3,data:(id:'3',label:drop_tx),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:'Average%20rx_byte'),type:value))),title:vm_rx_tx_bytes,type:histogram,uiState:())),gridData:(h:24,i:f5a13833-a6d3-4f6c-b174-bba9834dd87a,w:24,x:24,y:0),panelIndex:f5a13833-a6d3-4f6c-b174-bba9834dd87a,title:drop_rx_tx_bytes,type:visualization,version:'7.15.0')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:vm_resources_basic,viewMode:edit)&show-time-filter=true"
    // console.log(url.value);
}
const closeELS = () => {
    checkELS.value = true;
}

const metricSummary = {
    "cpu": {
        "total": 0.9,
        "status": "ok"
    },
    "memory": {
        "total": 0.21,
        "status": "ok"
    },
    "storage": {
        "total": 0.5,
        "status": "err",
        "err_desc": {
            "msg": "partition sda is full"
        }
    }
}

const handleMetricTooltip = ((key, value) => {
    if (value.status == 'ok') {
        return key + ' : ' + value.total.toFixed(2) + '\n' + 'healthy state'
    }
    else if (value.status == 'err' && value.err_desc.msg) {
        const data = key + ' : ' + value.total.toFixed(2) + '\n' + 'error : ' + value.err_desc.msg
        return data;
    }
    else {
        return key + ' : ' + value.total.toFixed(2) + '\n' + 'error : message is not defined'
    }
})

const metricStyleObject = ((A) => {
    if (A < 0.4) {
        return '#A7E521';
    } else if (A >= 0.4 && A < 0.7) {
        return '#FFD422';
    } else {
        return '#FF3333';
    }
});

const toggleDrag = ref(false)

</script>

<template>
    <template>
        <Dialog v-model:visible="httpWorking" :closable=false modal>
            <ProgressSpinner />
        </Dialog>
    </template>
    <div class=" flex surface-ground" style="height: 100%">
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="height: 100%">
            <div class="flex flex-none text-2xl font-bold mb-1 p-4">
                Detail Info
            </div>
            <Skeleton v-if="getServerDetailsLoading" class="flex flex-grow-1" />
            <div v-else class="flex flex-column flex-grow-1" style="overflow-y: scroll; height: 60%">
                <div v-for="value, key in selectedNodeInfo" class="flex flex-column pl-2" :key='value'>
                    <div class=" text-green-600 border-round inline-flex mb-1 py-1 px-2 text-sm">
                        {{ key }} :
                    </div>
                    <div class="text-600 font-medium  py-1 px-2 mb-2">
                        {{ value }}
                    </div>
                </div>
            </div>
            <div class="flex flex-none text-2xl font-bold mb-1 mt-3 px-4">
                Metric overview
            </div>
            <div v-if="metricSummary"
                class="h-4rem mx-4 border-round bg-white shadow-2 flex justify-content-center align-items-center">
                <div v-for="(metricValue, metricKey) in metricSummary" :key=metricKey class="mx-3">
                    <div class="flex justify-content-center align-items-center circle my-1 cursor-pointer"
                        :style="{ 'backgroundColor': metricStyleObject(metricValue.total) }" @click="console.log('click')"
                        v-tooltip="handleMetricTooltip(metricKey, metricValue)">
                        <div v-if="metricValue.status == 'err'"
                            class="relative flex justify-content-center align-items-center" style="font-size: 30px;">
                            <img src="@/assets/danger.svg" alt="error" style="width: 30px; height: 30px; top: -17.6px;"
                                class="absolute" />
                        </div>
                    </div>
                    <div style="font-size: 9px;">
                        {{ metricKey.charAt(0) }} : {{ metricValue.total.toFixed(2) }}
                    </div>
                </div>
            </div>
            <div class="flex flex-none text-2xl font-bold p-4">
                View Toggler
            </div>
            <div class="flex justify-content-between pb-4 px-6">
                <Button v-if="!displayNodeInfo"
                    class="px-3 border-noround bg-teal-500 border-teal-500 hover:bg-teal-800 hover:border-teal-800"
                    @click="displayNodeInfoToggle">
                    <font-awesome-icon icon="fa-solid fa-chart-line" style="font-size: 1.2rem" />
                </Button>
                <Button v-else
                    class="px-3 border-noround bg-teal-800 border-teal-800 hover:bg-teal-500 hover:border-teal-500"
                    @click="displayNodeInfoToggle">
                    <font-awesome-icon icon="fa-solid fa-chart-line" style="font-size: 1.2rem" />
                </Button>
                <Button v-if="!displayLiveInfoForChosenVM"
                    class="border-noround px-3 border-noround bg-teal-500 border-teal-500 hover:bg-teal-800 hover:border-teal-800"
                    @click="displayLiveInfoForChosenVMToggle">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" style="font-size: 1.2rem" />
                </Button>
                <Button v-else
                    class="px-3 border-noround bg-teal-800 border-teal-800 hover:bg-teal-500 hover:border-teal-500"
                    @click="displayLiveInfoForChosenVMToggle">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" style="font-size: 1.2rem" />
                </Button>
                <Button v-if="!displayLiveInfoPanel"
                    class="border-noround px-3 border-noround bg-teal-500 border-teal-500 hover:bg-teal-800 hover:border-teal-800"
                    @click="displayLiveInfoPanelToggle">
                    <font-awesome-icon icon="fa-solid fa-sitemap" style="font-size: 1.2rem" />
                </Button>
                <Button v-else
                    class="px-3 border-noround bg-teal-800 border-teal-800 hover:bg-teal-500 hover:border-teal-500"
                    @click="displayLiveInfoPanelToggle">
                    <font-awesome-icon icon="fa-solid fa-sitemap" style="font-size: 1.2rem" />
                </Button>
            </div>
        </div>
        <div class="flex flex-column relative flex-auto">
            <div class="p-3 flex flex-column flex-auto">
                <div class="controls mb-3">
                    <div class="flex">
                        <Button class="mr-3 border-0 border-noround"
                            style="height: 2.8rem; background-color: #2e3341; color: white; z-index: 99;"
                            @click="liveByte()">실시간 통신량
                            ({{ timeForLiveUpdate }}초)</Button>
                        <Button class="border-0 border-noround"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341" @click="zoomOut">
                            <i :class="'pi pi-minus'"></i>
                        </Button>
                        <Button class="border-0 border-noround"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341" @click="zoomIn">
                            <i :class="'pi pi-plus'"></i>
                        </Button>
                        <Button class="border-0 border-noround"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341" @click="fitView">
                            <i :class="'pi pi-stop'"></i>
                        </Button>
                        <Button class="border-0 border-noround" style="height: 2.8rem; z-index: 99;"
                            :style="{ 'background-color': toggleDrag ? 'white' : '#2e3341', color: toggleDrag ? '#2e3341' : 'white' }"
                            @click="toggleDrag = !toggleDrag">
                            <font-awesome-icon :icon="['fas', 'computer-mouse']" />
                        </Button>
                    </div>
                </div>
                <div class="border-2 surface-border border-round surface-section flex-auto">
                    <Skeleton v-if="!loading" class="mr-2 h-full" />
                    <VueFlow v-else v-model="vueFlow" :node-types="nodeTypes" class="basicflow" :default-zoom="1.5"
                        :min-zoom="0.1" :max-zoom="2" :nodes-draggable="toggleDrag" :elevate-edges-on-select="true">
                        <Background gap="50" bg-color="rgba(255, 255, 255, 0.1)" variant="lines" />

                        <Dialog v-bind:header="displayNodeInfoName" v-model:visible="displayNodeInfo" class="w-8" modal>
                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>
                            <div class="py-3 px-6 flex justify-content-between">
                                <Dropdown v-model="selectedNode" :options="parentNodesName" optionLabel="name"
                                    placeholder="Select a node (Optional)" class="w-7" />
                                <Button label="실시간 마이그레이션" @click="liveMigration(displayNodeInfoDetail)" />
                            </div>
                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>
                            <!-- VM detail information -->
                            <ul v-for="value, key in selectedNodeInfo" :key='value' class="list-none">
                                <div class="flex">
                                    <div class="bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                        {{ key }} :
                                    </div>
                                    <div class="text-600 font-medium  py-1 px-2">
                                        {{ value }}
                                    </div>
                                </div>
                            </ul>

                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>

                            <div class="px-6 my-2">
                                <div v-if="checkELS">
                                    <div class="flex justify-content-between align-items-center">
                                        <div
                                            class="bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                            RxTx Detail : </div>
                                        <Button label="Show Detail" @click="showELS(selectedNodeInfo.vm_id)"></Button>
                                    </div>
                                </div>
                                <div v-if="!checkELS">
                                    <div class="flex justify-content-end">
                                        <Button label="Close Detail" @click="closeELS"></Button>
                                    </div>
                                    <div class="mt-2 flex justify-content-center">
                                        <iframe v-bind:src="url" height="600" width="800"></iframe>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>

                            <div v-for="value1, key1 in selectedNodeMetric" :key="value1">
                                <div class="text-lg text-600 font-medium px-6 my-2 flex justify-content-center">
                                    original resource id = {{ key1 }}
                                </div>
                                <!-- data 구조 : label = x 좌표 리스트 , datasets = [{label : ~ , data : y 좌표 리스트, fill : false}] -->
                                <ul v-for="graphData, key in value1" class="list-none w-full" :key="graphData">
                                    <div class="bg-green-50 text-green-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                        {{ key }}
                                    </div>
                                    <div class="card w-full flex justify-content-center">
                                        <Chart type="line" :data="graphData" :options="graphOptions" :width="800"
                                            :height="600" />
                                    </div>
                                </ul>
                                <div class="flex justify-content-center">
                                    <div class="w-11 border-400 border-bottom-1 "></div>
                                </div>
                            </div>
                        </Dialog>
                    </VueFlow>
                </div>
            </div>
        </div>
        <div v-if="!displayLiveInfoPanel" class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2">
            <div class="text-2xl font-bold mb-4 m-4">
                Detail List
            </div>
            <div class="flex-grow-1" style="overflow-y: scroll;">
                <div v-for="object in onlyVMInVueFlow(vueFlow)" :key="object.label"
                    class="flex align-items-center mb-4 ml-4">
                    <RadioButton v-model="displayNodeInfoName" :inputId="object.id" :value="object.label"
                        @click="clickRadioButtonForVM(object.id)" />
                    <label :for="object.key" class="ml-2 text-700">{{ object.label }}</label>
                </div>
            </div>
        </div>
        <div v-else class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2">
            <div class="flex flex-column" style="height: 65%;">
                <div class="text-2xl font-bold mb-4 m-4">
                    Detail List
                </div>
                <div class="ml-4" style="overflow-y: scroll;">
                    <div v-for="object in onlyVMInVueFlow(vueFlow)" :key="object.label"
                        class="flex align-items-center mb-4">
                        <RadioButton v-model="displayNodeInfoName" :inputId="object.id" :value="object.label"
                            @click="clickRadioButtonForVM(object.id)" />
                        <label :for="object.key" class="ml-2 text-700">{{ object.label }}</label>
                    </div>
                </div>
            </div>
            <div class="flex flex-column" style="height: 35%">
                <div class=" text-2xl font-bold mx-4 my-2">
                    Traffic summary
                </div>
                <div style="height: 70%;overflow-y: scroll;">
                    <!-- {{ panelData }} -->
                    <div v-for="panelDataValue, panelDataKey in panelData" :key="panelDataValue"
                        class="flex flex-column mb-4">
                        <div class="text-700 px-4 text-xs"> [{{ panelDataKey }}] </div>
                        <div v-for="value, key in panelDataValue" :key="value" class="text-500 text-xs mt-2">
                            <div class="px-4">
                                {{ key }} = {{ value[2] }} byte
                                <ProgressBar :value="ProgressBarRate(Number(value[0]), Number(value[1]))"
                                    :showValue="false" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-500 text-xs mt-2 flex justify-content-end m-2">
                    <div>
                        <Tag value="Incoming" class="mr-2" severity="success"></Tag>
                        <Tag value="Outgoing" severity="danger"></Tag>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/theme-default.css';

.vue-flow__minimap {
    transform: scale(75%);
    transform-origin: bottom right;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #cbcaca;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.p-dialog .p-dialog-content {
    background-color: #6a5454;
}

.p-progressbar {
    background: #f0b4b4;
}

::v-deep(.p-progressbar) {
    .p-progressbar-value {
        background: #a7d99a;
    }
}

.circle {
    margin: 0 auto;
    width: 20px;
    height: 20px;
    border: 0px solid;
    border-radius: 50%;
}
</style>

