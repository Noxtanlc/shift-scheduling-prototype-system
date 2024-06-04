import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

async function fetchStaff(queryClient: QueryClient, token?: any) {
    return await queryClient.prefetchQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const response = await axios.get('/api/staff', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }
    })
}

async function fetchShift(queryClient: QueryClient, token?: any) {
    return await queryClient.prefetchQuery({
        queryKey: ['shift'],
        queryFn: async () => {
            const response = await axios.get('/api/shifts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }
    })
}

async function fetchShiftCategory(queryClient: QueryClient, token?: any) {
    return await queryClient.prefetchQuery({
        queryKey: ['shiftCategory'],
        queryFn: async () => {
            const response = await axios.get('/api/shift-category', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        }
    })
}

async function fetchLocation(queryClient: QueryClient, token?: any) {
    return await queryClient.prefetchQuery({
        queryKey: ['location'],
        queryFn: async () => {
            const response = await axios.get('/api/location', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        }
    })
}

async function fetchGroup(queryClient: QueryClient, token?: any) {
    return await queryClient.prefetchQuery({
        queryKey: ['group'],
        queryFn: async () => {
            const response = await axios.get('/api/group', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        }
    })


}

async function fetchAssignedGroup(queryClient: QueryClient, token?: any) {
    return await queryClient.prefetchQuery({
        queryKey: ['assigned_staff'],
        queryFn: async () => {
            const response = await axios.get('/api/as_staff', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        }
    });
}

export function FetchDataApi(queryClient: QueryClient, token?: any, isAdmin?:any) {
    fetchStaff(queryClient, token);
    fetchShift(queryClient, token)
    fetchShiftCategory(queryClient, token)
    fetchLocation(queryClient, token)
    fetchGroup(queryClient, token)
    fetchAssignedGroup(queryClient, token);
}