const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: Number,
      enum: [0, 1],
      default: 1, // 0 for Admin, 1 for user
    },
    name: {
      type: String,
      default: "",
    },
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
    },

    image: {
      type: String,
      default: "",
    },

    countryCode: {
      type: String,
      default: "",
    },

    status: {
      type: Number,
      enum: [1, 2],
      default: 1, //  1 for  Active user, 2 for Inactive
    },

    // companyName: {
    //   type: String,
    //   default: "",
    // },
    // companyEmail: {
    //   type: String,
    //   default: "",
    // },
    // countryCodeCompany: {
    //   type: String,
    // },
    // companyPhone: {
    //   type: Number,
    //   default: null,
    // },
    // companyImage: {
    //   type: String,
    //   default: "",
    // },
    // labarCharge: {
    //   type: String,
    //   default: ""
    // },
    // referalCode: {
    //   type: String,
    //   default: "",
    // },

    authToken: {
      type: String,
      default: "",
    },

    deviceToken: {
      type: String,
      default: "",
    },

    deviceType: {
      type: Number,
      enum: [1, 2], //1 for Android, 2 for IOS
      default: null,
    },

    // socialId: {
    //   type: String,
    //   default: "",
    // },

    // socialtype: {
    //   type: Number,
    //   enum: [0, 1], // 0 for facebook 1 for google
    //   default: null,
    // },
    otp: {
      type: Number,
    },
    otpVerify: {
      type: Number,
      enum: [0, 1],
      default: 0, // 1 verify 0 unverify
    },
    profile: {
      type: Number,
      enum: [0, 1], //0 user Profile not complete ,  1 user profile complete,
      default: 0,
    },
    forgotPasswordToken: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
