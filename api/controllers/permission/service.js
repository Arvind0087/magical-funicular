// const db = require("../../models/index");
// const msg = require("../../constants/Messages");
// const Module = db.module;
// const module_child_map = db.module_child_map;
// const Permission = db.permission;

// //create module
// const createModules = async (req, res) => {
//   try {
//     const { name } = req.body;

//     for (let data of name) {
//       const newModule = await Module.create({
//         name: data,
//       });
//     }

//     return res.status(200).send({
//       status: 200,
//       message: msg.MODULES_CREATED,
//     });
//   } catch (err) {
//     return res.status(500).send({ status: 500, message: err.message });
//   }
// };


// //create module child
// const createModulesChild = async (req, res) => {
//   try {
//     const { moduleId, name } = req.body;

//     for (let data of name) {
//       const newModule = await module_child_map.create({
//         moduleId: moduleId,
//         name: data,
//       });
//     }
//     return res.status(200).send({
//       status: 200,
//       message: msg.MODULE_CHILD__CREATED,
//     });
//   } catch (err) {
//     return res.status(500).send({ status: 500, message: err.message });
//   }
// };

// //get module by id
// const getModuleById = async (req, res) => {
//   try {
//     const getModule = await Module.findOne({
//       where: { id: req.params.id },
//     });
//     if (!getModule) {
//       return res
//         .status(400)
//         .send({ status: 400, message: msg.MODULES_NOT_FOUND, data: [] });
//     }
//     return res.status(200).send({
//       status: 200,
//       message: msg.FOUND_DATA,
//       data: getModule,
//     });
//   } catch (err) {
//     return res.status(500).send({ status: 500, message: err.message });
//   }
// };

// //get all modules
// const getAllModules = async (req, res) => {
//   try {
//     let getAllFeedback = [];
//     const getModule = await Module.findAll({
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });

//     if (!getModule) {
//       return res
//         .status(400)
//         .send({ status: 400, message: msg.MODULES_NOT_FOUND });
//     }

//     return res.status(200).send({
//       status: 200,
//       message: msg.FOUND_DATA,
//       count: getModule.length,
//       data: getModule,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send({ status: 500, message: err.message });
//   }
// };

// //create Permission
// const createPermission = async (req, res) => {
//   try {
//     const { staffId, master } = req.body;
//     for (let data of master) {
//       const newPermission = await Permission.create({
//         staffId: staffId,
//         moduleId: data.moduleId,
//         childId: null,
//         add: data.add,
//         view: data.view,
//         edit: data.edit,
//         delete: data.delete,
//       });

//       if (data.child && data.child !== null) {
//         for (let dataS of data.child) {
//           const newPermission = await Permission.create({
//             staffId: staffId,
//             moduleId: data.moduleId,
//             childId: dataS.Id,
//             add: data.add,
//             view: data.view,
//             edit: data.edit,
//             delete: data.delete,
//           });
//         }
//       }
//     }
//     //}
//     return res.status(200).send({
//       status: 200,
//       message: msg.PERMISSION_CREATED,
//     });
//   } catch (err) {
//     return res.status(500).send({ status: 500, message: err.message });
//   }
// };

// //get Permission by id
// const getPermissionById = async (req, res) => {
//   try {
//     const staffId = req.params.id;
//     const getPermission = await Permission.findAll({
//       where: { staffId: staffId },
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });
//     if (!getPermission) {
//       return res
//         .status(400)
//         .send({ status: 400, message: msg.MODULES_NOT_FOUND, data: [] });
//     }

//     // const getModule = await Module.findOne({
//     //   where: { id: req.params.id },
//     // });

//     //console.log(getModule);

//     let allPermission = [];
//     for (let data of getPermission) {
//       const modulename = await Module.findOne({
//         where: { id: data?.moduleId },
//         attributes: ["name"],
//       });

//       const childName = await module_child_map.findOne({
//         where: { id: data?.childId},
//         attributes: ["name"],
//       });
//       allPermission.push({
//         id: data.id,
//         staffId: data.staffId,
//         moduleId: data.moduleId,
//         moduleName: modulename ? modulename.name : null,
//         childId: data.childId,
//         childName: childName ? childName.name : null,
//         add: data.add,
//         view: data.view,
//         edit: data.edit,
//         delete: data.delete,
//       });
//     }

//     return res.status(200).send({
//       status: 200,
//       message: msg.FOUND_DATA,
//       data: allPermission,
//     });
//   } catch (err) {
//     return res.status(500).send({ status: false, message: err.message });
//   }
// };

// module.exports = {
//   createModules,
//   createModulesChild,
//   getModuleById,
//   getAllModules,
//   createPermission,
//   getPermissionById,
// };
