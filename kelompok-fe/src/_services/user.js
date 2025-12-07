import { API } from "../_api";

export const getUsers = async () => {
   try {
      const { data } = await API.get("/users");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createUser = async (data) => {
    try {
        const response = await API.post("/users", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showUser = async (id) => {
  try {
    const { data } = await API.get(`/users/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateUser = async ( id, data ) => {
  try {
    const response = await API.post(`/users/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    await API.delete(`/users/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchUsers = async (page = 1) => {
    const response = await API.get(`/users?page=${page}`);
    
    return response.data.data;
};