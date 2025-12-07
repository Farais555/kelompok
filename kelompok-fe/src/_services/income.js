import { API } from "../_api";

export const getIncomes = async () => {
   try {
      const { data } = await API.get("/incomes");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const createIncome = async (data) => {
    try {
        const response = await API.post("/incomes", data)
        return response.data
    } catch (error) {
        console.log(error);
        throw error
    }
}

export const showIncome = async (id) => {
  try {
    const { data } = await API.get(`/incomes/${id}`)
    return data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateIncome = async ( id, data ) => {
  try {
    const response = await API.post(`/incomes/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteIncome = async (id) => {
  try {
    await API.delete(`/incomes/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const fetchIncomes = async (page = 1) => {
    const response = await API.get(`/incomes?page=${page}`);
    
    return response.data.data;
};