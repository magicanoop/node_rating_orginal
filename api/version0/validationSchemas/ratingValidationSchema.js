module.exports = {
    createRatingSchema: {
        "type": "object",
        "properties": {
            "postID": {
                "type": "String",
                "required":"true",
                "strim":"true"
               
            },
            "userID": {
                "type": "String",
                "required":"true",
                "strim":"true"
               
            },
            "rating":{
                "type":"integer",
                "required":"true",
                "min":"1",
                "max":"5"
              },
            
              "status":{
                "type":"integer",
                "required":"true"
              },
        }},
         
       
    // loginUserSchema: {
    //     "type": "object",
    //     "properties": {
    //         "emailId": {
    //             "type": "string"
    //         },
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "password": {
    //             "type": "string"
    //         }
    //     },
    //     "additionalProperties": false,
    //     "anyOf": [
    //         {
    //             "required": ["emailId", "password"],

    //         },
    //         {
    //             "required": ["phoneNumber", "password"]
    //         }
    //     ]
    // },
    // updateUserSchema: {
    //     "type": "object",
    //     "properties": {
    //         "name": {
    //             "type": "string"
    //         },
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "language": {
    //             "type": "string"
    //         },
    //         "imageUrl": {
    //             "type": "string"
    //         },
    //         "isDeleted": {
    //             "type": "boolean"
    //         },
    //         "isActive": {
    //             "type": "boolean"
    //         },
    //         "role": {
    //             "type": "string",
    //             "enum": ["student", "institute", "admin", "faculty", "super_admin"]
    //         },
    //         "emailId": {
    //             "type": "string"
    //         },
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "password": {
    //             "type": "string"
    //         },
    //         "about": {
    //             "type": "string"
    //         }
    //     },
    //     "additionalProperties": false

    // },
    // updatePasswordSchema: {
    //     "type": "object",
    //     "properties": {
    //         "currentPassword": {
    //             "type": "string"
    //         },
    //         "newPassword": {
    //             "type": "string"
    //         }
    //     },
    //     "additionalProperties": false,
    //     required: ["newPassword", "currentPassword"]
    // },
    // resetPasswordSchema: {
    //     "type": "object",
    //     "properties": {
    //         "newPassword": {
    //             "type": "string"
    //         },
    //         "resetToken": {
    //             "type": "string"
    //         },
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "otp": {
    //             "type": ""
    //         },
    //     },
    //     "additionalProperties": false,
    //     "anyOf": [
    //         {
    //             required: ["newPassword", "resetToken"]

    //         },
    //         {
    //             required: ["phoneNumber", "newPassword", "otp"]
    //         }
    //     ]
    // },
    // verifyOtpSchema: {
    //     "type": "object",
    //     "properties": {
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "otp": {
    //             "type": "integer"
    //         }
    //     },
    //     "additionalProperties": false,
    //     required: ["phoneNumber", "otp"]

    // },
    // resendOtpSchema: {
    //     "type": "object",
    //     "properties": {
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "emailId": {
    //             "type": "string"
    //         },
    //     },
    //     "additionalProperties": false,
    //     "anyOf": [
    //         {
    //             required: ["emailId"]

    //         },
    //         {
    //             required: ["phoneNumber"]
    //         }
    //     ]
    // },
    // createStudentSchema: {
    //     "type": "object",
    //     "properties": {
    //         "role": {
    //             "type": "string",
    //             "enum": ["student", "institute", "admin", "faculty", "super_admin"]
    //         },
    //         "name": {
    //             "type": "string"
    //         },
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "emailId": {
    //             "type": "string"
    //         },
    //         "language": {
    //             "type": "string"
    //         },
    //         "filename": {
    //             "type": "string"
    //         },
    //         "referralCode": {
    //             "type": "string"
    //         }
    //     },
    //     "additionalProperties": false,
    //     "required": [
    //         "role",
    //         "name",
    //         "phoneNumber",
    //         "emailId"
    //     ]
    // },
    // loginStudentSchema: {
    //     "type": "object",
    //     "properties": {
    //         "emailId": {
    //             "type": "string"
    //         },
    //         "phoneNumber": {
    //             "type": "string"
    //         },
    //         "otp": {
    //             "oneOf": [
    //                 { "type": "integer" },
    //                 { "type": "string" }
    //             ]
    //         },
    //     },
    //     "additionalProperties": false,
    //     "anyOf": [
    //         {
    //             required: ["emailId", "otp"]

    //         },
    //         {
    //             required: ["phoneNumber", "otp"]
    //         }
    //     ]
    // },
    // sendLoginStudentSchema: {
    //     "type": "object",
    //     "properties": {
    //         "emailId": {
    //             "type": "string"
    //         },
    //         "phoneNumber": {
    //             "type": "string"
    //         }
    //     },
    //     "additionalProperties": false,
    //     "anyOf": [
    //         {
    //             required: ["emailId"]

    //         },
    //         {
    //             required: ["phoneNumber"]
    //         }
    //     ]
    // }
}