import Header from "@/components/Header";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../misc/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { TbCheck } from "react-icons/tb";

export default function Login() {
    const { token, setToken, setUser } = useAuth();

    const [error, setError] = useState({
        errInput: '',
        msg: '',
    });
    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: '',
        },
        validate: {
            username: isNotEmpty('Enter your username'),
            password: isNotEmpty('Enter your password'),
        }
    });

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: (cred: typeof form.values) => {
            return axios.post('/api/login', {
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
                    message: 'Logging in, please wait...',
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
        onError: (err: any) => {
            const { errInput, response }: any = err.response.data;
            setError({
                errInput: errInput,
                msg: response,
            });
        },
    })

    useEffect(() => {
        if (mutation.isError) {
            if (error.errInput === 'username') {
                form.setFieldError(
                    'username', error.msg
                );
            }

            if (error.errInput === 'password') {
                form.setFieldError(
                    'password', error.msg
                );
            }

            mutation.reset();
        }
    }, [mutation.isError])

    return (
        <div className="flex h-screen">
            <div className="flex-col w-screen overflow-hidden">
                <div className="relative flex flex-col h-full dark:bg-zinc-600/20 dark:text-stone-200">
                    <div className="z-[199] top-0 flex flex-1 h-14 p-2 justify-between dark:bg-zinc-900 bg-white shadow px-4">
                        <Header />
                    </div>

                    <div className="flex overflow-y-auto h-dvh bg-sky-600 dark:bg-zinc-700">
                        <div className="flex flex-col w-full overflow-x-hidden">
                            <div className="flex flex-1">
                                <div className="flex flex-col w-full h-full p-6 mx-auto my-auto bg-sky-200 dark:bg-zinc-800 md:rounded-3xl md:w-11/12 lg:w-6/12 lg:max-w-xl md:h-fit">
                                    <div>
                                        <div className="mb-4">
                                            <div className="text-2xl font-semibold">
                                                UniSec
                                            </div>
                                            <div className="font-light text-gray-600 dark:text-gray-400 text-normal font">A simple Scheduling Application for University's Security Division</div>
                                        </div>
                                        <div className="text-lg font-medium">Sign In</div>
                                    </div>
                                    <form
                                        onSubmit={form.onSubmit((value) => mutation.mutate(value))}
                                        className="lg:text-lg"
                                    >
                                        <fieldset disabled={mutation.isSuccess}>
                                            <div className="flex flex-col mb-4">
                                                <TextInput label="Username" key={form.key('username')}
                                                    {...form.getInputProps('username')}
                                                />
                                                <PasswordInput label={"Password"} key={form.key('password')}
                                                    {...form.getInputProps('password')}
                                                />
                                            </div>
                                            <div className="flex flex-row justify-end">
                                                <Button type="submit">Confirm</Button>
                                            </div>
                                        </fieldset>
                                    </form>
                                    <div className="pt-8 text-xs font-medium text-justify ps-2 pe-2 text-slate-500">
                                        2024 &copy; Tan Li Chuang, Faculty of Computer Science and Information Technology
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

/*
<div className="flex flex-col gap-4 pt-10 mx-auto my-auto shadow-xl lg:h-96 ps-6 pe-6 h-fit md:rounded-3xl bg-sky-200 dark:bg-zinc-800">
    <div className="">
        <div className="text-2xl font-medium">Sign In</div>
        <div className="text-lg"></div>
    </div>
    <form
        onSubmit={form.onSubmit((value) => mutation.mutate(value))}
        className="lg:text-lg"
    >
        <fieldset disabled={mutation.isSuccess}>
            <div className="flex flex-col mb-4">
                <TextInput label="Username" key={form.key('username')}
                    {...form.getInputProps('username')}
                />
                <PasswordInput label={"Password"} key={form.key('password')}
                    {...form.getInputProps('password')}
                />
            </div>
            <div className="flex flex-row justify-end">
                <Button type="submit">Confirm</Button>
            </div>
        </fieldset>
    </form>
    <div className="flex flex-row pt-8 pb-4 text-xs font-medium text-justify ps-2 pe-2">
        2024 &copy; Tan Li Chuang, Faculty of Computer Science and Information Technology
    </div>
</div>
*/