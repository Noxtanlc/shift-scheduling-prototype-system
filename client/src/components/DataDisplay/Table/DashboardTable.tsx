import { shiftList } from "@/types";
// import Loader from "@/common/loader";
import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { nameFilter } from "../filters";
import { useTheme } from "@/misc/ThemeProvider";

export default function DashboardTable({ ...props }) {
    const dateValue = props.dateValue;
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filter = nameFilter({
        text: filterText,
        setText: setFilterText,
        resetPaginationToggle: resetPaginationToggle,
        setResetPaginationToggle: setResetPaginationToggle,
    });
    const data = props.data;
    const filteredItems = data.filter(
        (ele: any) => ele.name && ele.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const { theme } = useTheme()!;

    const column: TableColumn<shiftList>[] = [
        {
            name: (
                <div className="flex flex-col dark:text-slate-200">
                    <div className="font-bold text-md">
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
                    <div className="my-auto font-bold text-md text-slate-600 dark:text-slate-200">
                        {row.name}
                    </div>
                </div>
            )
        },
    ];

    for (let i = 0; i < dateValue.numDay; i++) {
        column.push({
            name: (
                <div className="font-bold text-md dark:text-slate-300">
                    {i + 1}
                </div>
            ),
            center: true,
            cell: (row) => {
                return (
                    <div className="px-2 text-xs font-bold text-white rounded-xl" style={{ backgroundColor: row['shift'][i]["color"] }} >
                        <div className="text-center">{row['shift'][i]["st_alias"]}</div>
                        <div className="text-center">{row['shift'][i]["ca_alias"] ? "(" + row['shift'][i]["ca_alias"] + ")" : ""}</div>
                    </div>
                )
            },
        });
    }
    return (
        <DataTable
            columns={column}
            data={filteredItems}
            responsive
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[20, 25, 30]}
            persistTableHead
            paginationResetDefaultPage={resetPaginationToggle}
            theme={theme ? theme : undefined}
        />
    )
}