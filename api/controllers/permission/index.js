const db = require("../../models/index");
const msg = require("../../constants/Messages");
const Route = db.route;
const Permission = db.permission;
const Admin = db.admin;
const RolePermission = db.permissionRole;

//ANCHOR : create route
const createModules = async (req, res) => {
  try {
    const { title, icon, path, parent } = req.body;

    await Route.create({
      title: title,
      path: path,
      icon: icon,
      parent: parent,
    });

    return res.status(200).send({
      status: 201,
      message: msg.MODULES_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get route by id
const getRouteById = async (req, res) => {
  try {
    const getRoute = await Route.findOne({
      where: { id: req.params.id },
    });
    if (!getRoute)
      return res
        .status(400)
        .send({ status: 400, message: msg.MODULES_NOT_FOUND });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getRoute,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all modules
const getAllRoute = async (req, res) => {
  try {
    const allModule = [];

    const getRoute = await Route.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!getRoute)
      return res
        .status(400)
        .send({ status: 400, message: msg.MODULES_NOT_FOUND });

    //NOTE: push final data
    for (let data of getRoute.rows) {
      allModule.push({
        ...data.dataValues,
        add: false,
        view: false,
        edit: false,
        remove: false,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getRoute.count,
      data: allModule,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : create Permission
const createPermission = async (req, res) => {
  try {
    const { roleId, permission } = req.body;

    await Permission.destroy({
      where: {
        roleId: roleId,
      },
    });

    //NOTE - id from token
    const id = req.user.id;

    for (let data of permission) {
      await Permission.create({
        roleId: roleId,
        routeId: data.id,
        add: data.add,
        view: data.view,
        edit: data.edit,
        remove: data.remove,
        createdById: id,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.PERMISSION_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all modules by staffId
const getPermissionByStaffId = async (req, res) => {
  try {
    const staffId = req.params.id;
    let allPermission = [];

    //NOTE - get admin details
    const getAdmin = await Admin.findOne({
      where: { id: staffId },
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
      ],
    });

    //NOTE - CHECKING IF USER IS SUPER ADMIN THEN GIVE ALL ROUTE PERMISSION
    if (getAdmin?.permission_role?.role === "superAdmin") {
      const getRoute = await Route.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!getRoute)
        return res
          .status(200)
          .send({ status: 200, message: msg.MODULES_NOT_FOUND ,data:[]});

    
      //NOTE: push final data
      for (let data of getRoute) {
        allPermission.push({
          ...data.dataValues,
          add: true,
          view: true,
          edit: true,
          remove: true,
        });
      }

      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: allPermission,
      });
    } else {
      const getPermission = await Permission.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "id"],
        },
        where: { roleId: getAdmin.department },
        include: [
          {
            model: Route,
            attributes: ["id", "title", "icon", "path", "parent"],
          },
        ],
      });
      if (!getPermission)
        return res
          .status(400)
          .send({ status: 400, message: msg.MODULES_NOT_FOUND });

      for (let data of getPermission) {
        //NOTE: push final data
        allPermission.push({
          id: data.route.id,
          title: data.route.title,
          path: data.route.path,
          icon: data.route.icon,
          parent: data.route.parent,
          add: data.add,
          view: data.view,
          edit: data.edit,
          remove: data.remove,
        });
      }

      return res.status(200).send({
        status: 200,
        message: msg.FOUND_DATA,
        data: allPermission,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all modules by roleId
const getPermissionByRoleId = async (req, res) => {
  try {
    const roleId = req.params.id;
    let allPermission = [];

    const getPermission = await Permission.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
      where: { roleId: roleId },
      include: [
        {
          model: Route,
          attributes: ["id", "title", "icon", "path", "parent"],
        },
      ],
    });
    if (!getPermission)
      return res
        .status(400)
        .send({ status: 400, message: msg.MODULES_NOT_FOUND });

    //NOTE: push final data
    for (let data of getPermission) {
      allPermission.push({
        id: data.route.id,
        title: data.route.title,
        path: data.route.path,
        icon: data.route.icon,
        parent: data.route.parent,
        add: data.add,
        view: data.view,
        edit: data.edit,
        remove: data.remove,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allPermission,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update  permission by staff id
const updatePermissionByRoleId = async (req, res) => {
  try {
    const { roleId, routeId, add, view, edit, remove } = req.body;

    //NOTE - id from token
    const id = req.user.id;

    const getRoute = await Route.findOne({
      where: {
        id: routeId,
      },
    });
    if (!getRoute)
      return res
        .status(400)
        .send({ status: 400, message: msg.MODULES_NOT_FOUND });

    const getPermission = await Permission.findOne({
      where: { roleId: roleId },
    });
    if (!getPermission)
      return res
        .status(400)
        .send({ status: 400, message: msg.PERMISSION_NOT_CREATED });

    await Permission.update(
      {
        add: add,
        view: view,
        edit: edit,
        remove: remove,
        updatedById: id,
      },
      { where: { roleId: roleId, routeId: routeId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.PERMISSION_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : delete route
const deleteRouteById = async (req, res) => {
  try {
    const getRoute = await Route.findOne({
      where: { id: req.params.id },
    });
    if (!getRoute) {
      return res
        .status(400)
        .send({ status: 400, message: msg.MODULES_NOT_FOUND });
    }
    await Route.destroy({
      where: {
        id: req.params.id,
      },
    });
    await Permission.destroy({
      where: {
        roleId: req.params.id,
      },
    });

    return res.status(200).send({ status: 200, message: msg.MODULES_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : create route
const updateModules = async (req, res) => {
  try {
    const { title, icon, path, parent, id } = req.body;
    const getRoute = await Route.findOne({
      where: { id: id },
    });
    if (!getRoute)
      return res
        .status(400)
        .send({ status: 400, message: msg.MODULES_NOT_FOUND });

    await Route.update(
      { title: title, icon: icon, path: path, parent: parent },
      { where: { id: id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.MODULES_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  createModules,
  createPermission,
  getRouteById,
  getAllRoute,
  getPermissionByStaffId,
  updatePermissionByRoleId,
  deleteRouteById,
  getPermissionByRoleId,
  updateModules,
};
