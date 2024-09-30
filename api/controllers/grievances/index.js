const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { addTimeIntoDate } = require("../../helpers/service")
const grievanceCategory = db.grievance_category;
const grievanceSubCategory = db.grievance_subCategory;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;
const Girevances = db.girevancesCategory_subCategory_map;
const UserDetails = db.users;
const StudentDetails = db.student;
const TeacherSubjectMap = db.teacher_subject_map;

//ANCHOR : add grievance Category
const addGrievanceCategory = async (req, res) => {
    try {
        const { category } = req.body;

        //NOTE - cretor id from token
        const token = req.user.id;

        //NOTE - find category if already created
        const createCategory = await grievanceCategory.findOne({
            where: { category: category },
        });
        if (createCategory)
            return res.status(400).send({ status: 400, message: msg.GRIEVANCE_CATEGORY_ALREADY_EXIST });

        //NOTE - create grievences
        await grievanceCategory.create({
            category: category.replace(/\s+/g, " ").trim(),
            createdById: token,
        });

        return res.status(200).send({
            status: 200,
            message: msg.ADD_GRIEVANCE_CATEGORY,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};



//ANCHOR : get all GrievanceCategory
const getAllGrievanceCategory = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        let response = [];
        let query;
        if (page && limit) {
            query = {
                offset: Number(page - 1) * limit,
                limit: Number(limit),
            };
        } else {
            query = {};
        }

        //NOTE - Find all state data
        const getCategory = await grievanceCategory.findAndCountAll({
            ...query,
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: [
                {
                    model: AdminUser,
                    as: "creator",
                    attributes: ["id", "name"],
                    include: {
                        model: RolePermission,
                        attributes: ["role"],
                    },
                },
                {
                    model: AdminUser,
                    as: "updater",
                    attributes: ["id", "name"],
                    include: {
                        model: RolePermission,
                        attributes: ["role"],
                    },
                },
            ],

            order: [["createdAt", "ASC"]],
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_CATEGORY_NOT_FOUND });
        for (const data of getCategory.rows) {
            //NOTE - push final data
            response.push({
                id: data.id,
                category: data.category,
                createdByName: data.creator ? data.creator?.name : null,
                createdByRole: data.creator
                    ? data.creator?.permission_role?.role
                    : null,
                updateByName: data.updater ? data.updater?.name : null,
                updateByRole: data.updater ? data.updater?.permission_role.role : null,
            });
        }

        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            count: getCategory.count,
            data: response,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};

//ANCHOR : get grivences by id
const getGrievanceCategoryById = async (req, res) => {
    try {
        const getCategory = await grievanceCategory.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt", "createdById", "updatedById"],
            },
            where: { id: req.params.id },
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_CATEGORY_NOT_FOUND });

        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            data: getCategory,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};

//ANCHOR : update Grievance Category
const updateGrievanceCategoryById = async (req, res) => {
    try {
        const { id, category } = req.body;

        //NOTE - id from token
        const token = req.user.id;

        //NOTE - get categorhy by id
        const getCategory = await grievanceCategory.findOne({
            where: { id: id },
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_CATEGORY_NOT_FOUND });

        //NOTE - update grevinance category
        await grievanceCategory.update(
            { category: category.replace(/\s+/g, " ").trim(), updatedById: token },
            { where: { id: id } }
        );

        return res.status(200).send({
            status: 200,
            message: msg.UPDATED_GRIEVANCE_CATEGORY,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};
//ANCHOR : delete Grievance category
const deleteGrievanceCategoryById = async (req, res) => {
    try {
        //NOTE - get categorhy by id
        const getCategory = await grievanceCategory.findOne({
            where: { id: req.params.id },
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_CATEGORY_NOT_FOUND });


        //NOTE - delete category from sub category 
        const getSubCategory = await grievanceSubCategory.findOne({
            where: { categoryId: req.params.id },
        })

        if (getSubCategory && getSubCategory !== null) {
            grievanceSubCategory.destroy({
                where: {
                    categoryId: req.params.id,
                },

            })
        }

        //NOTE: delete category
        await grievanceCategory.destroy({
            where: {
                id: req.params.id,
            },
        });


        return res.status(200).send({ status: 200, message: msg.DELETED_GRIEVANCE_CATEGORY });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


//ANCHOR : add grievance sub Category
const addGrievanceSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategory } = req.body;

        //NOTE - cretor id from token
        const token = req.user.id;

        //NOTE - find category if already created
        const SubCategory = await grievanceSubCategory.findOne({
            where: {
                categoryId: categoryId,
                subCategory: subCategory,
            },
        });
        if (SubCategory)
            return res.status(400).send({ status: 400, message: msg.GRIEVANCE_SUB_CATEGORY_ALREADY_EXIST });

        //NOTE - create grievences
        await grievanceSubCategory.create({
            categoryId: categoryId,
            subCategory: subCategory.replace(/\s+/g, " ").trim(),
            createdById: token,
        });

        return res.status(200).send({
            status: 200,
            message: msg.ADD_GRIEVANCE_SUB_CATEGORY,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};



//ANCHOR : get all Grievance sub Category
const getAllGrievanceSubCategory = async (req, res) => {
    try {
        const { page, limit, category } = req.query;
        let response = [];
        let query;
        if (page && limit) {
            query = {
                offset: Number(page - 1) * limit,
                limit: Number(limit),
            };
        } else {
            query = {};
        }


        //NOTE - filter sub category by category
        let value = {};
        if (category) {
            value = {
                categoryId: category,
            };
        }


        //NOTE - Find all givances
        const getCategory = await grievanceSubCategory.findAndCountAll({
            ...query,
            where: value,
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: [
                {
                    model: grievanceCategory,
                    attributes: ["category"],
                },
                {
                    model: AdminUser,
                    as: "creator",
                    attributes: ["id", "name"],
                    include: {
                        model: RolePermission,
                        attributes: ["role"],
                    },
                },
                {
                    model: AdminUser,
                    as: "updater",
                    attributes: ["id", "name"],
                    include: {
                        model: RolePermission,
                        attributes: ["role"],
                    },
                },
            ],

            order: [["createdAt", "ASC"]],
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_SUB_CATEGORY_NOT_FOUND });


        for (const data of getCategory.rows) {
            //NOTE - push final data
            response.push({
                id: data.id,
                categoryId: data?.categoryId,
                category: data?.grievance_category?.category,
                subcategory: data?.subCategory,
                createdByName: data.creator ? data.creator?.name : null,
                createdByRole: data.creator
                    ? data.creator?.permission_role?.role
                    : null,
                updateByName: data.updater ? data.updater?.name : null,
                updateByRole: data.updater ? data.updater?.permission_role.role : null,
            });
        }

        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            count: getCategory.count,
            data: response,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};





//ANCHOR : get grivences sub category by id
const getGrievanceSubCategoryById = async (req, res) => {
    try {
        const getCategory = await grievanceSubCategory.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt", "createdById", "updatedById"],
            },
            where: { id: req.params.id },
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_SUB_CATEGORY_NOT_FOUND });

        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            data: getCategory,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};




//ANCHOR : get grivences sub category by category id
const getGrievanceSubCategoryByCategoryId = async (req, res) => {
    try {
        const getCategory = await grievanceSubCategory.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "createdById", "updatedById"],
            },
            where: { categoryId: req.params.id },
            include: [
                {
                    model: grievanceCategory,
                    attributes: ["category"],
                },

            ],
            order: [["createdAt", "DESC"]],
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_SUB_CATEGORY_NOT_FOUND });

        let final = [];
        for (let data of getCategory) {
            final.push({
                id: data.id,
                subCategory: data.subCategory,
                categoryId: data.categoryId,
                //grievance_category: data?.grievance_category?.category
            })
        }

        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            data: final,

        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};

//ANCHOR : update Grievance Category
const updateGrievanceSubCategoryById = async (req, res) => {
    try {
        const { id, categoryId, subCategory } = req.body;

        //NOTE - id from token
        const token = req.user.id;

        //NOTE - get categorhy by id
        const getCategory = await grievanceSubCategory.findOne({
            where: { id: id },
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_SUB_CATEGORY_NOT_FOUND });

        //NOTE - update grevinance category
        await grievanceSubCategory.update(
            { categoryId: categoryId, subCategory: subCategory.replace(/\s+/g, " ").trim() },
            { where: { id: id } }
        );

        return res.status(200).send({
            status: 200,
            message: msg.UPDATED_GRIEVANCE_SUB_CATEGORY,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};
//ANCHOR : delete Grievance sub category
const deleteGrievanceSubCategoryById = async (req, res) => {
    try {
        //NOTE - get categorhy by id
        const getCategory = await grievanceSubCategory.findOne({
            where: { id: req.params.id },
        });
        if (!getCategory)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_SUB_CATEGORY_NOT_FOUND });

        //NOTE: if state delete it
        await grievanceSubCategory.destroy({
            where: {
                id: req.params.id,
            },
        });
        return res.status(200).send({ status: 200, message: msg.DELETED_GRIEVANCE_SUB_CATEGORY });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


//ANCHOR : create new grievance
const createGrievance = async (req, res) => {
    try {
        const { categoryId, subCategoryId, message } = req.body;
        //NOTE - create grievences
        await Girevances.create({
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            parentId: req.user.parentId,
            userId: req.user.id,
            message: message
        });
        return res.status(200).send({
            status: 200,
            message: msg.GRIEVANCE_CREATED,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


//ANCHOR : get all Grievance 
const getAllGrievance = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        let response = [];
        let query;
        if (page && limit) {
            query = {
                offset: Number(page - 1) * limit,
                limit: Number(limit),
            };
        } else {
            query = {};
        }

        let staffParams = null;
        if (
            req.user?.role &&
            ["teacher", "mentor"].includes(req.user.role.toLowerCase())
        ) {
            //NOTE - get staff details
            const getAdmin = await AdminUser.findOne({ where: { id: req.user.id } });
            //NOTE - get staff class and batch details
            const teachersSubject = await TeacherSubjectMap.findAll({
                where: { teacherId: getAdmin.id },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            //NOTE - get all class details
            const classesIds = teachersSubject.map((item) => item.dataValues.classId);
            //NOTE - get all batch details
            const batchIds = teachersSubject.map(
                (item) => item.dataValues.batchTypeId
            );

            //NOTE - params based on class or batch type
            const idParams = batchIds.every((id) => id === null)
                ? { classId: { [Sequelize.Op.in]: classesIds } }
                : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

            //NOTE - get all student details
            const students = await StudentDetails.findAll({ where: idParams });
            //NOTE - get all students type ids
            const typeIds = students.map((item) => item.dataValues.id);

            staffParams = { userId: { [Sequelize.Op.in]: typeIds } };
        }

        //NOTE - Find all givances
        const getGirevances = await Girevances.findAndCountAll({
            ...query,
            where: staffParams,
            attributes: {
                exclude: ["updatedAt"],
            },
            include: [
                {
                    model: grievanceCategory,
                    attributes: ["category"],
                },
                {
                    model: grievanceSubCategory,
                    attributes: ["subCategory"],
                },
                {
                    model: UserDetails,
                    as: "user",
                    attributes: ["id", "name"],
                },
                {
                    model: UserDetails,
                    as: "parent",
                    attributes: ["id", "name"],
                },
            ],

            order: [["createdAt", "DESC"]],
        });
        if (!getGirevances)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_NOT_FOUND });

        for (const data of getGirevances.rows) {
            //NOTE - push final data
            response.push({
                id: data.id,
                category: data?.grievance_category !== null ? data?.grievance_category?.category : null,
                subcategory: data?.grievance_subCategory !== null ? data?.grievance_subCategory?.subCategory : null,
                messsage: data?.message,
                createdAt: addTimeIntoDate(data?.createdAt),
                studentId: data?.user?.id,
                student: data?.user?.name,
                parentId: data?.parent?.id,
                parent: data?.parent?.name,
            });
        }
        //NOTE - final response
        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            count: getGirevances.count,
            data: response,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


//ANCHOR : get all Grievance by parent id
const getAllGrievanceByParentId = async (req, res) => {
    try {
        let response = [];
        const parentId = req.user.parentId;
        const userId = req.user.id;

        //NOTE - Find all givances of parent user
        const getGirevances = await Girevances.findAndCountAll({
            where: { parentId: parentId, userId: userId },
            attributes: {
                exclude: ["updatedAt"],
            },
            include: [
                {
                    model: grievanceCategory,
                    attributes: ["category"],
                },
                {
                    model: grievanceSubCategory,
                    attributes: ["subCategory"],
                },

            ],
            order: [["createdAt", "DESC"]],
        });
        if (!getGirevances)
            return res
                .status(400)
                .send({ status: 400, message: msg.GRIEVANCE_NOT_FOUND });

        for (const data of getGirevances.rows) {
            if (data?.grievance_category !== null && data?.grievance_subCategory !== null) {
                //NOTE - push final data
                response.push({
                    id: data.id,
                    parentId: data.parentId,
                    category: data?.grievance_category?.category,
                    subcategory: data?.grievance_subCategory?.subCategory,
                    messsage: data?.message,
                    createdAt: addTimeIntoDate(data?.createdAt)
                });
            }
        }
        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            count: getGirevances.count,
            data: response,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};



module.exports = {
    addGrievanceCategory,
    getAllGrievanceCategory,
    getGrievanceCategoryById,
    updateGrievanceCategoryById,
    deleteGrievanceCategoryById,
    addGrievanceSubCategory,
    getAllGrievanceSubCategory,
    getGrievanceSubCategoryById,
    updateGrievanceSubCategoryById,
    deleteGrievanceSubCategoryById,
    createGrievance,
    getAllGrievance,
    getAllGrievanceByParentId,
    getGrievanceSubCategoryByCategoryId
};
