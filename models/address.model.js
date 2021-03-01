const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    full_name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, trim: true, unique: true },
    city: { type: String, trim: true },
    mobile_no: { type: Number },
    state: { type: String, trim: true },
    zip_code: { type: Number, required: true, trim: true },
    street: { type: String, trim: true },
    created_date: { type: Date, default: Date.now() },
    createdBy: { type: ObjectId, ref: "user" },
  },
  { timestamps: true }
);

addressSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

addressSchema.set("toJSON", {
  virtuals: true,
});

const address = mongoose.model("address", addressSchema);

module.exports = address;
