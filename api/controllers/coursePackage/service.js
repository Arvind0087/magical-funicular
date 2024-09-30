
const db = require("../../models/index");
const packageTable = db.course_package_map;


//NOTE - generate package code
exports.generatePackageCode = async (type) => {
    const lastCode = await packageTable.findAll({
        order: [["id", "DESC"]],
        limit: 1,
    });

    const lastPackageCode = lastCode.length ? lastCode[0].package_code : null;
    if (lastPackageCode === null) {
        return `${type}0001`;
    }

    const counter = parseInt(lastPackageCode.slice(-4));
    const code = `${lastPackageCode.slice(0, -4)}${(counter + 1)
        .toString()
        .padStart(4, "0")}`;
    return code;
};