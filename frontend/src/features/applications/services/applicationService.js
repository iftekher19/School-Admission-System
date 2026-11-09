import { apiRequest } from "../../../lib/api";

export const getMyApplications = (studentId) => {
  return apiRequest("/me/holds", {
    method: "GET",
    headers: {
      "X-Student-Id": studentId,
    },
  });
};

export const cancelApplication = (holdId, studentId) => {
  return apiRequest(`/holds/${holdId}`, {
    method: "DELETE",
    headers: {
      "X-Student-Id": studentId,
    },
  });
};