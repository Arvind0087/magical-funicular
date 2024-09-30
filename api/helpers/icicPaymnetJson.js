const icicPaymentMode = [
  {
    id: 0,
    paymentMode: "Cash",
  },
  {
    id: 1,
    paymentMode: "Cheque",
  },
  {
    id: 2,
    paymentMode: "NEFT/RTGS",
  },
  {
    id: 3,
    paymentMode: "NetBanking",
  },
  {
    id: 4,
    paymentMode: "DebitCard",
  },
  {
    id: 5,
    paymentMode: "CreditCard",
  },
  {
    id: 6,
    paymentMode: "UPI",
  },
  {
    id: 9,
    paymentMode: "All",
  },
];

const icicPaymnetResponse = [
  {
    id: "E000",
    ddescription:
      "Received successful confirmation in real time for the transaction. Settlement process is initiated for the transaction.",
  },
  {
    id: "E001",
    ddescription: "Unauthorized Payment Mode",
  },
  {
    id: "E002",
    ddescription: "Unauthorized Key",
  },
  {
    id: "E003",
    ddescription: "Unauthorized Packet",
  },
  {
    id: "E004",
    ddescription: "Unauthorized Merchant",
  },
  {
    id: "E005",
    ddescription: "Unauthorized Return URL",
  },
  {
    id: "E006",
    ddescription: "Transaction is already paid",
  },
  {
    id: "E007",
    ddescription: "Transaction Failed",
  },
  {
    id: "E008",
    ddescription: "Failure from Third Party due to Technical Error",
  },
  {
    id: "E009",
    ddescription: "Bill Already Expired",
  },
  {
    id: "E0031",
    ddescription: "Mandatory fields coming from merchant are empty",
  },
  {
    id: "E0032",
    ddescription: "Mandatory fields coming from database are empty",
  },
  {
    id: "E0033",
    ddescription: "Payment mode coming from merchant is empty",
  },
  {
    id: "E0034",
    ddescription: "PG Reference number coming from merchant is empty",
  },
  {
    id: "E0035",
    ddescription: "Sub merchant id coming from merchant is empty",
  },
  {
    id: "E0036",
    ddescription: "Transaction amount coming from merchant is empty",
  },
  {
    id: "E0037",
    ddescription: "Payment mode coming from merchant is other than 0 to 9",
  },
  {
    id: "E0038",
    ddescription:
      "Transaction amount coming from merchant is more than 9 digit length",
  },
  {
    id: "E0039",
    ddescription: "Mandatory value Email in wrong format",
  },
  {
    id: "E00310",
    ddescription: "Mandatory value mobile number in wrong format",
  },
  {
    id: "E00311",
    ddescription: "Mandatory value amount in wrong format",
  },
  {
    id: "E00312",
    ddescription: "Mandatory value Pan card in wrong format",
  },
  {
    id: "E00313",
    ddescription: "Mandatory value Date in wrong format",
  },
  {
    id: "E00314",
    ddescription: "Mandatory value String in wrong format",
  },
  {
    id: "E00315",
    ddescription: "Optional value Email in wrong format",
  },
  {
    id: "E00316",
    ddescription: "Optional value mobile number in wrong format",
  },
  {
    id: "E00317",
    ddescription: "Optional value amount in wrong format",
  },
  {
    id: "E00318",
    ddescription: "Optional value pan card number in wrong format",
  },
  {
    id: "E00319",
    ddescription: "Optional value date in wrong format",
  },
  {
    id: "E00320",
    ddescription: "Optional value string in wrong format",
  },
  {
    id: "E00321",
    ddescription:
      "Request packet mandatory columns is not equal to mandatory columns set in enrolment or optional columns are not equal to optional columns length set in enrolment",
  },
  {
    id: "E00322",
    ddescription: "Reference Number Blank",
  },
  {
    id: "E00323",
    ddescription: "Mandatory Columns are Blank",
  },
  {
    id: "E00324",
    ddescription: "Merchant Reference Number and Mandatory Columns are Blank",
  },
  {
    id: "E00325",
    ddescription: "Merchant Reference Number Duplicate",
  },
  {
    id: "E00326",
    ddescription: "Sub merchant id coming from merchant is non numeric",
  },
  {
    id: "E00327",
    ddescription: "Cash Challan Generated",
  },
  {
    id: "E00328",
    ddescription: "Cheque Challan Generated",
  },
  {
    id: "E00329",
    ddescription: "NEFT Challan Generated",
  },
  {
    id: "E00330",
    ddescription:
      "Transaction Amount and Mandatory Transaction Amount mismatch in Request URL",
  },
  {
    id: "E00331",
    ddescription:
      "UPI Transaction Initiated Please Accept or Reject the Transaction",
  },
  {
    id: "E00332",
    ddescription:
      "Challan Already Generated, Please re-initiate with unique reference number",
  },
  {
    id: "E00333",
    ddescription: "Referer is null/invalid Referer",
  },
  {
    id: "E00334",
    ddescription:
      "Mandatory Parameters Reference No and Request Reference No parameter values are not matched",
  },
  {
    id: "E00335",
    ddescription: "Transaction Cancelled By User",
  },
  {
    id: "E0801",
    ddescription: "FAIL",
  },
  {
    id: "E0802",
    ddescription: "User Dropped",
  },
  {
    id: "E0803",
    ddescription: "Canceled by user",
  },
  {
    id: "E0804",
    ddescription: "User Request arrived but card brand not supported",
  },
  {
    id: "E0805",
    ddescription: "Checkout page rendered Card function not supported",
  },
  {
    id: "E0806",
    ddescription: "Forwarded / Exceeds withdrawal amount limit",
  },
  {
    id: "E0807",
    ddescription: "PG Fwd Fail / Issuer Authentication Server failure",
  },
  {
    id: "E0808",
    ddescription:
      "Session expiry / Failed Initiate Check, Card BIN not present",
  },
  {
    id: "E0809",
    ddescription: "Reversed / Expired Card",
  },
  {
    id: "E0810",
    ddescription: "Unable to Authorize",
  },
  {
    id: "E0811",
    ddescription: "Invalid Response Code or Guide received from Issuer",
  },
  {
    id: "E0812",
    ddescription: "Do not honor",
  },
  {
    id: "E0813",
    ddescription: "Invalid transaction",
  },
  {
    id: "E0814",
    ddescription: "Not Matched with the entered amount",
  },
  {
    id: "E0815",
    ddescription: "Not sufficient funds",
  },
  {
    id: "E0816",
    ddescription: "No Match with the card number",
  },
  {
    id: "E0817",
    ddescription: "General Error",
  },
  {
    id: "E0818",
    ddescription: "Suspected fraud",
  },
  {
    id: "E0819",
    ddescription: "User Inactive",
  },
  {
    id: "E0820",
    ddescription: "ECI 1 and ECI6 Error for Debit Cards and Credit Cards",
  },
  {
    id: "E0821",
    ddescription: "ECI 7 for Debit Cards and Credit Cards",
  },
  {
    id: "E0822",
    ddescription: "System error. Could not process transaction",
  },
  {
    id: "E0823",
    ddescription: "Invalid 3D Secure values",
  },
  {
    id: "E0824",
    ddescription: "Bad Track Data",
  },
  {
    id: "E0825",
    ddescription: "Transaction not permitted to cardholder",
  },
  {
    id: "E0826",
    ddescription: "Rupay timeout from issuing bank",
  },
  {
    id: "E0827",
    ddescription: "OCEAN for Debit Cards and Credit Cards",
  },
  {
    id: "E0828",
    ddescription: "E-commerce decline",
  },
  {
    id: "E0829",
    ddescription: "This transaction is already in process or already processed",
  },
  {
    id: "E0830",
    ddescription: "Issuer or switch is inoperative",
  },
  {
    id: "E0831",
    ddescription: "Exceeds withdrawal frequency limit",
  },
  {
    id: "E0832",
    ddescription: "Restricted card",
  },
  {
    id: "E0833",
    ddescription: "Lost card",
  },
  {
    id: "E0834",
    ddescription: "Communication Error with NPCI",
  },
  {
    id: "E0835",
    ddescription: "The order already exists in the database",
  },
  {
    id: "E0836",
    ddescription: "General Error Rejected by NPCI",
  },
  {
    id: "E0837",
    ddescription: "Invalid credit card number",
  },
  {
    id: "E0838",
    ddescription: "Invalid amount",
  },
  {
    id: "E0839",
    ddescription: "Duplicate Data Posted",
  },
  {
    id: "E0840",
    ddescription: "Format error",
  },
  {
    id: "E0841",
    ddescription: "SYSTEM ERROR",
  },
  {
    id: "E0842",
    ddescription: "Invalid expiration date",
  },
  {
    id: "E0843",
    ddescription: "Session expired for this transaction",
  },
  {
    id: "E0844",
    ddescription: "FRAUD - Purchase limit exceeded",
  },
  {
    id: "E0845",
    ddescription: "Verification decline",
  },
  {
    id: "E0846",
    ddescription: "Compliance error code for issuer",
  },
  {
    id: "E0847",
    ddescription:
      "Caught ERROR of type:[ System.Xml.XmlException ] . strXML is not a valid XML string Failed in Authorize - I",
  },
  {
    id: "E0848",
    ddescription: "Incorrect personal identification number",
  },
  {
    id: "E0849",
    ddescription: "Stolen card",
  },
  {
    id: "E0850",
    ddescription: "Transaction timed out, please retry",
  },
  {
    id: "E0851",
    ddescription: "Failed in Authorization - PE",
  },
  {
    id: "E0852",
    ddescription: "Cardholder did not return from Rupay",
  },
  {
    id: "E0853",
    ddescription:
      "Missing Mandatory Field(s)The field card_number has exceeded the maximum length of 19",
  },
  {
    id: "E0854",
    ddescription:
      "Exception in CheckEnrollmentStatus: Data at the root level is invalid. Line 1, position 1.",
  },
  {
    id: "E0855",
    ddescription: "CAF status = 0 or 9",
  },
  {
    id: "E0856",
    ddescription: "412",
  },
  {
    id: "E0857",
    ddescription: "Allowable number of PIN tries exceeded",
  },
  {
    id: "E0858",
    ddescription: "No such issuer",
  },
  {
    id: "E0859",
    ddescription: "Invalid Data Posted",
  },
  {
    id: "E0860",
    ddescription: "PREVIOUSLY AUTHORIZED",
  },
  {
    id: "E0861",
    ddescription: "Cardholder did not return from ACS",
  },
  {
    id: "E0862",
    ddescription: "Duplicate transmission",
  },
  {
    id: "E0863",
    ddescription: "Wrong transaction state",
  },
  {
    id: "E0864",
    ddescription: "Card acceptor contact acquirer",
  },
];

module.exports = {
  icicPaymentMode,
  icicPaymnetResponse,
};
