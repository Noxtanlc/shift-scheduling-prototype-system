import Loader from "@/common/loader";
import { useAuth } from "@/misc/AuthProvider";
import { useTheme } from "@/misc/ThemeProvider";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import DataTable, { TableColumn } from "react-data-table-component";
import * as icon from "react-icons/bs"

export default function ShiftCategoryTable({ ...props }) {
    const { token, axiosJWT } = useAuth();
    const data = props.data;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["ShiftCategoryForm"],
        mutationFn: (data: any) => {
            return axiosJWT.post('http://127.0.0.1:3001/api/shift-category/' + data['id'], {
                action: "Delete",
                data: data,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
        },
        onSuccess: async (res:any) => {
            await queryClient.invalidateQueries({
                queryKey: ['shiftCategory'],
                refetchType: 'all',
            });

            await queryClient.invalidateQueries({
                queryKey: ['shift'],
                refetchType: 'all',
            });

            props.setUpdate(!props.update);
            props.setNotification({
                action: 'Delete',
                title: res.data.title,
                response: res.data.response
            });
        },
    });
    const openModal = (value: any) => modals.openConfirmModal({
        classNames: {
            header: 'bg-red-600'
        },
        centered: true,
        title: <span className="font-bold text-white">Please confirm your action</span>,
        children: (
            <div className="mt-4">
                Do you wish to delete the shift category <span className="font-bold">({value.st_name})</span>? All employees' shift assigned with the shift category will be removed!
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
            width: '120px',
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