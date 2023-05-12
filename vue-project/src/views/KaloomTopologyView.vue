<script setup>
import { ref, markRaw, onMounted } from 'vue'
import axios from 'axios'
import baremetalNode from '../components/vueFlowComponents/baremetalNode.vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';

const vueFlow = ref()
const loading = ref(false)
const httpWorking = ref(false)
const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
// const { userdata } = storeToRefs(user);

const { onPaneReady, onNodeDoubleClick, getEdge } = useVueFlow()

const nodeTypes = {
    baremetal: markRaw(baremetalNode),
}

onPaneReady(({ fitView }) => {
    fitView()
})

onMounted(() => {
    contentBarName.value = 'Kaloom Topology'
    // console.log(userdata.value, info.value)
    getVueFlowForKaloom(0)
})

var flowData = [];
var nameToNum = {};
const nodeList = ref();
const linkList = ref();
const fabricLinkList = ref();
const categories = ref([{ 'name': 'Not select', 'key': 'A' }]);
const edgePortInfo = ref();
// const node_style = { backgroundColor: '#05325966', '--vf-node-text': 'white', '--vf-node-color': 'gray' }
const controller_style = { backgroundColor: '#0D567366', '--vf-node-text': 'white', '--vf-node-color': 'gray' }
const leaf_style = { backgroundColor: '#BDF2F266', '--vf-node-text': 'gray', '--vf-node-color': 'gray' }
const spine_style = { backgroundColor: '#4995A666', '--vf-node-text': 'gray', '--vf-node-color': 'gray' }
var nameToFullname = {};
const getVueFlowForKaloom = (async (retry, ...theArgs) => {
    console.log("getKaloomTopology")
    try {
        const response = await axios.get('http://192.168.15.129:8000/api/ksdf/topology/node_link')

        nodeList.value = response.data["node_dict"]
        //  nodeListObject is for vueFlow, sorting nodes for position allocation. 
        // key: "168c0ee5-9782-4842-80fe-520a088703ae" 
        // value: Proxy {0: "controller-1", 1: "CONTROLLER"}
        var nodeListObject = Object.entries(nodeList.value).map(([key, value]) => ({ key, value }));
        nodeListObject.sort(function (a, b) {
            if (String(Object.values(a)[1][0]) > String(Object.values(b)[1][0])) {
                return 1
            } else if (String(Object.values(a)[1][0]) < String(Object.values(b)[1][0])) {
                return -1
            }
            return 0;
        });

        let sorting = {}
        let spineTotalCount = 0;
        let leafTotalCount = 0;
        let controllerTotalCount = 0;
        let spineInitXvalue = 0;
        let leafInitXvalue = 0;
        let controllerInitXvalue = 0;
        for (const id in nodeListObject) {
            const node_key = nodeListObject[id]["key"];
            const node_value = nodeListObject[id]["value"]
            sorting[node_key] = node_value
            nameToFullname[nodeListObject[id].value[0]] = nodeListObject[id].key;

            console.log(node_value[1])
            switch (node_value[1]) {
                case 'LEAF':
                    leafTotalCount += 1;
                    break;
                case 'SPINE':
                    spineTotalCount += 1;
                    break;
                case 'CONTROLLER':
                    controllerTotalCount += 1;
                    break;
                default:
                    break;
            }
        }
        const maxCount = Math.max(leafTotalCount, spineTotalCount, controllerTotalCount)
        spineInitXvalue = 150 * (maxCount - spineTotalCount);
        leafInitXvalue = 150 * (maxCount - leafTotalCount);
        controllerInitXvalue = 150 * (maxCount - controllerTotalCount);

        nodeList.value = new Proxy(sorting, {}); // what?
        linkList.value = response.data["link_dict"];
        fabricLinkList.value = linkList.value["fabric_link"];
        // data 형태 형성 => Role에 따라 y 값 다르게 , 현재 총 9개 박스 그려야 함
        // [
        //     { id: 'idNumber', type: 'input', label: 'controller-1, position: { x: 250, y: 5 }},  ... ,
        //  ]
        let spineCount = 0;
        let leafCount = 0;
        let controllerCount = 0;
        let y = ref(0);
        let x = ref(0);
        let idNumber = 1;
        for (const id in nodeList.value) {
            let position, flow
            let node = nodeList.value[id]
            categories.value.push({ 'name': node[0], 'key': 'A' })
            if (node[1] == "LEAF") {
                x.value = leafInitXvalue + leafCount * 300;
                leafCount += 1;
                y.value = 400;
                position = {
                    "x": x.value,
                    "y": y.value,
                }
                flow = {
                    "id": idNumber,
                    "type": "baremetal",
                    "label": node[0],
                    "position": position,
                    "style": leaf_style,
                    "data": { 'type': 'leaf' }
                }
            } else if (node[1] == "CONTROLLER") {
                x.value = controllerInitXvalue + controllerCount * 300;
                y.value = 800;
                controllerCount += 1;
                position = {
                    "x": x.value,
                    "y": y.value,
                }
                flow = {
                    "id": idNumber,
                    "type": "baremetal",
                    "label": node[0],
                    "position": position,
                    "class": "light",
                    "style": controller_style,
                    "targetPosition": "top",
                    "data": { 'type': 'baremetal' }
                }
            } else {
                x.value = spineInitXvalue + spineCount * 300;
                spineCount += 1;
                y.value = 0;
                position = {
                    "x": x.value,
                    "y": y.value,
                }
                flow = {
                    "id": idNumber,
                    "type": 'baremetal',
                    "label": node[0],
                    "position": position,
                    "style": spine_style,
                    "data": { 'type': 'spine' }
                }
            }
            flowData[idNumber] = flow;
            nameToNum[node[0]] = idNumber
            idNumber += 1;
        }
        var port = {};
        for (const id in fabricLinkList.value) {
            var linkinfo = fabricLinkList.value[id];
            var source = nodeList.value[linkinfo["src"][0]];
            if (source == undefined) {
                continue;
            }
            var sourceID = nameToNum[source[0]];
            var targetID = nameToNum[linkinfo["dst"][0]];
            var linkID = "e" + String(sourceID) + "-" + String(targetID);
            var NodeID = "n" + String(sourceID)
            if (sourceID > targetID) {
                var flow = {
                    "id": linkID,
                    "type": "straight",
                    "source": String(sourceID),
                    "target": String(targetID),
                    "style": { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' },
                    "data": { 'type': 'edge', },
                }
                if (Object.keys(flowData).find(key => flowData[key].id === linkID) == undefined) {
                    flowData[idNumber] = flow;
                    idNumber += 1;
                }
            }
            if (port[NodeID] == undefined) {
                port[NodeID] = {}
            }
            if (port[NodeID][linkinfo["dst"][0]] == undefined) {
                port[NodeID][linkinfo["dst"][0]] = {};
                port[NodeID][linkinfo["dst"][0]].name = linkinfo["dst"][0]
                port[NodeID][linkinfo["dst"][0]].value = [];
                port[NodeID][linkinfo["dst"][0]].edge = checkEdgeName(sourceID, targetID);
                port[NodeID][linkinfo["dst"][0]].showList = false;
            }
            port[NodeID][linkinfo["dst"][0]].value.push({ "srcPort": linkinfo["src"][1], "dstPort": linkinfo["dst"][1], "show": false, "edge": checkEdgeName(sourceID, targetID) })
        }
        edgePortInfo.value = new Proxy(port, {});
        getRxTxRate(0);
        vueFlow.value = flowData;
        loading.value = true;
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getVueFlowForKaloom, retry, theArgs);
        }
    }
})

const checkEdgeName = (sourceID, targetID) => {
    return sourceID > targetID ? "e" + String(sourceID) + "-" + String(targetID) : "e" + String(targetID) + "-" + String(sourceID);
}

const packetRate = ref()
const getRxTxRate = (async (retry, ...theArgs) => {
    console.log("getRxTxRate")
    try {
        const response = await axios.get('http://192.168.15.129:8000/api/ksdf/packet_counter/per_tp')
        packetRate.value = response.data["cur_pkt_rate"]
        // console.log(packetRate.value)
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getRxTxRate, retry, theArgs);
        }
    }
})

const displayAllEdgeInfo = ref(false);
const timeForLiveUpdate = ref(5)
const RxTx = () => {
    let edge
    if (displayAllEdgeInfo.value == true) {
        clearInterval(intervalID.value);
        timeForLiveUpdate.value = 5;
        displayAllEdgeInfo.value = false // 모든 선을 black으로 변경
        for (const edgeId in vueFlow.value) {
            edge = vueFlow.value[edgeId];
            if (edge.data["type"] == 'edge') {
                edge.style = { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' };
                edge.animated = false;
                delete edge.label;
            }
        }
    } else {
        // initial call
        getRxTxRate(0)
        displayAllEdgeInfo.value = true // 모든 선을 rx+tx 값으로 변경
        for (const edgeId in vueFlow.value) {
            edge = vueFlow.value[edgeId];
            if (edge.data["type"] == 'edge') {
                const srcNode = edge.id.split('-')[0].replace('e', '');
                const dstNode = edge.id.split('-')[1];
                const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
                const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
                const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
                let sumTxBytes = 0;
                let sumRxBytes = 0;
                for (const port in dstPort) {
                    sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
                    sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
                }
                const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
                edge.style = { stroke: update.color, strokeWidth: 3 };
                edge.animated = true;
                if (edge.label != undefined) {
                    edge.style = { stroke: update.color, strokeWidth: 6 }; // 'font-size': '18px' ?
                    edge.label = update.value;
                    edge.labelBgPadding = [8, 4];
                    edge.labelBgBorderRadius = 4;
                    edge.labelStyle = { 'font-size': '18px' }
                    edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 0.5 };
                }
            }
        }
        timer();
    }
    return
}

const intervalID = ref(null);
const timer = (() => {
    intervalID.value = setInterval(async () => {
        timeForLiveUpdate.value -= 1;
        if (timeForLiveUpdate.value < 0) {
            timeForLiveUpdate.value = 5;
            clearInterval(intervalID.value);
            timer()
            httpWorking.value = true;
            getRxTxRate(0)
            for (const edgeId in vueFlow.value) {
                var edge = vueFlow.value[edgeId];
                if (edge.data["type"] == 'edge') {
                    const srcNode = edge.id.split('-')[0].replace('e', '');
                    const dstNode = edge.id.split('-')[1];
                    const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
                    const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
                    const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
                    let sumTxBytes = 0;
                    let sumRxBytes = 0;
                    for (const port in dstPort) {
                        sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
                        sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
                    }
                    const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
                    edge.style = { stroke: update.color, strokeWidth: 3 };
                    edge.animated = true;
                    if (edge.label != undefined) {
                        edge.style = { stroke: update.color, strokeWidth: 6 };
                        edge.label = update.value;
                        edge.labelBgPadding = [8, 4];
                        edge.labelBgBorderRadius = 4;
                        edge.labelStyle = { 'font-size': '18px' }
                        edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 0.5 };
                    }
                }
            }
            httpWorking.value = false;
        }
    }, 1000)
})


const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

const pickColorbyValue = (value) => {
    const round = value.toFixed(0);
    const digit = round.toString();
    let object = {}
    let temp = ''
    let number
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

const displayNodeInfo = ref(false);
const openNodeInfo = () => {
    displayNodeInfo.value = true;
};
const displayNodeInfoName = ref("")
onNodeDoubleClick(({ node }) => {
    displayNodeInfoName.value = node.label;
    openNodeInfo()
})
const showEdgeList = (list) => {
    if (list.showList == false) {
        list.showList = true
    } else {
        list.showList = false
    }
}
const showEdgeRoute = (list) => {
    const edge = getEdge.value(list.edge);
    updateEdgeAddbyRxTx(edge);
}
const deleteEdgeRoute = (list) => {
    const edge = getEdge.value(list.edge);
    if (displayAllEdgeInfo.value == false) {
        edge.style = { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' };
        edge.animated = false;
        // edge.label = '';
        delete edge.label;
    } else {
        updateEdgeDeletebyRxTx(edge);
    }
}
const updateEdgeAddbyRxTx = (edge) => {
    const srcNode = edge.id.split('-')[0].replace('e', '');
    const dstNode = edge.id.split('-')[1];
    const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
    const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
    const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
    let sumTxBytes = 0;
    let sumRxBytes = 0;
    for (const port in dstPort) {
        console.log('RxTx Port' + port)
        sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
        sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
    }
    const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
    edge.style = { stroke: update.color, strokeWidth: 6, };
    edge.animated = true;
    edge.label = update.value;
    edge.labelBgPadding = [8, 4];
    edge.labelBgBorderRadius = 4;
    edge.labelStyle = { 'font-size': '18px' }
    edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 0.5 };
}
const updateEdgeDeletebyRxTx = (edge) => {
    const srcNode = edge.id.charAt(1);
    const dstNode = edge.id.charAt(3);
    const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
    const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
    const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
    let sumTxBytes = 0;
    let sumRxBytes = 0;
    for (const port in dstPort) {
        sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
        sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
    }
    const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
    edge.style = { stroke: update.color, strokeWidth: 3 };
    edge.animated = true;
    delete edge.label;
}

const categoryChecked = ref();
const clickCategories = (checkedValue, beforeValue) => {
    for (const edgeId in vueFlow.value) {
        var edge = vueFlow.value[edgeId];
        if (edge.data["type"] == 'edge') { //only edges
            if (edge.source == nameToNum[beforeValue] || edge.target == nameToNum[beforeValue]) {
                //edge to grey line
                if (displayAllEdgeInfo.value == false) {
                    edge.style = { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' };
                    edge.animated = false;
                    delete edge.label;
                } else {
                    updateEdgeDeletebyRxTx(edge)
                }
            }
            if (edge.source == nameToNum[checkedValue] || edge.target == nameToNum[checkedValue]) {
                //edge to colored line
                updateEdgeAddbyRxTx(edge);
            }
        }
    }
}

const RxValueBytesRate = (name, srcPort) => {
    const fullName = nameToFullname[name];
    const ports = packetRate.value[fullName];
    if (ports[srcPort] == undefined) {
        return null;
    }
    const RxBytes = Number(ports[srcPort].RxBytes);
    const TxBytes = Number(ports[srcPort].TxBytes);
    const value = TxBytes / (RxBytes + TxBytes) * 100;
    return value
}
const RxValuePacketsRate = (name, srcPort) => {
    const fullName = nameToFullname[name];
    const ports = packetRate.value[fullName];
    if (ports[srcPort] == undefined) {
        return null;
    }
    const RxPackets = Number(ports[srcPort].RxPackets);
    const TxPackets = Number(ports[srcPort].TxPackets);
    const value = TxPackets / (RxPackets + TxPackets) * 100;
    return value
}

const showSwitchInfo = ref(true);
const url = ref();
const detailSwitchInfo = (nodeName) => {
    const nodeID = nameToFullname[nodeName];
    console.log(nodeID);
    showSwitchInfo.value = false;
    url.value = "http://192.168.15.140:5601/app/dashboards#/view/269c8d70-6969-11ed-af12-d11535b1546d?embed=true&_g=(filters:!(),query:(language:kuery,query:''),refreshInterval:(pause:!f,value:30000),time:(from:now-10m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'0aa04650-6966-11ed-af12-d11535b1546d',key:sw_id.keyword,negate:!f,params:(query:'" + nodeID + "'),type:phrase),query:(match_phrase:(sw_id.keyword:'" + nodeID + "')))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(enhancements:(),savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(field:rx_bytes),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:auto,min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-10m,to:now),useNormalizedEsInterval:!t,used_interval:'10s'),schema:segment,type:date_histogram),(enabled:!t,id:'3',params:(field:tx_bytes),schema:metric,type:avg),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:10),schema:split,type:terms)),searchSource:(filter:!(),index:'0aa04650-6966-11ed-af12-d11535b1546d',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,fittingFunction:linear,grid:(categoryLines:!f,valueAxis:''),labels:(),legendPosition:top,maxLegendLines:1,palette:(name:default,type:palette),radiusRatio:9,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:'Average%20rx_bytes'),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:area,valueAxis:ValueAxis-1),(circlesRadius:3,data:(id:'3',label:'Average%20tx_bytes'),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:area,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:area,valueAxes:!((id:ValueAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:1000),name:LeftAxis-1,position:left,scale:(mode:normal,type:log),show:!t,style:(),title:(text:'Average%20rx_bytes'),type:value))),title:ksdf_rx_tx,type:area,uiState:())),gridData:(h:43,i:'042d1fe3-e4a5-432b-a938-37b110659c09',w:23,x:0,y:0),panelIndex:'042d1fe3-e4a5-432b-a938-37b110659c09',type:visualization,version:'7.15.0'),(embeddableConfig:(enhancements:(),hidePanelTitles:!f,savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(field:drop_bytes),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:auto,min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-10m,to:now),useNormalizedEsInterval:!t,used_interval:'10s'),schema:segment,type:date_histogram),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:10),schema:split,type:terms)),searchSource:(filter:!(),index:'0aa04650-6966-11ed-af12-d11535b1546d',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,fittingFunction:linear,grid:(categoryLines:!f,valueAxis:''),labels:(),legendPosition:top,maxLegendLines:1,palette:(name:default,type:palette),radiusRatio:9,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:'Average%20drop_bytes'),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:area,valueAxes:!((id:ValueAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:1000),name:LeftAxis-1,position:left,scale:(mode:normal,type:log),show:!t,style:(),title:(text:'Average%20rx_bytes'),type:value))),title:ksdf_rx_tx,type:area,uiState:())),gridData:(h:43,i:'318e62b6-07fc-4ad3-809e-7107f424e203',w:23,x:23,y:0),panelIndex:'318e62b6-07fc-4ad3-809e-7107f424e203',title:ksdf_drop_bytes,type:visualization,version:'7.15.0')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:ksdf_packet_counter,viewMode:view)&show-time-filter=true"
}
const closeSwitchInfo = () => {
    showSwitchInfo.value = true;
}

</script>

<template>
    <template>
        <Dialog v-model:visible="httpWorking" :closable=false modal>
            <ProgressSpinner />
        </Dialog>
    </template>
    <div class=" flex surface-ground" style="height: 100%">
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="">
        </div>
        <div class="flex flex-column relative flex-auto">
            <div class="p-5 flex flex-column flex-auto">
                <div class="border-2 border-dashed surface-border border-round surface-section flex-auto">
                    <Skeleton v-if="!loading" class="mr-2 h-full" />
                    <VueFlow v-else v-model="vueFlow" class="basicflow" :node-types="nodeTypes" :default-zoom="1.5"
                        :min-zoom="0.1" :max-zoom="2" :nodes-draggable="true" :elevate-edges-on-select="true">
                        <MiniMap />
                        <Controls />
                        <Background gap="50" bg-color="rgba(255, 255, 255, 0.1)" variant="lines" />

                        <Dialog v-bind:header="'출발지 노드 : ' + displayNodeInfoName" v-model:visible="displayNodeInfo"
                            class="w-8">
                            <div class="my-2">
                                <div class="flex justify-content-end" v-if="showSwitchInfo">
                                    <Button @click="detailSwitchInfo(displayNodeInfoName)" label='detail switch info' />
                                </div>
                                <div v-if="!showSwitchInfo">
                                    <div class="flex justify-content-end">
                                        <Button @click="closeSwitchInfo" label="close switch info" />
                                    </div>
                                    <div class="mt-2 flex justify-content-center">
                                        <iframe v-bind:src="url" height="600" width="800"></iframe>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-content-center">
                                <div class="w-11 border-400 border-bottom-1 "></div>
                            </div>
                            <ul v-for="nodeEdgePortInfo in edgePortInfo['n' + nameToNum[displayNodeInfoName]]"
                                :key="nodeEdgePortInfo" class="list-none">
                                <!-- {{ nodeEdgePortInfo }} -->
                                <div
                                    class="flex justify-content-between align-content-center block text-500 surface-card shadow-2 p-3 border-1 border-50 border-round">
                                    <div class="flex align-items-center">
                                        도착지 노드 :
                                        {{ nodeEdgePortInfo.name }}
                                    </div>
                                    <div class="flex just justify-content-center">
                                        <div v-if="getEdge(nodeEdgePortInfo.edge).style.strokeWidth === 1" class="mr-2">
                                            <Button icon="pi pi-eye" class="p-button-success p-button-rounded"
                                                @click="showEdgeRoute(nodeEdgePortInfo)" />
                                        </div>
                                        <div v-else class="mr-2">
                                            <Button icon="pi pi-times" class="p-button-danger p-button-rounded"
                                                @click="deleteEdgeRoute(nodeEdgePortInfo)" />
                                        </div>
                                        <div v-if="nodeEdgePortInfo.showList !== true">
                                            <Button icon="pi pi-chevron-down" class="p-button-rounded"
                                                @click="showEdgeList(nodeEdgePortInfo)" />
                                        </div>
                                        <div v-else>
                                            <Button icon="pi pi-chevron-up" class="p-button-rounded"
                                                @click="showEdgeList(nodeEdgePortInfo)" />
                                        </div>
                                    </div>
                                </div>
                                <template v-for="list in  nodeEdgePortInfo.value" :key="list">
                                    <li v-if="nodeEdgePortInfo.showList == true"
                                        class="py-3 border-bottom-1 surface-border md-3">
                                        <div class="flex justify-content-between align-content-center">
                                            <div class="flex m-2">출발지 포트 : {{ list.srcPort }}</div>
                                            <div class="flex m-2">도착지 포트 : {{ list.dstPort }}</div>
                                        </div>
                                        <div
                                            v-if="packetRate[nameToFullname[displayNodeInfoName]][list.srcPort] != undefined">

                                            <ul class="text-500 text-xs">
                                                <li v-for="dataValue, dataIndex in packetRate[nameToFullname[displayNodeInfoName]][list.srcPort]"
                                                    :key="dataValue">
                                                    {{ dataIndex }} : {{ dataValue }}
                                                </li>
                                            </ul>
                                            <div class="text-500 text-xs mt-2">
                                                총 Byte =
                                                {{
                                                    (Number(packetRate[nameToFullname[displayNodeInfoName]][list.srcPort].TxBytes)
                                                        +
                                                        Number(packetRate[nameToFullname[displayNodeInfoName]][list.srcPort].RxBytes))
                                                        .toFixed(2)
                                                }} Byte </div>
                                            <ProgressBar :value="RxValueBytesRate(displayNodeInfoName, list.srcPort)"
                                                :showValue="false" />

                                            <div class="text-500 text-xs mt-2">
                                                <div>
                                                    총 패킷 수 =
                                                    {{
                                                        (Number(packetRate[nameToFullname[displayNodeInfoName]][list.srcPort].TxPackets)
                                                            +
                                                            Number(packetRate[nameToFullname[displayNodeInfoName]][list.srcPort].RxPackets))
                                                    }} 개
                                                    <ProgressBar
                                                        :value="RxValuePacketsRate(displayNodeInfoName, list.srcPort)"
                                                        :showValue="false" />
                                                </div>

                                            </div>
                                            <div class="text-500 text-xs mt-2 flex justify-content-end">
                                                <div>
                                                    <Tag value="Tx" class="mr-2" severity="success"></Tag>
                                                    <Tag value="Rx" severity="danger"></Tag>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                        </Dialog>
                        <div class="controls">
                            <button style="background-color: #113285; color: white" @click="RxTx">실시간 패킷 레이트
                                ({{ timeForLiveUpdate }}초)</button>
                        </div>
                    </VueFlow>
                </div>
            </div>
        </div>
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="">
            <div class=" text-2xl font-bold m-4">
                List
            </div>
            <div class="m-4">
                <div v-for="category of categories" :key="category.key" class="field-radiobutton text-800 mb-4">
                    <RadioButton :inputId="category.key" name="category" :value="category.name" v-model="categoryChecked"
                        @click="clickCategories(category.name, categoryChecked)" :disabled="category.key === 'R'" />
                    <label :for="category.key">{{ category.name }}</label>
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
</style>
