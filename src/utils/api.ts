import { ChatResponse } from "../types";
const apiURL = process.env.API_URL || "http://localhost:8000";

const api = {
  async post<T = ChatResponse>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${apiURL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default api;
