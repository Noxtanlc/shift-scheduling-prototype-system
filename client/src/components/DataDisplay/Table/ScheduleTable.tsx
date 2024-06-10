import { useEffect, useState } from "react";
import { nameFilter } from "../filters";
import DataTable from "react-data-table-component";
import { ActionIcon } from "@mantine/core";
import { TableColumn } from "react-data-table-component/dist/DataTable/types";
import { ScheduleForm } from "@/components/Form";
import { useAuth } from "@/misc/AuthProvider";
import { useTheme } from "@/misc/ThemeProvider";
import { TbPencil } from "react-icons/tb";
// import Loader from "@/common/loader";

export default function ScheduleTable({ ...props }) {
    const { user } = useAuth();
    const isAdmin = user.isAdmin;

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filter = nameFilter({
        text: filterText,
        setText: setFilterText,
        resetPaginationToggle: resetPaginationToggle,
        setResetPaginationToggle: setResetPaginationToggle,
    });

    const [data, setData]: any = useState([]);
    // const [loading, setLoading]: any = useState(true);

    const { theme } = useTheme()!;

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const filteredItems = data.filter(
        (ele: any) => ele.name && ele.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const columns: TableColumn<any>[] = [
        {
            name: (
                <div className="flex flex-col dark:text-slate-200">
                    <div className="text-sm font-bold">
                        Name
                    </div>
                    <div>
                        {filter}
                    </div>
                </div>
            ),
            selector: (row: any) => row['name'],
            center: false,
            minWidth: "250px",
            cell: (row: any) => (
                <div className='flex flex-row justify-between w-full dark:text-slate-300'>
                    <div className="my-auto text-sm font-bold text-slate-600 dark:text-slate-200">
                        {row.name}
                    </div>
                    {!isAdmin ? <></> : (
                        <ActionIcon onClick={() => {
                            props.handleModal('Schedule', <ScheduleForm
                                id='schedule'
                                dateValue={props.dateValue}
                                staff_id={row.staff_id}
                                handler={props.handler}
                                update={props.update}
                                setUpdate={props.setUpdate}
                                notification={props.notification}
                                setNotification={props.setNotification}
                            />
                            )
                            props.handler.open();
                        }}>
                            <TbPencil />
                        </ActionIcon>
                    )
                    }
                </div>
            )
        },
    ];

    for (let d = 1; d <= props.dateValue.numDay; d++) {
        columns.push(
            {
                name: (
                    <div className="text-sm font-bold dark:text-slate-300">
                        {d}
                    </div>
                ),
                center: true,
                cell: (row: any) => (
                    <div className="px-2 text-xs font-bold text-white rounded-xl" style={{ backgroundColor: row['shift'][d - 1]["color"] }} >
                        <div className="text-center">{row['shift'][d - 1]["st_alias"]}</div>
                        <div className="text-center">{row['shift'][d - 1]["ca_alias"] ? "(" + row['shift'][d - 1]["ca_alias"] + ")" : ""}</div>
                    </div>
                ),
            }
        )
    }

    /*
    useEffect(() => {
        if (!loading) {
            setLoading(true);
        }
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => {
            clearTimeout(timer);
        }
    }, [props.dateValue.numDay])
    */

    return (
        <DataTable
            columns={columns}
            data={filteredItems}
            responsive
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[20, 25, 30]}
            persistTableHead
            paginationResetDefaultPage={props.resetPaginationToggle}
            theme={theme ? theme : undefined}
        />
    )
}