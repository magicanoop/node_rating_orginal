const db = require("../models");
const responseMessages = require('./../constants/messages');
const responseHelper = require('./../utils/responseHelper');
const Roles = db.roles
const Modules = db.modules
const ModuleAccess = db.moduleAccess
const ObjectId = require('mongoose').Types.ObjectId;

async function generateAccessData(roleId, req) {
    try {
        const role = await Roles.findById(roleId);
        if (!role) { throw { message: "role not found", httpcode: 404 } };
        let allModulesIds = (await Modules.find().select("_id").lean())
            .map(a => a._id.toString());
        let definedAccessIds = (await ModuleAccess.find({ roleId }).select("moduleId").lean())
            .map(a => a.moduleId.toString());
        let newAccess = [];
        allModulesIds.forEach(moduleId => {
            if (!definedAccessIds.includes(moduleId)) {
                newAccess.push(moduleId);
            }
        });
        let promises = [];
        for (let index = 0; index < newAccess.length; index++) {
            const moduleId = newAccess[index];
            promises.push(
                new ModuleAccess({
                    roleId,
                    moduleId,
                    hasAccess: false
                }).save()
            );
        };
        await Promise.all(promises);
        if (req.user.role === "super_admin" || role.role === "super_admin") {
            await generateSuperUserAccessData()
        };
        return true;
    } catch (error) {
        throw "Error generating access data"
    }
}

async function generateSuperUserAccessData() {
    try {
        const role = await Roles.findOne({ name: "super_admin" })
        const roleId = role._id.toString();
        let definedAccessIds = (await ModuleAccess.find({ roleId, hasAccess: false })
            .select("_id").lean())
            .map(a => a._id.toString());
        let toChange = [];
        definedAccessIds.forEach(id => {
            toChange.push(ModuleAccess.findByIdAndUpdate(id, { hasAccess: true }))
        });
        await Promise.all(toChange);
        return true;
    } catch (error) {
        throw "Error generating access data"
    }
}

async function getList(roleId) {
    try {
        const list = await Modules.aggregate([
            {
                '$match': {
                    'parentId': null
                }
            }, {
                '$lookup': {
                    'from': 'module_access',
                    'let': {
                        'module_Id': '$_id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$moduleId', '$$module_Id'
                                            ]
                                        }, {
                                            '$eq': [
                                                '$roleId', new ObjectId(roleId)
                                            ]
                                        },
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'accessData'
                }
            }, {
                '$unwind': {
                    'path': '$accessData',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$lookup': {
                    'from': 'modules_master',
                    'let': {
                        'parent_Id': '$_id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$parentId', '$$parent_Id'
                                            ]
                                        }
                                    ]
                                }
                            }
                        }, {
                            '$lookup': {
                                'from': 'module_access',
                                'let': {
                                    'submodule_Id': '$_id'
                                },
                                'pipeline': [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    {
                                                        '$eq': [
                                                            '$moduleId', '$$submodule_Id'
                                                        ]
                                                    }, {
                                                        '$eq': [
                                                            '$roleId', new ObjectId(roleId)
                                                        ]
                                                    },
                                                ]
                                            }
                                        }
                                    }
                                ],
                                'as': 'accessData'
                            }
                        }, {
                            '$unwind': '$accessData'
                        }, {
                            '$project': {
                                '_id': 1,
                                'label': 1,
                                'hasAccess': '$accessData.hasAccess'
                            }
                        }
                    ],
                    'as': 'subModules'
                }
            }, {
                '$project': {
                    '_id': 1,
                    'label': 1,
                    'hasAccess': '$accessData.hasAccess',
                    'subModules': '$subModules'
                }
            }
        ])
        return list
    } catch (error) {
        throw error
    }
}

async function getMyList(roleId) {
    try {
        const list = await Modules.aggregate([
            {
                '$lookup': {
                    'from': 'module_access',
                    'let': {
                        'module_Id': '$_id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$moduleId', '$$module_Id'
                                            ]
                                        }, {
                                            '$eq': [
                                                '$roleId', new ObjectId(roleId)
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'accessData'
                }
            }, {
                '$unwind': {
                    'path': '$accessData',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$project': {
                    '_id': 1,
                    'label': 1,
                    'name': 1,
                    'hasAccess': '$accessData.hasAccess',
                }
            }
        ])
        return list
    } catch (error) {
        throw error
    }
}

function processMyList(list) {
    let newList = {}
    list.forEach(element => {
        newList[element.name] = element.hasAccess
    });
    return newList
}

async function verifyModuleAccess(role, modules) {
    try {
        const roleId = role._id.toString()
        for (let index = 0; index < modules.length; index++) {
            const moduleId = modules[index];
            const module = await Modules.findById(moduleId)
            if (!module) throw "Module not found";
            const access = await ModuleAccess.findOne({ roleId, moduleId })
            if (!access || access.hasAccess == false) {
                throw {
                    message: "cannot change the access of modules you don't have access",
                    httpcode: 401
                }
            }
        }
    } catch (error) {
        throw error
    }
}

async function processListAccess(req, list) {
    try {
        const userRole = await Roles.findOne({ name: req.user.role });
        if (!userRole) return [];
        let newList = [];
        for (let index = 0; index < list.length; index++) {
            let element = list[index];
            if (element.subModules.length) {
                let sublist = []
                for (let index = 0; index < element.subModules.length; index++) {
                    const data = element.subModules[index];
                    const access = await ModuleAccess.findOne(
                        {
                            roleId: userRole._id.toString(),
                            moduleId: data._id
                        })
                    if (access.hasAccess === true) {
                        sublist.push(data)
                    }
                }
                element.subModules = sublist;

            }
            const access = await ModuleAccess.findOne(
                {
                    roleId: userRole._id.toString(),
                    moduleId: element._id
                })
            if (access.hasAccess === true) {
                newList.push(element)
            }
        }
        return newList;
    } catch (error) {
        throw error
    }
}

exports.enable = async (roleId, moduleIds) => {
    try {
        let moduleAccess = [];
        let newModuleAccess = [];
        await Promise.all(moduleIds.map(async (id) => {
            const data = await Modules.findById(id);
            if (!data) { throw "Module doesn't exist" };
            const accessData = await ModuleAccess.findOne({ roleId, moduleId: id });
            if (accessData) { moduleAccess.push(accessData) }
            else { newModuleAccess.push(id) };
        }))
        let Promises = [];
        moduleAccess.forEach(element => {
            element.hasAccess = true
            Promises.push(element.save())
        });
        newModuleAccess.forEach(moduleId => {
            const access = new ModuleAccess({
                roleId,
                moduleId,
                hasAccess: true
            })
            Promises.push(access.save())
        });
        const data = await Promise.all(Promises);
        let response = []
        data.forEach(element => {
            response.push({
                id: element.moduleId,
                hasAccess: element.hasAccess
            })
        });
        return response
    } catch (error) {
        if (error.errors) {
            throw (
                responseHelper.createCustomResponse(
                    409,
                    responseHelper.processModelValidationMessage(error.errors, true)
                ));
        }
        throw error;
    }
}

exports.disable = async (roleId, moduleIds) => {
    try {
        let newIds = [];
        let moduleAccess = [];
        let newModuleAccess = [];
        await Promise.all(moduleIds.map(async (id) => {
            const data = await Modules.findById(id);
            if (!data) { throw "Module doesn't exist" };
            const accessData = await ModuleAccess.findOne({ roleId, moduleId: id });
            if (data.parentId == null) {
                subModules = await Modules.find({ parentId: data._id }).lean()
                subModules.forEach(element => {
                    newIds.push(element._id)
                });
            }
            if (accessData) { moduleAccess.push(accessData) }
            else { newModuleAccess.push(id) };
        }));
        await Promise.all(newIds.map(async (id) => {
            const data = await Modules.findById(id);
            if (!data) { throw "Module doesn't exist" };
            const accessData = await ModuleAccess.findOne({ roleId, moduleId: id });
            if (accessData) { moduleAccess.push(accessData) }
            else { newModuleAccess.push(id) };
        }));
        let Promises = [];
        moduleAccess.forEach(element => {
            element.hasAccess = false
            Promises.push(element.save())
        });
        newModuleAccess.forEach(moduleId => {
            const access = new ModuleAccess({
                roleId,
                moduleId
            })
            Promises.push(access.save())
        });
        const data = await Promise.all(Promises);
        let response = []
        data.forEach(element => {
            response.push({
                id: element.moduleId,
                hasAccess: element.hasAccess
            })
        });
        return response
    } catch (error) {
        if (error.errors) {
            throw (
                responseHelper.createCustomResponse(
                    409,
                    responseHelper.processModelValidationMessage(error.errors, true)
                ));
        }
        throw error;
    }
}

exports.list = async (req) => {
    try {
        const role = await Roles.findById(req.params.id)
        if (!role) { throw responseMessages.itemNotFound }
        await generateAccessData(role._id, req)
        let list = await getList(role._id)
        list = await processListAccess(req, list)
        return list
    } catch (error) {
        throw error
    }
}

exports.access = async (req) => {
    try {
        const roleId = req.params.id;
        const role = await Roles.findById(roleId);
        const userRole = await Roles.findOne({ name: req.user.role });
        if (!role || !userRole) { throw "Role not found" };
        if (userRole.name !== "super_admin") {
            if (role.createdBy === null || role.createdBy.toString() !== req.user._id) {
                throw { message: "unauthorized", httpcode: 401 }
            }
        }
        await generateAccessData(roleId, req)
        let toDisable = [];
        let toEnable = [];
        let modules = req.body.modules;
        modules.forEach(element => {
            if (element.hasAccess === true) {
                toEnable.push(element.id)
            }
            else {
                toDisable.push(element.id)
            }
        });
        let toVerifyAccess = [
            ...toEnable,
            ...toDisable
        ];
        await verifyModuleAccess(userRole, toVerifyAccess)
        await this.enable(roleId, toEnable)
        await this.disable(roleId, toDisable)
        req.params.id = roleId
        return (await this.list(req))
    } catch (error) {
        throw error
    }
}

exports.myList = async (req) => {
    try {
        const role = await Roles.findOne({ name: req.user.role })
        if (!role) { throw responseMessages.itemNotFound }
        await generateAccessData(role._id, req)
        const list = await getMyList(role._id)
        const response = processMyList(list)
        return response
    } catch (error) {
        throw error
    }
}