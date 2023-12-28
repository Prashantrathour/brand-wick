const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 40,
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true   
    },
    password:String
})
userSchema.pre("save", function (next) {
    this.email = this.email.toLowerCase();
    next();
  });
  
const UserModel = mongoose.model("user",userSchema)

module.exports={
    UserModel
}