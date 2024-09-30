import axios from "axios";
import { errorMessage } from "./slices/error.slice";

/*
 * Axios Api Call Component
 * @type : GET POST PATCH DELETE
 * @api : Api Path
 * @payload : Payload that need to be sent to server
 * @toolkit: dispatch, fulfillWithValue, rejectWithValue
 */
const AxiosClient = async (type, api, payload, toolkit) => {
  const { userInfo: { userInfo = {} } = {} } = toolkit?.getState();
  const AxiosTypeString = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
  };
  return await axios({
    method: AxiosTypeString[type],
    url: `${process.env.REACT_APP_API_URL}${api}`,
    data: payload,
    headers: {
      "Content-Type": "application/json",
      Authorization: userInfo?.accessToken || null,
    },
  })
    .then((response) => {
      return toolkit.fulfillWithValue(response.data);
    })
    .catch((error) => {
      toolkit.dispatch(errorMessage(error.response.data.message));
      if (error.response.data.status === 401) {
        //  if user unauthorized
        setTimeout(() => {
          //set timeout becouse give time to display error message
          toolkit.dispatch({ type: "LOGOUT" }); // logout the system
        }, 1000);
      }
      return toolkit.rejectWithValue(
        error.response.data,
      );
    });
};
export { AxiosClient };

// // start interceptors code  - if user unauthorized then logout the system
// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.data.status === 401) {
//       toolkit.dispatch(errorMessage(error.response.data.message));
//       toolkit.dispatch({ type: 'LOGOUT' })
//     }
//     return Promise.reject(error);
//   }
// );
// // end interceptors code
