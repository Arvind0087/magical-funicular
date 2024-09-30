const db = require("../models/index");
const { Sequelize } = require("sequelize");
const TeacherSubjectMap = db.teacher_subject_map;
const StudentDetails = db.student;
const ClassDetails = db.class;
const BatchDetails = db.batchTypes;

//NOTE - If login by a teacher or mentor
exports.batchClassBase = async (teacherId, role) => {
  if (["teacher", "mentor"].includes(role.toLowerCase())) {
    const staffDetails = await TeacherSubjectMap.findAll({
      where: { teacherId: teacherId },
      attributes: ["classId", "batchTypeId"],
    });

    const classIds = staffDetails.map((item) => item.classId);
    const batchIds = staffDetails.map((item) => item.batchTypeId);

    //NOTE - check if the classIds are active or not
    const activeClassDetails = await ClassDetails.findAll({
      where: { id: classIds, status: 1 },
    });

    let activeBatchDetails;
    let activeClassIds;
    let activeBatchTypeIds;

    if (activeClassDetails.length > 0) {

      //NOTE - get all active classIds
      activeClassIds = activeClassDetails.map((item) => item.id);

      //NOTE - check if the batchTypeIds are active or not
      activeBatchDetails = await BatchDetails.findAll({
        where: {
          ...(batchIds.length > 0
            ? {
                [Sequelize.Op.or]: [
                  { id: batchIds },
                  { classId: activeClassIds },
                ],
              }
            : { classId: activeClassIds }),
          status: 1,
        },
      });

      //NOTE - get all active batchTypeIds
      activeBatchTypeIds = activeBatchDetails.map((item) => item.id);
    }

    if (batchIds.every((id) => id === null)) {
      return {
        classId: activeClassIds || [],
        batchTypeId: activeBatchTypeIds || [],
      };
    } else {
      return { batchTypeId: activeBatchTypeIds || [] };
    }
  }

  return {};
};

//NOTE - filter class and batch based on user
exports.userBased = async (teacherId, role) => {
  let staffParams = null;

  //NOTE - get staff class and batch details
  const teachersSubject = await TeacherSubjectMap.findAll({
    where: { teacherId: teacherId },
    attributes: ["classId", "batchTypeId"],
  });

  //NOTE - get all class details
  const classesIds = teachersSubject.map((item) => item.classId);

  //NOTE - get all batch details
  const batchIds = teachersSubject.map((item) => item.batchTypeId);

  //NOTE - params based on class or batch type
  const idParams = batchIds.every((id) => id === null)
    ? { classId: { [Sequelize.Op.in]: classesIds } }
    : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

  //NOTE - get all student details
  const students = await StudentDetails.findAll({
    where: idParams,
    attributes: ["id"],
  });
  //NOTE - get all students type ids
  const typeIds = students.map((item) => item.id);

  staffParams = { studentId: { [Sequelize.Op.in]: typeIds } };

  return staffParams;
};
