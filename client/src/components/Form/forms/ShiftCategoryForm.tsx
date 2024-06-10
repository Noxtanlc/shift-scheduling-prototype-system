import { useAuth } from "@/misc/AuthProvider";
import { ActionIcon, TextInput, ColorInput, Switch, Button, Fieldset } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRef, useMemo, useState } from "react";
import * as icon from "react-icons/bs";

export default function ShiftCategoryForm({ ...props }) {
    interface ShiftCategoryForm {
        id: number | undefined | string;
        name: string;
        alias: string;
        color: string | undefined;
        start_time: string;
        end_time: string;
        active: boolean | undefined;
    }
    const { token, axiosJWT } = useAuth();
    const [formDisabled, setFormDisabled] = useState(false);
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["ShiftCategoryForm"],
        mutationFn: (formData: ShiftCategoryForm) => {
            return axiosJWT.post('http://127.0.0.1:3001/api/shift-category/' + formData['id'], {
                action: action,
                data: formData,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
        },
        onMutate: () => {
            setFormDisabled(true);
        },
        onSuccess: async (res: any) => {
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
                action: action,
                title: res.data.title,
                response: res.data.response
            });
            props.handler.close();
            mutation.reset();
            setFormDisabled(false);
        },
        onError: (res: any) => {
            setFormDisabled(false);
            props.setUpdate(!props.update);
            props.setNotification({
                action: action,
                title: res.data.title,
                response: res.data.response
            });
            props.handler.close();
            mutation.reset();
        },
    });

    const action = props.action;
    const sdRef = useRef<HTMLInputElement>(null);
    const edRef = useRef<HTMLInputElement>(null);
    const form = useForm<ShiftCategoryForm>({
        mode: 'uncontrolled',
        initialValues: {
            id: 0,
            name: '',
            alias: '',
            color: '',
            start_time: '00:00',
            end_time: '00:00',
            active: false,
        },

        validate: {
            start_time: (value) => {
                const sTime = dayjs(`2000-01-01 ${value}`);
                const eTime = dayjs(`2000-01-01 ${form.getValues().end_time}`);

                if (sTime.isAfter(eTime.toDate())) {
                    return "Start time cannot be greater than end time!"
                }
            },
            end_time : (value) => {
                const sTime = dayjs(`2000-01-01 ${form.getValues().start_time}`);
                const eTime = dayjs(`2000-01-01 ${value}`);

                if (eTime.isBefore(sTime.toDate())) {
                    return "End time cannot be smaller than start time!"
                }
            }
        }
    });

    const pickerControl = (ref: any) => (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <icon.BsClock size={16} />
        </ActionIcon>
    );

    let start_timeArr: any;
    let start_time: any = '';
    let end_timeArr: any;
    let end_time: any = '';
    let active: boolean = false;

    if (props.data['id'] !== undefined) {
        start_timeArr = props.data['start_time'].split(":");
        start_time = new Date(0, 0, 0, start_timeArr[0], start_timeArr[1])
            .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: "h23" });

        end_timeArr = props.data['end_time'].split(":");
        end_time = new Date(0, 0, 0, end_timeArr[0], end_timeArr[1])
            .toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: "h23" });

        if (props.data['active'] === 1) {
            active = !active;
        }

        useMemo(() => {
            form.setValues({
                id: props.data['id'],
                name: props.data['st_name'],
                alias: props.data['st_alias'],
                color: props.data['color-coding'],
                start_time: start_time,
                end_time: end_time,
                active: active,
            })
        }, [props.data['id']]);
    }

    return (
        <form
            onSubmit={form.onSubmit((values: any) =>
                mutation.mutate(values)
            )}
        >
            <Fieldset disabled={formDisabled} variant="unstyled">
                <TextInput
                    required
                    label="Template Name"
                    placeholder="Enter shift template name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                <TextInput
                    required
                    label="Alias/Code"
                    placeholder="Enter alias/code"
                    key={form.key('alias')}
                    {...form.getInputProps('alias')}
                />
                <ColorInput
                    label="Color Code"
                    description="Select color code for template"
                    placeholder="Select Color"
                    key={form.key('color')}
                    {...form.getInputProps('color')}
                />
                <div className="mb-3 md:flex md:flex-row md:gap-2">
                    <TimeInput
                        className="w-full"
                        ref={sdRef}
                        leftSection={pickerControl(sdRef)}
                        label="Start Time"
                        description="Shift Starting Time"
                        placeholder="Select/Enter start time"
                        withSeconds={false}
                        key={form.key('start_time')}
                        {...form.getInputProps('start_time')}
                    />
                    <TimeInput
                        className="w-full"
                        ref={edRef}
                        leftSection={pickerControl(edRef)}
                        label="End Time"
                        description="Shift Ending Time"
                        placeholder="Select/Enter end time"
                        withSeconds={false}
                        minTime={form.getValues().start_time}
                        key={form.key('end_time')}
                        {...form.getInputProps('end_time')}
                    />
                </div>
                <Switch
                    labelPosition="left"
                    onLabel="ACTIVE"
                    offLabel="DISABLE"
                    label="Status: "
                    checked={form.values.active}
                    onChange={() => {
                        form.setValues(
                            { active: !form.values.active }
                        )
                    }
                    }
                />
                <div className="flex justify-end flex-1 mt-6">
                    <Button
                        type='submit'
                    >
                        Submit
                    </Button>
                </div>
            </Fieldset>
        </form>
    )
}
