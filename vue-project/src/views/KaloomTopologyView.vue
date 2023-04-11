<script setup>
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { ref, onMounted } from 'vue'
import { usePathStore } from '@/stores/path'
import { storeToRefs } from 'pinia';
import axios from "axios";

const path = usePathStore();
const { contentBarName } = storeToRefs(path);

let loading = ref(false);
var url = ref();
var showSwitchInfo = ref(true);
let json = ref([]);
let nodeList = ref([]);
let linkList = ref([]);
let fabricLinkList = ref([]);
var flowData = [];
var nameToNum = {};
var nameToFullname = {};
let displayNodeInfo = ref(false);
let displayNodeInfoName = ref("")
let edgePortInfo = ref([]);
let packetCounter = ref([]);
let packetRate = ref([]);
let displayAllEdgeInfo = ref(false);
let timerId = null;
const categories = ref([]);
const categoryChecked = ref();
const node_style = { backgroundColor: '#05325966', '--vf-node-text': 'white', '--vf-node-color': 'gray' }
const controller_style = { backgroundColor: '#0D567366', '--vf-node-text': 'white', '--vf-node-color': 'gray' }
const leaf_style = { backgroundColor: '#BDF2F266', '--vf-node-text': 'gray', '--vf-node-color': 'gray' }
const spine_style = { backgroundColor: '#4995A666', '--vf-node-text': 'gray', '--vf-node-color': 'gray' }
const detailSwitchInfo = (nodeName) => {
    const nodeID = nameToFullname[nodeName];
    console.log(nodeID);
    showSwitchInfo.value = false;
    url.value = "http://192.168.15.140:5601/app/dashboards#/view/269c8d70-6969-11ed-af12-d11535b1546d?embed=true&_g=(filters:!(),query:(language:kuery,query:''),refreshInterval:(pause:!f,value:30000),time:(from:now-10m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'0aa04650-6966-11ed-af12-d11535b1546d',key:sw_id.keyword,negate:!f,params:(query:'" + nodeID + "'),type:phrase),query:(match_phrase:(sw_id.keyword:'" + nodeID + "')))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(enhancements:(),savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(field:rx_bytes),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:auto,min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-10m,to:now),useNormalizedEsInterval:!t,used_interval:'10s'),schema:segment,type:date_histogram),(enabled:!t,id:'3',params:(field:tx_bytes),schema:metric,type:avg),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:10),schema:split,type:terms)),searchSource:(filter:!(),index:'0aa04650-6966-11ed-af12-d11535b1546d',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,fittingFunction:linear,grid:(categoryLines:!f,valueAxis:''),labels:(),legendPosition:top,maxLegendLines:1,palette:(name:default,type:palette),radiusRatio:9,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:'Average%20rx_bytes'),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:area,valueAxis:ValueAxis-1),(circlesRadius:3,data:(id:'3',label:'Average%20tx_bytes'),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:area,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:area,valueAxes:!((id:ValueAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:1000),name:LeftAxis-1,position:left,scale:(mode:normal,type:log),show:!t,style:(),title:(text:'Average%20rx_bytes'),type:value))),title:ksdf_rx_tx,type:area,uiState:())),gridData:(h:43,i:'042d1fe3-e4a5-432b-a938-37b110659c09',w:23,x:0,y:0),panelIndex:'042d1fe3-e4a5-432b-a938-37b110659c09',type:visualization,version:'7.15.0'),(embeddableConfig:(enhancements:(),hidePanelTitles:!f,savedVis:(data:(aggs:!((enabled:!t,id:'1',params:(field:drop_bytes),schema:metric,type:avg),(enabled:!t,id:'2',params:(drop_partials:!f,extended_bounds:(),field:'@timestamp',interval:auto,min_doc_count:1,scaleMetricValues:!f,timeRange:(from:now-10m,to:now),useNormalizedEsInterval:!t,used_interval:'10s'),schema:segment,type:date_histogram),(enabled:!t,id:'4',params:(field:port_id.keyword,missingBucket:!f,missingBucketLabel:Missing,order:desc,orderBy:_key,otherBucket:!f,otherBucketLabel:Other,size:10),schema:split,type:terms)),searchSource:(filter:!(),index:'0aa04650-6966-11ed-af12-d11535b1546d',query:(language:kuery,query:''))),description:'',params:(addLegend:!t,addTimeMarker:!f,addTooltip:!t,categoryAxes:!((id:CategoryAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:100),position:bottom,scale:(type:linear),show:!t,style:(),title:(),type:category)),detailedTooltip:!t,fittingFunction:linear,grid:(categoryLines:!f,valueAxis:''),labels:(),legendPosition:top,maxLegendLines:1,palette:(name:default,type:palette),radiusRatio:9,row:!t,seriesParams:!((circlesRadius:3,data:(id:'1',label:'Average%20drop_bytes'),drawLinesBetweenPoints:!t,interpolate:linear,lineWidth:2,mode:stacked,show:!t,showCircles:!t,type:line,valueAxis:ValueAxis-1)),thresholdLine:(color:%23E7664C,show:!f,style:full,value:10,width:1),times:!(),truncateLegend:!t,type:area,valueAxes:!((id:ValueAxis-1,labels:(filter:!t,rotate:0,show:!t,truncate:1000),name:LeftAxis-1,position:left,scale:(mode:normal,type:log),show:!t,style:(),title:(text:'Average%20rx_bytes'),type:value))),title:ksdf_rx_tx,type:area,uiState:())),gridData:(h:43,i:'318e62b6-07fc-4ad3-809e-7107f424e203',w:23,x:23,y:0),panelIndex:'318e62b6-07fc-4ad3-809e-7107f424e203',title:ksdf_drop_bytes,type:visualization,version:'7.15.0')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:ksdf_packet_counter,viewMode:view)&show-time-filter=true"
}
const closeSwitchInfo = () => {
    showSwitchInfo.value = true;
}
const clickCategories = (checkedValue, beforeValue) => {
    // console.log(checkedValue); // nodeID 
    // console.log(nameToNum[checkedValue]); // nodeNumber
    for (const edgeId in elements.value) {
        var edge = elements.value[edgeId];
        if (edge.type == undefined) { //only edges
            if (edge.source == nameToNum[beforeValue] || edge.target == nameToNum[beforeValue]) {
                //edge to grey line
                if (displayAllEdgeInfo.value == false) {
                    edge.style = { stroke: 'grey', strokeWidth: 1 };
                    edge.animated = false;
                    delete edge.label;
                } else {
                    //updateEdgeDeletebyRxTx(edge)
                }
            }
            if (edge.source == nameToNum[checkedValue] || edge.target == nameToNum[checkedValue]) {
                //edge to colored line
                updateEdgeAddbyRxTx(edge);
            }
        }
    }
}
const openNodeInfo = () => {
    displayNodeInfo.value = true;
};
/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */
const { onPaneReady, onNodeDoubleClick, onEdgeClick, getEdge, fitView } = useVueFlow()
/**
 * Our elements
 */
// var elements = ref(initialElements)
var elements = ref([])
onPaneReady(({ fitView }) => {
    fitView()
})
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
        edge.style = { stroke: 'grey', strokeWidth: 1 };
        edge.animated = false;
        // edge.label = '';
        delete edge.label;
    } else {
        updateEdgeDeletebyRxTx(edge);
    }
}
const updateEdgeAddbyRxTx = (edge) => {
    console.log('edge id ' + edge.id)
    const srcNode = edge.id.split('-')[0].replace('e', ''); // 성연성연
    const dstNode = edge.id.split('-')[1];
    console.log('srcNode ' + srcNode + 'dstNode ' + dstNode)
    // console.log(getKeyByValue(nameToNum, Number(srcNode)))
    const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
    console.log('srcFullName' + srcFullname)
    const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
    console.log('dstName' + dstName)
    const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
    // console.log(dstPort, packetRate.value[srcFullname]);
    let sumTxBytes = 0;
    let sumRxBytes = 0;
    console.log('updateEdgeAddbyRxTx => ' + dstPort)
    console.log(dstPort)
    for (const port in dstPort) {
        console.log('RxTx Port' + port)
        // console.log(packetRate.value[srcFullname][dstPort[port].srcPort]);
        sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
        sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
    }
    // console.log(sumTxBytes, sumRxBytes, sumTxBytes + sumRxBytes);
    const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
    edge.style = { stroke: update.color, strokeWidth: 4 };
    edge.animated = true;
    edge.label = update.value;
    edge.labelBgPadding = [8, 4];
    edge.labelBgBorderRadius = 4;
    edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 0.5 };
}
const updateEdgeDeletebyRxTx = (edge) => {
    const srcNode = edge.id.charAt(1);
    const dstNode = edge.id.charAt(3);
    // console.log(getKeyByValue(nameToNum, Number(srcNode)))
    const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
    const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
    const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
    // console.log(dstPort, packetRate.value[srcFullname]);
    let sumTxBytes = 0;
    let sumRxBytes = 0;
    for (const port in dstPort) {
        // console.log(packetRate.value[srcFullname][dstPort[port].srcPort]);
        sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
        sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
    }
    // console.log(sumTxBytes, sumRxBytes, sumTxBytes + sumRxBytes);
    const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
    edge.style = { stroke: update.color, strokeWidth: 1 };
    edge.animated = true;
    // edge.label = '';
    delete edge.label;
    // console.log(edge);
}
const checkEdgeName = (sourceID, targetID) => {
    return sourceID > targetID ? "e" + String(sourceID) + "-" + String(targetID) : "e" + String(targetID) + "-" + String(sourceID);
}
const RxTx = () => {
    if (displayAllEdgeInfo.value == true) {
        clearInterval(timerId);
        displayAllEdgeInfo.value = false // 모든 선을 black으로 변경
        for (const edgeId in elements.value) {
            var edge = elements.value[edgeId];
            if (edge.type == undefined) {
                edge.style = { stroke: 'grey', strokeWidth: 1 };
                edge.animated = false;
                delete edge.label;
            }
        }
    } else {
        // initial call
        getRxTxRate()
        displayAllEdgeInfo.value = true // 모든 선을 rx+tx 값으로 변경
        for (const edgeId in elements.value) {
            var edge = elements.value[edgeId];
            if (edge.type == undefined) {
                const srcNode = edge.id.split('-')[0].replace('e', ''); // 성연성연!!
                const dstNode = edge.id.split('-')[1];
                const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
                const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
                const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
                // console.log(dstPort, packetRate.value[srcFullname]);
                let sumTxBytes = 0;
                let sumRxBytes = 0;
                for (const port in dstPort) {
                    // console.log(packetRate.value[srcFullname][dstPort[port].srcPort]);
                    sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
                    sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
                }
                // console.log(sumTxBytes, sumRxBytes, sumTxBytes + sumRxBytes);
                const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
                edge.style = { stroke: update.color, strokeWidth: 1 };
                edge.animated = true;
                if (edge.label != undefined) {
                    edge.style = { stroke: update.color, strokeWidth: 4 };
                    edge.label = update.value;
                    edge.labelBgPadding = [8, 4];
                    edge.labelBgBorderRadius = 4;
                    edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 0.5 };
                }
            }
        }
        // setInterval(function, milliseconds)
        timerId = setInterval((() => {
            //console.log('timer on')
            // 루프로 5초마다 get 요청 + 각 edge에 RxTx 합 색으로 표시 
            getRxTxRate()
            // console.log('setInterval check')
            // console.log(elements.value)
            for (const edgeId in elements.value) {
                var edge = elements.value[edgeId];
                if (edge.type == undefined) {
                    const srcid = edge.id;
                    // const srcNode = edge.id.charAt(1); //출발지 
                    // const dstNode = edge.id.charAt(3); //도착지
                    const srcNode = edge.id.split('-')[0].replace('e', ''); // 성연성연!!
                    const dstNode = edge.id.split('-')[1];
                    const srcFullname = nameToFullname[getKeyByValue(nameToNum, Number(srcNode))]; // edge의 출발 노드 (Fullname)
                    const dstName = getKeyByValue(nameToNum, Number(dstNode)); // edge의 도착 노드 (name)
                    const dstPort = edgePortInfo.value['n' + srcNode][dstName].value;
                    // console.log(dstPort, packetRate.value[srcFullname]);
                    let sumTxBytes = 0;
                    let sumRxBytes = 0;
                    for (const port in dstPort) {
                        // console.log(packetRate.value[srcFullname][dstPort[port].srcPort]);
                        sumTxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].TxBytes
                        sumRxBytes += packetRate.value[srcFullname][dstPort[port].srcPort].RxBytes
                    }
                    // console.log(sumTxBytes, sumRxBytes, sumTxBytes + sumRxBytes);
                    //링크 색상변경
                    const update = pickColorbyValue((sumTxBytes + sumRxBytes) * 8);
                    edge.style = { stroke: update.color, strokeWidth: 1 };
                    edge.animated = true;
                    if (edge.label != undefined) {
                        edge.style = { stroke: update.color, strokeWidth: 4 };
                        edge.label = update.value;
                        edge.labelBgPadding = [8, 4];
                        edge.labelBgBorderRadius = 4;
                        edge.labelBgStyle = { fill: update.color, color: '#fff', fillOpacity: 0.5 };
                    }
                }
            }
        }), 5000); // 5s
    }
    return
}
const getRxTxRate =
    async () => {
        await axios.get('http://192.168.15.129:8000/api/ksdf/packet_counter/per_tp').then((result) => {
            json.value = result.data;
            // console.log(json.value)
            packetRate.value = json.value["cur_pkt_rate"];
            console.log('cur_pkt_rate')
            console.log(packetRate.value);
        }).catch(error => {
            console.log(error);
        });
    }
const getAppServerRxTxDummy = () => {
    var dummydata = {
        "compute1.forwiz-os.com":
        {
            "eno1":
            {
                RxBytes: 0,
                TxBytes: 0
            },
            "eno2":
            {
                RxBytes: 0,
                TxBytes: 0
            }
        }
    }
    var merge = Object.assign({}, packetRate.value, dummydata);
    packetRate.value = merge
}
const getRxTxCounter =
    async () => {
        await axios.get('http://192.168.15.129:8000/api/ksdf/packet_counter/per_tp').then((result) => {
            json.value = result.data;
            packetCounter.value = json.value["cur_pkt_counter"]; // rate와 차이점은 json에 ports 파트 존재
            // console.log(packetCounter.value);
        }).catch(error => {
            console.log(error);
        });
    }
const RxValueBytesRate = (name, srcPort) => {
    const fullName = nameToFullname[name];
    // console.log(packetRate.value[fullName]);
    const ports = packetRate.value[fullName];
    // console.log("test : ", ports[srcPort]);
    if (ports[srcPort] == undefined) {
        return null;
    }
    const RxBytes = Number(ports[srcPort].RxBytes);
    const TxBytes = Number(ports[srcPort].TxBytes);
    // console.log(RxBytes, TxBytes);
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
    // console.log(value);
    return value
}
const RxValueBytesCounter = (name, srcPort) => {
    const fullName = nameToFullname[name];
    // console.log(packetCounter.value[fullName]);
    const ports = packetCounter.value[fullName]["ports"];
    // console.log("test : ", ports[srcPort]);
    if (ports[srcPort] == undefined) {
        return null;
    }
    const RxBytes = Number(ports[srcPort].RxBytes);
    const TxBytes = Number(ports[srcPort].TxBytes);
    // console.log(RxBytes, TxBytes);
    const value = TxBytes / (RxBytes + TxBytes) * 100;
    return value
}
const RxValuePacketsCounter = (name, srcPort) => {
    const fullName = nameToFullname[name];
    const ports = packetCounter.value[fullName]["ports"];
    if (ports[srcPort] == undefined) {
        return null;
    }
    const RxPackets = Number(ports[srcPort].RxPackets);
    const TxPackets = Number(ports[srcPort].TxPackets);
    const value = TxPackets / (RxPackets + TxPackets) * 100;
    // console.log(value);
    return value
}
const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}
onEdgeClick(({ edge }) => {
    if (edge.style.strokeWidth != 1) {
        if (displayAllEdgeInfo.value == false) {
            edge.style = { stroke: 'grey', strokeWidth: 1 };
            edge.animated = false;
            delete edge.label;
        } else {
            updateEdgeDeletebyRxTx(edge)
        }
    } else {
        // console.log(edge.id, edge.id.charAt(1), edge.id.charAt(3));
        updateEdgeAddbyRxTx(edge);
    }
})
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
//  ==================================================
const insertDummyData = (data) => {
    var appcount = 3
    var x_val = 500
    var y_val = 400
    var y_dist = 60
    var idnum = 10
    var servername = 'compute'
    var domainname = '.forwiz-os.com'
    var leaf1 = '4'
    var leaf2 = 5
    for (var i = 0; i < appcount; i++) {

        var position = {
            "x": x_val,
            "y": (y_val + (y_dist * (i + 1))),
        }
        var labelname = servername + (i + 1) + domainname
        var idvalue = idnum + i
        var flow = {
            "id": idvalue,
            "label": labelname,
            "position": position,
            "targetPosition": "left",
            "type": "output",
            "style": node_style,
        }
        console.log(flow)
        nameToNum[labelname] = idvalue
        data.push(flow)
    }
    var linkcount = 3
    var link_style = {
        'stroke': 'grey',
        'strokeWidth': 1
    }
    for (var i = 0; i < linkcount; i++) {
        var target = (idnum + i)
        var link = {
            'id': 'e' + leaf1 + '-' + target,
            'source': String(leaf1),
            'target': String(target),
            'style': link_style
        }
        data.push(link)
    }
    for (var i = 0; i < linkcount; i++) {
        var target = (idnum + i)
        var link = {
            'id': 'e' + leaf2 + '-' + target,
            'source': String(leaf2),
            'target': String(target),
            'style': link_style
        }
        data.push(link)
    }
}
const node_dummy_add = (nodeList) => {
    var servername = 'compute'
    var domainname = '.forwiz-os.com'
    var count = 3
    for (var i = 0; i < count; i++) {
        var name = servername + (i + 1) + domainname
        nodeList.push({ 'name': name, 'key': 'A' })
    }

}
const dummyEdgePortInsert = (port) => {
    //console.log('dummyEdgePortInsert')
    //console.log(port['n4'])
    //leaf에서 app서버
    var leaf1 = 'n4'
    var leaf2 = 'n5'
    var computeNm1 = 'compute1.forwiz-os.com'
    var computeNm2 = 'compute2.forwiz-os.com'
    var computeNm3 = 'compute3.forwiz-os.com'
    var srcPortNm = 'sw1p25s1'
    var dstPortNm = 'eno1'
    var srcPort_app1 = 'sw1p31s2' //app1
    var srcPort_app2 = 'sw1p31s3' //??
    var srcPort_app3 = 'sw1p31s4' //??
    //망할 자바스크립트에는 객체 복사가 없니? 
    var edge_leaf1_app1 = 'e4-10'
    var comobj_leaf1_10 = {
        'edge': edge_leaf1_app1,
        'name': computeNm1,
        'showList': false,
        'value': [{ 'dstPort': dstPortNm, 'edge': edge_leaf1_app1, 'show': false, 'srcPort': srcPort_app1 }]
    }
    var edge_leaf2_app1 = 'e5-10'
    var comobj_leaf2_10 = {
        'edge': edge_leaf2_app1,
        'name': computeNm1,
        'showList': false,
        'value': [{ 'dstPort': dstPortNm, 'edge': edge_leaf2_app1, 'show': false, 'srcPort': srcPort_app1 }]
    }
    var edge_leaf1_app2 = 'e4-11'
    var comobj_leaf1_11 = {
        'edge': edge_leaf1_app2,
        'name': computeNm2,
        'showList': false,
        'value': [{ 'dstPort': dstPortNm, 'edge': edge_leaf1_app2, 'show': false, 'srcPort': srcPort_app2 }]
    }
    var edge_leaf2_app2 = 'e5_11'
    var comobj_leaf2_11 = {
        'edge': edge_leaf2_app2,
        'name': computeNm2,
        'showList': false,
        'value': [{ 'dstPort': dstPortNm, 'edge': edge_leaf2_app2, 'show': false, 'srcPort': srcPort_app2 }]
    }
    var edge_leaf1_app3 = 'e4_12'
    var comobj_leaf1_12 = {
        'edge': edge_leaf1_app3,
        'name': computeNm3,
        'showList': false,
        'value': [{ 'dstPort': dstPortNm, 'edge': edge_leaf1_app3, 'show': false, 'srcPort': srcPort_app3 }]
    }
    var edge_leaf2_app3 = 'e5_12'
    var comobj_leaf2_12 = {
        'edge': edge_leaf2_app3,
        'name': computeNm3,
        'showList': false,
        'value': [{ 'dstPort': dstPortNm, 'edge': edge_leaf2_app3, 'show': false, 'srcPort': srcPort_app3 }]
    }
    port[leaf1][computeNm1] = comobj_leaf1_10
    port[leaf2][computeNm1] = comobj_leaf2_10
    port[leaf1][computeNm2] = comobj_leaf1_11
    port[leaf2][computeNm2] = comobj_leaf2_11
    port[leaf1][computeNm3] = comobj_leaf1_12
    port[leaf2][computeNm3] = comobj_leaf2_12
    var leaf1_name = 'leaf-1'
    var comobj_app1_leaf1 = {
        'edge': edge_leaf1_app1,
        'name': leaf1_name,
        'showList': false,
        'value': [{ 'dstPort': srcPort_app1, 'edge': edge_leaf1_app1, 'show': false, 'srcPort': dstPortNm }]
    }
    var leaf2_name = 'leaf-2'
    var comobj_app1_leaf2 = {
        'edge': edge_leaf2_app1,
        'name': leaf2_name,
        'showList': false,
        'value': [{ 'dstPort': srcPort_app1, 'edge': edge_leaf2_app1, 'show': false, 'srcPort': dstPortNm }]
    }
    var comobj_app2_leaf1 = {
        'edge': edge_leaf1_app2,
        'name': leaf1_name,
        'showList': false,
        'value': [{ 'dstPort': srcPort_app2, 'edge': edge_leaf1_app2, 'show': false, 'srcPort': dstPortNm }]
    }
    var comobj_app2_leaf2 = {
        'edge': edge_leaf2_app2,
        'name': leaf2_name,
        'showList': false,
        'value': [{ 'dstPort': srcPort_app2, 'edge': edge_leaf2_app2, 'show': false, 'srcPort': dstPortNm }]
    }
    var comobj_app3_leaf1 = {
        'edge': edge_leaf1_app3,
        'name': leaf1_name,
        'showList': false,
        'value': [{ 'dstPort': srcPort_app3, 'edge': edge_leaf1_app3, 'show': false, 'srcPort': dstPortNm }]
    }
    var comobj_app3_leaf2 = {
        'edge': edge_leaf2_app3,
        'name': leaf2_name,
        'showList': false,
        'value': [{ 'dstPort': srcPort_app3, 'edge': edge_leaf2_app3, 'show': false, 'srcPort': dstPortNm }]
    }
    var com1 = 'n10'
    var com2 = 'n11'
    var com3 = 'n12'
    port = Object.assign({}, port, { 'n10': { 'leaf1': {}, 'leaf2': {} } });
    port = Object.assign({}, port, { 'n11': { 'leaf1': {}, 'leaf2': {} } });
    port = Object.assign({}, port, { 'n12': { 'leaf1': {}, 'leaf2': {} } });
    console.log('dummyEdgePort')
    console.log(port)
    port[com1]['leaf1'] = comobj_app1_leaf1
    port[com1]['leaf2'] = comobj_app1_leaf2
    port[com2]['leaf1'] = comobj_app2_leaf1
    port[com2]['leaf2'] = comobj_app2_leaf2
    port[com3]['leaf1'] = comobj_app3_leaf1
    port[com3]['leaf2'] = comobj_app3_leaf2
    //appServer에서 lefa로
}
onMounted(async () => {
    contentBarName.value = 'Kaloom Topology'
    await axios.get('http://192.168.15.129:8000/api/ksdf/topology/node_link').then((result) => {
        json.value = result.data;
        // node info
        nodeList.value = json.value["node_dict"];

        var nodeListObject = Object.entries(nodeList._rawValue).map(([key, value]) => ({ key, value }));
        nodeListObject.sort(function (a, b) {
            if (String(Object.values(a)[1][0]) > String(Object.values(b)[1][0])) {
                return 1
            } else if (String(Object.values(a)[1][0]) < String(Object.values(b)[1][0])) {
                return -1
            }
            return 0;
        });
        var sorting = {}
        for (const id in nodeListObject) {
            const node_key = nodeListObject[id]["key"];
            const node_value = nodeListObject[id]["value"]
            sorting[node_key] = node_value
            nameToFullname[nodeListObject[id].value[0]] = nodeListObject[id].key;
        }
        // console.log(nameToFullname);
        // nodeList.value = nodeListObject;
        nodeList.value = new Proxy(sorting, {});
        linkList.value = json.value["link_dict"];
        // fabric link info
        fabricLinkList.value = linkList.value["fabric_link"];
        // console.log(nodeList.value, fabricLinkList.value);
        // data 형태 형성 => Role에 따라 y 값 다르게 , 현재 총 9개 박스 그려야 함
        // [
        //     { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 }, class: 'light' },
        //     ...
        // ]
        let spineCount = 0;
        let leafCount = 0;
        let controllerCount = 0;
        let y = ref(0);
        let x = ref(0);
        let idNumber = 1;
        //카테고리 더미값 입력
        node_dummy_add(categories.value)
        for (const id in nodeList.value) {
            let node = nodeList.value[id]
            categories.value.push({ 'name': node[0], 'key': 'A' })
            // const selectedCategory = ref(categories.value[0].name);
            if (node[1] == "LEAF") {
                x.value = 100 + leafCount * 200;
                leafCount += 1;
                y.value = 250;
                var position = {
                    "x": x.value,
                    "y": y.value,
                }
                var flow = {
                    "id": idNumber,
                    "label": node[0],
                    "position": position,
                    "style": leaf_style
                }
            } else if (node[1] == "CONTROLLER") {
                x.value = 200;
                y.value = 400 + controllerCount * 50;
                controllerCount += 1;
                var position = {
                    "x": x.value,
                    "y": y.value,
                }
                var flow = {
                    "id": idNumber,
                    "type": "output",
                    "label": node[0],
                    "position": position,
                    "class": "light",
                    "style": controller_style,
                    "targetPosition": "left",
                }
            } else {
                x.value = 300 + spineCount * 200;
                spineCount += 1;
                y.value = 5;
                var position = {
                    "x": x.value,
                    "y": y.value,
                }
                var flow = {
                    "id": idNumber,
                    "type": 'input',
                    "label": node[0],
                    "position": position,
                    "style": spine_style,
                }
            }
            flowData[idNumber] = flow;
            nameToNum[node[0]] = idNumber
            // console.log(flowData, nameToNum);
            idNumber += 1;
        }
        var port = {};
        // console.log(nameToNum);
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
                    // "type": "output",
                    "source": String(sourceID),
                    "target": String(targetID),
                    "style": { stroke: 'grey', strokeWidth: 1 }
                    // "animated": true,
                    // "class": 'normal-edge',
                }
                if (Object.keys(flowData).find(key => flowData[key].id === linkID) == undefined) {
                    // console.log(Object.keys(flowData).find(key => flowData[key].id === linkID));
                    flowData[idNumber] = flow;
                    idNumber += 1;
                }
            }
            if (port[NodeID] == undefined) {
                port[NodeID] = {}
                // console.log('port', typeof (port))
            }
            if (port[NodeID][linkinfo["dst"][0]] == undefined) {
                // console.log(port[NodeID][linkinfo["dst"][0]]);
                // port[NodeID].push([linkinfo["dst"][0]]);
                port[NodeID][linkinfo["dst"][0]] = {};
                port[NodeID][linkinfo["dst"][0]].name = linkinfo["dst"][0]
                port[NodeID][linkinfo["dst"][0]].value = [];
                port[NodeID][linkinfo["dst"][0]].edge = checkEdgeName(sourceID, targetID);
                port[NodeID][linkinfo["dst"][0]].showList = false;
            }
            // console.log('port', port);
            // console.log('NodeID : ', NodeID, '| port', port[NodeID], linkinfo["dst"][0]);
            // console.log(port[NodeID][linkinfo["dst"][0]])
            port[NodeID][linkinfo["dst"][0]].value.push({ "srcPort": linkinfo["src"][1], "dstPort": linkinfo["dst"][1], "show": false, "edge": checkEdgeName(sourceID, targetID) })

        }
        // edgePortInfo = port;
        //dummy data input 더미 데이터 입니다.
        dummyEdgePortInsert(port)
        edgePortInfo.value = new Proxy(port, {});
        // console.log(edgePortInfo);
        // console.log(nodeList);
        getRxTxRate();
        loading.value = true;
    }).catch(error => {
        console.log(error);
    });
    insertDummyData(flowData) //dummy data input
    elements.value = flowData;
    console.log(flowData)
    fitView();
});
</script>

<template>
    <div class="min-h-screen flex relative lg:static surface-ground">
        <div class="min-h-screen flex flex-column relative flex-auto">
            <div class="p-5 flex flex-column flex-auto">
                <div class="border-2 border-dashed surface-border border-round surface-section flex-auto">
                    <div style="height: 100%" class="border-round-md">
                        <Skeleton v-if="!loading" class="mr-2 h-full" />
                        <VueFlow v-else v-model="elements" class="basicflow" :default-zoom="1.5" :min-zoom="1" :max-zoom="2"
                            :nodes-draggable="false" :elevate-edges-on-select="true">
                            <!-- <Background gap="50" pattern-color="#aaa" bg-color="rgba(60, 179, 113, 0.1)" variant="lines" /> -->
                            <Background gap="50" bg-color="rgba(255, 255, 255, 0.1)" variant="lines" />
                            <MiniMap />
                            <Controls />
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
                                    class="list-none">
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
                                    <template v-for="list in  nodeEdgePortInfo.value">
                                        <li v-if="nodeEdgePortInfo.showList == true"
                                            class="py-3 border-bottom-1 surface-border md-3">
                                            <div class="flex justify-content-between align-content-center">
                                                <!-- {{ nodeEdgePortInfo }}, {{ Object.values(list) }} -->
                                                <div class="flex m-2">출발지 포트 : {{ list.srcPort }}</div>
                                                <div class="flex m-2">도착지 포트 : {{ list.dstPort }}</div>
                                                <!-- <div v-if="list.show !== true">
                                                    <Button class="pi pi-eye p-button-success mr-2" @click="showEdgeRoute(list)" />
                                                  </div>
                                                  <div v-else>
                                                    <Button class="pi pi-times p-button-danger mr-2 " @click="deleteEdgeRoute(list)" />
                                                  </div> -->
                                            </div>
                                            <!-- {{ displayNodeInfoName }}, {{ nodeEdgePortInfo.name }}, {{ list.srcPort }} <br>
                                                  {{ nameToFullname[nodeEdgePortInfo.name] }} <br>
                                                  {{ packetRate[nameToFullname[nodeEdgePortInfo.name]] }} <br> -->
                                            <div
                                                v-if="packetRate[nameToFullname[displayNodeInfoName]][list.srcPort] != undefined">

                                                <ul class="text-500 text-xs">
                                                    <li
                                                        v-for="dataValue, dataIndex in packetRate[nameToFullname[displayNodeInfoName]][list.srcPort]">
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
                                                    <!-- 기준 시간 : {{
                                                          new
                                                            Date(Number(packetRate[nameToFullname[nodeEdgePortInfo.name]][list.srcPort].Timestamp)
                                                              * 1e-6)
                                                      }} -->
                                                </div>
                                            </div>
                                        </li>
                                    </template>
                                </ul>
                            </Dialog>
                            <div class="controls">
                                <button style="background-color: #113285; color: white" @click="RxTx">실시간 패킷 레이트
                                    (5초)</button>
                            </div>
                        </VueFlow>
                        <div class="bg-cyan-50 p-4 font-bold border-round">
                            <div>Check list</div>
                            <div v-for="category of categories" :key="category.key" class="field-radiobutton">
                                <RadioButton :inputId="category.key" name="category" :value="category.name"
                                    v-model="categoryChecked" @click="clickCategories(category.name, categoryChecked)"
                                    :disabled="category.key === 'R'" />
                                <label :for="category.key">{{ category.name }}</label>
                            </div>
                        </div>
                    </div>
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

.p-progressbar {
    background: #f0b4b4;
}
</style>

<style lang="scss" scoped>
::v-deep(.p-progressbar) {
    .p-progressbar-value {
        background: #a7d99a;
    }
}
</style>   