const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Sequelize, Op } = require("sequelize");
const { DateTime } = require("luxon");
const moment = require("moment");
const {
  printTimeSlots,
  ExcludeTime,
  countTimeSlots,
  convertIntoColor,
} = require("./service");
const { generateTokenForZoom } = require("../event/service");
const { getYouTubeVideoId, getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const TeacherSchedule = db.teacher_schedule;
const scheduleTimeMap = db.schedule_time_map;
const teacherBookMap = db.teacher_book_map;
const Event = db.event;
const BookEvents = db.teacher_book_map;
const Admin = db.admin;
const UserDetails = db.users;
const StudentDetails = db.student;
const AllCourses = db.courses;
const Boards = db.boards;
const Class = db.class;
const batchType = db.batchTypes;
const Chapter = db.chapter;
const Subject = db.subject;

//ANCHOR - Create  teacher Schedule
const CreateTeacherSchedule = async (req, res) => {
  try {
    const { teacherId, date, breakTime, duration } = req.body;

    for (let data of date) {
      //NOTE - converting date into date time formate
      const dates = new Date(data.date);

      //NOTE - checking teacher has already schedule for that day or not
      const TeacherSchedules = await TeacherSchedule.findOne({
        where: {
          teacherId: teacherId,
          date: { [Sequelize.Op.eq]: dates },
        },
      });
      if (TeacherSchedules)
        return res.status(400).send({
          status: 400,
          message: `teacher schedule is already created for this date ${data.date}`,
        });

      //NOTE - create new schedule for teacher
      const schedules = await TeacherSchedule.create({
        teacherId: teacherId,
        date: data.date,
        availability: data.availability,
        breakTime: breakTime,
        duration: duration,
      });
      for (let final of data.slots) {
        await scheduleTimeMap.create({
          scheduleId: schedules.id,
          fromTime: final.from,
          toTime: final.to,
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.TEACHER_SCHEDULE_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get schedule by teacher id
const getScheduleByTeacherId = async (req, res) => {
  try {
    const { teacherId, date } = req.body;
    let result = [];
    let filteredTimeSlots;
    const data = new Date(date);

    const TeacherSchedules = await TeacherSchedule.findOne({
      where: {
        teacherId: teacherId,
        date: { [Sequelize.Op.eq]: data },
        availability: true,
      },
    });
    if (!TeacherSchedules)
      return res
        .status(400)
        .send({ status: 400, message: msg.TEACHER_UNAVAILABLE });

    const scheduleTimeMaps = await scheduleTimeMap.findAll({
      where: { scheduleId: TeacherSchedules.id },
    });

    //NOTE : slots
    for (let data of scheduleTimeMaps) {
      array = printTimeSlots(
        DateTime.fromISO(data.fromTime),
        DateTime.fromISO(data.toTime),
        TeacherSchedules.duration,
        TeacherSchedules.breakTime
      );
      result.push(...array);
    }

    //NOTE : BOOKED SLOTS
    const teacherBooked = await teacherBookMap.findAll({
      where: {
        teacherId: teacherId,
        date: { [Sequelize.Op.eq]: data },
      },
    });

    if (teacherBooked) {
      for (let final of teacherBooked) {
        filteredTimeSlots = await ExcludeTime(
          final.bookTimeFrom,
          final.bookTimeTo,
          result
        );
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: filteredTimeSlots && filteredTimeSlots ? filteredTimeSlots : result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - teacher BOOK
const TeacherBook = async (req, res) => {
  try {
    const {
      eventId,
      studentId,
      teacherId,
      date,
      bookTimeFrom,
      bookTimeTo,
      type,
    } = req.body;

    await teacherBookMap.create({
      studentId: studentId,
      teacherId: teacherId,
      date: date,
      bookTimeFrom: bookTimeFrom,
      bookTimeTo: bookTimeTo,
      eventId: eventId,
      type: type,
    });

    return res.status(200).send({
      status: 200,
      message: msg.TEACHER_BOOKED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all schedule by teacher id
const getAllScheduleByTeacherId = async (req, res) => {
  try {
    const { page, limit, teacherId } = req.query;
    let final = [];

    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - current date 
    const currentDate = new Date(); // Get the current date
    currentDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    //NOTE - filter based on role
    let params;
    if (req.user)
      if (!["superadmin", "superAdmin"].includes(req.user?.role.toLowerCase())) {
        params = {
          teacherId: req.user.id
        }
      }
    //NOTE - filter based on teacherID
    let teacher;
    if (teacherId) {
      teacher = {
        teacherId: teacherId
      }
    }

    //NOTE - get all events of staff
    const getAllTeacherSchedules = await TeacherSchedule.findAndCountAll({
      ...query,
      where: {
        ...params,
        ...teacher,
        date: {
          [Sequelize.Op.gte]: currentDate // Filter events with startDateTime greater than or equal to the current date
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },

      include: [
        { model: Admin, attributes: ["name", "id"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    for (let data of getAllTeacherSchedules.rows) {
      const scheduleTimeMaps = await scheduleTimeMap.findAll({
        where: { scheduleId: data.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "id", "scheduleId"],
        },
      });

      //NOTE - final push
      final.push({
        id: data.id,
        adminUser: data.adminUser.name,
        date: data.date,
        availability: data.availability,
        duration: data.availability ? data.duration + " Min" : "N/A",
        breakTime: data.availability ? data.breakTime + " Min" : "N/A",
        teacherId: data.adminUser.id,
        slots: scheduleTimeMaps,
      });
    }
    //NOTE - final response return 
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getAllTeacherSchedules.count,
      data: final,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all SCHEDULE BY MONTH
const getAllScheduleOfMonthByTeacherId = async (req, res) => {
  try {
    const { page, limit, teacherId, date } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE: create current time ith start to end
    let newDate;
    if (date) {
      newDate = new Date(date);
    } else {
      newDate = new Date();
    }

    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

    const finalCount = [];

    //NOTE - MONTH ALL DATES
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const lastDayOfMonth = moment([year, month]).daysInMonth();

    for (let i = 1; i <= lastDayOfMonth; i++) {
      const currentDate = moment([year, month, i]);
      const dateString = currentDate.format("YYYY-MM-DD");

      //NOTE - CHECKING MONTH ALL DATES SCHEDULE OF TEACHER
      const getAllTeacherSchedules = await TeacherSchedule.findAndCountAll({
        where: {
          teacherId: teacherId,
          date: currentDate,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      let color;
      if (getAllTeacherSchedules.count === 0) {
        color = "#808080";
      } else {
        let totalAvailability = 0;
        let totalBooked = 0;

        for (let data of getAllTeacherSchedules.rows) {
          if (data.availability === true) {
            const scheduleTimeMaps = await scheduleTimeMap.findAll({
              where: { scheduleId: data.id },
            });

            for (let final of scheduleTimeMaps) {
              const array = countTimeSlots(
                DateTime.fromISO(final.fromTime),
                DateTime.fromISO(final.toTime),
                data.duration,
                data.breakTime
              );
              totalAvailability += array;
            }

            const teacherBooked = await teacherBookMap.findAll({
              where: {
                teacherId: teacherId,
                date: {
                  [Op.eq]: currentDate,
                },
              },
            });

            totalBooked += teacherBooked.length;
          }
        }

        const percentageBooked = (totalBooked / totalAvailability) * 100;
        color = convertIntoColor(100 - percentageBooked);
      }

      finalCount.push({
        date: dateString,
        color: color,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalCount,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all SCHEDULE BY MONTH FOR MOBILEAPP
const getAllScheduleByTeacherIdMobileApp = async (req, res) => {
  try {
    const { page, limit, teacherId, date } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE : create current time with start to end
    let newDate;
    if (date) {
      newDate = new Date(date);
    } else {
      newDate = new Date();
    }

    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

    const getAllTeacherSchedules = await TeacherSchedule.findAndCountAll({
      ...query,
      where: {
        teacherId: teacherId,
        date: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE -  get all teacher schedule
    let finalCount = [];

    // Get the last date of the month
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const lastDayOfMonth = moment([year, month]).daysInMonth();

    // Add all dates in the month to the finalCount array
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const date = moment([year, month, i]);
      const dateString = date.format("YYYY-MM-DD");
      finalCount.push({ date: dateString });
    }

    for (let data of getAllTeacherSchedules.rows) {
      if (data.availability === true) {
        const scheduleTimeMaps = await scheduleTimeMap.findAll({
          where: { scheduleId: data.id },
        });

        //NOTE -  get teacher all slots
        let result = [];
        for (let final of scheduleTimeMaps) {
          const array = countTimeSlots(
            DateTime.fromISO(final.fromTime),
            DateTime.fromISO(final.toTime),
            data.duration,
            data.breakTime
          );
          result.push({ count: array, date: data.date });
        }
        const results = Object.values(
          result.reduce((acc, { count, date }) => {
            const d = new Date(date);
            if (!isNaN(d)) {
              const dateString = d.toISOString().slice(0, 10);
              acc[dateString] = acc[dateString] || { count: 0, date };
              acc[dateString].count += count;
            }
            return acc;
          }, {})
        );

        for (let res of results) {
          const teacherBooked = await teacherBookMap.findAll({
            where: {
              teacherId: teacherId,
              date: {
                [Op.eq]: res.date,
              },
            },
          });

          //NOTE: length of total booking slots
          const totalBookCount = teacherBooked.length;

          //NOTE : calculate total percentage
          let totalPercentage = 100;
          let dividedPercentage = totalPercentage / res.count;
          let actualValues = dividedPercentage * totalBookCount;
          let minusFinalPer = totalPercentage - actualValues;
          const PercentIntoColor = convertIntoColor(minusFinalPer);
          finalCount.push({
            date: res.date,
            color: PercentIntoColor,
            disable:
              PercentIntoColor && PercentIntoColor === "#FF0000" ? true : false,
          });
        }
      } else {
        finalCount.push({
          date: data.date,
          color: "#808080",
          disable: true,
        });
      }
    }

    const results = finalCount.reduce((acc, { date, color, disable }) => {
      const backgroundColor = color ? color.toLowerCase() : "#808080"; // Check if color is defined before calling toLowerCase()
      acc[date] = {
        customStyles: {
          container: {
            backgroundColor,
            borderRadius: 12,
          },
          text: {
            color: "#000000",
            fontWeight: "bold",
          },
        },

        disableTouchEvent: disable === undefined ? true : disable,
      };
      return acc;
    }, {});

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: results,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all SCHEDULE BY MONTH
const getAllScheduleOfMonthByTeacherIdAdmin = async (req, res) => {
  try {
    const { page, limit, teacherId, date } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE : create current time ith start to end
    let newDate;
    if (date) {
      newDate = new Date(date);
    } else {
      newDate = new Date();
    }
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

    const getAllTeacherSchedules = await TeacherSchedule.findAndCountAll({
      ...query,
      where: {
        teacherId: teacherId,
        date: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    let finalCount = [];
    for (let data of getAllTeacherSchedules.rows) {
      if (data.availability === true) {
        const scheduleTimeMaps = await scheduleTimeMap.findAll({
          where: { scheduleId: data.id },
        });

        let result = [];
        for (let final of scheduleTimeMaps) {
          const array = countTimeSlots(
            DateTime.fromISO(final.fromTime),
            DateTime.fromISO(final.toTime),
            data.duration,
            data.breakTime
          );
          result.push({ count: array, date: data.date });
        }
        const results = Object.values(
          result.reduce((acc, { count, date }) => {
            const d = new Date(date);
            if (!isNaN(d)) {
              const dateString = d.toISOString().slice(0, 10);
              acc[dateString] = acc[dateString] || { count: 0, date };
              acc[dateString].count += count;
            }
            return acc;
          }, {})
        );

        for (let res of results) {
          const teacherBooked = await teacherBookMap.findAll({
            where: {
              teacherId: teacherId,
              date: {
                [Op.eq]: res.date,
              },
            },
            include: {
              model: Event,
              attributes: ["type"],
            },
          });

          //NOTE : length of total booking slots
          const totalBookCount = teacherBooked.length;

          //NOTE : calculate total percentage
          let totalPercentage = 100;
          let dividedPercentage = totalPercentage / res.count;
          let actualValues = dividedPercentage * totalBookCount;
          let minusFinalPer = totalPercentage - actualValues;
          const PercentIntoColor = convertIntoColor(minusFinalPer);
          finalCount.push({
            date: res.date,
            color: PercentIntoColor,
          });
        }
      } else {
        finalCount.push({
          date: data.date,
          color: "GREY",
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalCount,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all SCHEDULE BY MONTH
const getAllEventByTeacherId = async (req, res) => {
  try {
    const { page, limit, teacherId, date } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - validation of date
    let newDate;
    if (date) {
      newDate = new Date(date);
    } else {
      newDate = new Date();
    }

    //NOTE - get all date of month
    const year = newDate.getFullYear();
    const monthNumber = newDate.getMonth();
    const startDate = moment({ year, month: monthNumber })
      .startOf("month")
      .format("YYYY-MM-DDTHH:mm:ss.sssZ");
    const endDate = moment({ year, month: monthNumber })
      .endOf("month")
      .format("YYYY-MM-DDTHH:mm:ss.sssZ");

    let finalEvent = [];
    //NOTE - find all event of teacher
    const getEvent = await Event.findAll({
      where: {
        teacherId: teacherId,
        attemptBy: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate,
        },
      },
      include: [
        {
          model: Subject,
          attributes: ["id", "name"],
        },
        {
          model: Chapter,
          attributes: ["id", "name"],
        },
        {
          model: Admin,
          attributes: ["name"],
        },
      ],
    });

    for (let data of getEvent) {
      //NOTE - FIND ALL EVENT OF Teacher
      const newBookEvents = await BookEvents.findOne({
        where: {
          eventId: data.id,
        },
      });

      let user_details;
      if (newBookEvents !== null)
        //NOTE - FIND USER
        user_details = await UserDetails.findOne({
          where: { id: newBookEvents?.studentId, type: "Student" },
        });

      if (user_details) {
        //NOTE - Get user Details from student table
        const student_details = await StudentDetails.findOne({
          where: { id: user_details?.typeId },
          include: [
            {
              model: AllCourses,
              attributes: ["id", "name"],
            },
            {
              model: Boards,
              attributes: ["id", "name"],
            },
            {
              model: Class,
              attributes: ["id", "name"],
            },
            {
              model: batchType,
              attributes: ["id", "name"],
            },
          ],
        });

        let generatedToken;
        if (data.category === "Zoom") {
          //NOTE - GENERATE TOKEN FOR ZOOM
          generatedToken = generateTokenForZoom(
            data.zoomApiSecret,
            data.zoomApiKey,
            data.meetingNumber,
            data.teacherRole
          );
        }

        //NOTE - FINAL PUSH
        finalEvent.push({
          id: data?.id,
          start: (data?.attemptBy).toISOString().split(".")[0],
          title: data.type,
          teacherId: data?.teacherId,
          teacher: data?.adminUser?.name,
          courseId: student_details?.courseId,
          course: student_details?.course?.name,
          boardId: student_details?.boardId,
          board: student_details?.board?.name,
          classId: student_details?.classId,
          class: student_details?.class?.name,
          batchTypeId: student_details.batchTypeId,
          batchType: student_details.batchType?.name,
          subjectId: data?.subject?.id ? data?.subject?.id : null,
          subject: data?.subject?.name ? data?.subject?.name : null,
          chapterId: data?.chapter?.id ? data?.chapter?.id : null,
          chapter: data?.chapter?.name ? data?.chapter?.name : null,
          student: user_details?.name,
          zoomApiKey: data.zoomApiKey ? data.zoomApiKey : null,
          zoomApiSecret: data.zoomApiSecret ? data.zoomApiSecret : null,
          meetingNumber: data.meetingNumber,
          password: data.password || null,
          signature: generatedToken || null,
          time: data?.time || null,
          backgroundColor: "red",
          originalUrl: data.url || null,
          convertUrl: data.category === "Youtube" ? await getYouTubeVideoId(data.url) : null,
          category: data.category,
          thumbnail: data.thumbnail ? await getSignedUrlCloudFront(data.thumbnail) : null,
          description: data?.title,
        });
      }
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalEvent,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};


//ANCHOR: get all schedule by teacher id
const getCalendarMonth = async (req, res) => {
  try {
    const { date } = req.query;

    let newDate;
    if (date) {
      newDate = new Date(date);
    } else {
      newDate = new Date();
    }

    //NOTE -  get all teacher schedule
    let finalCount = [];

    // Get the last date of the month
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const lastDayOfMonth = moment([year, month]).daysInMonth();

    // Add all dates in the month to the finalCount array
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const date = moment([year, month, i]);
      const dateString = date.format("YYYY-MM-DD");
      let color = date.day() === 0 || date.day() === 6 ? "#808080" : "#FFFFFF";
      if (moment().diff(date, "days") > 0) {
        // Check if current date is greater than loop date
        color = "#808080"; // Set color to #808080 if loop date is in the past
      }
      const disableTouchEvent = color === "#808080" ? true : false;

      finalCount.push({
        date: dateString,
        color: color,
        disableTouchEvent: disableTouchEvent,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: finalCount.length,
      data: finalCount,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all schedule of Month
const getCalendarMonthMobileApp = async (req, res) => {
  try {
    const { date } = req.query;

    let newDate;
    if (date) {
      newDate = new Date(date);
    } else {
      newDate = new Date();
    }

    //NOTE -  get all teacher schedule
    let finalCount = [];

    // Get the last date of the month
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const lastDayOfMonth = moment([year, month]).daysInMonth();

    // Add all dates in the month to the finalCount array
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const date = moment([year, month, i]);
      const dateString = date.format("YYYY-MM-DD");
      let color = date.day() === 0 || date.day() === 6 ? "#808080" : "#FFFFFF";
      if (moment().diff(date, "days") > 0) {
        // Check if current date is greater than loop date
        color = "#808080"; // Set color to #808080 if loop date is in the past
      }
      const disableTouchEvent =
        date.day() === 0 || date.day() === 6 ? true : false;
      finalCount.push({
        date: dateString,
        color: color,
        disableTouchEvent: disableTouchEvent,
      });
    }

    const results = finalCount.reduce(
      (acc, { date, color, disableTouchEvent }) => {
        const backgroundColor = color ? color.toLowerCase() : "#808080"; // Check if color is defined before calling toLowerCase()
        acc[date] = {
          customStyles: {
            container: {
              backgroundColor,
              borderRadius: 12,
            },
            text: {
              color: "#000000",
              fontWeight: "bold",
            },
          },

          disableTouchEvent:
            disableTouchEvent === undefined ? true : disableTouchEvent,
        };
        return acc;
      },
      {}
    );

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: finalCount.length,
      data: results,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all SCHEDULE BY MONTH
const getTeacherScheduleDate = async (req, res) => {
  try {
    const { teacherId, date } = req.query;

    //NOTE - get current date and time
    let currentDate = date ? new Date(date) : new Date(); // Get the current date and time
    let next30Days = [];

    //NOTE - get 30 day from current date
    for (let i = 0; i < 30; i++) {
      let nextDay = new Date(currentDate.getTime());
      nextDay.setDate(currentDate.getDate() + i);
      next30Days.push(nextDay);
    }

    let finalCount = [];

    //NOTE - CALCULATE TEACHER SCHEDULE
    for (let data of next30Days) {
      const getAllTeacherSchedules = await TeacherSchedule.findOne({
        where: {
          teacherId: teacherId,
          date: data,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      //NOTE - final push
      finalCount.push({
        date: data,
        status:
          getAllTeacherSchedules?.availability === true
            ? "available"
            : "unavailable",
      });
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalCount,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  CreateTeacherSchedule,
  getScheduleByTeacherId,
  TeacherBook,
  getAllScheduleByTeacherId,
  getAllScheduleOfMonthByTeacherId,
  getAllScheduleByTeacherIdMobileApp,
  getAllScheduleOfMonthByTeacherIdAdmin,
  getAllEventByTeacherId,
  getCalendarMonth,
  getCalendarMonthMobileApp,
  getTeacherScheduleDate,
};
