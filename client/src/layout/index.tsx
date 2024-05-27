import { Transition } from "@mantine/core";
import Header from "../components/Header";
import { MobileNavbar, Navbar } from "../components/Navbar";
import { useState } from "react";
import {
  MdOutlineDashboard,
  MdOutlineCalendarMonth,
  MdOutlineLocationCity,
  MdPersonOutline,
} from "react-icons/md";
import { useAuth } from "@/misc/AuthProvider";
import { Outlet } from "react-router-dom";

const slideRight = {
  in: { opacity: 1, marginLeft: "0" },
  out: { opacity: 0, marginLeft: "-15rem" },
  transitionProperty: "margin-left, opacity",
};


export default function DefaultLayout() {
  const { user } = useAuth();
  const isAdmin = user.isAdmin;

  const adminRoute = [
    {
      icon: <MdOutlineLocationCity />,
      label: "Location",
      path: "/location",
      index: 5,
    },
    {
      icon: <MdPersonOutline />,
      label: "Employee",
      disabled: true,
      index: 6,
      children: [
        {
          label: "Group",
          path: "/group",
          index: 7,
        },
      ],
    }
  ]

  const data = [
    {
      icon: <MdOutlineDashboard />,
      label: "Dashboard",
      path: "/",
      index: 0,
    },
    {
      label: "Schedule",
      icon: <MdOutlineCalendarMonth />,
      disabled: true,
      index: 2,
      children: [
        {
          label: "Overview",
          path: "/overview",
          index: 3,
        },
        ...(isAdmin === 0 ? [] : [{
          label: "Shift Category",
          path: "/shift-category",
          index: 4,
        }])
      ],
    },
    ...(isAdmin === 0 ? [] : adminRoute)
  ];

  const [topbarOpened, setTopbarOpened] = useState(false);
  const [sidebarOpened, setsidebarOpened] = useState(true);

  return (
    <div className="flex h-screen">
      <div className="flex-col w-screen overflow-hidden">
        <div className="relative flex flex-col h-full bg-sky-100/60 dark:bg-zinc-600/20 dark:text-stone-200">
          <div className="z-[199] top-0 flex flex-1 h-14 p-2 justify-between dark:bg-zinc-900 bg-white shadow px-4">
            <Header
              topbarOpened={topbarOpened}
              setTopbarOpened={setTopbarOpened}
              sidebarOpened={sidebarOpened}
              setsidebarOpened={setsidebarOpened}
            />
          </div>
          {/*-------------------------------- Topbar ----------------------------------- */}
          <Transition
            mounted={topbarOpened}
            transition={"slide-down"}
            duration={500}
            timingFunction="ease"
            keepMounted
          >
            {(transitionStyle) => (
              <div
                id="topbar"
                className="z-[197] absolute w-dvw h-dvh flex lg:hidden flex-col dark:bg-neutral-800 bg-white overflow-y-auto"
                style={{ ...transitionStyle }}
              >
                <div className="h-full">
                  <div className="flex-col p-1">
                    <MobileNavbar
                      opened={topbarOpened}
                      setOpened={setTopbarOpened}
                      data={data}
                    />
                  </div>
                </div>
              </div>
            )}
          </Transition>
          {/*-------------------------------- Topbar ----------------------------------- */}

          <div className="flex flex-col h-full overflow-y-auto lg:flex-row">
            {/*-------------------------------- Sidebar ----------------------------------- */}
            <Transition
              mounted={sidebarOpened}
              transition={slideRight}
              duration={500}
              timingFunction="ease-out"
              keepMounted
            >
              {(transitionStyle) => (
                <div
                  className="dark:bg-zinc-800/60 dark:text-white bg-gray-100 z-[198] lg:flex hidden top-0 left-0 flex-col w-60"
                  id="sidebar"
                  style={{ ...transitionStyle }}
                >
                  <div className="flex flex-col mx-auto my-16 w-52">
                    <Navbar data={data} />
                  </div>
                </div>
              )}
            </Transition>
            {/*-------------------------------- Sidebar ----------------------------------- */}
            <div
              id="contentBody"
              className="flex flex-col flex-1 overflow-x-hidden"
            >
              <div className="p-2 py-1 h-dvh md:p-3">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
