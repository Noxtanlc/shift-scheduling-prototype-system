import '../css/navbar.css';
import { Link } from "react-router-dom";
import { NavLink } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function mobileNavbar({ ...props }) {
    const data = props.data;
    const [active, setActive] = useState(0);
    const { pathname } = useLocation();
    const hoverClass = "hover:bg-slate-200 dark:hover:bg-slate-600"

    useEffect(() => {
        data.forEach((ele:any) => {
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
        });

        if (props.opened) {
            props.setOpened(!props.opened);
        }
    }, [pathname]);

    const items = data.map((item: any) =>
    (
        <NavLink
            component={Link}
            classNames={{
                root: hoverClass,
                children: 'dark:navChild'
            }}
            to={item.path}
            active={item.index === active}
            key={item.label}
            label={item.label}
            children={item.children?.map((item: any) => {
                return (
                    <NavLink
                        component={Link}
                        classNames={{
                            root: hoverClass,
                        }}
                        to={item.path}
                        active={item.index === active}
                        key={item.label}
                        label={item.label}
                    />
                )
            }
            )}
        />
    ));

    return (
        <>
        {items}
        </>
    );
}