import { apiRequest } from "../../../lib/api";

export const getClasses = () => apiRequest("/classes");

export const createClass = (data) =>
  apiRequest("/classes", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getClassById = (id) => apiRequest(`/classes/${id}`);