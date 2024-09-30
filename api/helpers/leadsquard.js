const axios = require("axios");

//NOtE - retrive lead
exports.retriveLeads = async (apiKey, clientSecret, host, phone) => {
  try {
    const leadData = [
      {
        Attribute: "SearchBy",
        Value: phone,
      },
    ];
    const response = await axios.get(
      `https://${host}/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${apiKey}&secretKey=${clientSecret}&phone=${phone}`,
      leadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
};
