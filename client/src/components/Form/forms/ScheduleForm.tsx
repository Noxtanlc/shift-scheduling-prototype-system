import { Button, Table, NativeSelect, Tooltip } from "@mantine/core";
import { DateInput, DateInputProps } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScheduleData } from "@/misc/ScheduleData";
import { shiftList } from "@/types";
import { notifications } from "@mantine/notifications";
import { getShiftCategory, getShiftData, getStaff, getLocation } from "@/api";
import { CustomMonthPicker } from "@/components/Datepicker";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "@/misc/AuthProvider";

const dateParser: DateInputProps['dateParser'] = (input) => {
    return dayjs(input, 'DD/MM/YYYY').toDate();
};

function CustomTable({ ...props }) {
    interface TableBody {
        row: number,
        body?: any[] | undefined;
    }

    const dateValue = props.dateValue;
    const data: shiftList = props.shiftData;

    const days = [{
        value: 0,
        day: 'Sun'
    }, {
        value: 1,
        day: 'Mon'
    }, {
        value: 2,
        day: 'Tue'
    }, {
        value: 3,
        day: 'Wed'
    }, {
        value: 4,
        day: 'Thu'
    }, {
        value: 5,
        day: 'Fri'
    }, {
        value: 6,
        day: 'Sat'
    }];

    var TableBodyContent: TableBody[] = [];
    var rowCount = 0;
    var dayCount = 0;
    var nullDay = 0;
    var inserted = false;
    var body = (<></>);
    const setBody = (index?: number, ele?: any) =>
        ele ? (
            <Table.Td key={"dayIndex-" + index} className="h-12">
                <Tooltip label={'Day ' + (index! + 1)} position='bottom' withArrow>
                    <Button fullWidth color={ele.color}
                        styles={{
                            root: {
                                height: "100%",
                                padding: 0,
                                fontSize: "0.5rem"
                            }
                        }}
                        onClick={() => {
                            if (ele.shift_id !== null) {
                                props.setAction('edit');
                            } else {
                                props.setAction('add');
                            }
                            let sdate = ele.start_date.split('/');
                            let edate = ele.end_date.split('/');
                            if (ele.end_date === '') {
                                edate = sdate;
                            }
                            /*
                            props.form.setInitialValues({
                                id: ele.shift_id === null ? undefined : ele.shift_id,
                                s_date: dayjs(sdate[2] + '/' + sdate[1] + '/' + sdate[0]).toDate(),
                                e_date: dayjs(edate[2] + '/' + edate[1] + '/' + edate[0]).toDate(),
                                st_id: ele.st_id === null ? null : ele.st_id,
                                ca_id: ele.ca_id === null ? null : ele.ca_id
                            });
                            */
                            props.form.setValues({
                                id: ele.shift_id === null ? undefined : ele.shift_id,
                                s_date: dayjs(sdate[2] + '/' + sdate[1] + '/' + sdate[0]).toDate(),
                                e_date: dayjs(edate[2] + '/' + edate[1] + '/' + edate[0]).toDate(),
                                st_id: ele.st_id === null ? null : ele.st_id,
                                ca_id: ele.ca_id === null ? null : ele.ca_id
                            });

                        }}
                    >
                        <div className="font-bold">
                            <div>
                                {ele.st_alias}
                            </div>
                            <div>
                                {ele.ca_alias}
                            </div>
                        </div>
                    </Button>
                </Tooltip>
            </Table.Td>
        ) : (
            <Table.Td key={"nullDay-" + index} />
        )

    data ? data.shift.forEach((ele, index: any) => {
        const date = dayjs(dateValue.year + '/' + dateValue.month + '/' + (index + 1));
        const diff = date.diff(dayjs(ele.start_date, 'DD/MM/YYYY'), 'day');
        const day = dayjs(ele.start_date, 'DD/MM/YYYY').add(diff, 'day').day() ?? dayjs(ele.start_date).day();

        if (dayCount === 0) {
            TableBodyContent.push({
                row: rowCount,
                body: [],
            });

            if (!inserted) {
                days.forEach((days_ele: any) => {
                    if (day === days_ele.value) {
                        body = setBody(index, ele);
                        TableBodyContent[rowCount].body?.push(body);
                        dayCount++;
                        inserted = true;
                        return;
                    } else {
                        if (!inserted) {
                            body = setBody(nullDay);
                            TableBodyContent[rowCount].body?.push(body);
                            nullDay++;
                            dayCount++;
                        }
                    }
                });
            }
        }

        if (day === dayCount) {
            body = setBody(index, ele);
            TableBodyContent[rowCount].body?.push(body);
            dayCount++;
        }

        if (dayCount > 6) {
            dayCount = 0;
            rowCount++;
        }

    }) : <></>;

    return (
        <>
            <Table.ScrollContainer minWidth={350}>
                <Table id='scheduleFormTable'
                    classNames={{
                        table: "min-h-72",
                        th: "lg:text-base text-xs min-w-10",
                    }}
                    withColumnBorders
                    styles={{
                        td: {
                            textAlign: 'center',
                            padding: '0px',
                            maxHeight: '5px !important',
                        },
                        th: {
                            padding: '0px',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            textAlign: 'center'
                        },
                    }}>
                    <Table.Thead>
                        <Table.Tr>
                            {days.map((ele: any) => (
                                <Table.Th key={"dayIndex-" + ele.value}>{ele.day}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {TableBodyContent.length !== 0 ? TableBodyContent.map((ele: any, index) => (
                            <Table.Tr key={"weekRow-" + index}>
                                {ele.body}
                            </Table.Tr>
                        )) : <></>}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </>
    )
}

export default function ScheduleForm({ ...props }) {
    interface FormType {
        id: string | number | undefined;
        s_date: Date | undefined;
        e_date: Date | undefined;
        st_id: number | null;
        ca_id: number | null;
    }
    const queryClient = useQueryClient();
    const { token } = useAuth();

    let shift = useQuery({
        ...getShiftData(token.accessToken),
        initialData: queryClient.getQueryData(['shift']),
    }).data;
    const staff: any = useQuery({
        ...getStaff(token.accessToken),
        initialData: queryClient.getQueryData(['staff']),
        enabled: false,
    }).data;
    const shiftCategory: any = useQuery({
        ...getShiftCategory(token.accessToken),
        initialData: queryClient.getQueryData(['shiftCategory']),
        enabled: false,
    }).data;
    let location: any = useQuery({
        ...getLocation(token.accessToken),
        initialData: queryClient.getQueryData(['location']),
        enabled: false,
    }).data;

    const st = shiftCategory.filter((ele: any) => ele.active === 1)
    const [pickerValue, setPickerValue] = useState<Date | null>(new Date(props.dateValue.year, props.dateValue.month - 1, 1));
    const dateValue = useMemo(() => {
        return {
            month: pickerValue!.getMonth() + 1,
            year: pickerValue!.getFullYear(),
            numDay: new Date(pickerValue!.getFullYear(), pickerValue!.getMonth() + 1, 0).getDate()
        }
    }, [pickerValue]);

    const filteredStaff = staff.filter((ele: any) => ele.staff_id === props.staff_id);
    const data = useMemo(() => ScheduleData(dateValue, filteredStaff, shift)[0], [shift]);

    const st_select: any = [{
        label: 'Select',
        value: 0,
    }];
    const ca_select: any = [{
        label: 'None',
        value: 0,
    }];

    st.map((ele: any) => {
        st_select.push({
            label: ele.st_alias,
            value: ele.id,
        });
    });
    location.map((ele: any) => {
        ca_select.push({
            label: ele.ca_alias,
            value: ele.ca_id,
        });
    });

    const [action, setAction] = useState('add');
    const sDateRef = useRef<HTMLInputElement>(null);
    const eDateRef = useRef<HTMLInputElement>(null);

    const initialValues = {
        id: undefined,
        s_date: dayjs(new Date()).toDate(),
        e_date: dayjs(new Date()).toDate(),
        st_id: null,
        ca_id: null,
    };

    const form = useForm<FormType>({
        mode: 'uncontrolled',
        initialValues,
        validate: {
            st_id: (value) =>
                value === 0 ? 'Select a shift category' : null,
            s_date: (value) => {
                if (dayjs(value) > dayjs(form.getValues().e_date)) {
                    return (
                        'Start date cannot be greater than end date'
                    );
                } else {
                    return null;
                }
            },
        }
    });

    const mutation = useMutation({
        mutationKey: ['scheduleForm'],
        mutationFn: (value: FormType) => {
            return axios.post('http://127.0.0.1:3001/api/shifts/staff/' + props.staff_id, {
                data: {
                    id: value.id,
                    start_date: dayjs(value.s_date).format('YYYY-MM-DD'),
                    end_date: dayjs(value.e_date).format('YYYY-MM-DD'),
                    st_id: value.st_id,
                    ca_id: value.ca_id
                },
                action: action,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
        },
        onSuccess: async (res: any) => {
            await queryClient.invalidateQueries({
                queryKey: ['shift'],
                refetchType: 'all',
            });

            props.setUpdate(!props.update);
            props.setNotification({
                action: action,
                title: res.data.title,
                response: res.data.response
            });
        },
        onError: (res: any) => {
            props.setUpdate(!props.update);
            props.setNotification({
                action: action,
                title: res.data.title,
                response: res.data.response,
            });
        },
    });

    useEffect(() => {
        if (mutation.isSuccess) {
            shift = queryClient.getQueryData(['shift']);
            mutation.reset();
            form.setInitialValues(initialValues);
            setAction('');
            form.reset();
        }
    }, [mutation.status]);

    return (
        <div className="flex flex-col gap-2 overflow-y-auto md:flex-row">
            <div className="w-full pb-4 border-b border-r-0 lg:p-2 lg:border-r-2 md:border-b-0 dark:border-zinc-200 lg:pb-0 md:w-96">
                <CustomMonthPicker
                    value={pickerValue}
                    onValueChange={setPickerValue}
                />
                <CustomTable shiftData={data} setAction={setAction} form={form} dateValue={dateValue} />
            </div>
            <div className="w-full p-2 md:w-80">
                <form id="ScheduleForm" className="my-2"
                    onSubmit={form.onSubmit((data) => {
                        if (!!form.isDirty()) mutation.mutate(data);
                        else {
                            notifications.show({
                                title: <div className="font-bold">Warning</div>,
                                message: <div>If you wish to update the following shift, change the detail and click save.</div>,
                                color: "yellow",
                            });
                        }

                    })}
                >
                    <div className="pb-2 border-b-2 dark:border-zinc-200">
                        <span className="font-bold">{data.name}</span>
                    </div>
                    <div className="h-6">
                        {form.getValues().id !== undefined ? (

                            <span className="text-sm italic text-slate-600 dark:text-slate-200">Shift ID: {form.getValues().id}</span>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="flex flex-row gap-8">
                        <div className="w-full">
                            <DateInput
                                allowDeselect={false}
                                key={form.key('s_date')}
                                title="Start Date"
                                label="Pick start date"
                                valueFormat="DD/MM/YYYY"
                                placeholder="Select date"
                                type="default"
                                classNames={{
                                    label: "text-nowrap"
                                }}
                                required
                                ref={sDateRef}
                                dateParser={dateParser}
                                error="Please select a date!"
                                {...form.getInputProps('s_date')}
                            />
                        </div>
                        <div className="w-full">
                            <DateInput
                                allowDeselect={false}
                                key={form.key('e_date')}
                                title="End Date"
                                placeholder="Select date"
                                label="Pick end date"
                                valueFormat="DD/MM/YYYY"
                                required
                                ref={eDateRef}
                                dateParser={dateParser}
                                minDate={form.getValues().s_date}
                                error="Please select a date!"
                                {...form.getInputProps('e_date')}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div>
                            <NativeSelect title="Select Shift Category"
                                label="Select Shift Category" data={st_select}
                                required
                                key={form.key('st_id')}
                                {...form.getInputProps('st_id')}
                            />

                        </div>
                        <div>
                            <NativeSelect title="Select Control Area"
                                label="Select Location" data={ca_select}
                                key={form.key('ca_id')}
                                {...form.getInputProps('ca_id')}
                            />
                        </div>
                    </div>

                </form>
                <div className="flex justify-between mb-8">
                    <Button onClick={() => {
                        form.reset();
                        // form.setInitialValues(initialValues);
                        setAction('add');
                    }}
                    >
                        Reset
                    </Button>

                    <div className="flex gap-3">
                        <Button color="red"
                            style={{ display: action === 'edit' || action === 'delete' ? undefined : 'none' }}
                            onClick={(e) => {
                                e.preventDefault();
                                setAction('delete');
                                mutation.mutate(form.getValues());
                            }}
                        >
                            Delete
                        </Button>
                        <Button type='submit' form="ScheduleForm">
                            Save
                        </Button>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => {
                        props.handler.close();
                    }}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}