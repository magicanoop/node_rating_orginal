const uniqueValidator = require("mongoose-unique-validator");
const config = require("config");

module.exports = (mongoose) => {
    var Schema = mongoose.Schema({
        userName: {
            type: String,
            trim: true
        },
        userPass: {
            type: String,
            strim:true
           
        },
        email:{
            type:String,
            required:true,
          },
        
          status:{
            type:Boolean,
            required:true
          },
    },
       
    );
    Schema.plugin(uniqueValidator);

    Schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const users = mongoose.model("users", Schema);
    return users;
};
