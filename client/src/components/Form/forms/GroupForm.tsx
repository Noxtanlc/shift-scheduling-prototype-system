import { getStaff } from "@/api";
import { useAuth } from "@/misc/AuthProvider";
import { TextInput, MultiSelect, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export default function GroupForm({ ...props }) {
    interface GroupFormValue {
        groupID: number | null | string;
        groupName: string;
        selectedStaff: [];
        originalSelectedStaff: [];
    }
    const queryClient = useQueryClient();
    const { token } = useAuth();
    const staffList:any = useQuery({
        ...getStaff(token.accessToken), 
        enabled: false,
        initialData: queryClient.getQueryData(['staff'])
    }).data;

    const action = props.action;
    const data = props.data;
    let groupID = 0;
    let groupName = '';
    let selectedStaff: any = [];
    let staffSelection: any = [];

    if (data != undefined) {
        groupID = data['groupID'];
        groupName = data['groupName'];
        let staff = data['staff'];

        if (staff !== undefined) {
            staff.map((ele: any) => {
                selectedStaff.push(
                    ele['staffID'].toString(),
                );
            });
        }
    }

    staffList.map((ele: any) => {
        staffSelection.push({
            value: ele['staff_id'].toString(),
            label: ele['name'],
        })
    });

    const mutation = useMutation({
        mutationKey: ["groupForm"],
        mutationFn: (formData: GroupFormValue) => {
            return axios.post('/api/group/' + formData['groupID'], {
                action: action,
                data: formData,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
        },
        onSuccess: async (res) => {
            await queryClient.invalidateQueries({
                queryKey: ['group'],
                refetchType: 'all',
            });

            await queryClient.invalidateQueries({
                queryKey: ['assigned_staff'],
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
        },
        onError: (res: any) => {
            props.setUpdate(!props.update);
            props.setNotification({
                action: action,
                title: res.data.title,
            });
            props.handler.close();
            mutation.reset();
        },
    });

    const form = useForm<GroupFormValue>({
        initialValues: {
            groupID: null,
            groupName: '',
            selectedStaff: [],
            originalSelectedStaff: [],
        }
    });

    if (groupID > 0) {
        useMemo(() => {
            form.setValues({
                groupID: groupID,
                groupName: groupName,
                selectedStaff: selectedStaff,
                originalSelectedStaff: selectedStaff,
            })
        }, [data.groupID])
    }

    return (
        <form
            onSubmit={form.onSubmit((values) => mutation.mutate(values))}
        >
            <TextInput
                required
                label="Group Name"
                placeholder="Enter group name..."
                {...form.getInputProps('groupName')}
            />
            <MultiSelect
                mt={16}
                label="Employee"
                placeholder="Select employee..."
                data={staffSelection}
                searchable
                clearable
                maxDropdownHeight={120}
                {...form.getInputProps('selectedStaff')}
            />
            <div className="flex justify-end flex-1 mt-3">
                <Button
                    type='submit'
                >
                    Submit
                </Button>
            </div>
        </form>
    )
}
