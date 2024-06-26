import { useMemo, useState } from "react";
import MonthPicker from "@/components/Datepicker/CustomMonthPicker";
import { Button, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { ScheduleData } from "@/misc/ScheduleData";
import { DashboardTable } from "@/components/DataDisplay";
import { useAuth } from "@/misc/AuthProvider";
import { shiftList } from "@/types";
import { queriesApi } from "@/misc/FetchDataApi";
import { BsCalendarEvent } from "react-icons/bs";
import { Clipboard2Data, PersonSquare, PinMap } from "react-bootstrap-icons";

export default function Dashboard() {
    const { user } = useAuth();
    const isAdmin = user.isAdmin;
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

    const {staff, shift} = queriesApi();

    const data: shiftList[] = ScheduleData(dateValue, staff.data, shift.data) ?? [];

    return (
        <div key="dashboard" className="flex flex-col flex-1 p-2">
            <div className="flex flex-col mb-4">
                <div className="my-2 text-2xl font-bold TileHeader">Quick Shortcuts</div>
                <div
                    className="inline-grid grid-flow-col p-2 mx-auto rounded auto-cols-auto place-items-center bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800"
                >
                    <Tooltip label="Schedule" position="bottom" openDelay={500} events={{ hover: true, focus: true, touch: true }}>
                        <Button
                            component={Link}
                            justify="center"
                            id="quickTile"
                            to="/overview"
                        >
                            <div className="flex flex-col h-full">
                                <div className="items-center my-auto md:h-1/2 md:flex">
                                    <BsCalendarEvent className="mx-auto" size={24} />
                                </div>
                                <div className="items-center hidden md:h-1/2 md:flex">
                                    Schedule
                                </div>
                            </div>
                        </Button>
                    </Tooltip>
                    <Tooltip label="Shift Category" position="bottom" openDelay={500} events={{ hover: true, focus: true, touch: true }}>
                        <Button
                            component={Link}
                            justify="center"
                            id="quickTile"
                            to="/shift-category"
                        >
                            <div className="flex flex-col h-full">
                                <div className="items-center my-auto md:h-1/2 md:flex">
                                    <Clipboard2Data className="mx-auto" size={24} />
                                </div>
                                <div className="items-center hidden md:h-1/2 md:flex">
                                    Shift Category
                                </div>
                            </div>
                        </Button>
                    </Tooltip>
                    {isAdmin ? (
                        <>
                            <Tooltip label="Location" position="bottom" openDelay={500} events={{ hover: true, focus: true, touch: true }}>
                                <Button
                                    component={Link}
                                    justify="center"
                                    id="quickTile"
                                    to="/location"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="items-center my-auto md:h-1/2 md:flex">
                                            <PinMap className="mx-auto" size={24} />
                                        </div>
                                        <div className="items-center hidden md:h-1/2 md:flex">
                                            Location
                                        </div>
                                    </div>
                                </Button>
                            </Tooltip>
                            <Tooltip label="Group" position="bottom" openDelay={500} events={{ hover: true, focus: true, touch: true }}>
                                <Button component={Link} justify="center" id="quickTile" to="/group">
                                    <div className="flex flex-col h-full">
                                        <div className="items-center my-auto md:h-1/2 md:flex">
                                            <PersonSquare className="mx-auto" size={24} />
                                        </div>
                                        <div className="items-center hidden md:h-1/2 md:flex">Group</div>
                                    </div>
                                </Button>
                            </Tooltip>
                        </>
                    ) : <></>}

                </div>
            </div>
            <div className="mb-4">
                <div className="text-2xl font-bold TileHeader">Schedules</div>
                <div className="mb-3">
                    <div className="lg:w-32">
                        <MonthPicker value={pickerValue} onValueChange={setPickerValue} />
                    </div>
                </div>
                <div className="w-full overflow-x-auto">
                    <DashboardTable data={data} dateValue={dateValue} />
                </div>
            </div>
        </div>
    );
}
