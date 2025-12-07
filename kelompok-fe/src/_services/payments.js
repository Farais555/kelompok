import axios from "axios";
import { API } from "../_api";

export const getPayments = async () => {
   try {
      const { data } = await API.get("/payments");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createPayment = async (data) => {
    try {
        const response = await API.post("/payments", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showPayment = async (id) => {
  try {
    const { data } = await API.get(`/payments/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updatePayment = async ( id, data ) => {
  try {
    const response = await API.post(`/payments/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deletePayment = async (id) => {
  try {
    await API.delete(`/payments/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchPayments = async (page = 1) => {
    const response = await API.get(`/payments?page=${page}`);
    
    return response.data.data;
};

export const confirmPayment = async (orderId, formData) => {

    const response = await axios.post(`/api/orders/${orderId}/payment`, formData); 
    
    return response.data;
};

export const updatePaymentStatus = (paymentId, newStatus) => {

    const payload = {
        status: newStatus,

    };
    

    return API.patch(`/payments/${paymentId}`, payload);

};