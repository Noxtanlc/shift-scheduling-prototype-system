import { useAuth } from "@/misc/AuthProvider";
import { TextInput, Button, Fieldset } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function LocationForm({ ...props }) {
    interface LocationFormValue {
        ca_id: number | undefined | string;
        ca_name: string;
        ca_desc: string;
    }
    const [formDisabled, setFormDisabled] = useState(false);
    const { token, axiosJWT } = useAuth();
    const locationQuery = useQuery({
        queryKey: ['location'],
    });
    const mutation = useMutation({
        mutationKey: ["locationForm"],
        mutationFn: (formData: LocationFormValue) => {
            return axiosJWT.post('http://127.0.0.1:3001/api/location/' + formData['ca_id'], {
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
        onSuccess: (res: any) => {
            locationQuery.refetch();
            props.setUpdate(!props.update);
            props.setNotification({
                action: action,
                title: res.data.title,
                response: res.data.response
            });
            props.handler.close();
            setFormDisabled(false);
            mutation.reset();
        },
        onError: (res: any) => {
            props.setUpdate(!props.update);
            props.setNotification({
                action: action,
                title: res.data.title,
            });
            props.handler.close();
            setFormDisabled(false);
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
            <Fieldset disabled={formDisabled} variant="unstyled">
                <TextInput
                    required
                    label="Alias"
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
            </Fieldset>
        </form>
    )
}
