import { shiftList } from "@/types";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat);

export function ScheduleData(dateValue: any, staffList: any, shiftData: any) {
    var data: shiftList[] = [];

    if (staffList && shiftData) {
        const staff = staffList;
        const shift = shiftData;
        
        const filteredData = shift.filter((ele: any) => {
            const start_date: [year: number, month: number] = ele.start_date.split('-');
            const end_date: [year: any, month: any] = ele.end_date.split('-');
            return (
                (dateValue.month === +(start_date[1])) && (dateValue.year === +(start_date[0]))
            ) || (
                    (dateValue.month === +(end_date[1])) && (dateValue.year === +(end_date[0]))
                );
        });

        staff.map((ele: any) => {
            data.push({
                staff_id: ele["staff_id"],
                name: ele["name"],
                shift: [],
            });
        });

        data.forEach((staff_ele: any) => {
            let days = dateValue.numDay;
            let dayCount = 1;
            let shift_id = staff_ele['staff_id'];
            let filteredShiftData = [] = shift.filter((ele: any) => ele['FKstaffID'] == shift_id);

            if (filteredData.length === 0) {
                for (let i = 1; i <= days; i++) {
                    let date = new Date(dateValue.year + '-' + dateValue.month + '-' + dayCount);
                    let dateString = date.toLocaleDateString('en-GB');

                    staff_ele['shift'].push({
                        shift_id: null,
                        start_date: dateString,
                        end_date: '',
                        st_id: null,
                        st_alias: '',
                        color: '',
                        ca_id: null,
                        ca_alias: '',
                    })
                    dayCount++;
                }
            } else {
                for (let i = 1; i <= days; i++) {
                    let hasData = false;
                    let range = 0;
                    let overlap = 0;
                    var dateString = dateValue.year + '-' + dateValue.month + '-' + dayCount;
                    var date = dayjs(dateString);
                    var dateFormatted = date.format('DD/MM/YYYY');

                    filteredShiftData.forEach((ele: any) => {
                        let sdate = dayjs(ele['start_date']);
                        let sdateFormatted = sdate.format('DD/MM/YYYY');
                        let edate = dayjs(ele['end_date']);
                        let edateFormatted = edate.format('DD/MM/YYYY')
                        if (sdate.isBefore(date) && (edate.isAfter(date) && !edate.isBefore(date))) {
                            overlap = edate.diff(date, 'day');
                            if (overlap !== 0) {
                                for (let n = 0; n <= overlap; n++) {
                                    staff_ele['shift'].push({
                                        shift_id: ele['id'],
                                        start_date: sdateFormatted,
                                        end_date: edateFormatted,
                                        st_id: ele["st_id"],
                                        st_alias: ele["st_alias"],
                                        color: ele["color-coding"],
                                        ca_id: ele["ca_id"],
                                        ca_alias: ele["ca_alias"]
                                    });
                                }
                                dayCount += overlap + 1;
                                days -= overlap + 1;
                                dateString = dateValue.year + '-' + dateValue.month + '-' + dayCount;
                                date = dayjs(new Date(dateString));
                                dateFormatted = date.format('DD/MM/YYYY');
                            }
                            hasData = true;
                        }

                        if (sdate.isSame(date)) {
                            range = edate.diff(sdate, "day");
                            if (range > 0) {
                                for (let n = 0; n <= range; n++) {
                                    staff_ele['shift'].push({
                                        shift_id: ele['id'],
                                        start_date: sdateFormatted,
                                        end_date: edateFormatted,
                                        st_id: ele["st_id"],
                                        st_alias: ele["st_alias"],
                                        color: ele["color-coding"],
                                        ca_id: ele["ca_id"],
                                        ca_alias: ele["ca_alias"]
                                    });
                                    if (dayCount !== dateValue.numDay) {
                                        dayCount++;
                                        dateString = dateValue.year + '-' + dateValue.month + '-' + dayCount;
                                        date = dayjs(new Date(dateString));
                                        dateFormatted = date.format('DD/MM/YYYY');
                                    } else {
                                        break;
                                    }
                                }
                                days -= range;
                            } else {
                                staff_ele['shift'].push({
                                    shift_id: ele['id'],
                                    start_date: sdateFormatted,
                                    end_date: edateFormatted,
                                    st_id: ele["st_id"],
                                    st_alias: ele["st_alias"],
                                    color: ele["color-coding"],
                                    ca_id: ele["ca_id"],
                                    ca_alias: ele["ca_alias"]
                                });
                                dayCount++;
                            }
                            hasData = true;
                        }
                    });

                    if (!hasData) {
                        staff_ele['shift'].push({
                            shift_id: null,
                            start_date: dateFormatted,
                            end_date: '',
                            st_id: null,
                            st_alias: '',
                            color: '',
                            ca_id: null,
                            ca_alias: '',
                        });
                        dayCount++;
                    }
                }
            }
        });
    }

    return data;
}   