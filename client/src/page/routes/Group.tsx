import { Button } from "@mantine/core";
import { getAssignedStaff, getGroup, getStaffList } from "@/api";
import { useEffect, useReducer, useState } from "react";
import { Group } from "../../types";
import { GroupTable } from "../../components/DataDisplay";
import { useDisclosure } from '@mantine/hooks';
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BsPlusCircle } from "react-icons/bs";
import { GroupForm } from "@/components/Form";
import Modal from "@/components/Modal";

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

function organiseData(groupArr: [], asArr: []) {
    const tempArr: Group[] = [];
    if (groupArr !== undefined) {
        groupArr.map(ele => {
            tempArr.push({
                groupID: ele['groupID'],
                groupName: ele['groupName'],
                staff: [],
            });

            if (asArr !== undefined) {
                asArr.forEach(asEle => {
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
    const queryClient = useQueryClient();
    const groupQuery = useQuery({
        ...getGroup(),
        initialData: queryClient.getQueryData(['group']),
        enabled: false,
    });

    const assigned_staffQuery = useQuery({
        ...getAssignedStaff(),
        initialData: queryClient.getQueryData(['assignedStaff']),
        enabled: false,
    });

    const staffQuery = useQuery({
        ...getStaffList(),
        initialData: queryClient.getQueryData(['staff']),
        enabled: false,
    });

    const group = groupQuery.data as [];
    const a_staff = assigned_staffQuery.data as [];
    const staff = staffQuery.data as [];

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
    const [GroupArray, setGroupArray] = useState<Group[]>(organiseData(group, a_staff));

    function handleModalClick(action: any, title: string | undefined, data?: any) {
        dispatch({
            title: title,
            action: action,
            data: data
        })
    }

    useEffect(() => {
        if (notification.title === 'Success') {
            const group: any = queryClient.getQueryData(['group']);
            const assigned_staff: any = queryClient.getQueryData(['assignedStaff']);

            setGroupArray(organiseData(group, assigned_staff));
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