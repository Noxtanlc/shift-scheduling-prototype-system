import { Button, FileInput, Tooltip, Divider } from "@mantine/core";
import { MonthPickerInput, YearPickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import Papa from 'papaparse';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TbAsterisk, TbDownload } from "react-icons/tb";
import { modals } from "@mantine/modals";
import { useAuth } from "@/misc/AuthProvider";
import { queriesApi } from "@/misc/FetchDataApi";

dayjs.extend(customParseFormat);

const addNotes = {
    asterisk: <TbAsterisk color={'red'} />,
    notes: [
        "Only shift category ID or shift alias are accepted for importing process.",
        "Locations are not supproted for now.",
        "Employee's shift will not be changed if nothing is entered in the row of that employee.",
    ]
}

export default function ImportForm({ ...props }) {
    const queryClient = useQueryClient();
    const { token, axiosJWT } = useAuth();
    const {staff, shiftCategory} = queriesApi();
    
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: (<div className="font-bold">Import CSV</div>),
            centered: true,
            children: (
                <div className="text-sm text-justify">
                    {"Are you sure you want to proceed? This action will replace all existing shifts in "}
                    <span className="font-bold">{date.format('MMMM')}</span>
                    {" "}
                    <span className="font-bold">{date.format('YYYY')}</span>
                    {" of the employee(s). "}
                    <span className="font-bold">All existing shifts have to be updated manually afterwards.</span>
                </div>
            ),
            labels: { confirm: 'Confirm', cancel: "No, don't import" },
            confirmProps: { color: 'blue', type: 'submit', form: 'ImportForm' },

        });

    const makeTemplate = (year: any, month: any) => {
        const array: any = {
            "fields": ["Name", "ID"],
            "data": []
        }
        const numDays = dayjs(year + '-' + month + '-' + 1).daysInMonth();
        for (let i = 1; i <= numDays; i++) {
            array.fields.push(i.toString());
        }

        (staff['data'] as any).forEach((ele: any) => {
            let arr: any = [];
            arr.push(ele.name);
            arr.push(ele.staff_id);
            for (let i = 1; i <= numDays; i++) {
                arr.push('');
            }
            array.data.push(arr);
        });
        array.data.push();
        return array;
    }

    const [month, setMonth] = useState(dayjs().month() + 1);
    const [year, setYear] = useState(dayjs().year());
    const [data, setData] = useState<any[]>([]);
    const [csvTemplate, setCSVTemplate] = useState(makeTemplate(year, month));
    const dateString = year + "-" + month + "-" + 1;
    const date = dayjs(dateString, "YYYY-M-D");
    const [filename, setFilename] = useState("shift_template_" + date.format('YYYY_MMM'));
    const ref = useRef<HTMLButtonElement>(null);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            month: dayjs().toDate(),
            year: dayjs().toDate(),
            file: null,
        },

        transformValues: (values) => ({
            month: values.month?.getMonth() + 1,
            year: values.year?.getFullYear(),
            data: data,
        }),

        validate: {
            file: (values) => {
                if (values === null) return 'Please select a file...'
                else {
                    if (data.length > 0) {
                        let check = false;
                        const fileHeader = Object.keys(data[0]);
                        const csvHeader = csvTemplate.fields;
                        csvHeader.forEach((ele: any) => {
                            if (fileHeader.includes(ele)) {
                                check = true;
                                return;
                            } else {
                                check = false;
                                return;
                            }
                        });

                        if (!check) {
                            return 'Incorrect CSV template!';
                        }
                    }
                }
            }
        }
    });

    form.watch("month", () => {
        setMonth(form.getTransformedValues().month);
    });

    form.watch("year", () => {
        setYear(form.getTransformedValues().year);
    });

    form.watch("file", ({ value }) => {
        const file = value as any;
        if (file !== null) {
            Papa.parse(file, {
                skipEmptyLines: true,
                header: true,
                complete: (result) => {
                    const temp_arr: any = [];

                    result.data.map((ele: any) => {
                        if (ele.ID !== '') {
                            temp_arr.push(ele)
                        }
                    })
                    setData(temp_arr);
                },
                error: (err) => {
                    console.log(err);
                }
            });
        } else {
            setData([]);
        }
    });

    useEffect(() => {
        setCSVTemplate(makeTemplate(year, month));
        setFilename("shift_template_" + date.format('YYYY_MMM'));
    }, [month, year]);

    useEffect(() => {
        if (data.length > 0) {
            let check = false;
            const fileHeader = Object.keys(data[0]);
            const csvHeader = csvTemplate.fields;
            csvHeader.forEach((ele: any) => {
                if (fileHeader.includes(ele)) {
                    check = true;
                    return;
                } else {
                    check = false;
                    return;
                }
            });

            if (check) {
                form.clearFieldError('file');
            } else {
                form.setFieldError('file', 'Incorrect CSV template!')
            }
        }
    }, [data])

    var csv = Papa.unparse(csvTemplate);
    const transformValues = form.getTransformedValues();

    const mutation = useMutation({
        mutationKey: ['importForm'],
        mutationFn: (value: typeof transformValues) => {
            return axiosJWT.post('http://127.0.0.1:3001/api/shifts/import', {
                data: value.data,
                month: value.month,
                year: value.year,
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
                action: 'import',
                title: res.data.title,
                response: res.data.response
            });
        },
        onError: async (res: any) => {
            await queryClient.invalidateQueries({
                queryKey: ['shift'],
                refetchType: 'all',
            });

            props.setUpdate(!props.update);
            props.setNotification({
                action: 'import',
                title: 'Oh no!',
                response: 'Something went wrong...',
            });
        },
    })

    return (
        <form id="ImportForm" className=""
            onSubmit={form.onSubmit((value) => mutation.mutate(value))}
        >
            <div>
                <MonthPickerInput
                    label="Select Month"
                    placeholder="Pick Month"
                    valueFormat="MMM"
                    key={form.key("month")}
                    styles={{
                        calendarHeader: {
                            display: 'none',
                        }
                    }}
                    {...form.getInputProps('month')}
                />

                <YearPickerInput
                    label="Select Year"
                    placeholder="Pick Year"
                    key={form.key("year")}
                    {...form.getInputProps('year')}
                />

                <Divider my="sm" />
                <div>
                    <FileInput
                        {...form.getInputProps('file')}
                        label="Select CSV File"
                        key={form.key("file")}
                        description="Only CSV is supported."
                        placeholder="Select file..."
                        accept=".csv"
                        ref={ref}
                        clearable
                        required
                    />
                    <div className='flex flex-col mb-4'>
                        <div className="mb-2">
                            <div className="mt-2 text-sm font-bold text-neutral-700 dark:text-neutral-400 ">
                                Download Shift Template by Month and Year
                            </div>
                        </div>
                        <div className='flex justify-between gap-2'>
                            <div className="w-1/2 my-auto">
                                <div className="text-sm">
                                    <div className="font-bold">Filename preview:</div>
                                    <div className="">
                                        shift_template_<span className="font-bold">{date.format('YYYY')}</span>_<span className="font-bold">{date.format('MMM')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 my-auto">
                                <Button variant="filled" rightSection={<TbDownload />}>
                                    <CSVLink
                                        data={csv}
                                        filename={filename}
                                        className="btn btn-primary"
                                        target="_blank"
                                    >
                                        Download Template
                                    </CSVLink>
                                </Button>
                            </div>

                        </div>
                    </div>

                    <div className="px-2 pb-4 text-justify border rounded border-zinc-600 border-opacity-30 dark:bg-neutral-700 bg-neutral-200">
                        <div className="text-sm font-bold">
                            Additional Note:
                        </div>
                        <div className="text-sm leading-tight">
                            {"If needed, shift category can be exported at "}
                            <a className="font-bold underline underline-offset-2 hover:text-sky-500 transition ease-in duration-[50]" href="/shift-category" target="_blank">Shift Category</a>
                            {" or clicking "}
                            <CSVLink className="font-bold underline underline-offset-2 hover:text-sky-500 transition ease-in duration-[50]" data={shiftCategory.data as any ?? []} filename="shift_category.csv">here</CSVLink>
                            {" for reference."}
                        </div>

                        <div className="flex flex-col gap-2 mt-2 text-sm font-bold">
                            {addNotes.notes.map((ele, index) => {
                                return (
                                    <div className="flex" key={'addNote-' + index}>
                                        <div className="pe-1">
                                            {addNotes.asterisk}
                                        </div>
                                        <div className="leading-none">
                                            {ele}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Divider my={'sm'} />
                <div className="flex justify-end flex-1 mt-3">
                    <Tooltip
                        label='Select CSV template'
                        disabled={!form.isValid() ? false : true}
                        withArrow
                        position="bottom"
                        openDelay={500}
                    >
                        <Button
                            disabled={!form.isValid() ? true : false}
                            onClick={openDeleteModal}
                        >
                            Import
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </form >
    )
}