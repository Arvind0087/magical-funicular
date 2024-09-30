

const db = require("../models/index");
const msg = require("../constants/Messages");
const { Response } = require("./response.helper");
const create_error = db.error;


exports.errorHandlerMiddleware = async (error, req, res, next) => {
    try {
        const statusCode = error.statusCode || 500;
        const errorsave = await create_error.create({
            status: statusCode,
            message: error.message,
            route: req.url,
            userId: 1,
            stack: JSON.stringify(error.stack),
        });
        console.log("error", errorsave);
        return res.status(500).send({ status: 500, message: "Something Went Wrong!" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 500, message: "Something Went Wrong!" })
    }
};