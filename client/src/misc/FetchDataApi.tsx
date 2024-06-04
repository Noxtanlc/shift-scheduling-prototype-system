import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function staffQuery(token?: any) {
    return useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const response = await axios.get('/api/staff', token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {});
            return response.data;
        },
        initialData: useQueryClient().getQueryData(['staff']),
    })
}

export function shiftQuery(token?: any) {
    return useQuery({
        queryKey: ['shift'],
        queryFn: async () => {
            const response = await axios.get('/api/shifts', token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {});
            return response.data;
        },
        initialData: useQueryClient().getQueryData(['shift']),
    })
}

export function shiftCategoryQuery(token?: any) {
    return useQuery({
        queryKey: ['shiftCategory'],
        queryFn: async () => {
            const response = await axios.get('/api/shift-category', token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {});

            return response.data;
        },
        initialData: useQueryClient().getQueryData(['shiftCategory']),
    });
}

export function locationQuery(token?: any) {
    return useQuery({
        queryKey: ['location'],
        queryFn: async () => {
            const response = await axios.get('/api/location', token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {});

            return response.data;
        },
        initialData: useQueryClient().getQueryData(['location']),
    })
}

export function groupQuery(token?: any) {
    return useQuery({
        queryKey: ['group'],
        queryFn: async () => {
            const response = await axios.get('/api/group', token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {});

            return response.data;
        },
        initialData: useQueryClient().getQueryData(['group']),
    })


}

export function assigned_staffQuery(token?: any) {
    return useQuery({
        queryKey: ['assigned_staff'],
        queryFn: async () => {
            const response = await axios.get('/api/as_staff', token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {});

            return response.data;
        },
        initialData: useQueryClient().getQueryData(['assigned_staff']),
    });
}

export function fetchQueryApi() {
    const staff = staffQuery();
    const shift = shiftQuery();
    const shiftCategory = shiftCategoryQuery();
    const location = locationQuery();
    const group = groupQuery();
    const assigned_staff = assigned_staffQuery();

    return { staff, shift, shiftCategory, location, group, assigned_staff};
}