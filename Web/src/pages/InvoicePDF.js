import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import logoImage from "../assets/logo.png";
import downloadImg from "../assets/download.png";
import moment from "moment";

function InvoicePDF({ orderData }) {
  const [base64Image, setBase64Image] = useState("");

  // Convert image to Base64
  useEffect(() => {
    const convertImageToBase64 = (image) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
    };

    fetch(logoImage)
      .then((response) => response.blob())
      .then((blob) => convertImageToBase64(blob));
  }, []);

  const handleGeneratePdf = async () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    // Use the Base64 image in the PDF
    // doc.addImage(base64Image, 'PNG', 20, 20, 120, 40);

    const emailContent = orderData?.email
      ? `<p style="font-family: sans-serif; font-size: 10px; margin-bottom: 5px; margin-top: 0; color: rgb(48, 47, 47);">
        ${orderData.email}
      </p>`
      : "";

    const htmlContent = `
      <div style="width: 420px; margin: auto; padding: 20px; border: 2px solid #ccc;">
        <div style="display: flex; justify-content: center; align-items: flex-start; width: 100%; border-bottom: 2px solid #ccc;">
          <div style="width: 220px">
            <img src="${base64Image}" alt="" width="90px" />
          </div>
          <div style="width: 220px; display: flex; flex-direction: column; align-items: flex-end;">
            <div style="width: 160px">
              <p style="font-family: sans-serif; font-size: 10px; margin-bottom: 10px; margin-top: 0;">
                Original For Recipient
              </p>
              <p style="font-family: sans-serif; font-size: 20px; margin-bottom: 15px; margin-top: 0; margin-left: 40px; font-weight:bold">
                Invoice
              </p>
              <p style="font-family: sans-serif; font-size: 10px; margin-bottom: 5px; margin-top: 0;">
                Invoice # ${orderData?.orderId}
              </p>
              <p style="font-family: sans-serif; font-size: 10px; margin-bottom: 10px; margin-top: 0;">
                Invoice date: ${moment(orderData?.purchaseDate)
                  .utc()
                  .format("Do MMM YYYY")}
              </p>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: center; align-items: flex-start; width: 100%; margin-top: 20px;">
          <div style="width: 50%; display: flex; flex-direction: column; align-items: flex-start;">
            <p style="font-family: sans-serif; font-size: 10px; margin-bottom: 10px; margin-top: 0; font-weight: bold;">
              Supplier Details:
            </p>
            <p style="font-family: sans-serif; font-size: 10px; margin-bottom: 10px; margin-top: 0; max-width: 300px; line-height: 24px; color: rgb(48, 47, 47);">
            ${orderData?.fullAddress || "N/A"}
            </p>
            <p style="font-family: sans-serif; font-size: 9px; margin-bottom: 5px; font-weight: bold; margin-top: 0;">
              GSTN: 09AAHCK2971N1ZW
            </p>
          </div>
          <div style="width: 50%; display: flex; flex-direction: column; align-items: flex-end;">
            <p style="font-family: sans-serif; font-size: 10px; margin-bottom: 10px; margin-top: 0; font-weight: bold;">
              Recipient Details:
            </p>
            <p style="font-family: sans-serif; font-size: 10px; margin-bottom: 5px; margin-top: 0; color: rgb(48, 47, 47);">
              ${orderData?.userName || "N/A"}
            </p>
            ${emailContent}
          </div>
        </div>
        <table style="width: 390px; margin-top: 30px; border-collapse: collapse">
          <thead>
            <tr>
              <th style="color: rgb(48, 47, 47); background-color: #f0f0f0; border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; font-size: 10px; width: 33%; vertical-align: middle;">
                Description
              </th>
              <th style="color: rgb(48, 47, 47); background-color: #f0f0f0; border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; width: 33%; vertical-align: middle;font-size: 10px; ">
                Quantity
              </th>
              <th style="color: rgb(48, 47, 47); background-color: #f0f0f0; border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; width: 33%; vertical-align: middle;font-size: 10px; ">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="color: rgb(48, 47, 47); border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; text-align: center; font-size: 8px;">
                ${orderData?.invoiceTitle}
              </td>
              <td style="color: rgb(48, 47, 47); border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; text-align: center; font-size: 8px;">
                1.0
              </td>
              <td style="color: rgb(48, 47, 47); border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; text-align: center; font-size: 8px;">
              ${orderData?.amount}
              </td>
            </tr>
            <tr>
              <td style="padding-top: 40px" colspan="3"></td>
            </tr>
            <tr style="margin-top: 50px">
              <td style="color: rgb(48, 47, 47); border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; text-align: center; font-weight: bold; background-color: #f0f0f0; vertical-align: middle;font-size: 10px; ">
                Total
              </td>
              <td style="color: rgb(48, 47, 47); border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; text-align: center; background-color: #f0f0f0; vertical-align: middle;font-size: 10px;">
              </td>
              <td style="color: rgb(48, 47, 47); border-collapse: collapse; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif; text-align: center; font-weight: bold; background-color: #f0f0f0; vertical-align: middle;font-size: 10px;">
                INR ${orderData?.amount}
              </td>
            </tr>
          </tbody>
        </table>
        <p style="color: rgb(88, 87, 87); margin-top: 20px; margin-bottom: 8px; font-family: sans-serif; font-size: 10px;">
          This is a system generated invoice and does not require a signature or a digital signature
        </p>
      </div>
    `;

    // Use the html method to convert the HTML string to PDF
    doc.html(htmlContent, {
      callback: (doc) => {
        doc.save("invoice.pdf");
      },
      x: 10,
      y: 10,
    });
  };

  return (
    <div>
      <button
        className="button"
        onClick={handleGeneratePdf}
        disabled={!base64Image}
        style={{ cursor: "pointer", width: "35px" }}
      >
        <img src={downloadImg} alt="Download image" />
      </button>
    </div>
  );
}

export default InvoicePDF;
