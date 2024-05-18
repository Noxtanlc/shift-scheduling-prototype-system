import axios from "axios";

export function getShiftCategory(token?: any) {
  return ({
    queryKey: ['shiftCategory'],
    queryFn: async () => {
      const response = await axios.get('/api/shift-category', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.data;
      return data;
    }
  });
}

export function getShiftData(token?: any) {
  return ({
    queryKey: ['shift'],
    queryFn: async (token?: any) => {
      const response = await axios.get('/api/shifts', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.data;
      return data;
    }
  });
}

export function getStaff(token?: any) {
  return ({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await axios.get("/api/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.data;
      return data;
    }
  });
}

export function getGroup(token?: any) {
  return ({
    queryKey: ['group'],
    queryFn: async () => {
      const response = await axios.get("/api/group", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.data;
      return data;
    }
  });
}

export function getAssignedStaff(token?: any) {
  return ({
    queryKey: ['assigned_staff'],
    queryFn: async () => {
      const response = await axios.get("/api/as_staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.data;
      return data;
    }
  });
}

export function getLocation(token?: any) {
  return ({
    queryKey: ['location'],
    queryFn: async () => {
      const response = await axios.get("/api/location", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.data;
      return data;
    }
  });
}