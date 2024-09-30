const db = require("../../models/index");
const msg = require("../../constants/Messages");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { Sequelize, Op } = require("sequelize");
const _ = require("lodash");
const { generatePackageCode } = require("./service");
const { getSignedUrlCloudFront, getYouTubeVideoId } = require("../../helpers/cloudFront");
const { config } = require("../../config/db.config");
const packageTable = db.course_package_map;
const AdminUser = db.admin;
const RolePermission = db.permissionRole;
const batchType = db.batchTypes;
const Course = db.courses;
const studentCoursePackage = db.student_course_package_map;
const Boards = db.boards;
const Class = db.class;
const packageDemoVideo = db.package_demo_video_map;
const packageFaq = db.course_package_faq_map;


//ANCHOR:  create products
const createCoursePackage = async (req, res) => {
    try {
        const { courseId, boardId, classId, batchTypeId, package_title, package_thumbnail, package_duration, package_start_date, package_end_date, package_type, package_price, package_selling_price, package_description, package_brochure, demoVideo, faq } = req.body;

        //NOTE - id from token
        const userId = req.user.id;

        //NOTE - find course package details exist or not
        const typeCheck = await packageTable.findOne({
            where: { batchTypeId: batchTypeId, status: 1, package_type: package_type },
        });
        if (typeCheck)
            return res.status(400).send({
                status: 400,
                message: msg.PACKAGE_TYPE_ALREADY_EXIST,
            });

        //NOTE - find course package details exist or not
        const newPackage = await packageTable.findOne({
            where: { package_title: package_title, batchTypeId: batchTypeId, status: 1 },
        });
        if (newPackage)
            return res.status(400).send({
                status: 400,
                message: msg.ALREADY_EXIST,
            });

        let thumbnail;
        let brouser;
        //NOTE - upload thumbnail into cloud
        if (package_thumbnail && package_thumbnail.includes("base64")) {
            const uploadImage = await uploadFileS3(package_thumbnail, msg.COURSE_PACKAGE_THUMBNAIL);
            thumbnail = uploadImage.Key;
        }
        if (package_brochure && package_brochure.includes("base64")) {
            const uploadPdf = await uploadFileS3(package_brochure, msg.COURSE_PACKAGE_BROCHURE);
            brouser = uploadPdf.Key;
        }

        //NOTE - package code
        const code = package_type === "Recorded" ? await generatePackageCode("VEDA-R") : await generatePackageCode("VEDA-L");

        //NOTE - create new package
        const createPackage = await packageTable.create({
            courseId: courseId,
            boardId: boardId,
            classId: classId,
            batchTypeId: batchTypeId,
            package_title: package_title.replace(/\s+/g, " ").trim(),
            package_thumbnail: thumbnail,
            package_duration: package_duration,
            package_start_date: package_start_date,
            package_end_date: package_end_date || null,
            package_type: package_type,
            package_price: package_price,
            package_selling_price: package_selling_price,
            package_description: package_description,
            package_brochure: brouser,
            package_code: code,
            createdById: userId,
        })

        //NOTE - demo video create
        for (let demovideos of demoVideo) {

            let payload;
            //NOTE - upload image into cloud
            if (demovideos.thumbnail && demovideos.thumbnail.includes("base64")) {
                const uploadImage = await uploadFileS3(demovideos.thumbnail, msg.COURSE_PACKAGE_DEMO_VIDEO_THUMBNAIL);
                payload = uploadImage.Key;
            }

            //NOTE - create demo video for packages
            await packageDemoVideo.create({
                packageId: createPackage.id,
                thumbnail: payload,
                url: demovideos.url
            })
        }

        //NOTE - FAQ CREATE
        for (let faqs of faq) {
            await packageFaq.create({
                packageId: createPackage.id,
                question: faqs.question,
                answer: faqs.answer
            })
        }

        //NOTE - final response
        return res.status(200).send({
            status: 200,
            message: msg.CREATED,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};

//ANCHOR : update package
const updateCoursePackageById = async (req, res) => {
    try {
        let { courseId, boardId, classId, batchTypeId, package_title, package_thumbnail, package_duration, package_start_date, package_type, package_price, package_selling_price, package_description, package_brochure, Id, package_end_date, demoVideo, faq } = req.body;

        //NOTE - id from token
        const id = req.user.id;

        const package = await packageTable.findOne({
            where: { id: Id },
        });
        if (!package) {
            return res
                .status(400)
                .send({ status: 400, message: msg.NOT_FOUND });
        }

        let obj1 = {
            id: package.id,
            package_title: package.package_title,
        };

        let obj2 = {
            id: Id,
            package_title: package_title,
        };

        //NOTE: check if the same name of package is already exist or not
        if (!_.isEqual(obj1, obj2)) {
            const getPackage = await packageTable.findOne({
                where: {
                    package_title: package_title,
                },
            });
            if (getPackage)
                return res.status(400).send({
                    status: 400,
                    message: msg.ALREADY_EXIST,
                });
        }

        ///NOTE - payload for update package
        let payload = {
            courseId: courseId,
            boardId: boardId,
            classId: classId,
            batchTypeId: batchTypeId,
            package_title: package_title.replace(/\s+/g, " ").trim(),
            package_duration: package_duration,
            package_start_date: package_start_date,
            package_type: package_type,
            package_price: package_price,
            package_selling_price: package_selling_price,
            package_description: package_description,
            package_end_date: package_end_date || null,
            updatedById: id,
        };

        //NOTE - upload thumbnail into cloud
        if (package_thumbnail && package_thumbnail.includes("base64")) {
            const uploadImage = await uploadFileS3(package_thumbnail, msg.COURSE_PACKAGE_THUMBNAIL);
            payload = { ...payload, package_thumbnail: uploadImage.Key };
        }
        if (package_brochure && package_brochure.includes("base64")) {
            const uploadPdf = await uploadFileS3(package_brochure, msg.COURSE_PACKAGE_BROCHURE);
            payload = { ...payload, package_brochure: uploadPdf.Key };
        }
        await packageTable.update(payload, {
            where: { id: Id },
        });

        //NOTE - package demo video
        await packageDemoVideo.destroy({
            where: {
                packageId: Id,
            },
        });

        //NOTE - demo video crate
        for (let demovideos of demoVideo) {
            let payload = demovideos.thumbnail;
            //NOTE - upload image into cloud
            if (payload && payload.includes("base64")) {
                const uploadImage = await uploadFileS3(demovideos.thumbnail, msg.COURSE_PACKAGE_DEMO_VIDEO_THUMBNAIL);
                payload = uploadImage.Key;
            }

            //NOTE - extract only original data
            if (payload.startsWith(config.CLOUD_FRONT)) {
                payload = payload.substring(config.CLOUD_FRONT.length);
            }

            //NOTE - create demo video for packages
            await packageDemoVideo.create({
                packageId: Id,
                thumbnail: payload,
                url: demovideos.url
            })
        }

        //NOTE - FAQ
        await packageFaq.destroy({
            where: {
                packageId: Id,
            },
        });

        //NOTE - FAQ
        for (let faqs of faq) {
            await packageFaq.create({
                packageId: Id,
                question: faqs.question,
                answer: faqs.answer
            })
        }

        //NOTE - final response
        return res.status(200).send({
            status: 200,
            message: msg.UPDATED,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};

//ANCHOR: update products status
const updateCoursePackageStatus = async (req, res) => {
    try {
        const { status, Id } = req.body;

        //NOTE - userId from token
        const userId = req.user.id;

        //NOTE - update status
        await packageTable.update({
            status: status,
            updatedById: userId,
        }, {
            where: { id: Id },
        });

        //NOTE - final update response
        return res.status(200).send({
            status: 200,
            message: msg.STATUS_UPDATE,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};

//ANCHOR : get all products
const allCoursePackages = async (req, res) => {
    try {
        const { page, limit } = req.query;

        //NOTE - add pagination
        const query =
            page && limit
                ? {
                    offset: Number(page - 1) * limit,
                    limit: Number(limit),
                }
                : {};

        //NOTE - find products details
        const { rows, count } = await packageTable.findAndCountAll({
            ...query,
            where: {
                status: true,
            },
            include: [
                { model: Course, attributes: ["name"] },
                { model: Boards, attributes: ["name"] },
                { model: Class, attributes: ["name"] },
                { model: batchType, attributes: ["name"] },
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
            order: [["createdAt", "DESC"]],
        });
        if (!rows)
            return res
                .status(200)
                .send({ status: 200, message: msg.NOT_FOUND, data: [] });

        //NOTE - push final data
        const result = await Promise.all(
            rows.map(async (package) => {

                //NOTE - get all packages demo video
                let video = [];
                const videos = await packageDemoVideo.findAll({
                    where: {
                        packageId: package.id
                    }
                })
                for (let data of videos) {
                    video.push({
                        thumbnail: data.thumbnail ? await getSignedUrlCloudFront(data.thumbnail) : null,
                        url: data.url
                    })
                }

                //NOTE - all faq
                let faq = [];
                const getFaq = await packageFaq.findAll({
                    where: {
                        packageId: package.id
                    }
                })
                for (let data of getFaq) {
                    faq.push({
                        question: data.question,
                        answer: data.answer
                    })
                }

                const thumbnail = package.package_thumbnail ? await getSignedUrlCloudFront(package.package_thumbnail) : null;
                const brocr = package.package_brochure ? await getSignedUrlCloudFront(package.package_brochure) : null;

                return {
                    id: package.id,
                    package_title: package.package_title,
                    package_duration: package?.package_duration,
                    package_start_date: package?.package_start_date,
                    package_type: package.package_type,
                    package_price: package.package_price,
                    package_selling_price: package.package_selling_price,
                    package_description: package.package_description,
                    package_thumbnail: thumbnail,
                    package_brochure: brocr,
                    status: package.status,
                    createdByName: package.creator ? package.creator?.name : null,
                    createdByRole: package.creator
                        ? package.creator?.permission_role?.role
                        : null,
                    updateByName: package.updater ? package.updater?.name : null,
                    updateByRole: package.updater
                        ? package.updater?.permission_role.role
                        : null,
                    courseId: package.courseId,
                    courseName: package.course?.name,
                    boardId: package.boardId,
                    boardName: package.board?.name,
                    classId: package.classId,
                    className: package.class?.name,
                    batchTypeId: package.batchTypeId,
                    batchTypeName: package.batchType?.name,
                    package_end_date: package?.package_end_date,
                    demoVideo: video,
                    faq: faq
                };
            })
        );

        //NOTE - final response
        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            count: count,
            data: result,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


//ANCHOR : get single package
const coursePackageById = async (req, res) => {
    try {
        //NOTE - find product details
        const package = await packageTable.findOne({
            where: { id: req.params.id },
            include: [
                { model: Course, attributes: ["name"] },
                { model: Boards, attributes: ["name"] },
                { model: Class, attributes: ["name"] },
                { model: batchType, attributes: ["name"] },
            ],
            attributes: {
                exclude: ["createdById", "updatedById", "createdAt", "updatedAt"]
            }
        });
        if (!package)
            return res
                .status(400)
                .send({ status: 400, message: msg.NOT_FOUND });

        //NOTE - convert signurl
        package.package_thumbnail = package.package_thumbnail ? await getSignedUrlCloudFront(package.package_thumbnail) : null;
        package.package_brochure = package.package_brochure ? await getSignedUrlCloudFront(package.package_brochure) : null;

        //NOTE - packages demo video
        let video = [];
        const videos = await packageDemoVideo.findAll({
            where: {
                packageId: package.id
            }
        })
        for (let data of videos) {
            video.push({
                thumbnail: data.thumbnail ? await getSignedUrlCloudFront(data.thumbnail) : null,
                url: data.url
            })
        }

        //NOTE - all faq
        let faq = [];
        const getFaq = await packageFaq.findAll({
            where: {
                packageId: package.id
            }
        })
        for (let data of getFaq) {
            faq.push({
                question: data.question,
                answer: data.answer
            })
        }

        //NOTE - create final object
        let packs = {
            ...package.dataValues,
            courseName: package.course?.name,
            boardName: package.board?.name,
            className: package.class?.name,
            batchTypeName: package.batchType?.name,
            demoVideo: video,
            faq: faq
        }

        //NOTE - final response
        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            data: packs,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


//ANCHOR : get all package for user
const coursePackagesByStudent = async (req, res) => {
    try {
        const { batchTypeId, type } = req.query;

        //NOTE - token from token
        const userId = req.user.id;

        let result = [];
        if (type == "allcourse") {
            //NOTE - find packages
            const { rows } = await packageTable.findAndCountAll({
                where: {
                    batchTypeId: batchTypeId,
                    status: true,
                },
                include: [
                    {
                        model: batchType,
                        attributes: ["name"],
                    }

                ],
                order: [["createdAt", "DESC"]],
            });
            if (!rows)
                return res
                    .status(200)
                    .send({ status: 200, message: msg.NOT_FOUND, data: [] });

            for (let package of rows) {
                //NOTE - user purchased package
                const isPurchased = await studentCoursePackage.findOne({
                    where: {
                        userId: userId,
                        packageId: package.id,
                        batchTypeId: batchTypeId,
                    },
                });

                // const batchNames = type == "allcourse" ? package?.course?.batchTypes.map(batch => batch.name) : package?.course_package_map?.course?.batchTypes.map(batch => batch.name);
                // const batchString = batchNames.join(' + ');

                //NOTE - convert into sign url
                const thumbnail = package.package_thumbnail ? await getSignedUrlCloudFront(package.package_thumbnail) : null;

                result.push({
                    packageId: package.id,
                    courseId: package.courseId,
                    package_title: package.package_title,
                    package_start_date: package?.package_start_date,
                    package_type: package.package_type,
                    package_price: package.package_price,
                    package_selling_price: package.package_selling_price,
                    package_thumbnail: thumbnail,
                    status: package.status,
                    batchName: package.batchType?.name,
                    isPurchased: isPurchased ? true : false
                })

            }
        }
        else {
            //NOTE - find packages
            const { rows } = await studentCoursePackage.findAndCountAll({
                where: {
                    userId: userId,
                    batchTypeId: batchTypeId,
                },
                include: [
                    {
                        model: packageTable,
                        attributes: {
                            exclude: ["updateAt", "createdAt", "createdById", "updatedById"]
                        },
                        include:
                        {
                            model: batchType,
                            attributes: ["name"],
                        }
                    }
                ],
                order: [["createdAt", "DESC"]],
            });
            if (!rows)
                return res
                    .status(200)
                    .send({ status: 200, message: msg.NOT_FOUND, data: [] });

            for (let package of rows) {
                //NOTE - user purchased package
                const isPurchased = await studentCoursePackage.findOne({
                    where: {
                        userId: userId,
                        packageId: package.packageId,
                        batchTypeId: batchTypeId,
                    },
                });

                // const batchNames = package?.course_package_map?.course?.batchTypes.map(batch => batch.name);
                // const batchString = batchNames.join(' + ');

                //NOTE - convert into sign url
                const thumbnail = package?.course_package_map?.package_thumbnail ? await getSignedUrlCloudFront(package?.course_package_map?.package_thumbnail) : null;
                //NOTE - pushed if user purchased any packages
                if (isPurchased)
                    result.push({
                        packageId: package.packageId,
                        courseId: package.course_package_map.courseId,
                        package_title: package.course_package_map.package_title,
                        package_start_date: package?.course_package_map.package_start_date,
                        package_type: package.course_package_map.package_type,
                        package_price: package.course_package_map.package_price,
                        package_selling_price: package.course_package_map.package_selling_price,
                        package_thumbnail: thumbnail,
                        status: package?.course_package_map?.status,
                        batchName: package.course_package_map.batchType?.name || null,
                        isPurchased: isPurchased ? true : false
                    })
            }
        }

        //NOTE - final response
        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            data: result,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


//ANCHOR : get single package for user
const userCoursePackageBypackageId = async (req, res) => {
    try {
        const { packageId } = req.query;

        //NOTE - userid from token
        const userId = req.user.id;

        //NOTE - chack product or not
        const isPurchased = await studentCoursePackage.findOne({
            where: { packageId: packageId, userId: userId },
        });

        let purchased = false;
        if (isPurchased) {
            //NOTE - Set the time part of the current date to zero
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            //NOTE - Set the time part of the current date to zero
            const purchaseDate = new Date(isPurchased.validity);
            purchaseDate.setHours(0, 0, 0, 0);
            purchased = isPurchased && purchaseDate > currentDate ? true : false;
        }


        //NOTE - find product details
        const package = await packageTable.findOne({
            where: { id: packageId },
            attributes: {
                exclude: ["updatedAt", "createdAt", "createdById", "updatedById", "status"],
            },
        });
        if (!package)
            return res
                .status(400)
                .send({ status: 400, message: msg.NOT_FOUND, data: [] });

        package.package_thumbnail = package.package_thumbnail ? await getSignedUrlCloudFront(package.package_thumbnail) : null;
        package.package_brochure = package.package_brochure ? await getSignedUrlCloudFront(package.package_brochure) : null;
        let newKey = "isPurchased";
        package.dataValues[newKey] = purchased;


        //NOTE - packages demo video
        let video = [];
        const videos = await packageDemoVideo.findAll({
            where: {
                packageId: package.id
            }
        })
        for (let data of videos) {
            video.push({
                thumbnail: data.thumbnail ? await getSignedUrlCloudFront(data.thumbnail) : null,
                original_url: data.url,
                converted_url: data.url ? await getYouTubeVideoId(data.url) : null,
            })
        }

        let key = "demoVideo";
        package.dataValues[key] = video;


        //NOTE - all faq
        let faq = [];
        const getFaq = await packageFaq.findAll({
            where: {
                packageId: package.id
            }
        })
        for (let data of getFaq) {
            faq.push({
                question: data.question,
                answer: data.answer
            })
        }

        let faqkey = "faq";
        package.dataValues[faqkey] = faq;

        //NOTE - final response
        return res.status(200).send({
            status: 200,
            message: msg.FOUND_DATA,
            data: package,
        });
    } catch (err) {
        return res.status(500).send({ status: 500, message: err.message });
    }
};


module.exports = {
    createCoursePackage,
    updateCoursePackageById,
    updateCoursePackageStatus,
    allCoursePackages,
    coursePackageById,
    coursePackagesByStudent,
    userCoursePackageBypackageId
};
