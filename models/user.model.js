const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 250, trim: true },
    email: { type: String, maxlength: 100, trim: true, required: true },
    password: { type: String, required: true },
    resetToken: String,
    expireToken: Date,
    // address: [{ type: ObjectId, ref: "address" }],
  },
  { timestamps: true }
);
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.expireToken;
  return obj;
};

const user = mongoose.model("user", userSchema);
module.exports = user;
