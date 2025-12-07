import { API } from "../_api";

export const getWarehouses = async () => {
   try {
      const { data } = await API.get("/warehouses");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const fetchWarehouses = async (page = 1) => {
    const response = await API.get(`/warehouses?page=${page}`);
    
    return response.data.data;
};