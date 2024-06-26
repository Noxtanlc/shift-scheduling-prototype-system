import CustomMonthPicker from "@/components/Datepicker/CustomMonthPicker";
import { CustomDataScroller } from "@/components/DataDisplay/Datascroller";
import { Button, CloseButton, NativeSelect } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useReducer, useEffect, useMemo } from "react";
import { ScheduleTable } from "@/components/DataDisplay/";
import { ScheduleData } from "@/misc/ScheduleData";
import Modal from "@/components/Modal";
import { ImportForm } from "@/components/Form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../misc/AuthProvider";
import { queriesApi } from "@/misc/FetchDataApi";

interface initial {
    title: string | undefined;
    data: [] | undefined;
    action: string | undefined;
    FormElement: JSX.Element | undefined;
    props: any;
}

function modalReducer(_state: any, data: any) {
    switch (data.action) {
        case "Import": {
            return {
                title: data.title ?? "Import CSV",
                action: data.action,
                data: data.data ?? [],
                FormElement: data.formEle,
                props: data.props ?? {},
            };
        }
        case "Schedule": {
            return {
                title: data.title ?? "Schedule",
                action: data.action,
                data: data.data ?? [],
                FormElement: data.formEle,
                props: data.props ?? {},
            };
        }
        default: {
            break;
        }
    }
}

const initialModalProps: initial = {
    title: "",
    data: [],
    action: "",
    FormElement: <></>,
    props: {},
};

export default function Schedule() {
    const { user } = useAuth();
    const isAdmin = user.isAdmin;

    const InitialNotification = {
        action: "",
        title: "",
        response: "",
    };

    const {shift, staff, group, assigned_staff, shiftCategory} = queriesApi();

    const date = new Date();
    const [pickerValue, setPickerValue] = useState<Date | null>(
        new Date(date.getFullYear(), date.getMonth(), 1)
    );
    const dateValue = useMemo(() => {
        return {
            month: pickerValue!.getMonth() + 1,
            year: pickerValue!.getFullYear(),
            numDay: new Date(
                pickerValue!.getFullYear(),
                pickerValue!.getMonth() + 1,
                0
            ).getDate(),
        };
    }, [pickerValue]);
    // const [loading, setLoading] = useState(true);

    const [update, setUpdate] = useState(false);

    const [notification, setNotification] = useState<typeof InitialNotification>(InitialNotification);

    const [opened, handler] = useDisclosure(false, {
        /*
        onClose() {
            if (scheduleFormMutation[0] === "success" || importFormMutation[0] === "success") {
                shift = queryClient.getQueryData(['shift'])
            }
        },
        */
    });

    const [modalProps, setModalProps] = useReducer(
        modalReducer,
        initialModalProps
    );

    const [groupFilter, setGroupFilter] = useState("0");

    const data = useMemo(
        () => ScheduleData(dateValue, staff.data, shift.data),
        [dateValue, shift.data]
    );

    const groupSelect = useMemo(() => {
        const initial = [
            {
                value: "0",
                label: "All",
            },
        ];

        group.data ? (group['data'] as any).map((row: any) => {
            initial.push({
                value: row["groupID"].toString(),
                label: row["groupName"],
            });
        }) : {};
        
        return initial;
    }, [group.data])

    const filteredData = useMemo(
        () =>
            data.filter((ele: any) => {
                const filter = +groupFilter;
                if (groupFilter === "0") {
                    return ele;
                } else {
                    if ((assigned_staff.data as any).find((asEle: any) => asEle.groupID === filter && asEle.staffID === ele.staff_id)) return ele;
                }
            }),
        [groupFilter, data]
    );

    const handleModal = (
        action: string,
        FormElement: any,
        data?: [],
        prop?: {}
    ) => {
        setModalProps({
            action: action,
            data: data,
            formEle: FormElement,
            props: prop,
        });
    };

    useEffect(() => {
        if (notification.title === "Success") {
            switch (notification.action) {
                case "add": {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Shift {notification.response} has been added!</div>,
                        color: "green",
                        onClose: () => {
                            setNotification(InitialNotification);
                        },
                    });
                    break;
                }
                case "edit": {
                    notifications.show({
                        title: <div className="font-bold">Update Succesfully!</div>,
                        message: <div>Shift has been updated!</div>,
                        color: "green",
                        onClose: () => {
                            setNotification(InitialNotification);
                        },
                    });
                    break;
                }
                case "delete": {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>Shift {notification.response} has been deleted!</div>,
                        color: "green",
                        onClose: () => {
                            setNotification(InitialNotification);
                        },
                    });
                    break;
                }
                case "import": {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: <div>{notification.response}</div>,
                        color: "green",
                        onClose: () => {
                            setNotification(InitialNotification);
                        },
                    });
                    break;
                }
            }
        }

        if (notification.title === "Failed") {
            switch (notification.action) {
                case "add":
                case "edit": {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: notification.response,
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case "delete": {
                    notifications.show({
                        title: <div className="font-bold">{notification.title}</div>,
                        message: (
                            <div>
                                Encountered an error! Try refreshing the page and retry...
                            </div>
                        ),
                        color: "red",
                        onClose: () => setNotification(InitialNotification),
                    });
                    break;
                }
                case "import": {
                    notifications.show({
                        autoClose: 10000,
                        title: <div className="font-bold">Failed</div>,
                        message: <div>{notification.response}</div>,
                        color: "orange",
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
                action={modalProps?.action}
                data={modalProps?.data}
                update={update}
                setUpdate={setUpdate}
                setNotification={setNotification}
                title={modalProps?.title}
                Form={modalProps?.FormElement}
            />

            <div key="schedule" className="flex flex-col flex-1 p-2">
                <div className="flex flex-col justify-between mb-4 header lg:flex-row">
                    <div className="text-2xl font-bold">Schedule</div>
                </div>
                <div className="flex flex-col justify-between mb-3 lg:flex-row">
                    <div className="flex flex-col order-2 w-full md:flex-row lg:order-1 lg:w-1/2">
                        <div className="flex flex-col justify-between w-full gap-2 lg:gap-0">
                            <div className="flex gap-6">
                                <CustomMonthPicker
                                    value={pickerValue}
                                    onValueChange={setPickerValue}
                                />
                                <div>
                                    <NativeSelect
                                        value={groupFilter}
                                        rightSection={
                                            <CloseButton
                                                aria-label="Clear"
                                                onClick={() => setGroupFilter("0")}
                                                style={{
                                                    display: groupFilter === "0" ? "none" : undefined,
                                                }}
                                            />
                                        }
                                        rightSectionPointerEvents="auto"
                                        size="sm"
                                        label="Group"
                                        data={groupSelect as any}
                                        onChange={(event:any) =>
                                            setGroupFilter(event.currentTarget.value)
                                        }
                                        style={{
                                            width: "7.5rem",
                                        }}
                                    />
                                </div>
                            </div>
                            {!isAdmin ? <></> : (
                                <div className={"my-auto"}>
                                    <Button
                                        className="mt-6"
                                        onClick={() => {
                                            handleModal(
                                                "Import",
                                                <ImportForm
                                                    handler={handler}
                                                    update={update}
                                                    setUpdate={setUpdate}
                                                    setNotification={setNotification}
                                                    staff={staff}
                                                />,
                                                undefined,
                                                {
                                                    centered: true,
                                                }
                                            );
                                            handler.open();
                                        }}
                                    >
                                        Import CSV
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="order-1 w-full text-xs shadow lg:order-2 lg:w-1/2 shadow-1">
                        <CustomDataScroller data={shiftCategory.data} />
                    </div>
                </div>
                <div className="bg-white scheduleTable dark:bg-slate-700">
                    <ScheduleTable
                        data={filteredData}
                        dateValue={dateValue}
                        opened={opened}
                        handleModal={handleModal}
                        handler={handler}
                        update={update}
                        setUpdate={setUpdate}
                        notification={notification}
                        setNotification={setNotification}
                    />
                </div>
            </div>
        </>
    );
}

/** Scrapped? */
/*
const scheduleFormMutation = useMutationState({
    filters: {
        mutationKey: ["scheduleForm"],
    },
    select(mutation) {
        return mutation.state.status;
    },
});

const importFormMutation = useMutationState({
    filters: {
        mutationKey: ["importForm"],
    },
    select(mutation) {
        return mutation.state.status;
    },
});
*/