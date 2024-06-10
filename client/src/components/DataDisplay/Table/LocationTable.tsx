import { useAuth } from "@/misc/AuthProvider";
import { useTheme } from "@/misc/ThemeProvider";
import { Button, Loader } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BsPencil, BsXCircle } from "react-icons/bs";

export default function LocationTable({ ...props }) {
    const { token, axiosJWT } = useAuth();
    const [disabled, setDisabled] = useState(false);
    const queryClient = useQueryClient();
    const locationQuery = useQuery({
        queryKey: ['location'],
    });
    const mutation = useMutation({
        mutationKey: ["locationForm"],
        mutationFn: (data: any) => {
            return axiosJWT.post('http://127.0.0.1:3001/api/location/' + data['ca_id'], {
                action: "Delete",
                data: data,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
        },
        onMutate: () => {
            setDisabled(true);
        },
        onSuccess: (res:any) => {
            locationQuery.refetch();
            props.setUpdate(!props.update);
            props.setNotification({
                action: 'Delete',
                title: res.data.title,
                message: res.data.message
            });
            setDisabled(false);
        },
    });

    const data = props.data;
    const openModal = (value: any) => modals.openConfirmModal({
        classNames: {
            header: 'bg-red-600'
        },
        centered: true,
        title: <span className="font-bold text-white">Please confirm your action</span>,
        children: (
            <div className="mt-4">
                Do you wish to delete the location <span className="font-bold">({value.ca_alias})</span>?
            </div>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: async () => {
            mutation.mutate(value);
        },
    });

    const { theme } = useTheme()!;

    const col: TableColumn<any>[] = [
        {
            name: "#",
            selector: (_row: any, index: any) => index + 1,
            center: false,
            width: "50px",
        },
        {
            name: "Alias",

            selector: (row: any) => row.ca_alias,
            center: false,
            width: "100px",
            reorder: false,
        },
        {
            name: "Description",
            cell: (row: any) => row.ca_desc,
        },
        {
            name: "Action",
            width: '120px',
            cell: (row: any) =>
                <div className="flex flex-col justify-between md:flex-row lg:my-1">
                    <div className='mx-auto'>
                        <Button
                            disabled={disabled}
                            variant="transparent"
                            id='actionBtn'
                            onClick={() => {
                                props.modalHandler('Edit', 'Edit Location', row);
                                props.handler.open();
                            }}
                        >
                            <BsPencil />
                        </Button>
                    </div>
                    <div className='mx-auto'>
                        <Button
                            disabled={disabled}
                            variant="transparent"
                            id='actionBtn'
                            onClick={() => {
                                openModal(row);
                            }}
                        >
                            <BsXCircle />
                        </Button>
                    </div>
                </div>,
            center: true
        },
    ]


    const [pending, setPending] = useState(false);
    useEffect(() => {
        if (queryClient.isFetching({ queryKey: ['location'] })) setPending(true)
        else setPending(false);
    }, [queryClient.isFetching]);

    return (
        <DataTable
            progressPending={pending}
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
