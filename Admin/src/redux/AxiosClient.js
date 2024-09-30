import axios from "axios";
import { errorMessage } from "./slices/error.slice";
import { isJson } from "utils/isJson";
/*
 * Axios Api Call Component
 * @type : GET POST PATCH DELETE
 * @api : Api Path
 * @payload : Payload that need to be sent to server
 * @toolkit: dispatch, fulfillWithValue, rejectWithValue
 */

const AxiosClient = async (
  type,
  api,
  payload,
  toolkit,
  content = "application/json"
) => {
  const AxiosTypeString = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
  };
  return await axios({
    method: AxiosTypeString[type],
    url: `${process.env.REACT_APP_BASE_URL}${api}`,
    data: payload,
    headers: {
      "Content-Type": content,
      Authorization: isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null,
    },
  })
    .then((response) => {
      return toolkit.fulfillWithValue(response.data);
    })
    .catch((error) => {
      toolkit.dispatch(errorMessage(error.response.data.message));
      return toolkit.rejectWithValue(error.response.data.message);
    });
};
export { AxiosClient };
