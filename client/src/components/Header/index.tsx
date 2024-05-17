import { useDisclosure } from "@mantine/hooks";
import { Avatar, Burger, Menu, Switch } from "@mantine/core";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useAuth } from "@/hook/AuthProvider";
import { TbCheck, TbChevronDown } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useTheme } from "@/hook/ThemeProvider";

export default function Header({ ...props }) {
    const { token, setToken, removeToken, user, removeUser } = useAuth();
    const navigate = useNavigate();
    const { theme, ToggleTheme } = useTheme()!;
    const [topOpened, topHandler] = useDisclosure();
    const [sideOpened, sideHandler] = useDisclosure(true);
    const { pathname } = useLocation();

    useEffect(() => {
        if (topOpened) {
            topHandler.toggle();
        }
    }, [pathname]);

    const handleLogout = async () => {
        if (token.accessToken) {
            await axios.post('/api/logout', {
                token: token.accessToken,
            }).then(() => {
                notifications.show({
                    id: 'login',
                    withCloseButton: true,
                    autoClose: 1500,
                    title: "Logging out",
                    message: 'Logging out of application...',
                    color: 'orange',
                    icon: <TbCheck />,
                    className: 'logout-class',
                });

                setTimeout(() => {
                    removeToken();
                    removeUser();
                    navigate('/', { replace: true });
                }, 3 * 1000);
            })
                .catch((err) => console.log(err));
        }
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
                                <Menu trigger="click" width={150}>
                                    <Menu.Target>
                                        <div className="flex justify-around px-2 ease-out border dark:border-white/30 border-black/30 hover:transition hover:scale-110 bg-slate-600/50 rounded-xl">
                                            <Avatar className="" color={'white'}
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