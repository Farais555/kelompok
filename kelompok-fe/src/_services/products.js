import { API } from "../_api";

export const getProducts = async () => {
   try {
      const { data } = await API.get("/products");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createProduct = async (data) => {
    try {
        const response = await API.post("/products", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showProduct = async (id) => {
  try {
    const { data } = await API.get(`/products/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateProduct = async ( id, data ) => {
  try {
    const response = await API.post(`/products/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    await API.delete(`/products/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchProducts = async (page = 1) => {
    const response = await API.get(`/products?page=${page}`);
    
    return response.data.data;
};

export const getAllProductsForDropdown = async () => {
    // Panggil endpoint yang mengembalikan SEMUA data, atau 
    // pastikan API.get('/products?all=true') atau yang sejenis
    const response = await API.get(`/products/all`); 
    return response.data.data; // Asumsi mengembalikan array
};