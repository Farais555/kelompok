import { API } from "../_api";

export const getStores = async () => {
   try {
      const { data } = await API.get("/stores");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createStore = async (data) => {
    try {
        const response = await API.post("/stores", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showStore = async (id) => {
  try {
    const { data } = await API.get(`/stores/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateStore = async ( id, data ) => {
  try {
    const response = await API.post(`/stores/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteStore = async (id) => {
  try {
    await API.delete(`/stores/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchStores = async (page = 1) => {
    const response = await API.get(`/stores?page=${page}`);
    
    return response.data.data;
};

export const getAllStoresForDropdown = async () => {
    // Panggil endpoint yang mengembalikan SEMUA data, atau 
    // pastikan API.get('/products?all=true') atau yang sejenis
    const response = await API.get(`/stores/all`); 
    return response.data.data; // Asumsi mengembalikan array
};

