import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useReducer, useState } from "react";
import * as Icon from 'react-bootstrap-icons';
import { notifications } from "@mantine/notifications";
import { getShiftCategory } from "@/api";
import { ShiftCategoryTable } from "@/components/DataDisplay";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import Modal from "@/components/Modal";
import { ShiftCategoryForm } from "@/components/Form";
import { CSVLink } from "react-csv";
import { TbDownload } from "react-icons/tb";

interface initial {
    title: string | undefined;
    data: [] | undefined;
    action: string | undefined;
}

export const loader = (queryClient: QueryClient, staleTime?: number | undefined) => async () => {
    return queryClient.getQueryData(getShiftCategory().queryKey) ?? (await queryClient.fetchQuery({
        ...getShiftCategory(),
        staleTime: staleTime
    })
    );
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

export default function ShiftType() {
    const queryClient = useQueryClient();
    const data = useLoaderData() as Awaited<
        ReturnType<ReturnType<typeof loader>>
    >;
    const InitialNotification: any = {
        action: '',
        title: '',
        response: '',
    };
    const [notification, setNotification] = useState(InitialNotification);
    const [opened, handler] = useDisclosure(false, {
        onClose: () => {
            if (update) {
                setUpdate(!update);
            }
        }
    });
    const [update, setUpdate] = useState(false);
    const [stData, setData] = useState(data);
    const [state, dispatch] = useReducer(reducer, initialState)

    const CSVExport = () => (
        <CSVLink data={data} filename={"shift_category.csv"}>
            <Button 
                leftSection={<TbDownload size={16} />}
                color={"lime"}
            >
                Download CSV
            </Button>
        </CSVLink>
    )

    const modalHandler = (action: any, title?: string | undefined, data?: any) => {
        dispatch({
            title: title,
            action: action,
            data: data,
        })
    };

    useEffect(() => {
        if (notification.title === 'Success') {
            setData(queryClient.getQueryData(['shiftCategory']));
            switch (notification.action) {
                case 'Add': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Shift {notification.response} has been added!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Edit': {
                    notifications.show({
                        title: <div className="font-bold">Update Succesfully!</div>,
                        message: <div>Shift has been updated!</div>,
                        color: "green",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Delete': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Shift {notification.response} has been deleted!</div>,
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
                        message: <div>Shift <span className="font-bold">{notification.response}</span> already existed! Try a different name...</div>,
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case 'Delete': {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Encountered an error! Try refreshing the page and retry the proccess...</div>,
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
            }
        }
    }, [notification])

    return (
        <div key="shift-category" className="flex flex-col flex-1 p-2">
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
                    <ShiftCategoryForm
                        data={state?.data}
                        action={state?.action}
                        handler={handler}
                        update={update}
                        setUpdate={setUpdate}
                        setNotification={setNotification}
                    />
                }
            />
            <div className="flex flex-col justify-between mb-4 header lg:flex-row">
                <div className='text-2xl font-bold'>Shift Category</div>
            </div>
            <div className="mb-2">
                <div className="flex justify-end">
                    {CSVExport()}
                    <Button
                        leftSection={<Icon.PlusCircle size={16} />}
                        onClick={() => {
                            modalHandler('Add', 'Add Shift Category');
                            handler.open();
                        }}
                    >
                        Add New Shift Category
                    </Button>
                </div>
                <ShiftCategoryTable
                    data={stData}
                    opened={opened}
                    modalHandler={modalHandler}
                    handler={handler}
                    update={update}
                    setUpdate={setUpdate}
                    setNotification={setNotification}
                />
            </div>
        </div>
    )
}