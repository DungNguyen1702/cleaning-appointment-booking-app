import axiosClient from "../utils/customFetch";

const userAPI = {
      getListTodo: ( startDate, endDate) => {
        const url = `/todo/1?startDate=${startDate}&endDate=${endDate}`; // Đường dẫn tới API lịch làm việc
        return axiosClient.application.get(url);
      },
      createToDo: (formData) => {
        const url = `/todo`;
        return axiosClient.application.post(url, formData);
      },
      editToDo: (formData,id) => {
        const url = `/todo/${id}`;
        return axiosClient.application.put(url, formData);
      }
};

export default userAPI;