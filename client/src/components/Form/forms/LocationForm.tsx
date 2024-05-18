import { useAuth } from "@/misc/AuthProvider";
import { TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export default function LocationForm({ ...props }) {
    interface LocationFormValue {
        ca_id: number | undefined | string;
        ca_name: string;
        ca_desc: string;
    }
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ["locationForm"],
        mutationFn: (formData: LocationFormValue) => {
            return axios.post('http://127.0.0.1:3001/api/location/' + formData['ca_id'], {
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
                queryKey: ['location'],
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

    const action = props.action;

    const form = useForm<LocationFormValue>({
        initialValues: {
            ca_id: 0,
            ca_desc: '',
            ca_name: '',
        }
    });

    if (props.data['ca_id'] !== undefined) {
        useMemo(() => {
            form.setValues({
                ca_id: props.data['ca_id'],
                ca_desc: props.data['ca_desc'],
                ca_name: props.data['ca_alias'],
            })
        }, [props.data['ca_id']])
    }

    return (
        <form onSubmit={
            //form.onSubmit((values: any) => submitHandler(values))
            form.onSubmit((values: any) => mutation.mutate(values))
        }
        >
            <TextInput
                required
                label="Name"
                placeholder="Enter location code/name"
                {...form.getInputProps('ca_name')}
            />
            <TextInput
                label="Description"
                placeholder="Enter location description"
                {...form.getInputProps('ca_desc')}
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
