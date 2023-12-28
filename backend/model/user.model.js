const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 40,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: String,
    phonenumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Validate that the phone number is a 10-digit number
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
});

userSchema.pre("save", function (next) {
    this.email = this.email.toLowerCase();
    next();
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel
};
