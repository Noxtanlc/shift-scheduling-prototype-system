import '../css/navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function Navbar({ ...props }) {
    const [active, setActive] = useState(0);
    const { pathname } = useLocation();
    const classes = 'dark:hover:bg-slate-500';

    useEffect(() => {
        props.data.forEach((ele:any) => {
            if (ele.path === pathname) {
                setActive(ele.index);
            };

            if (ele.children !== undefined) {
                ele.children.forEach((ChildEle:any) => {
                    if (ChildEle.path === pathname) {
                        setActive(ChildEle.index);
                    };
                })
            }
        })
    }, [pathname]);

    const items = props.data.map((item: any) =>
    (
        <NavLink
            className='md:text-3xl lg:text-2xl'
            classNames={{
                root: classes,
                children: 'dark:navChild'
            }}
            component={Link}
            to={item.path}
            leftSection={item.icon}
            key={item.label}
            active={item.index === active}
            label={item.label}
            children={item.children?.map((item: any) => {
                return (
                    <NavLink
                        className='md:text-3xl lg:text-2xl'
                        classNames={{
                            root: classes,
                        }}
                        component={Link}
                        to={item.path}
                        key={item.label}
                        label={item.label}
                        active={item.index === active}
                    />
                )
            }
            )}
        />
    ));

    return (
        <>
        { items }
        </>
    );
}