

const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const axios = require('axios');
// Set up API credentials
const apiKey = 'u$r60c90741aa40fc1bca5e5f8cb00f1745';
const clientSecret = '8a39d24802c88122ce4182ff19b6ca1ffedf045f';
const host = 'api-in21.leadsquared.com'


//NOTE - create leads
const createLead = async (req, res) => {
    try {
        const newLead = await leadFunction(apiKey, clientSecret)
        return res.send({ data: newLead })
    } catch (err) {
        console.log(err);
    }
}


//Make API request
const leadFunction = async (apiKey, clientSecret) => {
    try {
        const leadData = [
            {
                Attribute: 'EmailAddress',
                Value: 'vedAcademy@gmail.com'
            },
            {
                Attribute: 'FirstName',
                Value: 'vedas'
            },
            {
                Attribute: 'LastName',
                Value: 'Demos'
            },
            {
                Attribute: 'Phone',
                Value: '7774336878'
            },
            // {
            //     Attribute: 'Class',
            //     Value: 12
            // }
            // {
            //     Attribute: "SearchBy",
            //     Value: "EmailAddress"
            // },
        ];

        const response = await axios.post(
            ` https://${host}/v2/ProspectActivity.svc/CreateCustom?accessKey=${apiKey}&secretKey=${clientSecret}`,
            leadData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        return response.data;     //NOTE - return success data
    } catch (error) {
        const responseData = {
            Status: error.response.data.Status,
            ExceptionType: error.response.data.ExceptionType,
            ExceptionMessage: error.response.data.ExceptionMessage
        };
        return responseData;
    }
};




//NOTE - capture Leads
const captureLead = async (req, res) => {
    try {
        const newLead = await captureFunction(apiKey, clientSecret);
        return res.send({ data: newLead })

    } catch (err) {
        console.log(err);
    }
}

// Make API request 
const captureFunction = async (apiKey, clientSecret) => {
    try {
        const leadData = [
            {
                Attribute: 'FirstName',
                Value: 'veds demo'
            },
            {
                Attribute: 'mx_Course',
                Value: 'K-12'
            },
            {
                Attribute: 'mx_Board',
                Value: 'CBSE'       
            },
            {
                Attribute: 'mx_Class',
                Value: "6th"
            },
            {
                Attribute: 'Phone', 
                Value: '7273747578'      
            },      
        ];

        const response = await axios.post(
            `https://${host}/v2/LeadManagement.svc/Lead.Capture?accessKey=${apiKey}&secretKey=${clientSecret}`,
            leadData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
};



//NOTE - capture Leads
const retriveLead = async (req, res) => {
    try {
        const newLead = await retriveLeads(apiKey, clientSecret);
        return res.send({ data: newLead })

    } catch (err) {
        console.log(err);
    }
}

// Make API request
const retriveLeads = async (apiKey, clientSecret) => {
    try {
        const leadData = [  
            {
                Attribute: "SearchBy",
                Value: "Phone"
            },
        ];

        const response = await axios.get(
            `https://${host}/v2/ProspectActivity.svc/ActivityTypes.Get?accessKey=${apiKey}&secretKey=${clientSecret}`,
            leadData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
};

module.exports = {
    createLead,
    captureLead,
    retriveLead
}
