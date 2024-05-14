import { Button, Loader } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import * as icon from "react-icons/bs";
import { useTheme } from "@/hook/ThemeProvider";

export default function GroupTable({ ...props }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["groupForm"],
        mutationFn: (data: any) => {
            return axios.post('http://127.0.0.1:3001/api/group/' + data['groupID'], {
                action: "Delete",
                data: data,
            })
        },
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({
                queryKey: ['group'],
                refetchType: 'all',
            });

            await queryClient.invalidateQueries({
                queryKey: ['assignedStaff'],
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
    const [pending, setPending] = useState(true);
    const openModal = (value: any) => modals.openConfirmModal({
        centered: true,
        title: 'Please confirm your action',
        children: (
            <div>
                Do you wish to delete the group <span className="fw-bold">{value.groupName}</span>?
            </div>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: async () => {
            mutation.mutate(value);
        },
    });
    const [filterText, _setFilterText] = useState('');
    const [resetPaginationToggle, _setResetPaginationToggle] = useState(false);
    const groupData = props.GroupData;
    const filteredItems = groupData.filter(
        (ele: any) => ele.groupName && ele.groupName.toLowerCase().includes(filterText.toLowerCase()),
    );

    const { theme } = useTheme()!;

    const col: TableColumn<any>[] = [
        {
            name: "#",
            selector: (_row: any, index: any) => index + 1,
            minWidth: "50px",
            maxWidth: "5%",
        },
        {
            name: "Name",
            cell: (row: any) => (
                <div className="text-sm ">{row.groupName}</div>
            ),
            reorder: false,
            maxWidth: "15%"
        },
        {
            name: "Employee List",
            cell: (row: any) => (
                <div className='flex lg:flex-row gap-1 flex-wrap'>
                    {staffList(row.staff)}
                </div>
            ),
            maxWidth: "70%",
        },
        {
            name: "Action",
            width: '100px',
            maxWidth: "10%",
            cell: (row: any) => (
                <div className="flex lg:flex-row flex-col justify-between lg:my-0 my-1">
                    <div className='mx-auto'>
                        <Button
                            variant="transparent"
                            id='actionBtn'
                            onClick={() => {
                                props.modalFunction('Edit', 'Edit Group', row);
                                props.handler.open();
                            }
                            }
                        >
                            <icon.BsPencil />
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
                            <icon.BsXCircle />
                        </Button>
                    </div>
                </div>
            ),
            center: true
        }
    ]

    const staffList = (row: any) => {
        const staff = [];
        for (let i = 0; i < row.length; i++) {
            staff.push(
                <div key={row[i]['staffID']} className="font-bold lg:my-1 my-2">
                    <div className="bg-sky-600 p-1 px-2 rounded-full text-center text-white">{row[i]['name']}</div>
                </div>
            );
        }
        return staff;
    }

    useEffect(() => {
        if (queryClient.isFetching({ queryKey: ['GroupPage'] })) setPending(true)
        setPending(false);
    }, [queryClient.isFetching]);

    return (
        <DataTable
            progressPending={pending}
            columns={col}
            data={filteredItems}
            responsive
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            progressComponent={<Loader />}
            persistTableHead
            theme={theme ? theme : undefined}
        />
    )
}
