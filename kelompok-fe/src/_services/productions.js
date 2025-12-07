import { API } from "../_api";

export const getProductions = async () => {
   try {
      const { data } = await API.get("/productions");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createProduction = async (data) => {
    try {
        const response = await API.post("/productions", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showProduction = async (id) => {
  try {
    const { data } = await API.get(`/productions/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateProduction = async ( id, data ) => {
  try {
    const response = await API.post(`/productions/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteProduction = async (id) => {
  try {
    await API.delete(`/productions/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchProductions = async (page = 1) => {
    const response = await API.get(`/productions?page=${page}`);
    
    return response.data.data;
};