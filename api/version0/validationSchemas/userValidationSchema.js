module.exports = {
    createUserSchema: {
        "type": "object",
        "properties": {
            "userName": {
                "type": "String",
                "required":"true",
                "strim":"true"
               
            },
            "userPass": {
                "type": "String",
                "required":"true",
                "strim":"true"
               
            },
            "email":{
                "type":"String",
                "required":"true"
                
              },
            
              "status":{
                "type":"integer",
                "required":"true"
              },
        }},
        loginUserSchema: {
            "type": "object",
            "properties": {
                "emailId": {
                    "type": "string"
                },
                "phoneNumber": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "anyOf": [
                {
                    "required": ["emailId", "password"],
    
                },
                {
                    "required": ["phoneNumber", "password"]
                }
            ]
        }
}