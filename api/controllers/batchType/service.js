const db = require("../../models/index");
const { Sequelize } = require("sequelize");
const TeacherSubjectMap = db.teacher_subject_map;
const ClassDetails = db.class;
const BatchDetails = db.batchTypes;

//NOTE - If login by a teacher or mentor
const teacherParams = async (teacherId, role) => {
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
        id: activeBatchTypeIds || [],
        classId: activeClassIds || [],
      };
    } else {
      return { id: activeBatchTypeIds || [] };
    }
  }

  return {};
};

//NOTE - get Active BatchType
const getActiveBatchDetails = async (boardId, activeClassDetails) => {
  if (activeClassDetails.length > 0) {
    return await BatchDetails.findAll({
      where: {
        boardId: boardId,
        classId: {
          [Sequelize.Op.in]: activeClassDetails.map(
            (activeClass) => activeClass.id
          ),
        },
        status: 1,
      },
    });
  }
  return [];
};

//NOTE - get Active class and batch Type
exports.getActiveParams = async (boardId, role, userId) => {
  if (!["teacher", "mentor"].includes(role.toLowerCase())) {
    const activeClassDetails =
      (await ClassDetails.findAll({
        where: { boardId: boardId, status: 1 },
      })) ?? [];

    const activeBatchDetails = await getActiveBatchDetails(
      boardId,
      activeClassDetails
    );

    return {
      classId: activeClassDetails.map((activeClass) => activeClass.id),
      id: activeBatchDetails.map((activeBatch) => activeBatch.id),
    };
  } else {
    //NOTE - If login by a teacher or mentor
    return await teacherParams(userId, role);
  }
};
