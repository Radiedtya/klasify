import api from "./axios";

export const userApi = {
  getByRole: (role) => api.get(`/users/role/${role}`),
};
