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
  getCompanyRequests: (companyId, page, limit) => {
    const url = `/company/${companyId}/requests?page=${page}&limit=${limit}`;
    return axiosClient.application.get(url);
  },
  getHistory :(page,userid,name,starDate,limit)=>{
    const url = `/requests/${userid}/userrentalhistory?page=${page}&companyName=${name}&startDate=${starDate}&limit=${limit}`
    ///requests/1/userrentalhistory?page=1&limit=10&companyName=C
    return axiosClient.application.get(url);
  },
  updateStatusRQByCompany: (requestId, workingHours, status) => {
    const url = `/company/requests/${requestId}`;
    return axiosClient.application.put(url, { workingHours: workingHours, status: status });
  }
};

export default RequestAPI;