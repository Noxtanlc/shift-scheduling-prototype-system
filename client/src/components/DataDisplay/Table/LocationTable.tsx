import { useAuth } from "@/misc/AuthProvider";
import { useTheme } from "@/misc/ThemeProvider";
import { Button, Loader } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import DataTable, { TableColumn } from "react-data-table-component";
import * as icon from "react-icons/bs"

export default function LocationTable({ ...props }) {
    const { token, axiosJWT } = useAuth();
    const queryClient = useQueryClient();
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
        onSuccess: async (res:any) => {
            await queryClient.invalidateQueries({
                queryKey: ['location'],
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

    const data = props.data;
    const openModal = (value: any) => modals.openConfirmModal({
        centered: true,
        title: 'Please confirm your action',
        children: (
            <div>
                Do you wish to delete the location <span className="font-bold">({value.ca_alias})</span>?
            </div>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: async () => {
            mutation.mutate(value)
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
                            variant="transparent"
                            id='actionBtn'
                            onClick={() => {
                                props.modalHandler('Edit', 'Edit Location', row);
                                props.handler.open();
                            }}
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
    size="small"
    paginator
    rows={10}
    rowsPerPageOptions={[10, 25, 50]}
    value={data}
    tableStyle={{ minWidth: '50rem', fontSize: '0.9rem' }}
>
    <Column
        header="#"
        style={{ width: "5%" }}
        body={(_data, option) => (
            option.rowIndex + 1
        )}
    />
    <Column field="ca_alias" header="Alias" style={{ width: "10%" }} />
    <Column field="ca_desc" header="Description" style={{ width: "75%" }} />
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
                            props.modalHandler('Edit', 'Edit Location', data);
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
        )} />
</DataTable>
*/
