import { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      default: null,
    },
    type: {
      type: String,
      enums: ["public", "private"],
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.type === "private";
      },
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

roomSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

roomSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Room = models.Room || model("Room", roomSchema);

export default Room;
