import { useDisclosure } from "@mantine/hooks";
import { Avatar, Burger, Menu, Switch } from "@mantine/core";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useAuth } from "@/misc/AuthProvider";
import { TbCheck, TbChevronDown } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useTheme } from "@/misc/ThemeProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function Header({ ...props }) {
    const { token, setToken, user, axiosJWT } = useAuth();
    const navigate = useNavigate();
    const { theme, ToggleTheme } = useTheme()!;
    const [topOpened, topHandler] = useDisclosure();
    const [sideOpened, sideHandler] = useDisclosure(true);
    const { pathname } = useLocation();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (topOpened) {
            topHandler.toggle();
        }
    }, [pathname]);

    const handleLogout = async () => {
        await axiosJWT.post('/api/logout', {
            token: token.accessToken
        }, {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        }).then(() => {
            notifications.show({
                id: 'logout',
                withCloseButton: true,
                autoClose: 1500,
                title: "Logging out",
                message: 'Logging out of application...',
                color: 'cyan',
                icon: <TbCheck />,
                className: 'logout-class',
            });

            setTimeout(() => {
                setToken();
                navigate('/login', { replace: true });
                queryClient.removeQueries();
            }, 3 * 1000);
        }).catch((err: any) => console.log(err));
    };

    return (
        <>
            <div className='w-full my-auto'>
                {token.accessToken ? (
                    <>
                        <Burger
                            size="sm"
                            className="lg:hidden"
                            opened={topOpened}
                            onClick={() => {
                                topHandler.toggle();
                                props.setTopbarOpened(!props.topbarOpened);
                            }}
                            aria-label="Toggle navigation"
                        />
                        <Burger
                            size="sm"
                            className="hidden lg:inline-block"
                            opened={sideOpened}
                            onClick={() => {
                                sideHandler.toggle();
                                props.setsidebarOpened(!props.sidebarOpened);
                            }}
                            aria-label="Toggle navigation"
                        />
                    </>
                ) : (<></>)}
            </div>
            <div className="flex flex-row justify-end w-full gap-2 sm:gap-4">
                <Switch className="my-auto" size="md" color="dark.4"
                    defaultChecked={theme ? true : false}
                    onLabel={<MdDarkMode size={16} />}
                    offLabel={<MdLightMode size={16} />}
                    onChange={() => {
                        ToggleTheme();
                    }}
                />
                {token.accessToken ? (
                    <>
                        <div className='flex gap-3 my-auto font-bold'>
                            <div className="hidden my-auto sm:block" aria-label="user-name">{user.username !== '' ? user.username : <></>}</div>
                            <div className="my-auto">
                                <Menu trigger="click" width={120}>
                                    <Menu.Target>
                                        <div className="flex justify-around px-1 ease-out border dark:border-white/30 border-black/30 hover:transition hover:scale-105 bg-slate-300/50 rounded-2xl">
                                            <Avatar
                                                classNames={{
                                                    placeholder: 'bg-transparent'
                                                }}
                                            />
                                            <TbChevronDown className="my-auto" />
                                        </div>
                                    </Menu.Target>
                                    <Menu.Dropdown className="">
                                        <Menu.Label className="block sm:hidden" aria-label="user-name">{user.username !== '' ? user.username : <></>}</Menu.Label>
                                        <Menu.Item leftSection={<></>} onClick={() => handleLogout()} >Logout</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}