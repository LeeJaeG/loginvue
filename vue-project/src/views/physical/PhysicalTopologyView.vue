<script setup>
// import mockNodeData from "@/mock/physicalNode.json"
// import mockEdgeData from "@/mock/physicalEdge.json"
// import PopUpView from '@/components/DeviceaddpopComponent.vue'
import baremetalNode from '@/components/vueFlowComponents/baremetalNode.vue'
import physicalGroupNode from '@/components/vueFlowComponents/physicalGroupNode.vue'
import liveDeviceMetric from "@/mock/liveDeviceMetric.json"
import { usePathStore } from '@/stores/path'
import { useUserStore } from '@/stores/user'
import { Background } from '@vue-flow/additional-components'
import { useVueFlow, VueFlow } from '@vue-flow/core'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { useConfirm } from "primevue/useconfirm"
import { markRaw, onMounted, ref, watch } from 'vue'

const vueFlow = ref()
const loading = ref(false)
const httpWorking = ref(false)
const path = usePathStore();
const user = useUserStore();
const { contentBarName } = storeToRefs(path);
// const { userdata } = storeToRefs(user);

const { onPaneReady, findEdge, fitView, zoomIn, zoomOut } = useVueFlow()

const nodeTypes = {
    baremetal: markRaw(baremetalNode),
    group: markRaw(physicalGroupNode),
}

onPaneReady(({ fitView }) => {
    fitView()
})

onMounted(() => {
    contentBarName.value = 'Physical Topology'
    // console.log(userdata.value, info.value)
    getVueFlowForKaloom(0)
})

const nodeTableForGroup = ref({})
const groupCategories = ref([{ 'name': 'All', 'key': 'A' }]);
const nodeCategories = ref([{ 'name': 'All', 'key': 'A' }]);
const interfaceCategories = ref([{ 'name': 'All', 'key': 'A' }]);
const groupCategoryChecked = ref('A')
const interfaceCategoryChecked = ref('All')
const nodeCategoryChecked = ref('All')
const originEdgeData = ref()
const originNodeData = ref()
const originInterfaceData = ref()
const getVueFlowForKaloom = (async (retry, ...theArgs) => {
    console.log("getKaloomTopology")
    try {
        const response = await axios.get('/api/physical_topology/topology')
        vueFlow.value = []
        const mockEdgeData = response.data.front_edge_list
        const mockNodeData = response.data.front_node_list
        originInterfaceData.value = response.data.interfaces
        originEdgeData.value = mockEdgeData
        originNodeData.value = mockNodeData

        // group 별 toggle list 만들기 (그룹을 제외한 다른 노드와 엣지를 안 보이게 하는 용도)
        for (const item of mockNodeData) {
            if (item.label && item.type == 'group') {
                const interfaceValue = {
                    "name": item.label,
                    "key": item.id
                };
                const isDuplicate = groupCategories.value.some((existingValue) => {
                    return existingValue.name === interfaceValue.name;
                });
                if (!isDuplicate) {
                    groupCategories.value.push(interfaceValue);
                    nodeTableForGroup.value[item.id] = [];
                }
            }
        }

        // node 별 toggle list 만들기
        for (const item of mockNodeData) {
            // group 별 node list 만들기
            if (item.parentNode && item.type != 'group') {
                nodeTableForGroup.value[item.parentNode].push(item.id)
            }
            if (item.label && item.type != 'group') {
                const interfaceValue = {
                    "name": item.label,
                    "key": item.id,
                    "parent": item.parentNode,
                    "interfaces": item.data.interfaceGroup
                };
                const isDuplicate = nodeCategories.value.some((existingValue) => {
                    return existingValue.name === interfaceValue.name;
                });
                if (!isDuplicate) {
                    nodeCategories.value.push(interfaceValue);
                }
            }
        }

        // 인터페이스 그룹 toggle list 만들기
        for (const item of mockEdgeData) {
            if (item.data && item.data.interface) {
                const interfaceValue = {
                    "name": item.data.interface,
                    "key": "A"
                };
                const isDuplicate = interfaceCategories.value.some((existingValue) => {
                    return existingValue.name === interfaceValue.name;
                });
                if (!isDuplicate) {
                    interfaceCategories.value.push(interfaceValue);
                }
            }
        }

        vueFlow.value.push(...originNodeData.value);
        vueFlow.value.push(...originEdgeData.value);
        // console.log(JSON.stringify(vueFlow.value))
        vueFlow.value.forEach((e) => (e.data.watched = 0))

        // inject live Device Metric data to vueFlow data inside 'data' key 
        for (const deviceMetric in liveDeviceMetric[0]) {
            // Found deviceMetric in VueFlow 
            const foundDeviceMetric = vueFlow.value.find((e) => e.id == deviceMetric);
            if (foundDeviceMetric) {
                foundDeviceMetric.data = {
                    ...foundDeviceMetric.data,
                    ...liveDeviceMetric[0][deviceMetric]
                }
            }
        }
        liveDeviceMetric
        loading.value = true;
    } catch (error) {
        console.log(error)
        if (retry <= 2) {
            user.tokenErrorHandler(error, getVueFlowForKaloom, retry, theArgs);
        }
    }
})

const clickGroupCategories = (checkedValue, previousValue) => {
    if (checkedValue == previousValue) {
        return
    }
    // vueFlow.value.forEach((e) => {
    //     // console.log(e)
    //     if (e.data.type != 'edge') {
    //         e.data.watched = 0
    //         e.hidden = false
    //     }
    // })
    if (checkedValue != 'A') {
        fitView({
            nodes: [checkedValue],
        })
    } else {
        fitView()
    }
    // if (nodeTableForGroup.value[checkedValue]) {
    //     for (let i = 0; i < vueFlow.value.length; i++) {
    //         if (!Object.values(nodeTableForGroup.value[checkedValue]).map(String).includes(vueFlow.value[i].id)) {
    //             if (vueFlow.value[i].type == 'baremetal') {
    //                 vueFlow.value[i].hidden = 'true';
    //                 vueFlow.value[i].data.watched += 1;
    //             }
    //         }
    //     }
    // }
}

const clickNodeCategories = (checkedValue, beforeValue) => {
    if (checkedValue == beforeValue) {
        return
    }
    for (const nodeObject of originNodeData.value) {
        if (nodeObject.data.interfaceGroup != null && nodeObject.label == beforeValue && checkedValue != beforeValue) {
            for (const nodeInterface of nodeObject.data.interfaceGroup) {
                const tempEdge = findEdge(nodeInterface)
                if (tempEdge.data.watched > 1) {
                    tempEdge.data.watched -= 1
                } else {
                    tempEdge.animated = false
                    tempEdge.style = { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' }
                    tempEdge.data.watched -= 1
                }
            }
        }
        else if (nodeObject.data.interfaceGroup != null && nodeObject.label == checkedValue) {
            for (const nodeInterface of nodeObject.data.interfaceGroup) {
                const tempEdge = findEdge(nodeInterface)
                tempEdge.animated = true;
                tempEdge.style = { stroke: 'grey', strokeWidth: 5, 'stroke-dasharray': '5,5' };
                tempEdge.data.watched += 1
            }
        }
    }
}

const clickInterfaceCategories = (checkedValue, beforeValue) => {
    if (checkedValue == beforeValue) {
        return
    }
    for (const edgeObject of originEdgeData.value) {
        if (edgeObject.data.interface && edgeObject.data.interface == beforeValue) {
            const tempEdge = findEdge(edgeObject.id)
            if (tempEdge.data.watched > 1) {
                tempEdge.data.watched -= 1
            } else {
                tempEdge.animated = false
                tempEdge.style = { stroke: 'grey', strokeWidth: 1, 'stroke-dasharray': '5,5' }
                tempEdge.data.watched -= 1
            }
        }
        else if (edgeObject.data.interface && edgeObject.data.interface == checkedValue) {
            const tempEdge = findEdge(edgeObject.id)
            tempEdge.style = { stroke: 'grey', strokeWidth: 5, 'stroke-dasharray': '5,5' };
            tempEdge.animated = true;
            tempEdge.data.watched += 1
        }
    }
    return
}

const selectedGroupInNavbar = ref(null)
const selectedNodeInNavbar = ref(null)
const selectedInterfaceInNavbar = ref(null)
const isOpen = ref({
    group: false,
    node: false,
})

const groupSelect = (group) => {
    selectedGroupInNavbar.value = group
    selectedNodeInNavbar.value = null
    selectedInterfaceInNavbar.value = null
    isOpen.value["group"] = true
    isOpen.value["node"] = false
}

const nodeSelect = (node) => {
    selectedNodeInNavbar.value = node
    selectedInterfaceInNavbar.value = null
    isOpen.value["node"] = true
}

const treeToggle = (open) => {
    if (open == 'group') {
        if (selectedGroupInNavbar.value != null) {
            isOpen.value[open] = !isOpen.value[open]
        }
    } else if (open == 'node') {
        if (selectedNodeInNavbar.value != null) {
            isOpen.value[open] = !isOpen.value[open]
        }
    }
}



// 버튼 클릭 시 Device List 팝업 및 데이터 저장,표시
const popList = ref(false);
const zabbixdevice = ref([]);
const DBdevice = ref([]);
const expandedRowGroupsList = ref();

//// Lookup Maps 생성 (id <-> 항목 명 변환 map)
const generateLookupMap = (dataArray) => {
    const lookupMap = new Map();
    Array.from(dataArray).forEach(item => {
        lookupMap.set(item._id, item.group);
    });
    return lookupMap;
};

const generateLookupMapType = (dataArray) => {
    const lookupMap = new Map();
    Array.from(dataArray).forEach(item => {
        lookupMap.set(item._id, item.type)
    });
    return lookupMap;
};

const generateLookupMapRole = (dataArray) => {
    const lookupMap = new Map();
    Array.from(dataArray).forEach(item => {
        lookupMap.set(item._id, item.role)
    });
    return lookupMap;
};

const generateLookupMapIG = (dataArray) => {
    const lookupMap = new Map();
    Array.from(dataArray).forEach(item => {
        lookupMap.set(item._id, item.interfacegroup)
    });
    return lookupMap;
}

const groupnameIDConvertMap = ref(new Map());

const openPopup = async () => {
    const db_group_id = await axios.get('/api/physical_layer/device_groups');
    groupnameIDConvertMap.value = generateLookupMap(db_group_id.data);
    popList.value = true;
    try {
        const getZabbixdevice = await axios.get('/test/zabbix-metric/zabbixmetric_inquiry');
        const zabbixdevicedata = getZabbixdevice.data;

        const getDBdevice = await axios.get('/api/physical_layer/devices');
        const DBdevicedata = getDBdevice.data;

        // Extract the deviceName values from the response and create a new array
        zabbixdevice.value = zabbixdevicedata.map(item => ({ deviceName: item.deviceName, interfaces: item.interfaces, deviceID: item.deviceID }));
        DBdevice.value = DBdevicedata.map(item => ({ deviceName: item.deviceName, deviceGroup: groupnameIDConvertMap.value.get(item.deviceGroupId), deviceID: item._id }))

        console.log(DBdevice);
    } catch (error) {
        console.error('Cannot get zabbix device list', error);
    }
};

const closePopAdd = async () => {
    popAdd.value = false;
};

// Device List의 Add 버튼 클릭 시 팝업 및 데이터 저장,표시
const popAdd = ref(false);
const rowDeviceName = ref("");
const rowDeviceInterfaces = ref([]);
const rowDeviceZID = ref("");

//// Dropdown 옵션
const Groups = ref([]);
const Roles = ref([]);
const Types = ref([]);
// const Locations = ref([]);
const IGroups = ref([]);

//// Dropdown v-model 및 입력 데이터 (Device)
const selectedGroup = ref();
const selectedRole = ref();
const selectedType = ref();
// const selectedLocation = ref();
const selectedMonitorType = ref("Zabbix");
const selectedinterfaceGroup = ref([]);
const selectedstatus = ref(null);
const selectedtier = ref(null);

//// Dropdown v-model 및 입력 데이터 (Interface)
const selectedDeviceInterface = ref([]);
const macAddress = ref([]);
const subNet = ref([]);
const bandWidth = ref([]);
const PrimaryIP = ref([]);
const SecondaryIP = ref([]);
watch(rowDeviceInterfaces, (newRowDeviceInterfaces) => {
    SecondaryIP.value = new Array(newRowDeviceInterfaces.length).fill('none');
});
const interfaceStatus = ref([]);

const openPopAdd = async (deviceName, deviceInterfaces, deviceID) => {
    rowDeviceName.value = deviceName;
    rowDeviceInterfaces.value = deviceInterfaces;
    rowDeviceZID.value = deviceID;
    popAdd.value = true;

    const dgroup = await axios.get('/api/physical_layer/device_groups');
    Groups.value = dgroup.data.map(item => ({ id: item._id, name: item.group }));

    const droles = await axios.get('/api/physical_layer/device_roles');
    Roles.value = droles.data.map(item => ({ id: item._id, role: item.role }));

    const dtypes = await axios.get('/api/physical_layer/device_types');
    Types.value = dtypes.data.map(item => ({ id: item._id, type: item.type }))

    // const dlocations = await axios.get('/api/physical_layer/locations')
    // Locations.value = dlocations.data.map(item => ({ id: item._id, locationName: item.locationName }))

    const digroups = await axios.get('/api/physical_layer/interface_groups')
    IGroups.value = digroups.data.map(item => ({ id: item._id, interfacegroup: item.interfacegroup }))

};

//// Submit 버튼 클릭
const submitAddClicked = async () => {
    const devicepostData = {
        deviceName: rowDeviceName.value,
        status: selectedstatus.value,
        deviceTypeId: (selectedType.value['id']),
        deviceGroupId: (selectedGroup.value['id']),
        deviceRoleId: (selectedRole.value['id']),
        // locationId: (selectedLocation.value['id']),
        activeMonitorType: selectedMonitorType.value,
        zabbixHostId: rowDeviceZID.value,
        tier: selectedtier.value
    };
    await axios.post('/api/physical_layer/devices', devicepostData)
        .then(() => {
            window.alert("Device DB 등록 완료")
        }).catch(
            (err) => {
                window.alert(err + "Device DB 등록 실패")
            }
        );
    const temp_deviceinfo = await axios.get('/api/physical_layer/devices/devicename/' + rowDeviceName.value);

    // console.log(temp_deviceinfo.data._id)
    // console.log(selectedinterfaceGroup.value)

    for (let index = 0; index < rowDeviceInterfaces.value.length; index++) {
        const interfacepostData = {
            interfaceName: selectedDeviceInterface.value[index],
            zabbixInterfaceName: rowDeviceInterfaces.value[index],
            macaddress: macAddress.value[index],
            subnet: subNet.value[index],
            bandwidth: bandWidth.value[index],
            primaryIP: PrimaryIP.value[index],
            secondaryIP: SecondaryIP.value[index],
            deviceId: temp_deviceinfo.data._id,
            interfacegroupid: selectedinterfaceGroup.value[index].id,
            status: interfaceStatus.value[index]
        };
        console.log(interfacepostData);
        await axios.post('/api/physical_layer/interfaces', interfacepostData)
            .then(() => {
                console.log((index + 1) + "번째 인터페이스 DB 등록 완료")
            }).catch(
                (err) => {
                    window.alert(err + "인터페이스 DB 등록 실패")
                }
            );
    }

    popList.value = false;
    popAdd.value = false;
};


// Device list Attach 버튼 클릭 시 팝업 및 데이터 표시 및 저장
const popAttach = ref(false);
const rowDeviceInterfacesAttach = ref([]); //자빅스, zabbixdevice 중 rowdata 중 interfaceName
const selectedInterfaceAttach = ref(); //자빅스, 좌측 zabbix Device Name 테이블 중 선택한 row
const expandedRowGroupsAttach = ref(); //ECHOE device 그룹 확장/축소
const selectedECHOEdeviceAttach = ref(); //중앙 ECHOE Device Name 테이블 중 선택한 row
const Related_Interfaces = ref([]); // 선택한 중앙 ECHOE device가 가지고 있는 Interface 리스트
const selectedECHOEInterfaceAttach = ref(); //우측 ECHOE Device Interface 중 선택한 row



const openAttach = async (deviceInterfaces) => {
    popAttach.value = true;
    rowDeviceInterfacesAttach.value = deviceInterfaces.map(interfaceName => {
        return {
            'interfaceName': interfaceName
        };
    });
};

//// 중앙 ECHOE device 클릭(선택)
const handleRowClick = async (rowData) => {
    console.log(rowData);
    console.log(rowData.data.deviceID);
    try {
        const get_Related_Interfaces = await axios.get('/api/physical_layer/interfaces/device_id/' + rowData.data.deviceID);
        console.log("인터페이스 정보 조회 성공");
        console.log("인터페이스 데이터", get_Related_Interfaces)
        Related_Interfaces.value = get_Related_Interfaces.data
        console.log("인터페이스 데이터 저장용 변수", Related_Interfaces.value)
    } catch (error) {
        window.alert(error + ' 인터페이스 정보 조회 실패')
    }
};

//// Attach 버튼 클릭
const AttachClicked = async () => {
    try {
        // console.log(selectedECHOEInterfaceAttach.value)
        // console.log(selectedInterfaceAttach.value)
        const zabbixName = selectedInterfaceAttach.value.interfaceName;
        const postData = selectedECHOEInterfaceAttach;
        const interface_ID = postData.value._id;
        // console.log(interface_ID)
        postData.value.zabbixInterfaceName = zabbixName
        delete postData.value._id;
        console.log(postData);
        await axios.put('/api/physical_layer/interfaces/' + interface_ID, postData.value);
        window.alert('인터페이스 연동 성공');
    } catch (error) {
        window.alert(error + ' 인터페이스 연동 실패');
    }
};

// Attribute manager 버튼 클릭 시 세부 mode 선택 창 및 데이터 표시,저장
const popAttManager = ref(false);
const att_deviceGroups = ref([]);
const att_deviceTypes = ref([]);
const att_deviceRoles = ref([]);
const att_deviceLocations = ref([]);
const att_interfaceGroups = ref([]);
const att_devices = ref([]);
const att_interfaces = ref([]);
const activeButton_Manages = ref(null);
const activeButton_Attributes = ref(null);

const att_groupNameIDconvertMap = ref(new Map());
const att_TypeIDconvertMap = ref(new Map());
const att_RoleIDconvertMap = ref(new Map());
const att_interfaceGroupIDconvertMap = ref(new Map());

const att_deviceGroupOptions = ref([]);
const att_deviceTypeOptions = ref([]);
const att_deviceRoleOptions = ref([]);

// const att_InterfaceGroupOptions = ref([]);


const openAttManager = async () => {
    popAttManager.value = true;
    try {
        const get_deviceGroups = await axios.get('/api/physical_layer/device_groups');
        att_groupNameIDconvertMap.value = generateLookupMap(get_deviceGroups.data);
        att_deviceGroups.value = get_deviceGroups.data;
        att_deviceGroupOptions.value = att_deviceGroups.value.map(deviceGroup => deviceGroup.group);

        const get_deviceTypes = await axios.get('/api/physical_layer/device_types');
        att_TypeIDconvertMap.value = generateLookupMapType(get_deviceTypes.data);
        att_deviceTypes.value = get_deviceTypes.data;
        att_deviceTypeOptions.value = att_deviceTypes.value.map(deviceType => deviceType.type);

        const get_deviceRoles = await axios.get('/api/physical_layer/device_roles');
        att_RoleIDconvertMap.value = generateLookupMapRole(get_deviceRoles.data);
        att_deviceRoles.value = get_deviceRoles.data;
        att_deviceRoleOptions.value = att_deviceRoles.value.map(deviceRole => deviceRole.role);

        const get_deviceLocations = await axios.get('/api/physical_layer/locations');
        att_deviceLocations.value = get_deviceLocations.data;

        const get_interfaceGroups = await axios.get('/api/physical_layer/interface_groups');
        att_interfaceGroupIDconvertMap.value = generateLookupMapIG(get_interfaceGroups.data);
        att_interfaceGroups.value = get_interfaceGroups.data;

        const get_devices = await axios.get('/api/physical_layer/devices');
        att_devices.value = get_devices.data;

        const get_interfaces = await axios.get('/api/physical_layer/interfaces');
        att_interfaces.value = get_interfaces.data;

        // console.log(att_deviceGroups);
        // console.log(att_deviceTypes);
        // console.log(att_deviceRoles);
        // console.log(att_groupNameIDconvertMap);
        // console.log(att_TypeIDconvertMap);
        // console.log(att_RoleIDconvertMap);
        // console.log(att_interfaceGroupIDconvertMap);
    } catch (error) {
        console.log(error + ' 정보 취득 실패');
    }
};

//// Attirbute or Member 선택
const selectedButton = ref(null);
const setPage = async (Button) => {
    selectedButton.value = Button
    if (Button === 'Member') {
        selectedAttribute.value = null
    }
    else if (Button === 'Attribute') {
        selectedTarget.value = null
    }
};

//// 하위 Attribute 선택
const selectedAttribute = ref(null);
const setAttribute = async (Button) => {
    selectedAttribute.value = Button
};

////// Device Group Manage 관련
const confirm_g = useConfirm();
const confirm_groupdelete = (groupID) => {
    confirm_g.require({
        message: 'Do you REALLY want to delete this Group?',
        icon: 'pi pi-info-circle',
        header: 'Delete Confirmation',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await axios.delete('/api/physical_layer/device_groups/' + groupID);
                window.alert("Successfully deleted");
                popAttManager.value = false;
            } catch (error) {
                console.log(error + ' 삭제 실패');
            }
        }
    });
};
const DeviceGroup_att = ref();
const DeviceGrouptier_att = ref();

const DeviceGroupAdd_att = async () => {
    const Groupinfo = {
        group: DeviceGroup_att.value,
        grouptier: DeviceGrouptier_att.value
    };
    console.log(Groupinfo)
    try {
        await axios.post('/api/physical_layer/device_groups', Groupinfo);
        window.alert("Successfully Added");
        popAttManager.value = false;
    } catch (error) {
        console.log(error + ' 추가 실패');
    }
};

//// Device Type Manage 관련
const confirm_t = useConfirm();
const confirm_typedelete = (typeID) => {
    confirm_t.require({
        message: 'Do you REALLY want to delete this Type?',
        icon: 'pi pi-info-circle',
        header: 'Delete Confirmation',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await axios.delete('/api/physical_layer/device_types/' + typeID);
                window.alert("Successfully deleted");
                popAttManager.value = false;
            } catch (error) {
                console.log(error + ' 삭제 실패');
            }
        }
    });
};

const DeviceType_att = ref();
const DeviceModel_att = ref();

const DeviceTypeAdd_att = async () => {
    const Typeinfo = {
        type: DeviceType_att.value,
        model: DeviceModel_att.value
    };
    console.log(Typeinfo)
    try {
        await axios.post('/api/physical_layer/device_types', Typeinfo);
        window.alert("Succesfully Added");
        popAttManager.value = false;
    } catch (error) {
        console.log(error + ' 추가 실패');
    }
};

//// Device Role Manage 관련
const confirm_r = useConfirm();
const confirm_roledelete = (roleID) => {
    confirm_r.require({
        message: 'Do you REALLY want to delete this Role?',
        icon: 'pi pi-info-circle',
        header: 'Delete Confirmation',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await axios.delete('/api/physical_layer/device_roles/' + roleID);
                window.alert("Successfully deleted");
                popAttManager.value = false;
            } catch (error) {
                console.log(error + ' 삭제 실패');
            }
        }
    });
};

const DeviceRole_att = ref();

const DeviceRoleAdd_att = async () => {
    const Roleinfo = {
        role: DeviceRole_att.value
    };
    console.log(Roleinfo)
    try {
        await axios.post('/api/physical_layer/device_roles', Roleinfo);
        window.alert("Succesfully Added");
        popAttManager.value = false;
    } catch (error) {
        console.log(error + ' 추가 실패');
    }
};

//// Interface Group Manage 관련
const confirm_IG = useConfirm();
const confirm_igroupdelete = (IGID) => {
    confirm_IG.require({
        message: 'Do you REALLY want to delete this Interface Group?',
        icon: 'pi pi-info-circle',
        header: 'Delete Confirmation',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await axios.delete('/api/physical_layer/interface_groups/' + IGID);
                window.alert("Successfully deleted");
                popAttManager.value = false;
            } catch (error) {
                console.log(error + ' 삭제 실패');
            }
        }
    });
};

const IGroup_att = ref();
const IGrouptier_att = ref();

const IGroupAdd_att = async () => {
    const IGinfo = {
        interfacegroup: IGroup_att.value,
        interfacetier: IGrouptier_att.value
    };
    console.log(IGinfo)
    try {
        await axios.post('/api/physical_layer/interface_groups', IGinfo);
        window.alert("Succesfully Added");
        popAttManager.value = false;
    } catch (error) {
        console.log(error + ' 추가 실패');
    }
};

//// Device Member
const selectedTarget = ref(null);
const setTarget = async (target) => {
    selectedTarget.value = target;
};

const att_TypeIDconvert = (typeid) => {
    const reply = att_TypeIDconvertMap.value.get(typeid)
    return reply
};

const att_RoleIDconvert = (roleid) => {
    const reply = att_RoleIDconvertMap.value.get(roleid)
    return reply
};

const att_groupNameIDconvert = (groupid) => {
    const reply = att_groupNameIDconvertMap.value.get(groupid)
    return reply
};




const selectedDevice = ref(null); // device list에서 선택한 device의 정보를 저장하는 변수
const att_PutData = ref(null);

const att_handleRowClick = async (rowData) => {
    console.log(rowData);
    console.log(selectedDevice);
    att_PutData.value = selectedDevice.value;
    // console.log(att_deviceTypeOptions);
};

const att_selectedType = ref();
const att_selectedGroup = ref();
const att_selectedRole = ref();

// const att_deviceUpdate = async() => {
//     try{
//         console.log att_PutData
//     }
// };

// const att_selectedRole = ref();
// const att_selectedGroup = ref();

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
            <div class="flex flex-column flex-grow-0" style="height: 25%;">
                <div class="text-2xl font-bold mx-2 mt-4 ">
                    Select
                </div>
                <!-- Make tree navigation bar as like 'Device Group > Node > Interface' sequence -->
                <div class="mx-3 mt-4 mb-2 flex">
                    <div class="relative mr-2 cursor-pointer hover:border-bottom-1" v-ripple
                        v-styleclass="{ selector: '.grouplist', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                        Group
                        <div class="absolute grouplist hidden border-round shadow-2"
                            style="width : 200px; top: 30px; z-index: 999;">
                            <template v-for="group in groupCategories" :key="group">
                                <Button v-if="group.key != 'A'" @click="groupSelect(group)"
                                    class="text-sm text-color w-full flex justify-content-start align-items-center bg-white border-0 border-noround hover:bg-green-200">
                                    {{ group.name }}
                                </Button>
                            </template>
                        </div>
                    </div>
                    <div class="mr-2">
                        <div v-if="selectedGroupInNavbar != null && selectedNodeInNavbar != null"> >> </div>
                        <div v-else-if="selectedGroupInNavbar != null && selectedNodeInNavbar == null"> > </div>
                    </div>
                    <div v-if="selectedGroupInNavbar" class="relative mr-2 cursor-pointer" v-ripple
                        v-styleclass="{ selector: '.nodelist', enterClass: 'hidden', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                        Node
                        <div class="absolute nodelist hidden border-round shadow-2"
                            style="width : 200px; top: 30px; z-index: 999;">
                            <template v-for="node in nodeCategories" :key="node">
                                <Button v-if="node.key != 'A' && node.parent == selectedGroupInNavbar.key"
                                    @click="nodeSelect(node)"
                                    class="text-sm text-color w-full flex justify-content-start align-items-center bg-white border-0 border-noround hover:bg-green-200">
                                    {{ node.name }}
                                </Button>
                            </template>
                        </div>
                    </div>
                    <div class="mr-2">
                        <div v-if="selectedNodeInNavbar != null && selectedInterfaceInNavbar != null"> >> </div>
                        <div v-else-if="selectedNodeInNavbar != null && selectedInterfaceInNavbar == null"> > </div>
                    </div>
                    <div v-if="selectedNodeInNavbar" class="relative mr-2 cursor-pointer" v-ripple
                        v-styleclass="{ selector: '.interfacelist', enterClass: 'hidden', enterClass: 'hidden', enterActiveClass: 'scalein', leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true }">
                        Interface
                        <div class="absolute interfacelist hidden border-round shadow-2"
                            style="width : 200px; top: 30px; z-index: 999;">
                            <template v-for="Interface in originInterfaceData" :key="Interface">
                                <Button v-if="Interface['_id'] != 'A' && Interface['deviceId'] == selectedNodeInNavbar.key"
                                    @click="selectedInterfaceInNavbar = Interface"
                                    class="text-sm text-color w-full flex justify-content-start align-items-center bg-white border-0 border-noround hover:bg-green-200">
                                    {{ Interface['interfaceName'] }}
                                </Button>
                            </template>
                        </div>
                    </div>
                </div>
                <ul class="tree list-none p-0 mx-2 mb-4 mb-2" style="height: 90px;">
                    <li>
                        <div @click="treeToggle('group')" class="m-2 flex">
                            <div class="mr-2 flex align-items-center text-lg">
                                <i v-if="isOpen['group']" class="pi pi-angle-right"></i>
                                <i v-else-if="selectedNodeInNavbar == null && selectedGroupInNavbar == null"
                                    class="pi pi-minus"></i>
                                <i v-else class="pi pi-angle-down"></i>
                            </div>
                            <div class="font-semibold">
                                {{ selectedGroupInNavbar ? selectedGroupInNavbar.name : 'Group is not Selected' }}
                            </div>
                        </div>
                        <ul class="list-none p-0 ml-4" v-show="isOpen['group']">
                            <li>
                                <div @click="treeToggle('node')" class="m-2 flex ">
                                    <div class="mr-2 flex align-items-center">
                                        <i v-if="isOpen['node']" class="pi pi-angle-right"></i>
                                        <i v-else-if="selectedInterfaceInNavbar == null && selectedNodeInNavbar == null"
                                            class="pi pi-minus"></i>
                                        <i v-else class="pi pi-angle-down"></i>
                                    </div>
                                    <div class="bg-blue-50 text-blue-600 border-round inline-flex">
                                        {{ selectedNodeInNavbar ? selectedNodeInNavbar.name : 'Node is not Selected' }}
                                    </div>
                                </div>
                                <ul class="list-none p-0 ml-4" v-show="isOpen['node']">
                                    <div class="m-2">
                                        <li>
                                            <div class="mr-2 flex align-items-center text-sm">
                                                <i v-if="selectedInterfaceInNavbar == null" class="pi pi-minus mr-2"></i>
                                                <div class="bg-green-50 text-green-600 border-round inline-flex">
                                                    {{ selectedInterfaceInNavbar ? selectedInterfaceInNavbar.interfaceName
                                                        : 'Interface is not selected' }}
                                                </div>
                                            </div>
                                        </li>
                                    </div>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="flex flex-column mx-2" style="height: 73%;">
                <div style="height: 5%;">
                    <div class="text-2xl mb-1 font-bold">
                        Details
                    </div>
                    <!-- <div>(node & interface)</div> -->
                </div>
                <div class="overflow-y-scroll pl-2" style="height: 95%;">
                    <div v-if="selectedNodeInNavbar != null" class="my-2">
                        <div class="text-lg font-semibold my-3">
                            Node
                        </div>
                        <div v-for="contentValue, contentKey in selectedNodeInNavbar" :key="contentValue"
                            class="text-sm my-3">
                            <div class="bg-blue-50 text-blue-600 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                {{ contentKey }} :
                            </div>
                            <div class="text-600 font-medium  py-1 px-2">
                                {{ contentValue }}
                            </div>
                        </div>
                    </div>
                    <div v-if="selectedInterfaceInNavbar != null" class="my-2">
                        <div class="text-lg font-semibold my-3 ">
                            Interface
                        </div>
                        <div v-for="contentValue, contentKey in selectedInterfaceInNavbar" :key="contentValue"
                            class="text-sm my-3">
                            <div class="bg-green-50 text-green-600 border-round inline-flex mb-1 py-1 px-2 text-sm">
                                {{ contentKey }} :
                            </div>
                            <div class="text-600 font-medium  py-1 px-2">
                                {{ contentValue }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-column relative flex-auto">
            <div class=" flex flex-column flex-auto">

                <div class="flex controls mx-5 mt-5">
                    <div class="flex ">
                        <Button class="border-noround border-0 mr-4"
                            style="height: 2.8rem; background-color: #2e3341; color: white; z-index: 99;">실시간
                            패킷 레이트 (5초)</Button>
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
                        <Button class="border-0 border-noround ml-4"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341" @click="openPopup">
                            <i :class="'pi pi-database'"></i>
                        </Button>
                        <Button class="border-0 border-noround"
                            style="height: 2.8rem; z-index: 99; color: white; background-color: #2e3341"
                            @click="openAttManager">
                            <i :class="'pi pi-filter'"></i>
                        </Button>
                        <Dialog v-model:visible="popList" modal header="Device list" :style="{ width: '80%' }">
                            <div class="flex" style="height: 100%">
                                <div class="w-6 p-4">
                                    <div class="ml-2 mb-5 text-xl font-bold"> Zabbix Device </div>
                                    <DataTable :value="zabbixdevice" scrollable scrollHeight="flex"
                                        tableStyle="width= 100%">
                                        <Column field="deviceName" header="Device Name">
                                            <template #body="rowData">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <div>{{ rowData.data.deviceName }}</div>
                                                    <!-- {{ console.log(rowData) }} -->
                                                    <div>
                                                        <Button label="Add" severity="success" class="mr-2"
                                                            @click="openPopAdd(rowData.data.deviceName, rowData.data.interfaces, rowData.data.deviceID)" />
                                                        <Button label="Attach" severity="success"
                                                            @click="openAttach(rowData.data.interfaces)" />
                                                    </div>
                                                </div>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                                <Divider layout="vertical"></Divider>
                                <div class="w-6 p-4">
                                    <div class="ml-2 mb-5 text-xl font-bold"> E.CHO.E Device </div>
                                    <DataTable v-model:expandedRowGroups="expandedRowGroupsList" expandableRowGroups
                                        rowGroupMode="subheader" groupRowsBy="deviceGroup" :value="DBdevice" scrollable
                                        scrollHeight="flex" tableStyle="width= 100%" sortMode="single"
                                        sortField="deviceGroup" :sortOrder="1">
                                        <template #groupheader="slotProps">
                                            <span class="veritical-align-middle ml-2 font-bold line-height-3">{{
                                                slotProps.data.deviceGroup }}</span>
                                        </template>
                                        <Column field="deviceGroup" header="Device Group"></Column>
                                        <Column field="deviceName" header="Device Name"></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog v-model:visible="popAdd" modal header="Add zabbix device info to DB"
                            :style="{ width: '50%' }">
                            <div class="w-12 p-4">
                                <div class="mb-4 text-xl font-bold"> Fill out device info </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="devicename">Device name</label>
                                    <InputText id="devicename" v-model="rowDeviceName" aria-describedby="devicename-help"
                                        disabled />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="deviceZID">Device zabbixID</label>
                                    <InputText id="deviceZID" v-model="rowDeviceZID" aria-describedby="devicename-help"
                                        disabled />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="status">Status</label>
                                    <InputText id="status" v-model="selectedstatus" aria-describedby="status-help" />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="Tier">Tier</label>
                                    <InputNumber id="tier" v-model="selectedtier" aria-describedby="tier-help" />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="deviceGroup">Device Group</label>
                                    <Dropdown v-model="selectedGroup" :options="Groups" optionLabel="name"
                                        placeholder="Select device group" />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="deviceRole">Device Role</label>
                                    <Dropdown v-model="selectedRole" :options="Roles" optionLabel="role"
                                        placeholder="Select device role" />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="deviceType">Device Type</label>
                                    <Dropdown v-model="selectedType" :options="Types" optionLabel="type"
                                        placeholder="Select device type" />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="deviceLocation">Device Location</label>
                                    <Button label="Set Location" text raised severity="success" />
                                </div>
                                <div class="card flex flex-column gap-2 mb-4">
                                    <label for="Monitor">Monitor type</label>
                                    <InputText id="monitor" v-model="selectedMonitorType" disabled />
                                </div>
                            </div>
                            <Divider></Divider>
                            <div class="w-12 p-4">
                                <div class="card flex flex-column gap-2 mb-4">
                                    <div class="mb-4 text-xl font-bold"> Fill out Interface info </div>
                                </div>
                                <div v-for="(_, index) in rowDeviceInterfaces" :key="index">
                                    <div class="card flex flex-column gap-2 mb-4">
                                        <label for="zabbixinterfaceName">Zabbix Interface Name</label>
                                        <InputText id="zabbixinterfaceName" v-model="rowDeviceInterfaces[index]" disabled>
                                        </InputText>

                                        <label for="interfacename">Interface Name</label>
                                        <InputText id="interfaceName" v-model=selectedDeviceInterface[index]></InputText>

                                        <label for="MAC address">MAC address</label>
                                        <InputText id="macaddress" v-model=macAddress[index]></InputText>

                                        <label for="subnet">Subnet</label>
                                        <InputText id="Subnet" v-model=subNet[index]></InputText>

                                        <label for="Bandwidth">Bandwidth</label>
                                        <InputNumber id="bandwidth" v-model=bandWidth[index]></InputNumber>

                                        <label for="PrimaryIP">Primary IP</label>
                                        <InputText id="primaryip" v-model=PrimaryIP[index]></InputText>

                                        <label for="SecondaryIP">Secondary IP(optional)</label>
                                        <InputText id="secondaryip" v-model=SecondaryIP[index]></InputText>


                                        <label for="Interface Status">Interface Status</label>
                                        <InputText id="interfacestatus" v-model=interfaceStatus[index]></InputText>

                                        <label for="Interface Group">Interface Group</label>
                                        <Dropdown v-model="selectedinterfaceGroup[index]" :options="IGroups"
                                            optionLabel="interfacegroup"></Dropdown>
                                    </div>
                                    <Divider type="dashed"></Divider>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <Button label="Submit" severity="success" @click="submitAddClicked"></Button>
                                    <Button label="Cancel" severity="danger" @click="closePopAdd"></Button>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog v-model:visible="popAttach" modal header="Attach Zabbix-detected-interface"
                            :style="{ width: '70%' }">
                            <div class="flex" style="height: 100% overflow-x: auto;">
                                <div class="w-6 p-4">
                                    <div class="ml-2 mb-5 text-xl font-bold"> Zabbix-detected-Interfaces </div>
                                    <DataTable :value="rowDeviceInterfacesAttach" scrollable scrollHeight="flex"
                                        tableStyle="width= 100%" v-model:selection="selectedInterfaceAttach"
                                        selectionMode="single">
                                        <!-- {{ console.log(rowDeviceInterfacesAttach) }} -->
                                        <Column field="interfaceName" header="Interface Name">
                                        </Column>
                                    </DataTable>
                                </div>
                                <Divider layout="vertical"></Divider>
                                <div class="w-6 p-4">
                                    <div class="ml-2 mb-5 text-xl font-bold"> Target E.CHO.E device </div>
                                    <DataTable v-model:expandedRowGroups="expandedRowGroupsAttach"
                                        v-model:selection="selectedECHOEdeviceAttach" selectionMode="single"
                                        :value="DBdevice" tableStyle="width= 100%" expandableRowGroups
                                        rowGroupMode="subheader" groupRowsBy="deviceGroup" sortMode="single"
                                        sortField="deviceGroup" :sortOrder="1" @row-click="handleRowClick">
                                        <template #groupheader="slotProps">
                                            <span class="veritical-align-middle ml-2 font-bold line-height-3">{{
                                                slotProps.data.deviceGroup }}</span>
                                        </template>
                                        <Column field="deviceGroup" header="Device Group"></Column>
                                        <Column field="deviceName" header="Device Name"></Column>
                                    </DataTable>
                                </div>
                                <Divider layout="vertical"></Divider>
                                <div class="w-6 p-4">
                                    <div class="ml-2 mb-5 text-xl font-bold"> Selected Device's Interface list</div>
                                    <DataTable v-model:selection="selectedECHOEInterfaceAttach" selectionMode="single"
                                        :value="Related_Interfaces" tableStyle="width= 100%">
                                        <Column field="interfaceName" header="Interface Name"></Column>
                                    </DataTable>
                                    <Button label="Attach" severity="success" class="absolute bottom-0 right-0 mb-6 mr-6"
                                        @click="AttachClicked"></Button>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog v-model:visible="popAttManager" modal header="Welcome to Attribute Manager"
                            :style="{ width: '65%' }">
                            <div class="mt-3 w-12 card-container d-flex justify-content-center">
                                <Button label="Manage Attribute" severity="success" text
                                    class="justify-content-center inline mr-5" size="large" @click="setPage('Attribute')"
                                    v-model="activeButton_Manages" :toggleable="true" value="Attribute" />
                                <Button label="Manage Member" severity="success" text
                                    class="justify-content-center inline ml-5" size="large" @click="setPage('Member')"
                                    v-model="activeButton_Manages" :toggleable="true" value="Member" />
                            </div>
                            <div v-if="selectedButton === 'Attribute'"
                                class="mt-3 w-12 card-container d-flex justify-content-center">
                                <Button label="Device Group" severity="success" text class="justify-content-center inline"
                                    @click="setAttribute('Group')" v-model="activeButton_Attributes" />
                                <Button label="Device Type" severity="success" text
                                    class="justify-content-center inline ml-5" @click="setAttribute('Type')"
                                    v-model="activeButton_Attributes" />
                                <Button label="Device Role" severity="success" text
                                    class="justify-content-center inline ml-5" @click="setAttribute('Role')"
                                    v-model="activeButton_Attributes" />
                                <Button label="Device Location" severity="success" text
                                    class="justify-content-center inline ml-5" @click="setAttribute('Location')"
                                    v-model="activeButton_Attributes" />
                                <Divider layout="vertical"></Divider>
                                <Button label="Interface Group" severity="success" text
                                    class="justify-content-center inline ml-5" @click="setAttribute('IGroup')"
                                    v-model="activeButton_Attributes" />
                            </div>
                            <div v-if="selectedAttribute === 'Group'" class="inline mt-3 w-10">
                                <div class="mt-3 flex d-flex justify-content-center align-items-center relative">
                                    <div class="mr-8">
                                        <ConfirmDialog></ConfirmDialog>
                                        <DataTable :value="att_deviceGroups" tableStyle="width= 100%">
                                            <Column field="group" header="Group name"></Column>
                                            <Column field="grouptier" header="Group tier"></Column>
                                            <Column field="_id" header="ID">
                                                <template #body="rowData">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>{{ rowData.data._id }}</div>
                                                        <div>
                                                            <Button icon="pi pi-times" severity="danger" size="small" text
                                                                rounded @click="confirm_groupdelete(rowData.data._id)" />
                                                        </div>
                                                    </div>
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </div>
                                    <div class="ml-8">
                                        <div class="flex flex-column gap-2">
                                            <label for="DeviceGroup_att">New Group name</label>
                                            <InputText id="DeviceGroup_att" v-model="DeviceGroup_att">
                                            </InputText>
                                            <label for="DeviceTier_att" class="mt-2">Tier for New Group</label>
                                            <InputNumber id="DeviceTier_att" v-model="DeviceGrouptier_att">
                                            </InputNumber>
                                            <Button label="Add" class="mt-3 ml-auto" style="width: 50%" severity="success"
                                                @click="DeviceGroupAdd_att"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="selectedAttribute === 'Type'" class="inline mt-3 w-10">
                                <div class="mt-3 flex d-flex justify-content-center align-items-center relative">
                                    <div class="mr-8">
                                        <ConfirmDialog></ConfirmDialog>
                                        <DataTable :value="att_deviceTypes" tableStyle="width= 100%">
                                            <Column field="type" header="Type name"></Column>
                                            <Column field="model" header="Model"></Column>
                                            <Column field="_id" header="ID">
                                                <template #body="rowData">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>{{ rowData.data._id }}</div>
                                                        <div>
                                                            <Button icon="pi pi-times" severity="danger" size="small" text
                                                                rounded @click="confirm_typedelete(rowData.data._id)" />
                                                        </div>
                                                    </div>
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </div>
                                    <div class="ml-8">
                                        <div class="flex flex-column gap-2">
                                            <label for="DeviceType_att">New Type name</label>
                                            <InputText id="DeviceType_att" v-model="DeviceType_att">
                                            </InputText>
                                            <label for="DeviceModel_att" class="mt-2">Model for New Type</label>
                                            <InputText id="DeviceModel_att" v-model="DeviceModel_att">
                                            </InputText>
                                            <Button label="Add" class="mt-3 ml-auto" style="width: 50%" severity="success"
                                                @click="DeviceTypeAdd_att"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="selectedAttribute === 'Role'" class="inline mt-3 w-10">
                                <div class="mt-3 flex d-flex justify-content-center align-items-center relative">
                                    <div class="mr-8">
                                        <ConfirmDialog></ConfirmDialog>
                                        <DataTable :value="att_deviceRoles" tableStyle="width= 100%">
                                            <Column field="role" header="Role"></Column>
                                            <Column field="_id" header="ID">
                                                <template #body="rowData">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>{{ rowData.data._id }}</div>
                                                        <div>
                                                            <Button icon="pi pi-times" severity="danger" size="small" text
                                                                rounded @click="confirm_roledelete(rowData.data._id)" />
                                                        </div>
                                                    </div>
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </div>
                                    <div class="ml-8">
                                        <div class="flex flex-column gap-2">
                                            <label for="DeviceRole_att">New Role name</label>
                                            <InputText id="DeviceRole_att" v-model="DeviceRole_att">
                                            </InputText>
                                            <Button label="Add" class="mt-3 ml-auto" style="width: 50%" severity="success"
                                                @click="DeviceRoleAdd_att"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="selectedAttribute === 'IGroup'" class="inline mt-3 w-10">
                                <div class="mt-3 flex d-flex justify-content-center align-items-center relative">
                                    <div class="mr-8">
                                        <ConfirmDialog></ConfirmDialog>
                                        <DataTable :value="att_interfaceGroups" tableStyle="width= 100%">
                                            <Column field="interfacegroup" header="Interface Group"></Column>
                                            <Column field="interfacetier" header="Group Tier"></Column>
                                            <Column field="_id" header="ID">
                                                <template #body="rowData">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>{{ rowData.data._id }}</div>
                                                        <div>
                                                            <Button icon="pi pi-times" severity="danger" size="small" text
                                                                rounded @click="confirm_igroupdelete(rowData.data._id)" />
                                                        </div>
                                                    </div>
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </div>
                                    <div class="ml-8">
                                        <div class="flex flex-column gap-2">
                                            <label for="IGroup_att">New Interface Group name</label>
                                            <InputText id="IGroup_att" v-model="IGroup_att">
                                            </InputText>
                                            <label for="IGrouptier_att">Group tier for New interface group</label>
                                            <InputNumber id="IGrouptier_att" v-model="IGrouptier_att">
                                            </InputNumber>
                                            <Button label="Add" class="mt-3 ml-auto" style="width: 50%" severity="success"
                                                @click="IGroupAdd_att"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="selectedButton === 'Member'"
                                class="mt-3 w-12 card-container d-flex justify-content-center">
                                <Button label="Device" severity="success" text class="justify-content-center inline"
                                    @click="setTarget('Device')" />
                                <Button label="Interface" severity="success" text class="justify-content-center inline ml-5"
                                    @click="setTarget('Interface')" />
                            </div>
                            <div v-if="selectedTarget === 'Device'" class="inline mt-3 w-10">
                                <div class="mt-3 flex d-flex justify-content-center align-items-center relative">
                                    <div class="mr-8">
                                        <DataTable :value="att_devices" tableStyle="width = 100%"
                                            v-model:selection="selectedDevice" selectionMode="single"
                                            @row-click="att_handleRowClick">
                                            <Column field="_id" header="id"></Column>
                                            <Column field="deviceName" header="Device Name"></Column>
                                            <Column field="deviceTypeId" header="Device Type">
                                                <template #body="rowData">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>{{ att_TypeIDconvert(rowData.data.deviceTypeId) }}
                                                        </div>
                                                    </div>
                                                </template>
                                            </Column>
                                            <Column field="deviceGroupId" header="Device Group">
                                                <template #body="rowData">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>{{ att_groupNameIDconvert(rowData.data.deviceGroupId) }}
                                                        </div>
                                                    </div>
                                                </template>
                                            </Column>
                                            <Column field="deviceRoleId" header="Device Role">
                                                <template #body="rowData">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div>{{ att_RoleIDconvert(rowData.data.deviceRoleId) }}
                                                        </div>
                                                    </div>
                                                </template>
                                            </Column>
                                            <Column field="tier" header="Tier"></Column>
                                        </DataTable>
                                    </div>
                                    <div class="ml-8">
                                        <div v-if="att_PutData !== null" class="flex flex-column gap-2">
                                            <label for="att_deviceName">device Name</label>
                                            <InputText ID="att_deviceName" v-model="att_PutData.deviceName"></InputText>
                                            <label for="att_deviceType">device Type</label>
                                            <Dropdown v-model="att_selectedType" :options="att_deviceTypeOptions"
                                                placeholder="Select Type"></Dropdown>
                                            <label for="att_deviceGroup">device Group</label>
                                            <Dropdown v-model="att_selectedGroup" :options="att_deviceGroupOptions"
                                                placeholder="Select Group"></Dropdown>
                                            <label for="att_deviceRole">device Role</label>
                                            <Dropdown v-model="att_selectedRole" :options="att_deviceRoleOptions"
                                                placeholder="Select Role">
                                            </Dropdown>
                                            <label for="att_deviceTier">Tier</label>
                                            <InputNumber ID="att_deviceTier" v-model="att_PutData.tier"></InputNumber>
                                            <!-- <Button label="Update" text severity="success" @click="att_deviceUpdate"></Button> -->
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div v-if="selectedTarget === 'Interface'">

                            </div>
                        </Dialog>
                        <Button class="border-0 border-noround" style="height: 2.8rem; z-index: 99;"
                            :style="{ 'background-color': toggleDrag ? 'white' : '#2e3341', color: toggleDrag ? '#2e3341' : 'white' }"
                            @click="toggleDrag = !toggleDrag">
                            <font-awesome-icon :icon="['fas', 'computer-mouse']" />
                        </Button>
                    </div>
                </div>
                <div class="flex flex-grow-1 m-1">
                    <Skeleton v-if="!loading" class="mr-2 h-full" />
                    <VueFlow v-else v-model="vueFlow" class="basicflow" :node-types="nodeTypes" :default-zoom="1.5"
                        :min-zoom="0.1" :max-zoom="2" :nodes-draggable="toggleDrag" :elevate-edges-on-select="true">
                        <Background gap="50" class="surface-ground" />
                    </VueFlow>
                </div>
            </div>
        </div>
        <div class="flex flex-column w-2 surface-card surface-border border-right-2 shadow-2" style="height: 100%">
            <div class=" text-2xl font-bold mx-4 mt-4">
                Toggle
            </div>
            <div class="mx-4" style="height: 30%;">
                <div class="text-lg font-medium my-3">
                    Group
                </div>
                <div class="overflow-y-scroll p-1" style="height: 80%;">
                    <div v-for="category of groupCategories" :key="category.key" class="field-radiobutton text-800 mb-4">
                        <RadioButton :inputId="category.key" name="category" :value="category.key"
                            v-model="groupCategoryChecked" :disabled="category.key === 'R'"
                            @click="clickGroupCategories(category.key, groupCategoryChecked)" />
                        <label :for="category.key">{{ category.name }}</label>
                    </div>
                </div>
            </div>
            <div class="mx-4" style="height: 30%;">
                <div class="text-lg font-medium my-3">
                    Node
                </div>
                <div class="overflow-y-scroll p-1" style="height: 80%;">
                    <div v-for="category of nodeCategories" :key="category.key" class="field-radiobutton text-800 mb-4">
                        <RadioButton :inputId="category.key" name="category" :value="category.name"
                            v-model="nodeCategoryChecked" :disabled="category.key === 'R'"
                            @click="clickNodeCategories(category.name, nodeCategoryChecked)" />
                        <label :for="category.key">{{ category.name }}</label>
                    </div>
                </div>
            </div>
            <div class="mx-4 " style="height: 30%;">
                <div class="text-lg font-medium my-3">
                    Interface
                </div>
                <div class="overflow-y-scroll p-1" style="height: 80%;">
                    <div v-for="category of interfaceCategories" :key="category.key"
                        class="field-radiobutton text-800 mb-4">
                        <RadioButton :inputId="category.key" name="category" :value="category.name"
                            v-model="interfaceCategoryChecked" :disabled="category.key === 'R'"
                            @click="clickInterfaceCategories(category.name, interfaceCategoryChecked)" />
                        <label :for="category.key">{{ category.name }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.2.1/dist/theme-default.css';

.d-flex {
    display: flex;
}

.justify-content-between {
    justify-content: space-between;
}

.align-items-center {
    align-items: center;
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