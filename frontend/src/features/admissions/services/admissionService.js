import { apiRequest } from "../../../lib/api";

export const getClassDetails = (classId) => {
  return apiRequest(`/classes/${classId}`);
};

export const createAdmissionHold = (classId, studentId) => {
  return apiRequest(`/classes/${classId}/holds`, {
    method: "POST",
    headers: {
      "X-Student-Id": studentId,
    },
  });
};

export const getHoldStatus = (holdId) => {
  return apiRequest(`/holds/${holdId}`);
};

export const confirmAdmission = (holdId, studentId) => {
  return apiRequest(`/holds/${holdId}/confirm`, {
    method: "POST",
    headers: {
      "X-Student-Id": studentId,
    },
  });
};