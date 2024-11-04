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
};

export default companyAPI;