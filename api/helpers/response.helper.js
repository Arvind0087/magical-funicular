exports.Response = async (response, status, message, data) => {
  return response.status(status).send({
    status: status,
    message: message,
    data: data,
  });
};
