import axiosClient from "../utils/customFetch";

const userAPI = {
      getListTodo: (comapnyId, startDate, endDate) => {
        const url = `/user/requests/${comapnyId}/userrequestsforweek?startDate=${startDate}&endDate=${endDate}`; // Đường dẫn tới API lịch làm việc
        return axiosClient.application.get(url);
      }
};

export default userAPI;