import { useJwt } from "react-jwt";
import { API } from "../_api";

export const login = async ({ email, password }) => {
   try {
      const { data } = await API.post("/login", { email, password });
      return data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const logout = async ({ token }) => {
   try {
    const { data } = await API.post('/logout', { token }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    localStorage.removeItem('accessToken')
    return data
  } catch (error) {
    console.log(error);
    throw error
  }
}


export const useDecodeToken = (token) => {
   const { decodedToken, isExpired } = useJwt(token);

   // Jika decodedToken masih null sementara token ada → masih loading
   if (token && decodedToken === null && isExpired === false) {
      return {
         loading: true,
         success: null,
         data: null,
      };
   }

   // Jika token expired
   if (isExpired) {
      return {
         loading: false,
         success: false,
         data: null,
      };
   }

   // Kalau token valid
   return {
      loading: false,
      success: true,
      data: decodedToken,
   };
};

//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

export const getUsers = async () => {
   try {
      const { data } = await API.get("/users");
      return data.data;
   } catch (error) {
      console.log(error);
      throw error;
   }
};
