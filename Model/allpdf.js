const { string } = require("joi");
const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    Driverid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
      },
    EmploymentApplication: {
      type: String,
      default: "",
    },
    MedicalCertificate: {
      type: String,
      default: "",
    },    
    Dayscert: {
      type: String,
      default: "",
    },   
    SocialSecurityCard: {
          type: String,
          default: "",
        },  
        Violations: {
            type: String,
            default: "",
          },  



          MVRRecord: {
            type: String,
            default: "",
          },   
          RoadTest: {
                type: String,
                default: "",
              },  
              ClearingHouse: {
                  type: String,
                  default: "",
                },  

Consents: {
  type: [String],
  default: []
}
  
  },
        
  

  { timestamps: true }
);


module.exports = mongoose.model("pdf", pdfSchema);
