import axiosClient from "../utils/customFetch";

const companyAPI = {
    getListCompany: (page, location, name) => {
        const url = `/company?page=${page}&limit=9&location=${location}&name=${name}`; // Đường dẫn tới API danh sách công ty
        return axiosClient.application.get(url);
    },
    getCompanyDetails: (companyId) => {
        const url = `/company/${companyId}`; // Đường dẫn tới API chi tiết công ty
        return axiosClient.application.get(url);
      },
      getRequestCustomer: (comapnyId, startDate, endDate) => {
        const url = `/company/requests/${comapnyId}/customerrequestsforweek?startDate=${startDate}&endDate=${endDate}`; // Đường dẫn tới API lịch làm việc
        return axiosClient.application.get(url);
      },
      getStatificCompany: (companyId, startDate, endDate) => {
        const url = `/company/statistical/${companyId}?startDate=${startDate}&endDate=${endDate}`; 
        return axiosClient.application.get(url);
      },
};

export default companyAPI;