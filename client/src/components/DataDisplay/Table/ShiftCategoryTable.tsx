import Loader from "@/common/loader";
import { useAuth } from "@/misc/AuthProvider";
import { useTheme } from "@/misc/ThemeProvider";
import { Button } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import * as icon from "react-icons/bs"

export default function ShiftCategoryTable({ ...props }) {
    const { token } = useAuth();
    const data = props.data;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["ShiftCategoryForm"],
        mutationFn: (data: any) => {
            return axios.post('http://127.0.0.1:3001/api/shift-category/' + data['id'], {
                action: "Delete",
                data: data,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
        },
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({
                queryKey: ['shiftCategory'],
                refetchType: 'all',
            });

            props.setUpdate(!props.update);
            props.setNotification({
                action: 'Delete',
                title: res.data.title,
                message: res.data.message
            });
        },
    });
    const openModal = (value: any) => modals.openConfirmModal({
        centered: true,
        title: 'Please confirm your action',
        children: (
            <div>
                Do you wish to delete the shift category <span className="font-bold">({value.st_name})</span>?
            </div>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: async () => mutation.mutate(value),
    });

    const { theme } = useTheme()!;

    const col: TableColumn<any>[] = [
        {
            name: "#",
            selector: (_row: any, index: any) => index + 1,
            center: false,
            minWidth: '50px',
            maxWidth: '5%',
        },
        {
            name: "Name",
            selector: (row: any) => row.st_name,
            center: false,
            maxWidth: '30%',
            reorder: false,
        },
        {
            name: "Alias",
            cell: (row: any) => row.st_alias,
            maxWidth: '15%',
        },
        {
            name: "Color Code",
            minWidth: '120px',
            maxWidth: '10%',
            cell: (row: any) => (
                <div className="w-full" style={
                    {
                        backgroundColor: row['color-coding'],
                        color: row['color-coding']
                    }
                }>
                    {row['color-coding']}
                </div>
            ),
            center: true
        },
        {
            name: "Start Time",
            center: true,
            minWidth: '120px',
            maxWidth: '15%',
            cell: (row: any) => {
                let timeArr: any = row['start_time'].split(":");
                let time = new Date(0, 0, 0, timeArr[0], timeArr[1])
                    .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: "h23" });
                /*
                let timeLabel: any;
                if (+(timeArr[0]) < 12) {
                    timeLabel = 'AM'
                } else
                    timeLabel = 'PM'
                */
                return (
                    <div className="text-right">
                        {time}
                    </div>
                )
            },
        },
        {
            name: "End Time",
            center: true,
            maxWidth: '10%',
            cell: (row: any) => {
                let timeArr: any = row['end_time'].split(":");
                let time = new Date(0, 0, 0, timeArr[0], timeArr[1])
                    .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: "h23" });
                /*
                let timeLabel: any;
                if (+(timeArr[0]) < 12) {
                    timeLabel = 'AM'
                } else
                    timeLabel = 'PM'
                */
                return (
                    <div className="text-right">
                        {time}
                    </div>
                )
            },
        },
        {
            name: "Status",
            maxWidth: '5%',
            cell: (row: any) => {
                let status: string;

                if (row['active'] === 1) {
                    status = "Active"
                } else
                    status = "Disabled"
                return (
                    <>
                        {status}
                    </>
                )
            },
            center: true
        },
        {
            name: "Action",
            maxWidth: '10%',
            cell: (row: any) =>
                <div className="flex flex-col justify-between flex-1 md:flex-row">
                    <div className='mx-auto'>
                        <Button
                            variant="transparent"
                            id='actionBtn'
                            onClick={() => {
                                props.modalHandler('Edit', 'Edit Shift Category', row);
                                props.handler.open();
                            }}
                        >
                            <icon.BsPencil size='16' />
                        </Button>
                    </div>
                    <div className='mx-auto'>
                        <Button
                            variant="transparent"
                            id='actionBtn'
                            onClick={() => {
                                openModal(row);
                            }}
                        >
                            <icon.BsXCircle size='16' />
                        </Button>
                    </div>
                </div>,
            center: true
        },
    ]

    return (
        <DataTable
            columns={col}
            data={data}
            responsive
            pagination
            progressComponent={<Loader />}
            persistTableHead
            theme={theme ? theme : undefined}
        />
    )
}

/*
<DataTable
    className="dark:bg-gray-900"
    size="small"
    paginator
    rows={10}
    rowsPerPageOptions={[10, 25, 50]}
    value={data}
    tableStyle={{ minWidth: '50rem', fontSize: '0.9rem' }}
    paginatorRight
>
    <Column
        header="#"
        style={{ width: "5%" }}
        body={(_data, option) => (
            option.rowIndex + 1
        )}
    />
    <Column field="st_name" header="Name" style={{ width: "40%" }} />
    <Column field="st_alias" header="Alias" style={{ width: "10%" }} align={"center"} />
    <Column field="color-coding" header="Color Code" style={{ width: "10%" }}
        body={(data) => (
            <div className="w-100" style={
                {
                    backgroundColor: data['color-coding'],
                    color: data['color-coding']
                }
            }>
                {data['color-coding']}
            </div>
        )}
    />
    <Column field="start_time" header="Start Time" style={{ width: "10%" }}
        body={(data) => {
            let timeArr: any = data['start_time'].split(":");
            let time = new Date(0, 0, 0, timeArr[0], timeArr[1])
                .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: "h23" });
            let timeLabel: any;
            if (+(timeArr[0]) < 12) {
                timeLabel = 'AM'
            } else
                timeLabel = 'PM'
            return (
                <div className="text-right">
                    {time} {timeLabel}
                </div>
            )
        }}
    />
    <Column field="end_time" header="End Time" style={{ width: "10%" }}
        body={(data) => {
            let timeArr: any = data['end_time'].split(":");
            let time = new Date(0, 0, 0, timeArr[0], timeArr[1])
                .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: "h23" });
            let timeLabel: any;
            if (+(timeArr[0]) < 12) {
                timeLabel = 'A.M'
            } else
                timeLabel = 'P.M'
            return (
                <div className="text-right">
                    {time} {timeLabel}
                </div>
            )
        }}
    />
    <Column field="active" header="Status" style={{ width: "10%" }} align={"center"}
        body={(data) => {
            let status: string;

            if (data['active'] === 1) {
                status = "Active"
            } else
                status = "Disabled"
            return (
                <>
                    {status}
                </>
            )
        }}
    />
    <Column
        style={{ width: "10%" }}
        align="center"
        header="Action"
        body={(data) => (
            <div className="flex justify-between flex-1">
                <div className=''>
                    <Button
                        className='py-0 ps-3 pe-3'
                        variant="transparent"
                        id='actionBtn'
                        onClick={() => {
                            props.modalHandler("Edit", data);
                            props.handler.open();
                        }}
                    >
                        <icon.BsPencil size='16' />
                    </Button>
                </div>
                <div className=''>
                    <Button className='py-0 ps-3 pe-3'
                        variant="transparent"
                        id='actionBtn'
                        onClick={() => {
                            openModal(data);
                        }}
                    >
                        <icon.BsXCircle size='16' />
                    </Button>
                </div>
            </div>
        )}
    />

</DataTable>
*/