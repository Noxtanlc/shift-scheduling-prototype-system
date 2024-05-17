import axios from "axios";

export function getShiftCategory() {
  return ({
    queryKey: ['shiftCategory'],
    queryFn: async () => {
      const response = await axios.get('/api/shift-category');
      const data = await response.data;
      return data;
    }
  });
}

export function getShiftData() {
  return ({
    queryKey: ['shift'],
    queryFn: async () => {
      const response = await axios.get('/api/shifts');
      const data = await response.data;
      return data;
    }
  });
}

export function getStaffList() {
  return ({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await axios.get("/api/staff");
      const data = await response.data;
      return data;
    }
  });
}

export function getGroup() {
  return ({
    queryKey: ['group'],
    queryFn: async () => {
      const response = await axios.get("/api/group");
      const data = await response.data;
      return data;
    }
  });
}

export function getAssignedStaff() {
  return ({
    queryKey: ['assignedStaff'],
    queryFn: async () => {
      const response = await axios.get("/api/as_staff");
      const data = await response.data;
      return data;
    }
  });
}

export function getLocationList() {
  return ({
    queryKey: ['location'],
    queryFn: async () => {
      const response = await axios.get("/api/location");
      const data = await response.data;
      return data;
    }
  });
}