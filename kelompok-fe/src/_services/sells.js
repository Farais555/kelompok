import { API } from "../_api";

export const getSells = async () => {
   try {
      const { data } = await API.get("/sells");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createSell = async (data) => {
    try {
        const response = await API.post("/sells", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showSell = async (id) => {
  try {
    const { data } = await API.get(`/sells/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateSell = async ( id, data ) => {
  try {
    const response = await API.post(`/sells/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteSell = async (id) => {
  try {
    await API.delete(`/sells/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchSells = async (page = 1) => {
    const response = await API.get(`/sells?page=${page}`);
    
    return response.data.data;
};