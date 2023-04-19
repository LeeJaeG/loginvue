<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';
// import { useRouter, useRoute } from 'vue-router'
import CustomVM from '../components/CustomVM.vue'
import CustomSubnet from '../components/CustomSubnet.vue'

const path = usePathStore();
const { contentBarName } = storeToRefs(path);
// const router = useRouter()
// const route = useRoute()
const yymmddhh = ref();
const checkELS = ref(true);
const Mounted = ref(false);
const url = ref();
let loading = ref(false);
let json = ref([]);
let json1 = ref([]);
let json2 = ref([]);
let json3 = ref([]);
let json4 = ref([]);
var parentNodesName = ref([]);
var elements = ref([
    { id: '1', type: 'input', class: 'text-900 font-bold', label: 'Network', position: { x: 100, y: 50 }, style: { backgroundColor: 'rgba(195, 188, 254, 0.1)', width: '300px', height: '1200px' }, },
]);
var element = ref([]);
let displayNodeInfo = ref(false);
let displayNodeInfoName = ref("");
let displayNodeInfoDetail = ref([]);
let displayNodeInfoRxTx = ref([]);
var selectedNode = ref();
let subnetToID = ref([]);
let vmToID = ref([]);
let vmTotalHeight = ref(0);
const { onPaneReady, fitView, onNodeDoubleClick, getNode } = useVueFlow()
onPaneReady(({ fitView }) => {
    fitView()
})
onNodeDoubleClick(({ node }) => {
    // console.log(node.id.charAt(node.id.length - 1).charCodeAt(0), node.id, node.id.charAt(node.id.length - 1));
    if (node.id.length >= 2 && node.id.charAt(node.id.length - 1).charCodeAt(0) > 96) { // 뒷자리 알파벳인지 판별하는 게 더 안전 
        displayNodeInfoName.value = node.data.name;
        displayNodeInfoDetail.value = node.data;
        displayNodeInfoRxTx.value = node.rxtx;
        openNodeInfo();
    }
})
const showELS = (vmID) => {
    checkELS.value = false;
    // vmID = 'c1fca4a0-6930-11ed-9d97-373723c9a1cb'; 
    url.value = "http://192.168.15.140:5601/app/dashboards#/view/c1fca4a0-6930-11ed-9d97-373723c9a1cb?embed=true&_g=(filters:!(),refreshInterval:(pause:!f,value:10000),time:(from:now-30m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'6a4bde80-68c0-11ed-9d97-373723c9a1cb',key:vm_id.keyword,negate:!f,params:(query:'" + vmID + "'),type:phrase),query:(match_phrase:(vm_id.keyword:'" + vmID + "')))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(enhancements:(),savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(customLabel:rx_byte,field:rx_byte),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:'20s',min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-60m,to:now),useNormalizedEsInterval:!t,used_interval:'30s'),schema:segment,type:date_histogram),(enabled:!t,id:'3',params:(customLabel:tx_byte,field:tx_byte),schema:metric,type:avg),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:5),schema:split,type:terms)),searchSource:(filter:!(),index:'6a4bde80-68c0-11ed-9d97-373723c9a1cb',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,grid:(categoryLines:!f),labels:(show:!f),legendPosition:top,maxLegendLines:1,palette:(name:kibana_palette,type:palette),radiusRatio:0,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:rx_byte),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:histogram,valueAxis:ValueAxis-1),(circlesRadius:3,data:(id:'3',label:tx_byte),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:histogram,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:'Average%20rx_byte'),type:value))),title:vm_rx_tx_bytes,type:histogram,uiState:())),gridData:(h:24,i:a491ab0b-6f8a-44e7-8a18-1bfe6e8db1e3,w:24,x:0,y:0),panelIndex:a491ab0b-6f8a-44e7-8a18-1bfe6e8db1e3,type:visualization,version:'7.15.0'),(embeddableConfig:(enhancements:(),hidePanelTitles:!f,savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(customLabel:drop_rx,field:rx_drop),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:auto,min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-30m,to:now),useNormalizedEsInterval:!t,used_interval:'30s'),schema:segment,type:date_histogram),(enabled:!t,id:'3',params:(customLabel:drop_tx,field:tx_drop),schema:metric,type:avg),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:5),schema:split,type:terms)),searchSource:(filter:!(),index:'6a4bde80-68c0-11ed-9d97-373723c9a1cb',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,grid:(categoryLines:!f),labels:(show:!f),legendPosition:top,maxLegendLines:1,palette:(name:kibana_palette,type:palette),radiusRatio:0,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:drop_rx),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-1),(circlesRadius:3,data:(id:'3',label:drop_tx),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:histogram,valueAxes:!((id:ValueAxis-1,labels:(filter:!f,rotate:0,show:!t,truncate:100),name:LeftAxis-1,position:left,scale:(mode:normal,type:linear),show:!t,style:(),title:(text:'Average%20rx_byte'),type:value))),title:vm_rx_tx_bytes,type:histogram,uiState:())),gridData:(h:24,i:f5a13833-a6d3-4f6c-b174-bba9834dd87a,w:24,x:24,y:0),panelIndex:f5a13833-a6d3-4f6c-b174-bba9834dd87a,title:drop_rx_tx_bytes,type:visualization,version:'7.15.0')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:vm_resources_basic,viewMode:edit)&show-time-filter=true"
    // console.log(url.value);
}
const closeELS = () => {
    checkELS.value = true;
}
const pickColorbyValue = (value) => {
    const round = value.toFixed(0);
    const digit = round.toString();
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
        var number = Number(temp).toString(16).toUpperCase()
        if (number.length == 1) {
            // console.log("warning", number);
            number = '0' + number;
        }
        object.color = '#FF' + number + '00'
        return object
    } else if (7 > digit.length && digit.length >= 4) {
        object.value = (value * 1e-3).toFixed(2) + 'Kbps'
        temp = logConverterYG(value);
        var number = Number(temp).toString(16).toUpperCase()
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
const openNodeInfo = () => {
    displayNodeInfo.value = true;
};
// const getKeyByValue = (obj, value) => {
//     return Object.keys(obj).find(key => obj[key] === value);
// }
const liveMigration = async (node) => {
    // post request
    var config = {
        method: 'post',
        url: 'http://192.168.15.129:9000/ostck/topology/live_migrate',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "vm_id": node.vm_id,
            "host": selectedNode.value.name,
        }
    };
    // console.log(config);
    await axios(config)
        .then(function (response) {
            alert("실시간 마이그레이션 요청이 정상적으로 처리 되었습니다. ");
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            alert("실시간 마이그레이션 요청이 처리 되지 않았습니다");
            console.log(error);
        });
    // // // update node info // pss로 테스트
}
const hex2dec = (hexString) => {
    const yourNumber = parseInt(hexString, 16);
    return yourNumber;
}
// =============== RxTx ================= //
let displayAllEdgeInfo = ref(false);
let timerId = null;
const getRxTxRate = async (Mounted) => {
    // api config
    var config = {
        method: 'get',
        url: 'http://192.168.15.129:7000/metric/vm/network_all_proejct',    //
        // url: 'http://192.168.15.135:8000/metric/vm/network_all',
        headers: {}
    };
    // api call
    await axios(config)
        .then(function (result) {
            for (var project_id in result.data) {                //
                json4.value = result.data[project_id];       //   
                // json4.value = result.data      //   temp
                for (var vm in json4.value) {
                    // need to be parsing
                    // ex) "instance-000000fc-479c76f6-0cd4-4e31-81c4-bf26e34c9e41-tapda6bebff-9b" 
                    // to "479c76f6-0cd4-4e31-81c4-bf26e34c9e41" & get vm id in elements 
                    // it could add twice (2 ports)
                    var parsing = vm.split('-').slice(2, -2).join('-');
                    var tap = vm.split('-').slice(7, 9).join('-');
                    var vmID = vmToID.value[parsing];
                    if (vmID == undefined) {
                        continue;
                    }
                    // find key by vmID <= elements.value[?].name = vmID; 
                    const key = Object.keys(elements.value).find(key => elements.value[key].id === vmID.id);
                    elements.value[key].rxtx[tap] = json4.value[vm]; // elements.value[key].rxtx = json4.value[vm];
                    // data reform
                    for (var data in json4.value[vm]) {
                        var dataSet = {};
                        const name = data
                        data = json4.value[vm][data].measures.aggregated;
                        dataSet.labels = [];
                        dataSet.datasets = [];
                        var dataset = [];
                        for (var dataPoint in data) {
                            const date = new Date(data[dataPoint][0]);
                            var year = date.getFullYear();
                            var month = ("0" + (1 + date.getMonth())).slice(-2);
                            var day = ("0" + date.getDate()).slice(-2);
                            var hour = date.getHours();
                            var minute = date.getMinutes();
                            var second = date.getSeconds();
                            yymmddhh.value = year + "-" + month + "-" + day + ":" + hour + 'hr';
                            var mmss = minute + 'm' + ' : ' + second + 's';
                            dataSet.labels.push(mmss);
                            dataset.push(Number(data[dataPoint][2]));
                        }
                        dataSet.datasets.push(
                            {
                                label: yymmddhh.value,
                                data: dataset,
                                tension: .4,
                                fill: false,
                                borderColor: '#42A5F5',
                                target: tap,
                            }
                        )
                        if (Mounted.value == false) {
                            elements.value[key].rxtx[tap][name].dataSet = dataSet; // 첫 호출에는 elements에 넣는 게 맞지만, 이후에는 element에 바로 업데이트 해야함.
                        } else if (Mounted.value == true) {
                            element.value[key].rxtx[tap][name].dataSet = dataSet;
                            element.value[key].rxtx[tap][name].measures.aggregated = data;
                        }
                    }
                };
                //  console.log(element.value);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
const RxTx = () => { // element를 통한 edge 업데이트, Rx + Tx Rate 사용
    if (displayAllEdgeInfo.value == true) {
        clearInterval(timerId);
        displayAllEdgeInfo.value = false
        // 모든 선을 black으로 변경
        for (const edgeId in element.value) {
            var edge = element.value[edgeId];
            var originalEdge = elements.value[edgeId]
            if (edge.target != undefined) {
                edge.style = originalEdge.style
                edge.animated = false;
                delete edge.label;
            }
        }
    } else {
        // initial call
        getRxTxRate(Mounted).then(() => {
            displayAllEdgeInfo.value = true
            // 모든 선을 rx+tx 값으로 변경
            for (const edgeId in element.value) {
                var edge = element.value[edgeId];
                // console.log(edge);
                if (edge.target != undefined) {
                    const vmID = edge.target;
                    const vmNode = getNode.value(vmID);
                    const tap = 'tap' + edge.tapPort.substr(0, 11);
                    // for 2 ports in vmNode object, 
                    let sumTxBytes = 0;
                    let sumRxBytes = 0;
                    if (vmNode.rxtx != '' && vmNode.rxtx != undefined) {
                        const length = vmNode.rxtx[tap]["vm_network.incoming.bytes"].measures.aggregated.length;
                        sumTxBytes = vmNode.rxtx[tap]["vm_network.incoming.bytes"].measures.aggregated[length - 1][2];
                        sumRxBytes = vmNode.rxtx[tap]["vm_network.outgoing.bytes"].measures.aggregated[length - 1][2];
                    }
                    const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
                    // console.log(vmNode.label, 'tap =', tap, ' : ', sumTxBytes, sumRxBytes, sumTxBytes + sumRxBytes);
                    // console.log(edgeId, ':', update);
                    edge.style = { stroke: update.color, strokeWidth: 4 };
                    edge.animated = true;
                    if (edge.label != undefined) {
                        edge.style = { stroke: update.color, strokeWidth: 4 };
                        edge.label = update.value;
                        edge.labelBgPadding = [8, 4];
                        edge.labelBgBorderRadius = 4;
                        edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 1.0 };
                    }
                }
            }
        })
        // setInterval(function, milliseconds)
        timerId = setInterval((() => {
            console.log('timer on')
            // 루프로 20초마다 get 요청 + 각 edge에 RxTx 합 색으로 표시 
            getRxTxRate(Mounted).then(() => {
                for (const edgeId in element.value) {
                    var edge = element.value[edgeId];
                    // console.log(edge);
                    if (edge.target != undefined) {
                        const vmID = edge.target;
                        const vmNode = getNode.value(vmID);
                        const tap = 'tap' + edge.tapPort.substr(0, 11);
                        // const dstNode = edge.id.charAt(3);
                        let sumTxBytes = 0;
                        let sumRxBytes = 0;
                        if (vmNode.rxtx != '' && vmNode.rxtx != undefined) {
                            const length = vmNode.rxtx[tap]["vm_network.incoming.bytes"].measures.aggregated.length;
                            sumTxBytes = vmNode.rxtx[tap]["vm_network.incoming.bytes"].measures.aggregated[length - 1][2];
                            sumRxBytes = vmNode.rxtx[tap]["vm_network.outgoing.bytes"].measures.aggregated[length - 1][2];
                        }
                        const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
                        // console.log(vmNode.label, 'tap =', tap, ' : ', sumTxBytes, sumRxBytes, sumTxBytes + sumRxBytes);
                        // console.log(edgeId, ':', update);
                        edge.style = { stroke: update.color, strokeWidth: 4 };
                        edge.animated = true;
                        if (edge.label != undefined) {
                            edge.style = { stroke: update.color, strokeWidth: 4 };
                            edge.label = update.value;
                            edge.labelBgPadding = [8, 4];
                            edge.labelBgBorderRadius = 4;
                            edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 1.0 };
                        }
                    }
                }
            })
        }), 20000); // 20s
    }
    return
}
// ==================================== //
const callServersOnHosts = (result) => {
    console.log('callServersOnHosts')
    json.value = result.data;
    let idx = 1;
    let elementsNum = 1;
    for (let i = 0; i < 3; i++) {
        const node = 'compute' + (i + 1) + '.forwiz-os.com'
        parentNodesName.value.push({
            'name': node
        })
    }
    for (const node in json.value) {
        idx += 1
        elementsNum += 1;
        elements.value.push({
            id: idx,
            label: node,
            type: 'output',
            class: 'text-sm font-bold',
            // position: { x: 750, y: 50 +  (idx - 2) * 215 },
            position: { x: 750, y: 48 + vmTotalHeight.value },
            style: { backgroundColor: 'rgba(255, 234, 239, 0.0)', width: '200px', height: '200px' }
        })
        let vmCount = 0;
        // const sorted = json.value[node].sort((a, b) => {
        //     if (a.name > b.name) return 1;
        //     if (a.name < b.name) return -1;
        //     return 0;
        // })
        for (const vmNum in json.value[node]) {
            vmCount = Number(vmNum) + 1;
            elementsNum += 1;
            var name = json.value[node][vmNum].name;
            if (name.length >= 15) {
                name = name.substr(0, 15) + ' ... ';
            }
            var id = idx + String.fromCharCode(97 + Number(vmNum))
            vmToID.value[json.value[node][vmNum].vm_id] = { 'id': id, 'count': 0 }
            var locationID = json.value[node][vmNum].location.project.id
            var colorR = hex2dec(locationID.substr(0, 2).toUpperCase())
            var colorG = hex2dec(locationID.substr(2, 2).toUpperCase())
            var colorB = hex2dec(locationID.substr(4, 2).toUpperCase())
            var rgba = 'rgba(' + colorR + ',' + colorG + ',' + colorB + ',' + 0.4 + ')'
            var rgba2 = 'rgba(' + colorR + ',' + colorG + ',' + colorB + ',' + 1.0 + ')'
            // console.log(json.value[node][vmNum]);
            var ipSet = []
            for (const network in json.value[node][vmNum].addresses) {
                for (const info in json.value[node][vmNum].addresses[network]) {
                    ipSet.push(json.value[node][vmNum].addresses[network][info].addr);
                }
            }
            json.value[node][vmNum].ip = ipSet;
            elements.value.push({
                id: id,
                label: name,
                ip: ipSet,
                type: 'customVm',
                position: { x: 25, y: 70 * vmCount },
                parentNode: String(idx),
                extent: 'parent',
                class: 'text-sm font-bold flex text-center align-items-center justify-content-center border-solid border-round border-1',
                style: { height: '60px', width: '150px', backgroundColor: rgba, borderColor: rgba2, '--vf-handle': rgba2 },
                data: json.value[node][vmNum],
                rxtx: {}, // rxtx: '',
                targetPosition: "right",
            })
        }
        elements.value[elementsNum - vmCount - 1].style.height = 70 * vmCount + 70 + 'px';
        vmTotalHeight.value += 70 * vmCount + 70 + 10;
    }
}
const callCluster = (result) => {
    json1.value = result.data;
    console.log('callCluster', json1.value)
    for (var cluster in json1.value) {
        console.log(cluster, json1.value[cluster].nodes);
        // var clusterCount = 1;
        var checkList = [];
        var clusterName = json1.value[cluster].main.name;
        for (var clusterNode in json1.value[cluster].nodes) {
            var vmID = vmToID.value[json1.value[cluster].nodes[clusterNode].id].id
            if (checkList[vmID.charAt(0) + '-' + clusterName] == undefined) {
                checkList[vmID.charAt(0) + '-' + clusterName] = 0;
                elements.value.push({
                    id: clusterName + vmID.charAt(0),
                    label: clusterName,
                    parentNode: vmID.charAt(0),
                    extent: 'parent',
                    position: { x: 100, y: 700 },
                    style: { width: '180px', height: (65 * checkList[vmID.charAt(0) + '-' + clusterName]) + 'px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'black' },
                    class: 'text-sm font-bold flex text-center justify-content-center border-solid border-round border-1 pt-0 border-dashed',
                })
            }
            checkList[vmID.charAt(0) + '-' + clusterName] += 1;
            // console.log(vmID, element.value, clusterNode);
            const key = Object.keys(elements.value).find(key => elements.value[key].id === vmID);
            var objectNode = elements.value[key];
            objectNode.parentNode = clusterName + vmID.charAt(0);
            const key2 = Object.keys(elements.value).find(key2 => elements.value[key2].id === clusterName + vmID.charAt(0));
            clusterNode = elements.value[key2];
            clusterNode.position = { x: 10, y: objectNode.position.y - ((checkList[vmID.charAt(0) + '-' + clusterName] - 1) * 70 + 10) };
            objectNode.position = { x: 15, y: 70 * (checkList[vmID.charAt(0) + '-' + clusterName] - 1) + 10 };
            objectNode.style.zIndex = 100;
            clusterNode.style.height = (10 + 70 * (checkList[vmID.charAt(0) + '-' + clusterName])) + 'px';
            clusterNode.style.borderColor = objectNode.style.borderColor;
        }
    }
    console.log(elements.value);
}
const callSubNet = (result) => {
    console.log('callSubNet');
    json2.value = result.data;
    // console.log("test3");
    let idx = 0;
    for (var network in json2.value) {
        // console.log(json2.value[network]);
        idx += 1;
        elements.value.push({
            id: idx + 'N',
            data: json2.value[network],
            parentNode: String(1),
            extent: 'parent',
            label: json2.value[network].name,
            type: 'input',
            class: 'text-sm font-bold',
            position: { x: 50, y: 50 + (idx - 1) * 250 },
            style: {
                backgroundColor: 'rgb(229,249,239, 0)', borderColor: 'rgba(50, 155, 50, 1.0)', '--vf-handle': 'rgba(50, 155, 50, 1.0)', width: '200px', height: '235px'
            }
        })
        var subnetNum = 0;
        for (var subnet in json2.value[network].subnet_dict) {
            // console.log(subnet, json2.value[network].subnet_dict[subnet]);
            subnetNum += 1;
            const id = idx + String.fromCharCode(97 + Number(subnetNum - 1)) + 'N'
            subnetToID.value[subnet] = { 'id': id, 'count': 0 }
            // var locationID = json2.value[network].location.project.id
            // var colorR = hex2dec(locationID.substr(0, 2).toUpperCase())
            // var colorG = hex2dec(locationID.substr(2, 2).toUpperCase())
            // var colorB = hex2dec(locationID.substr(4, 2).toUpperCase())
            var colorR = 255 - ((idx - 1) * 60);
            var colorG = 15 + ((idx) * 20);
            var colorB = 15 + ((idx) * 60);
            var rgba = 'rgba(' + colorR + ',' + colorG + ',' + colorB + ',' + 0.3 + ')'
            var rgb = 'rgba(' + colorR + ',' + colorG + ',' + colorB + ')'
            // console.log("check : ", idx, rgb);
            subnetToID.value[subnet] = { 'id': id, 'count': 0, 'color': rgb }
            elements.value.push({
                id: id,
                data: json2.value[network],
                parentNode: idx + 'N',
                extent: 'parent',
                label: json2.value[network].subnet_dict[subnet].name + ' : ' + json2.value[network].subnet_dict[subnet].cidr,
                type: 'customSubnet',
                // class: 'text-sm font-bold flex text-center align-items-center justify-content-center',
                class: 'text-sm font-bold flex text-center align-items-center justify-content-center border-solid border-round border-1',
                position: { x: 15, y: 65 + (subnetNum - 1) * 70 },
                style: {
                    // backgroundColor: 'rgba(25, 255, 155, 1.0)', borderColor: 'rgba(155, 155, 50, 1.0)', '--vf-handle': 'rgba(155, 155, 50, 0.5)', width: '170px', height: '40px'
                    backgroundColor: rgba, borderColor: rgb, '--vf-handle': rgba, width: '170px', height: '40px'
                }
            })
        }
    }
    elements.value[0].style.height = (250 * (idx) + 50) + 'px';
    // console.log(vmTotalHeight.value / 2);
    elements.value[0].position = { x: 100, y: vmTotalHeight.value / 2 - (250 * (idx) + 50) / 2 };
}
const callPort = (result) => {
    console.log('callPort');
    json3.value = result.data;
    // let idx = 0;
    for (var vm in json3.value) {
        // edge source & target
        // idx += 1;
        for (var port in json3.value[vm].ports) {
            const target = vmToID.value[vm].id;
            const source = subnetToID.value[json3.value[vm].ports[port].subnet_id].id;
            const sourceHandle = String.fromCodePoint(97 + subnetToID.value[json3.value[vm].ports[0].subnet_id].count);
            const targetHandle = String.fromCodePoint(97 + vmToID.value[vm].count);
            const color = subnetToID.value[json3.value[vm].ports[port].subnet_id].color;
            vmToID.value[vm].count += 1;
            subnetToID.value[json3.value[vm].ports[port].subnet_id].count += 1;
            if (subnetToID.value[json3.value[vm].ports[port].subnet_id].count > 3) {
                subnetToID.value[json3.value[vm].ports[port].subnet_id].count = 0;
            }
            if (vmToID.value[vm].count > 3) {
                vmToID.value[vm].count = 0;
            }
            elements.value.push({
                id: source + ':' + target + '-E',
                source: source,
                target: target,
                sourceHandle: sourceHandle,
                targetHandle: targetHandle,
                data: json3.value[vm],
                tapPort: json3.value[vm].ports[port].id,
                style: { stroke: color, strokeWidth: 3 },
            })
        }
    }
    getRxTxRate(Mounted).then(() => {
        Mounted.value = true;
        element.value = elements.value;
        fitView();
    }).then(() => {
        loading.value = true;
    });
}
const reqHandler = async () => {
    var config_server_on_host = 'http://192.168.15.129:9000/ostck/topology/servers_on_hosts'
    var config_cluster = 'http://192.168.15.129:7000/metric/vm/cluster_all'
    var config_port = {
        method: 'get',
        url: 'http://192.168.15.129:9000/ostck/network/ports_on_servers',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    var config_subnet = {
        method: 'get',
        url: 'http://192.168.15.129:9000/ostck/network/subnets_on_networks',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    var getList = [
        axios.get(config_server_on_host),
        axios.get(config_cluster),
        axios(config_port),
        axios(config_subnet)
    ]
    axios
        .all(getList)
        .then(
            axios.spread((res_server_on_host, res_cluster, res_port, res_subnet) => {
                console.log(res_server_on_host);
                console.log(res_cluster);
                console.log(res_port);
                console.log(res_subnet);

                callServersOnHosts(res_server_on_host);
                callCluster(res_cluster);
                callSubNet(res_subnet);
                callPort(res_port);
            })
        )
        .catch(() => { });
};
onMounted(async () => {
    contentBarName.value = 'Openstack Topology';
    reqHandler();
});
</script>
 

<template>
    <div class="min-h-screen flex relative lg:static surface-ground">
        <div class="min-h-screen flex flex-column relative flex-auto">
            <div class="p-5 flex flex-column flex-auto">
                <!-- this is main page -->
                <div class="border-2 border-dashed surface-border border-round surface-section flex-auto">
                    <Skeleton v-if="!loading" class="mr-2 h-full" />
                    <VueFlow v-else v-model="element" class="basicflow" :default-zoom="1.5" :min-zoom="0.1" :max-zoom="2"
                        :nodes-draggable="true" :elevate-edges-on-select="true">
                        <MiniMap />
                        <Controls />
                        <Background gap="50" bg-color="rgba(255, 255, 255, 0.1)" variant="lines" />

                        <Dialog v-bind:header="displayNodeInfoName" v-model:visible="displayNodeInfo" class="w-8">
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
                            <ul v-for="value, key in displayNodeInfoDetail" :key='value' class="list-none">
                                <div class="bg-blue-50 text-blue-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                    {{ key }} :
                                </div>
                                <div class="text-600 font-medium  py-1 px-2">
                                    {{ value }}
                                </div>
                            </ul>
                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>
                            <div class="my-2 px-6">
                                <div v-if="checkELS">
                                    <div class="flex justify-content-between align-items-center">
                                        <div
                                            class="bg-blue-50 text-blue-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                            RxTx Detail : </div>
                                        <Button label="Show Detail" @click="showELS(displayNodeInfoDetail.vm_id)"></Button>
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
                            <div v-for="value1, key1 in displayNodeInfoRxTx" :key="value1">
                                <div class="text-lg text-600 font-medium px-6 my-2 flex justify-content-center">
                                    tap = {{ key1 }}
                                </div>
                                <ul v-for="value, key in value1" class="list-none w-full" :key="value">
                                    <div class="bg-blue-50 text-blue-400 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                        {{ key }} :
                                    </div>
                                    <div class="card w-full flex justify-content-center">
                                        <Chart type="line" :data="value.dataSet" :options="graphOptions" :width="800"
                                            :height="600" />
                                    </div>
                                </ul>
                                <div class="flex justify-content-center">
                                    <div class="w-11 border-400 border-bottom-1 "></div>
                                </div>
                            </div>
                        </Dialog>

                        <div class="controls">
                            <button style="background-color: #113285; color: white" @click="RxTx">실시간 패킷 레이트
                                (20초)</button>
                        </div>

                        <template #node-customVm="props">
                            <CustomVM :data="props" />
                        </template>
                        <template #node-customSubnet="props">
                            <CustomSubnet :data="props" />
                        </template>
                    </VueFlow>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/theme-default.css';

html,
body,
#app {
    margin: 0;
    height: 100%;
}

#app {
    text-transform: uppercase;
    font-family: 'JetBrains Mono', monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.vue-flow__minimap {
    transform: scale(75%);
    transform-origin: bottom right;
}

.basicflow .vue-flow__node.dark {
    background: #1C1C1C;
    color: #fffffb
}

.basicflow .controls {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 4;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px
}

.basicflow .controls button {
    padding: 5px;
    border-radius: 5px;
    font-weight: 500;
    -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .3);
    box-shadow: 0 5px 10px #0000004d;
    cursor: pointer
}

.basicflow .controls button:hover {
    opacity: .8;
    transform: scale(105%);
    transition: .25s all ease
}
</style>