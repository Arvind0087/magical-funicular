const db = require("../../models/index");
const msg = require("../../constants/Messages");
const Content = db.content;
const {
  getSignedUrlCloudFront,
  getYouTubeVideoId,
  cloudFrontM3u8Converter,
} = require("../../helpers/cloudFront");
const { config } = require("../../config/db.config");
const { converterType } = require("../../helpers/service");
const fs = require("fs");
const Topic = db.topic;
const { Sequelize, Op } = require("sequelize");
const _ = require("lodash");
const backup = require("node-mysql-backup");
const cron = require("node-cron");
const NewContent = db.new_content;
const contentCourseMap = db.content_course_map;
const Bookmark = db.bookmark;
const recentActivityDetails = db.recentActivity;
const Chapter = db.chapter;
const Subject = db.subject;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const Syllabus = db.syllabus;

exports.deleteContent = async (req, res) => {
  try {
    let convert = [];
    //NOTE - get all content
    const getAll = await contentCourseMap.findAll({
      attributes: ["contentId"],
      where: { courseId: req.params.id },
    });

    for (let data of getAll) {
      convert.push(data.contentId);
    }

    //NOTE - delete all bookmarks
    await Bookmark.destroy({
      where: {
        bookmarkType: "video",
        typeId: {
          [Sequelize.Op.in]: convert,
        },
      },
    });

    //NOTE - delete all recentactivity
    await recentActivityDetails.destroy({
      where: {
        videoId: {
          [Sequelize.Op.in]: convert,
        },
      },
    });

    //NOTE - delete all from content course map
    await contentCourseMap.destroy({
      where: {
        contentId: {
          [Sequelize.Op.in]: convert,
        },
      },
    });

    //NOTE - delete all from content master
    await NewContent.destroy({
      where: {
        id: {
          [Sequelize.Op.in]: convert,
        },
      },
    });

    return res.send({
      msg: msg.CONTETN_DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    console.log(error);
  }
};

//ANCHOR:  get syllabus content by topic id
exports.thumbnailConverter = async (req, res) => {
  try {
    let final = [];
    for (let data of filenames) {
      const modifiedString = _.last(_.split(data, "/")).split(".")[0];
      const getContent = await Content.findAll({
        where: {
          thumbnailFile: { [Op.like]: "%" + modifiedString + "%" },
        },
      });
      if (getContent !== null) {
        for (let thumb of getContent) {
          await Content.update(
            { thumbnailFile: data },
            { where: { id: thumb.id } }
          );
        }
      }
    }

    return res.send({
      msg: msg.FOUND_DATA,
      count: "updated",
      filecount: filenames.length,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR:  get syllabus content by topic id
exports.convertS3Foldername = async (req, res) => {
  try {
    let success = [];
    const getContent = await NewContent.findAll({
      where: {
        thumbnailFile: "content-thumbnail/Future Tense.jpg",
        //tag: "Learning Content",
      },
    });

    for (let data of getContent) {
      if (data.thumbnailFile !== null) {
        await NewContent.update(
          { thumbnailFile: "content-thumbnail/Future_Tense.jpg" },
          { where: { id: data.id } }
        );
      }
    }
    return res.send({
      msg: msg.FOUND_DATA,
      count: "update data",
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR:  get syllabus content by topic id
exports.getS3Foldername = async (req, res) => {
  try {
    const getContent = await contentCourseMap.findAll({
      where: {
        batchTypeId: {
          [Sequelize.Op.in]: [40, 41, 42, 43, 44, 45, 46],
        },
      },
    });

    for (let data of getContent) {
     await contentCourseMap.destroy({
        where: {
          contentId: {
            [Sequelize.Op.in]: data.contentId,
          },
        },
      });
      //NOTE - delete all from content master
      await NewContent.destroy({
        where: {
          id: {
            [Sequelize.Op.in]: data.contentId,
          },
        },
      });
   }

    return res.send({
      msg: msg.FOUND_DATA,
      count: "delete data",
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

// exports.getContentDataDemo = async (req, res) => {
//     try {
//         const modifiedData = data.map(obj => {

//             return {
//                 ...obj,
//                 sourceFile: obj.sourceFile.replace(/ /g, '_'),
//                 //thumbnailFile: obj.thumbnailFile.replace(/.jpg/, '.png'),
//             }
//         });
//         return res.send({
//             msg: msg.FOUND_DATA,
//             data: modifiedData
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

// Define connection options for the MySQL database
// const dbOptions = {
//     host: config.HOST,
//     user: config.USER,
//     password: config.PASSWORD,
//     database: config.DB
// };

// Path where the backup file will be saved
// const backupPath = 'D:/dbBackups/backup.sql';

// // Schedule the backup job to run daily at midnight
// cron.schedule('0 0 * * *', () => {
//     console.log('Running daily backup...');
//     backup({
//         ...dbOptions,
//         dest: backupPath
//     }, function (err) {
//         if (err) {
//             console.error(err);
//         } else {
//             console.log('Backup saved successfully.');
//         }
//     });
//});

// const mysqldump = require('mysqldump');
// const AWS = require('aws-sdk');
// const moment = require('moment');

// const dbConfig = {
//     host: config.HOST,
//     user: config.USER,
//     password: config.PASSWORD,
//     database: config.DB,
//     connection: {
//         host: config.HOST,
//         user: config.USER,
//         password: config.PASSWORD,
//         database: config.DB
//     }
// };

// const s3Config = {
//     accessKeyId: config.AWS_ACCESS_KEY,
//     secretAccessKey: config.AWS_SECRET_KEY,
//     region: config.S3_REGION,
//     bucketName: config.S3_BUCKET_NAME,
//     backupFolder: 'db_backup'
// };

// const s3 = new AWS.S3({
//     accessKeyId: config.AWS_ACCESS_KEY,
//     secretAccessKey: config.AWS_SECRET_KEY,
//     region: config.S3_REGION
// });

// const backupDatabase = async () => {
//     try {

//         const backupName = `${moment().format('YYYY-MM-DD_HH-mm-ss')}.sql`;
//         if (!fs.existsSync('/tmp')) {
//             fs.mkdirSync('/tmp');
//         }
//         const backupFilePath = `/tmp/${backupName}`;
//         const uploadParams = {
//             Bucket: config.S3_BUCKET_NAME,
//             Key: `${"db_backup"}/${backupName}`,
//             Body: null
//         };

//         await mysqldump({
//             ...dbConfig,
//             dumpToFile: backupFilePath
//         });

//         uploadParams.Body = fs.readFileSync(backupFilePath);

//         await s3.upload(uploadParams).promise();

//         console.log(`Database backup saved to S3 bucket: ${uploadParams.Bucket}/${uploadParams.Key}`);

//         fs.unlinkSync(backupFilePath);
//     } catch (error) {
//         console.error(`Error backing up database: ${error}`);
//     }
// };

// // Schedule the backup job to run daily at midnight
// cron.schedule('0 0 * * *',async () => {
//     console.log('Running daily backup...');
//     backupDatabase();
// });
