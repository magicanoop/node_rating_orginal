const authorizationService = require("./../version0/services/jwtServices");
const db = require("./../version0/models");
const ModuleAccess = db.moduleAccess;
const Module = db.modules;
const Role = db.roles;
const Users = db.users;

const userService = require("../version0/services/rating.services");

const getBearerToken = (token) => {
  return token.split(" ")[1];
};

exports.isUserAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      httpcode: 403,
      message: "FORBIDDEN",
    });
  } else {
    const token = getBearerToken(authHeader);

    if (token) {
      try {
        let tokenData = authorizationService.decodeToken(token).data;
        const userData = await userService.validateAuth(tokenData._id);
        req.user = userData;
        next();
      } catch (error) {
        console.log(error)
        if (error.message === "jwt expired") {
          return res.status(403).json({
            httpcode: 401,
            message: "TOKEN EXPIRED",
          });
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "INVALID TOKEN",
          });
        }
      }
    } else {
      return res.status(403).json({
        httpcode: 403,
        message: "FORBIDDEN",
      });
    }
  }
};

exports.isSuperAdminUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      httpcode: 403,
      message: "FORBIDDEN",
    });
  } else {
    const token = getBearerToken(authHeader);

    if (token) {
      try {
        let tokenData = authorizationService.decodeToken(token).data;
        const userData = await userService.validateAuth(tokenData._id);
        if (userData.role === "super_admin") {
          req.user = tokenData;
          next();
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "UNAUTHORISED",
          });
        }
      } catch (error) {
        console.log(error)
        if (error.message === "jwt expired") {
          return res.status(403).json({
            httpcode: 401,
            message: "TOKEN EXPIRED",
          });
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "INVALID TOKEN",
          });
        }
      }
    } else {
      return res.status(403).json({
        httpcode: 403,
        message: "FORBIDDEN",
      });
    }
  }
};

exports.isAdminUser = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      httpcode: 403,
      message: "FORBIDDEN",
    });
  } else {
    const token = getBearerToken(authHeader);

    if (token) {
      try {
        let tokenData = authorizationService.decodeToken(token).data;
        const userData = await userService.validateAuth(tokenData._id);
        if (userData.role === "admin" || userData.role === "super_admin") {
          req.user = tokenData;
          next();
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "UNAUTHORISED",
          });
        }
      } catch (error) {
        console.log(error)
        if (error.message === "jwt expired") {
          return res.status(403).json({
            httpcode: 401,
            message: "TOKEN EXPIRED",
          });
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "INVALID TOKEN",
          });
        }
      }
    } else {
      return res.status(403).json({
        httpcode: 403,
        message: "FORBIDDEN",
      });
    }
  }
};

exports.isFaculty = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      httpcode: 403,
      message: "FORBIDDEN",
    });
  } else {
    const token = getBearerToken(authHeader);

    if (token) {
      try {
        let tokenData = authorizationService.decodeToken(token).data;
        const userData = await userService.validateAuth(tokenData._id);
        if (userData.role === "faculty" || userData.role === "institute" || userData.role === "admin" || userData.role === "super_admin") {
          req.user = tokenData;
          next();
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "UNAUTHORISED",
          });
        }
      } catch (error) {
        console.log(error)
        if (error.message === "jwt expired") {
          return res.status(403).json({
            httpcode: 401,
            message: "TOKEN EXPIRED",
          });
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "INVALID TOKEN",
          });
        }
      }
    } else {
      return res.status(403).json({
        httpcode: 403,
        message: "FORBIDDEN",
      }); 
    }
  }
};

exports.isInstitute = async(req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({
      httpcode: 403,
      message: "FORBIDDEN",
    });
  } else {
    const token = getBearerToken(authHeader);

    if (token) {
      try {
        let tokenData = authorizationService.decodeToken(token).data;
        const userData = await userService.validateAuth(tokenData._id);
        if (userData.role === "institute" || userData.role === "admin" || userData.role === "super_admin") {
          req.user = tokenData;
          next();
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "UNAUTHORISED",
          });
        }
      } catch (error) {
        console.log(error)
        if (error.message === "jwt expired") {
          return res.status(403).json({
            httpcode: 401,
            message: "TOKEN EXPIRED",
          });
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "INVALID TOKEN",
          });
        }
      }
    } else {
      return res.status(403).json({
        httpcode: 403,
        message: "FORBIDDEN",
      });
    }
  }
};

exports.ifUserAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader == "") {
    next();
  } else {
    const token = getBearerToken(authHeader);
    if (token) {
      try {
        let tokenData = authorizationService.decodeToken(token).data;
        const userData = await userService.validateAuth(tokenData._id);
        req.user = userData;
        next();
      } catch (error) {
        if (error.message === "jwt expired") {
          return res.status(403).json({
            httpcode: 401,
            message: "TOKEN EXPIRED",
          });
        } else {
          return res.status(403).json({
            httpcode: 401,
            message: "TOKEN EXPIRED",
          });
        }
      }
    } else {
      return res.status(403).json({
        httpcode: 403,
        message: "FORBIDDEN",
      });
    }
  }
};

exports.hasModuleAccess = async (req, res, next) => {
  if (!req.currentModule) {
    return next();
  }
  try {
    const module = await Module.findOne({ name: req.currentModule }).lean();
    if (!module) {
      return res.status(404).send({
        message: "MODULE ERR",
        httpcode: 404,
      });
    }
    const role = await Role.findOne({ name: req.user.role }).lean();
    if (role.name === "super_admin") {
      next();
      return;
    } else {
      const access = await ModuleAccess.findOne({
        moduleId: module._id,
        roleId: role._id,
      }).lean();
      if (!access || access.hasAccess === false) {
        return res.status(499).send({
          message: "ACCESS DENIED",
          httpcode: 499,
        });
      } else {
        next();
      }tokenData
    }
  } catch (error) {
    return res.status(403).send({
      message: "ACCESS ERR",
      httpcode: 403,
    });
  }
};
