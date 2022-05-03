module.exports = {
    enableDisableSchema: {
        type: "object",
        properties: {
            roleId: {
                type: "string",
            },
            moduleId: {
                "type": "array",
                items: [
                    {
                        type: "string",
                    },
                ],
                "minItems": 1
            }
        },
        "additionalProperties": false,
        required: ["roleId", "moduleId"],
    },
    accessUpdateSchema: {
        type: "object",
        properties: {
            modules: {
                "type": "array",
                items: [
                    {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            hasAccess: {
                                type: 'boolean'
                            }
                        },
                        required: ["id", "hasAccess"],
                        "additionalProperties": false,
                    },
                ],
                "minItems": 1
            }
        },
        "additionalProperties": false,
        required: ["modules"],
    },
}