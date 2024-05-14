import rootLoader from '@/common/loader';
import ErrorPage from '@/404';
import { Schedule, Location, Group, ShiftCategory, Dashboard, Login } from '@/page'
import { ScheduleLoader, LocationLoader, GroupLoader, ShiftCategoryLoader, DashboardLoader } from '@/page';
import {Title} from '@/page';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hook/AuthProvider';
import ThemeProvider from '@/hook/ThemeProvider';
import Root from '@/root';
import DefaultLayout from '@/layout';

export default function Route() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Infinity,
            },
        },
    });

    const { token } = useAuth();

    const authRoute = [
        {
            path: "/login",
            element: [<Login key={"login"} />, <Title title="Login | UniSec" key={"pageTitle"} />],
            id: "login",
        }
    ]

    const route = [
        {
            path: "",
            element: [<Dashboard key={"dashboard"} />, <Title title="Dashboard | UniSec" key={"pageTitle"} />],
            id: "dashboard",
            loader: DashboardLoader(queryClient),
        },
        {
            path: "/overview",
            element: [<Schedule key={"schedule"} />, <Title title="Schedule | UniSec" key={"pageTitle"} />],
            id: "schedule",
            loader: ScheduleLoader(queryClient),
        },
        {
            path: "/shift-category",
            element: [<ShiftCategory key={"shift-category"} />, <Title title="Shift Category | UniSec" key={"pageTitle"} />],
            id: "shift-type",
            loader: ShiftCategoryLoader(queryClient),
        },
        {
            path: "/location",
            element: [<Location key={"location"} />, <Title title="Location | UniSec" key={"pageTitle"} />],
            id: "location",
            loader: LocationLoader(queryClient),
        },
        {
            path: "/group",
            element: [<Group key={"group"} />, <Title title="Group | UniSec" key={"pageTitle"} />],
            id: "group",
            loader: GroupLoader(queryClient),
        },
    ];

    const router = createBrowserRouter([
        {
            path: '',
            element: <ThemeProvider><Root /></ThemeProvider>,
            id: "root",
            loader: rootLoader,
            errorElement: <ErrorPage />,
            children: [
                ...(!token ? authRoute : []),
                {
                    path: '',
                    element: <DefaultLayout />,
                    children: route,
                },
            ],
        },
    ]);

    return (
        <QueryClientProvider client={queryClient} >
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}