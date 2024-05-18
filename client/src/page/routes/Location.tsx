import { LocationTable } from "@/components/DataDisplay";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useReducer, useState } from "react";
import * as Icon from 'react-icons/bs';
import { notifications } from "@mantine/notifications";
import { LocationForm } from "@/components/Form";
import Modal from "@/components/Modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLocation } from "@/api";

interface InitialNotification {
    action: string,
    title: string,
    response?: string | undefined,
}

interface initial {
    title: string | undefined;
    data: [] | undefined;
    action: string | undefined;
}

function reducer(_state: any, props: any) {
    switch (props.action) {
        case 'Add': {
            return {
                action: props.action,
                title: props.title,
                data: [],
            }
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

const initialState: initial = {
    title: '',
    data: [],
    action: '',
}

export default function Location() {
    const queryClient = useQueryClient();
    const InitialNotification: any = {
        action: '',
        title: '',
        response: '',
    };

    const [notification, setNotification] = useState<InitialNotification>(InitialNotification);
    const [opened, handler] = useDisclosure(false, {
        onClose: () => {
            if (update) {
                setUpdate(!update);
            }
        }
    });

    const [update, setUpdate] = useState(false);
    const data = useQuery({
        ...getLocation(),
        enabled: true,
        initialData: queryClient.getQueryData(['location'])
    }).data;
    const [state, dispatch] = useReducer(reducer, initialState);

    const modalHandler = (action: any, title?: string | undefined, data?: any) => {
        dispatch({
            action: action,
            title: title,
            data: data,
        })
    }

    useEffect(() => {
        if (notification.title === 'Success') {
            switch (notification.action) {
                case 'Add': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Location {notification.response} has been added!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Edit': {
                    notifications.show({
                        title: <div className="font-bold">Update Succesfully!</div>,
                        message: <div>Location has been updated!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Delete': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Location {notification.response} has been deleted!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
            }
        }

        if (notification.title === 'Failed') {
            switch (notification.action) {
                case 'Add':
                case 'Edit': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Location <span className="font-bold">{notification.response}</span> already existed! Try a different alias OR name...</div>,
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Delete': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Encountered an error! Try refreshing the page and retry...</div>,
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
            }
        }
    }, [notification]);

    return (
        <>
            <Modal
                opened={opened}
                handler={handler}
                action={state?.action}
                data={state?.data}

                update={update}
                setUpdate={setUpdate}
                setNotification={setNotification}

                title={state?.title}
                Form={
                    <LocationForm
                        data={state?.data}
                        action={state?.action}
                        handler={handler}
                        update={update}
                        setUpdate={setUpdate}
                        setNotification={setNotification}
                    />
                }
            />

            <div key="location" className="flex flex-col flex-1 p-2">
                <div className="flex flex-col justify-between mb-4 header lg:flex-row">
                    <div className='text-2xl font-bold'>Location</div>
                </div>

                <div className="LocationTable">
                    <div className="flex justify-end">
                        <Button
                            leftSection={<Icon.BsPlusCircle size={22} />}
                            onClick={() => {
                                modalHandler('Add', 'Add New Location');
                                handler.open();
                            }}
                        >
                            Add New Location
                        </Button>
                    </div>
                    <LocationTable
                        data={data}
                        opened={opened}
                        modalHandler={modalHandler}
                        handler={handler}
                        update={update}
                        setUpdate={setUpdate}
                        setNotification={setNotification}
                    />
                </div>
            </div>
        </>
    )
}