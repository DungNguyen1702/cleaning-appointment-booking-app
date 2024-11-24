import axiosClient from "../utils/customFetch";

const userAPI = {
      getListTodo: (userId, startDate, endDate) => {
        const url = `/todo/${userId}?startDate=${startDate}&endDate=${endDate}`; // Đường dẫn tới API lịch làm việc
        return axiosClient.application.get(url);
      },
      getListAllTodo: (userId) => {
        const url = `/todo/all/${userId}`;
        return axiosClient.application.get(url);
      },
      createToDo: (formData) => {
        const url = `/todo`;
        return axiosClient.application.post(url, formData);
      },
      editToDo: (formData,id) => {
        const url = `/todo/${id}`;
        return axiosClient.application.put(url, formData);
      },
      deleteToDo:(id)=>{
        const url = `/todo/${id}`;
        return axiosClient.application.delete(url);
      }
};

export default userAPI;