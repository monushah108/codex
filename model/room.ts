import { model, models, Schema } from "mongoose";
import bcrypt from "bcrypt";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 8,
    },

    type: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },

    password: {
      type: String,

      required: function () {
        return this.type === "private";
      },

      minlength: 6,

      validate: {
        validator: function (value: string) {
          // PUBLIC ROOM CANNOT HAVE PASSWORD
          if (this.type === "public") {
            return !value;
          }

          return true;
        },

        message: "Public rooms cannot contain password",
      },
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rootDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
    },

    maxUsers: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      default: 2,
    },

    currentUsers: {
      type: Number,
      default: 1,
      min: 1,
    },

    //
    // ROOM EXPIRY
    //

    isPermanent: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,

      default: function () {
        // EXPIRE AFTER 7 DAYS
        if (!this.isPermanent) {
          return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }

        return null;
      },
    },
  },
  {
    timestamps: true,
  },
);

//
// INDEXES
//

// FAST ROOM SEARCH
roomSchema.index({
  name: "text",
});

// FAST ADMIN ROOM FETCH
roomSchema.index({
  adminId: 1,
});

// FAST ROOM TYPE FILTER
roomSchema.index({
  type: 1,
});

// AUTO DELETE EXPIRED ROOM
roomSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,

    partialFilterExpression: {
      isPermanent: false,
    },
  },
);

//
// HASH PASSWORD
//

roomSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

//
// PASSWORD COMPARE
//

roomSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

//
// VALIDATE USER LIMIT
//

roomSchema.pre("save", function () {
  if (this.currentUsers > this.maxUsers) {
    throw new Error("Current users exceed maximum limit");
  }
});

const Room = models.Room || model("Room", roomSchema);

export default Room;
