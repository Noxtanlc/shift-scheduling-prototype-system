export interface Assigned_Staff {
    ID: number;
    name: string;
    staffID: number;
}

export interface Group {
    groupID: number;
    groupName: string;
    staff: Assigned_Staff[];
}

export interface location {
    ID: number;
    alias: string;
    Desc: string;
}

export interface shift {
    shift_id: number;
    start_date: string;
    end_date: string;
    st_id: number;
    st_alias: string;
    color: string;
    ca_id: number;
    ca_alias: string;
}

export interface shiftList {
    staff_id: number;
    name: string | undefined;
    shift: shift[];
}
