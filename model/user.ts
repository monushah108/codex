import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
      "please enter a valid email",
    ],
  },
  password: {
    type: String,
    minLength: 4,
  },
  rootDirId: {
    type: Schema.Types.ObjectId,
    ref: "Directory",
  },
});

const User = model("User", userSchema);

export default User;
