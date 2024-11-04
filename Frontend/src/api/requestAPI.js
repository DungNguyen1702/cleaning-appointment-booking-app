import axiosClient from '../utils/customFetch';

const RequestAPI = {
  createRequest: (formData) => {
    const url = `/requests`;
    return axiosClient.application.post(url, formData);
  },
  getCompanyDetails: (requestId) => {
    const url = `/requests/${requestId}`; // Đường dẫn tới API chi tiết công ty
    return axiosClient.application.get(url);
  },
};

export default RequestAPI;