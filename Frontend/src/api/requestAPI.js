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

  getHistory :(page,userid,name)=>{
    const url = `/requests/${userid}/userrentalhistory?page=${page}&companyName=${name}&limit=12`
    ///requests/1/userrentalhistory?page=1&limit=10&companyName=C
    return axiosClient.application.get(url);

  }

};

export default RequestAPI;