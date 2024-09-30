import { isJson } from "utils/isJson";
// import { API_URL } from "utils/secret";

export const studentExcelDownloadAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/studentExcelDownload?search=${
      payload.search || ""
    }&classes=${payload.classes || ""}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

export const paymentExcelDownloadAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/paymentExcelReport?token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

export const packageSellsExcelReportAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/packageSellsExcelReport?packageId=${
      payload.packageId || ""
    }&fromDate=${payload.fromDate || ""}&toDate=${payload.toDate || ""}&type=${
      payload.type || ""
    }&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

export const staffExcelDownloadAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/teacherExcelDownload?search=${
      payload.search
    }&department=${payload.department}&classes=${payload.classes}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

export const feedbackExcelDownloadAsync = (payload) => {
  window.open(
    `${
      process.env.REACT_APP_BASE_URL
    }/feedbackExcelDownload?search=${payload}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

//Scholarship Application  excel
export const scholarshipDownloadAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/scholarshipExcelDownload?search=${
      payload.search || ""
    }&classes=${payload.classes || ""}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

export const EnquiryExcelDownloadAsync = (payload) => {
  window.open(
    `${
      process.env.REACT_APP_BASE_URL
    }/enquiryExcelDownload?search=${payload}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};
//
export const CityExcelDownloadAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/cityExcelDownload?state=${
      payload.state
    }&city=${payload.city}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

export const StateExcelDownloadAsync = (payload) => {
  window.open(
    `${
      process.env.REACT_APP_BASE_URL
    }/stateExcelDownload?search=${payload}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

// subject excel download
export const subjectExcelDownloadAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/subjectExcelDownload?search=${
      payload.search || ""
    }&classes=${payload.classes || ""}&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};

// Student Call Request
export const studentCallRequestExcelAsync = (payload) => {
  window.open(
    `${process.env.REACT_APP_BASE_URL}/requestCallExcelDownload?search=${
      payload.search || ""
    }&token=${
      isJson(localStorage.getItem("auth"))
        ? JSON.parse(localStorage.getItem("auth"))?.token
        : null
    }`,
    "_blank"
  );
};
