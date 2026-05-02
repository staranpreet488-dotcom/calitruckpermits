const { string } = require("joi");
const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
 
    name: {
      type: String,
      default: "",
    },
    DOT: {
      type: String,
      default: "",
    },    MC: {
      type: String,
      default: "",
    },   
     Street: {
      type: String,
      default: "",
    },    
    City: {
      type: String,
      default: "",
    },   
    State: {
      type: String,
      default: "",
    },   
    ZipCode: {
      type: String,
      default: "",
    },   
    EmailAddress: {
      type: String,
      default: "",
    },   
    PhoneNumber: {
      type: String,
      default: "",
    },
    AccountStatus: {
      type: String,
      enum: ["active", "inactive", "Onboarding", "Pending"],
      default: "active"
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
      },
   
   
      link:{
type:String
      }
   
  
  
  },
  { timestamps: true }
);


module.exports = mongoose.model("Link", LinkSchema);
