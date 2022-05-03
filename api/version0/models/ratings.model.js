const uniqueValidator = require("mongoose-unique-validator");
const config = require("config");

module.exports = (mongoose) => {
    var Schema = mongoose.Schema({
        postID: {
            type: String,
            trim: true
        },
        userID: {
            type: String,
            required:true,
            strim:true
           
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
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

    const ratings = mongoose.model("ratings", Schema);
    return ratings;
};
