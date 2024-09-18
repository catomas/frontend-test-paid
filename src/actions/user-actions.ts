"use server";

import axios from "axios";

export const checkAndAddUser = async (userId: string, email: string) => {
  try {
    const checkUser = await axios.get(
      `http://localhost:3000/api/users/${userId}`
    );

    if (checkUser.status === 200) {
      return checkUser.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      try {
        const response = await axios.post("http://localhost:3000/api/users", {
          clerkUserId: userId,
          email,
        });
        return response.data;
      } catch (addError) {
        console.error("Error adding user:", addError);
        throw addError;
      }
    } else {
      console.error("Error checking user:", error);
      throw error;
    }
  }
};

export const getUserInfo = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/users/${userId}`
    );

    console.log("User info:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};
