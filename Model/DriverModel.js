const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  companyLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link"
  },

 FirstName: {
  type: String,
  default: "",
},
LastName: {
  type: String,
  default: "",
},
SSN: {
  type: String,
  default: "",
},
 Contact: {
  type: String,
  default: "",
},
AltContact : {
  type: String,
  default: "",
}, 
 Dob: {
  type: String,
  default: "",
}, 
Email : {
  type: String,
  default: "",
}, 
Address  : {
  type: String,
  default: "",
}, 

City  : {
  type: String,
  default: "",
}, 
State : {
  type: String,
  default: "",
}, 
Zip : {
  type: String,
  default: "",
}, 
MedicalRegistry : {
  type: String,
  default: "",
}, 
MedicalExpiry : {
  type: String,
  default: "",
}, 
TWIC  : {
  type: String,
  default: "",
}, 
Passport  : {
  type: String,
  default: "",
}, 

MedicalImg: {
  type: String,
  default: "",
},

SocialSecurityImg: {
  type: String,
  default: "",
},
ResidenceAddress: {
  type: String,
  default: "",
},
ResidenceCity: {
  type: String,
  default: "",
},

ResidenceState : {
  type: String,
  default: "",
},
ResidenceCountry : {
  type: String,
  default: "",
},
ResidenceZip : {
  type: String,
  default: "",
},
EmergencyFullname: {
  type: String,
  default: "",
},
EmRelationship : {
  type: String,
  default: "",
},
EmPhone  : {
  type: String,
  default: "",
},


LicenseFullName   : {
  type: String,
  default: "",
},
LicenseLastName: {
  type: String,
  default: "",
},
LicenseNumber : {
  type: String,
  default: "",
},
ReenterLicenseNumber : {
  type: String,
  default: "",
},
LicenseCountry  : {
  type: String,
  default: "",
},
LicenseState   : {
  type: String,
  default: "",
},
LicenseClass    : {
  type: String,
  default: "",
},
LicenseIssueDate   : {
  type: String,
  default: "",
},
LicenseExpiryDate   : {
  type: String,
  default: "",
},  
  licensefront: {
    type: String,
    default: "",
  },
  licenseback: {
    type: String,
    default: "",
  },
  StraightTruck: {
    experience: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  
    from: {
      type: Date,
    },
  
    to: {
      type: Date,
    },
  
    approxMiles: {
      type: Number,
    },
  },
  
  TruckTractor: {
    experience: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  
    from: {
      type: Date,
    },
  
    to: {
      type: Date,
    },
  
    approxMiles: {
      type: Number,
    },
  },
  SemiTrailer: {
    experience: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  
    from: {
      type: Date,
    },
  
    to: {
      type: Date,
    },
  
    approxMiles: {
      type: Number,
    },
  },
  DoubleTriple: {
    experience: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  
    from: {
      type: Date,
    },
  
    to: {
      type: Date,
    },
  
    approxMiles: {
      type: Number,
    },
  },
  Flatbed: {
    experience: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  
    from: {
      type: Date,
    },
  
    to: {
      type: Date,
    },
  
    approxMiles: {
      type: Number,
    },
  },
  Bus: {
    experience: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  
    from: {
      type: Date,
    },
  
    to: {
      type: Date,
    },
  
    approxMiles: {
      type: Number,
    },
  },
  Other: {
    experience: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
  
    from: {
      type: Date,
    },
  
    to: {
      type: Date,
    },
  
    approxMiles: {
      type: Number,
    },
  },

  Endorsement : {
    type: String,
    enum: ["None","H", "N","P","T","X"],
    default: "None",
  },
  AccidentHistory: {
    noAccident: Boolean,   // true ya false
    date: Date,
    accidentType: String,
    vehicleType: String,
    location: String,
  },
    ViolationHistory: {
      noAccident: Boolean,   // true ya false
      date: Date,
      accidentType: String,
      vehicleType: String,
      location: String,
    },
  companyName: {
    type: String,

    trim: true,
  },

  positionHeld: {
    type: String,

    default: "Driver",
  },

  companyContact: {
    type: String,

  },

  companyEmail: {
    type: String,

  },

  companyAddress: {
    type: String,
    trim: true,
  },

  companycity: {
    type: String,

    trim: true,
  },

  companystate: {
    type: String,

    trim: true,
  },

  companyzipCode: {
    type: String,

  },

  companycountry: {
    type: String,

  },

  workedFrom: {
    type: Date,

  },

  workedTill: {
    type: Date,

 
  },

  reasonForLeaving: {
    type: String,

  },

  subjectToDOT: {
    type: String,
  
  },

  safetySensitivePosition: {
    type: String,


  },

  notes: {
    type: String,
  },
  dutyHours: {
    days: [
      {
        dateLabel: String,
        hours: Number
      }
    ],
    totalHours: Number,
    // applicationDate: Date,
    // lastRelieved: Date
  },
 
Consents1: { type: Boolean, default: false },
Consents2: { type: Boolean, default: false },
Consents3: { type: Boolean, default: false },
Consents4: { type: Boolean, default: false },
Consents5: { type: Boolean, default: false },
Consents6: { type: Boolean, default: false },
Consents7: { type: Boolean, default: false },
Consents8: { type: Boolean, default: false },

  Sign: {
    type: String,
  },

},  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);