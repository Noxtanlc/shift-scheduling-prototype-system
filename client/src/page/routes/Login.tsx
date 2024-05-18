import Header from "@/components/Header";
import { Button, Input, PasswordInput, Image } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../misc/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { TbCheck } from "react-icons/tb";

export default function Login() {
    const { setToken, setUser } = useAuth();
    const [ error, setError] = useState('');
    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: '',
        },
        validateInputOnBlur: true,
        validate: {
            username: (value) => (value.trim().length < 0 ? 'Username is empty!' : null),
            password: (value) => (value.trim().length < 0 ? 'Enter your password!' : null),
        }
    });

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: (cred: typeof form.values) => {
            return axios.post('http://127.0.0.1:3001/api/login', {
                username: cred.username,
                password: cred.password
            });
        },
        onSuccess: (res: any) => {
            if (res.data.accessToken !== undefined) {
                notifications.show({
                    id: 'login',
                    withCloseButton: true,
                    autoClose: 1500,
                    title: "Logging in",
                    message: 'Logging into the application...',
                    color: 'cyan',
                    icon: <TbCheck />,
                    className: 'login-class',
                  });
                setTimeout(() => {
                    setUser({
                        username: res.data.name,
                        isAdmin: res.data.isAdmin,
                    });
                    setToken({
                        accessToken: res.data.accessToken,
                        refreshToken: res.data.refreshToken,
                    });
                    navigate("/", { replace: true });
                }, 3 * 1000);
            }
        },
        onError:  (err) => {
            const {response}:any = err;
            setError(response.data.response);
        },
    })

    useEffect(() => {
        if (mutation.isError) {
            form.setErrors({
                username: error,
                password: error, 
             });
             mutation.reset();
        }
    }, [mutation.isError])

    return (
        <div className="flex h-screen">
            <div className="flex-col w-screen overflow-hidden">
                <div className="relative flex flex-col h-full dark:bg-zinc-600 dark:text-stone-200">
                    <div className="z-[199] top-0 flex p-2 justify-between dark:bg-zinc-800 bg-white shadow">
                        <Header />
                    </div>
                    <div className="flex flex-col h-full overflow-y-auto lg:flex-row bg-sky-600/20 dark:bg-zinc-700">
                        <div className="flex flex-col flex-1 p-2 overflow-x-hidden">
                            <div className="p-2 mx-auto rounded-lg bg-sky-400/50 w-fit lg:mt-28">
                                <div className="flex flex-col justify-center h-full my-auto">
                                    <div className="h-full mx-auto">
                                        
                                        <form 
                                            onSubmit={form.onSubmit((value) => mutation.mutate(value))}
                                            className="flex flex-col h-full gap-4 p-6 bg-white/25 rounded-xl md:text-xl"
                                        >
                                            <div className="mx-auto">
                                                <Image src='./src/image/placeholder.png' fit="contain" w={200} />
                                            </div>
                                            <div className="font-bold text-center text-md">Placeholder Application Title</div>
                                            <fieldset disabled={mutation.isSuccess}>
                                            <div className="font-bold">Login</div>
                                            <div className="flex flex-row justify-between gap-4">
                                                <Input.Label className="w-1/3 my-auto">Username</Input.Label>
                                                <Input key={form.key('username')} className="w-2/3"
                                                    {...form.getInputProps('username')}
                                                />
                                            </div>
                                            <div className="flex flex-row justify-between gap-4">
                                                <Input.Label className="w-1/3 my-auto">Password</Input.Label>
                                                <PasswordInput key={form.key('password')} className="w-2/3"
                                                    {...form.getInputProps('password')}
                                                />
                                            </div>
                                            <div className="flex flex-row justify-end gap-4">
                                                <Button type="submit">Confirm</Button>
                                            </div>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}