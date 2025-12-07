import { API } from "../_api";

export const getOrders = async () => {
   try {
      const { data } = await API.get("/orders");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createOrder = async (data) => {
    try {
        const response = await API.post("/orders", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showOrder = async (id) => {
  try {
    const { data } = await API.get(`/orders/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateOrder = async ( id, data ) => {
  try {
    const response = await API.post(`/orders/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteOrder = async (id) => {
  try {
    await API.delete(`/orders/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchOrders = async (page = 1) => {
    const response = await API.get(`/orders?page=${page}`);
    
    return response.data.data;
};