import axiosClient from '../utils/customFetch';

const RequestDetailAPI = {
  getRequestDetail: (request_id) => {
    const url = `/company/request/${request_id}/details`;
    return axiosClient.application.get(url);
  },
  
//   completeRequest: (requestId) => {
//     const url = `/company/request/${requestId}/complete`;
//     return axiosClient.application.put(url);
//   }
};

export default RequestDetailAPI;