import { Button } from "@mantine/core";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Group } from "../../types";
import { GroupTable } from "../../components/DataDisplay";
import { useDisclosure } from '@mantine/hooks';
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { BsPlusCircle } from "react-icons/bs";
import { GroupForm } from "@/components/Form";
import Modal from "@/components/Modal";
import { useAuth } from "@/misc/AuthProvider";
import { assigned_staffQuery, fetchQueryApi, groupQuery, staffQuery } from "@/misc/FetchDataApi";

export async function queryFunction() {
    const response = await axios.get("http://127.0.0.1:3001/api/group");
    const data = await response.data;
    return data;
}

function reducer(_state: any, props: any) {
    switch (props.action) {
        case 'Add': {
            return {
                action: props.action,
                title: props.title,
            };
        }
        case 'Edit': {
            return {
                action: props.action,
                title: props.title,
                data: props.data,
            }
        }
    }
}

function organiseData(groupArr: any, asArr: any) {
    const tempArr: Group[] = [];
    if (groupArr !== undefined) {
        groupArr.map((ele: any) => {
            tempArr.push({
                groupID: ele['groupID'],
                groupName: ele['groupName'],
                staff: [],
            });

            if (asArr !== undefined) {
                asArr.forEach((asEle: any) => {
                    if (asEle['groupID'] === ele['groupID']) {
                        const index = tempArr.findIndex(tempEle => tempEle['groupID'] === asEle['groupID']);
                        tempArr[index].staff.push({
                            ID: asEle['ID'],
                            name: asEle['name'],
                            staffID: asEle['staffID'],
                        })
                    }
                });
            }
        });
    };
    return tempArr;
}

export default function GroupPage() {
    const { token } = useAuth();
    const ModalInitialState: {
        action: string | undefined,
        title: string | undefined,
        data?: [],
    } = {
        action: undefined,
        data: [],
        title: undefined,
    }

    const [state, dispatch] = useReducer(reducer, ModalInitialState);
    const InitialNotification = {
        title: '',
        message: '',
    };
    const [notification, setNotification] = useState(InitialNotification);
    const [updates, setUpdates] = useState(false);
    const [modalState, handler] = useDisclosure(false, {
        onClose: () => {
            if (updates) {
                setUpdates(!updates);
            }
        }
    });

    const { staff, group, assigned_staff } = fetchQueryApi();

    const GroupArray = useMemo(() => organiseData(group.data, assigned_staff.data), [group.data, assigned_staff.data]);

    function handleModalClick(action: any, title: string | undefined, data?: any) {
        dispatch({
            title: title,
            action: action,
            data: data
        })
    }

    useEffect(() => {
        if (notification.title === 'Success') {
            notifications.show({
                title: notification.title,
                message: notification.message,
                color: "rgba(0, 232, 73, 1)",
                onClose: () => setNotification(InitialNotification),
            });
        }
        if (notification.title === 'Failed') {
            notifications.show({
                title: notification.title,
                message: notification.message,
                color: "red",
                onClose: () => setNotification(InitialNotification),
            });
        }
    }, [notification]);

    const modalProps = {
        centered: true,
    }

    return (
        <div key="group" className="flex flex-col flex-1 p-2">
            <Modal
                opened={modalState}
                handler={handler}
                action={state?.action}
                updates={updates}
                setUpdates={setUpdates}
                setNotification={setNotification}
                title={state?.title}
                modalProps={modalProps}
                Form={
                    <GroupForm
                        data={state?.data}
                        staff={staff}
                        action={state?.action}
                        handler={handler}
                        updates={updates}
                        setUpdate={setUpdates}
                        setNotification={setNotification}
                    />
                }
            />
            <div className="flex flex-col justify-between mb-4 header lg:flex-row">
                <div className='text-2xl font-bold'>Group</div>
            </div>
            <div className="GroupTable">
                <div className="flex justify-end">
                    <Button
                        leftSection={<BsPlusCircle size={22} />}
                        onClick={() => {
                            handler.open();
                            handleModalClick('Add', 'Add New Group');
                        }}
                    >
                        Add New Group
                    </Button>
                </div>
                <GroupTable
                    GroupData={GroupArray}
                    opened={modalState}
                    handler={handler}
                    modalFunction={handleModalClick}
                    updates={updates}
                    setUpdate={setUpdates}
                    setNotification={setNotification}
                />
            </div>
        </div>
    )
}