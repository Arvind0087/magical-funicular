const db = require("../../models/index");
const Users = db.users;
const StudentDetails = db.student;
const ParentDetails = db.parent;
const StudentParentMap = db.parent_student_map;

//NOTE - Validate if the email and phone is unique or not
const validateUser = async (phone, email) => {
  var phoneValue = false;
  var emailValue = false;

  const user_exist_phone = await Users.findAll({ where: { phone: phone } });

  if (user_exist_phone.length) {
    phoneValue = true;
  }

  const user_exist_email = await Users.findOne({ where: { email: email } });
  if (user_exist_email) {
    emailValue = true;
  }

  return { phoneValue, emailValue };
};

//ANCHOR - Validate if the email and phone is unique or not
const validateParent = async (phone) => {
  var phoneValue = false;

  const user_exist_phone = await Users.findAll({ where: { phone: phone } });

  if (user_exist_phone.length) {
    phoneValue = true;
  }

  return phoneValue;
};

const profilePercentage = async (userId) => {
  let finalCount = 0;
  let counter = 100;
  let parentDetails;
  //NOTE - get student details from user table
  const user = await Users.findOne({
    where: { id: userId },
    include: {
      model: StudentDetails,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
  });

  //NOTE: check if parent exist or not
  const parentUser = await Users.findOne({
    where: { phone: user.phone, type: "Parent" },
  });

  if (parentUser) {
    //NOTE - get parent details from parent Table
    parentDetails = await ParentDetails.findOne({
      where: { id: parentUser.parentTypeId },
    });
  }

  if (user) {
    if (user.email === null) {
      counter -= 5;
    }
    if (user.student?.dob === null) {
      counter -= 5;
    }
    if (user.student?.gender === null) {
      counter -= 5;
    }
    if (user.student?.courseId === null) {
      counter -= 5;
    }
    if (
      user.student?.boardId === null ||
      user.student?.classId === null ||
      user.student?.batchTypeId === null ||
      user.student?.batchStartDateId === null
    ) {
      counter -= 25;
    }
    if (user.student?.address === null) {
      counter -= 15;
    }
    if (user.student?.wantsToBeId === null) {
      counter -= 10;
    }

    if (user.student?.schoolName === null) {
      counter -= 10;
    }

    if (!parentUser) {
      counter -= 10;
    } else if (parentUser) {
      if (parentUser.name === null) {
        counter -= 5;
      } else if (parentDetails.occupation === null) {
        counter -= 5;
      }
    }
  }

  finalCount = counter;

  return finalCount;
};

const convertDayIntoDate = async (day) => {
  // Get today's date
  const today = new Date();

  // Set the number of days to add
  const daysToAdd = day;

  // Create a new date by adding the number of days to today's date
  const newDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  return newDate;
};


module.exports = {
  validateUser,
  validateParent,
  profilePercentage,
  convertDayIntoDate,
};
