const Model = require("../../Model/Index");
const allpdfs = require("../../Model/allpdf")
const helper = require("../../utility/helper");
const helpers = require("../../utility/helpers");
const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.LIVE_BASE_URL
    : process.env.LOCAL_BASE_URL || 'http://localhost:2000';
module.exports = {
  createUser: helpers.AsyncHanddle(async (req, res) => {
    const userExist = await Model.UserModel.findOne({ email: req.body.email });
    if (userExist) {
      return helper.failed(res, "Email Already Exist");
    }
    if (req.files && req.files.image) {
      var image = req.files.image;
      if (image) {
        req.body.image = helper.imageUpload(image, "images");
      }
    }
    let hash = await bcrypt.hash(req.body.password, 10);
    let createuser = await Model.UserModel.create({
      role: req.body.role,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      countryCode: req.body.countryCode,
      image: req.body.image,
      password: hash,
    });
    return helper.success(res, "created successfully", createuser);
  }),

  addUser: helpers.AsyncHanddle(async (req, res) => {
    let title = "userList";
    res.render("Admin/user/addUser", {
      title,
      session: req.session.user,
      msg: req.flash("msg"),
    });
  }),

  editUser: helpers.AsyncHanddle(async (req, res) => {
    let title = "userList";
    const updatedata = await Model.UserModel.findOne({ _id: req.params.id });
    res.render("Admin/user/editUser", {
      title,
      updatedata,
      session: req.session.user,
      msg: req.flash("msg"),
    });
  }),

  updateUser: helpers.AsyncHanddle(async (req, res) => {
    if (req.files && req.files.image) {
      var image = req.files.image;
      if (image) {
        req.body.image = helper.imageUpload(image, "images");
      }
    }
    await Model.UserModel.updateOne(
      { _id: req.body.id },
      {
        role: req.body.role,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        image: req.body.image,
      }
    );
    res.redirect("/userList");
  }),

  userList: helpers.AsyncHanddle(async (req, res) => {
    let title = "userList";
    const userData = await Model.Driver.find({ }).populate("companyLinkId").sort({ createdAt: -1 });
    console.log(userData,"userDatauserDatauserData")
    res.render("Admin/user/userList", {
      title,
      userData,
      session: req.session.user,
      msg: req.flash("msg"),
    });
  }),
  // List: async (req, res) => {
  //   try {
  //     let title = "";
  //     const userData = await Model.Driver.find().populate("companyLinkId");
  //     res.render("Admin/user/userList.ejs", {
  //       title,
  //       userData,
  //       session: req.session.user,
  //       msg: req.flash("msg"),
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

// crutennt 
//   viewUser: helpers.AsyncHanddle(async (req, res) => {
//     let title = "userList";
  
//     const userdetails = await Model.Driver.findById(req.params.id);
//     const Clientdetails = await Model.LinkModel.findById(userdetails.companyLinkId);
  
//     const viewpdf = await allpdfs.findOne({ Driverid: userdetails._id });
  
// console.log(viewpdf,"viewpdfviewpdfviewpdfviewpdf")
//  const makeUrl = (filePath) => {
//   if (!filePath) return '';

//   // already full URL
//   if (filePath.startsWith('http')) return filePath;

//   const fileName = filePath.split('\\').pop();

//   if (filePath.startsWith('/pdfs')) return filePath;
//   if (filePath.includes('pdfs')) return `/pdfs/${fileName}`;
//   if (filePath.includes('images')) return `/images/${fileName}`;
//   if (filePath.includes('consentpdf')) return `/consentpdf/${fileName}`;

//   return `/pdfs/${fileName}`;
// };
// console.log(makeUrl,"makeUrlmakeUrlmakeUrl")
//     const updated = viewpdf
//       ? {
//           ...viewpdf._doc,
  
//           // PDF docs
//           EmploymentApplication: makeUrl(viewpdf.EmploymentApplication),
//           MedicalCertificate: makeUrl(viewpdf.MedicalCertificate),
//           Dayscert: makeUrl(viewpdf.Dayscert),
//           SocialSecurityCard: makeUrl(viewpdf.SocialSecurityCard),
//           Violations: makeUrl(viewpdf.Violations),
  
//           // Image docs
//           MVRRecord: viewpdf.MVRRecord,
//           RoadTest: viewpdf.RoadTest,
//           ClearingHouse: viewpdf.ClearingHouse,
//                 Consents: viewpdf.Consents
//         ? viewpdf.Consents.map(file => makeUrl(file))
//         : []
//         }
//       : {};
//   console.log(updated,"updatedupdatedupdatedupdated")
//     res.render("Admin/user/viewUser", {
//       title,
//       userdetails,
//       Clientdetails,
//       viewpdf: updated,
//       session: req.session.user,
//       msg: req.flash("msg"),
//     });
//   }),

viewUser: helpers.AsyncHanddle(async (req, res) => {
    let title = "userList";
  
    const userdetails = await Model.Driver.findById(req.params.id);
    const Clientdetails = await Model.LinkModel.findById(userdetails.companyLinkId);
  
    const viewpdf = await allpdfs.findOne({ Driverid: userdetails._id });
  
console.log(viewpdf,"viewpdfviewpdfviewpdfviewpdf")
 const makeUrl = (filePath) => {
  if (!filePath) return '';
 
  // filename nikalo - chahe full URL ho ya local path
  const fileName = filePath.split('/').pop().split('\\').pop();
 
  // folder detect karo
  if (filePath.includes('consentpdf')) return `${BASE_URL}/consentpdf/${fileName}`;
  if (filePath.includes('images')) return `${BASE_URL}/images/${fileName}`;
  if (filePath.includes('pdfs')) return `${BASE_URL}/pdfs/${fileName}`;
 
  return `${BASE_URL}/pdfs/${fileName}`;
};
console.log(makeUrl,"makeUrlmakeUrlmakeUrl")
    const updated = viewpdf
      ? {
          ...viewpdf._doc,
  
          // PDF docs
          EmploymentApplication: makeUrl(viewpdf.EmploymentApplication),
          MedicalCertificate: makeUrl(viewpdf.MedicalCertificate),
          Dayscert: makeUrl(viewpdf.Dayscert),
          SocialSecurityCard: makeUrl(viewpdf.SocialSecurityCard),
          Violations: makeUrl(viewpdf.Violations),
  
          // Image docs
          MVRRecord: viewpdf.MVRRecord,
          RoadTest: viewpdf.RoadTest,
          ClearingHouse: viewpdf.ClearingHouse,
                Consents: viewpdf.Consents
        ? viewpdf.Consents.map(file => makeUrl(file))
        : []
        }
      : {};
  console.log(updated,"updatedupdatedupdatedupdated")
    res.render("Admin/user/viewUser", {
      title,
      userdetails,
      Clientdetails,
      viewpdf: updated,
      session: req.session.user,
      msg: req.flash("msg"),
    });
  }),
  // viewUser: helpers.AsyncHanddle(async (req, res) => {
  //   let title = "userList";
  //   const userdetails = await Model.Driver.findById({ _id: req.params.id });
  //   const Clientdetails = await Model.LinkModel.findById({ _id:userdetails.companyLinkId });
  //   const viewpdf= await allpdfs.find({ Driverid: userdetails._id})
  //   console.log(userdetails,"viewpdfviewpdfviewpdfviewpdfviewpdfviewpdfviewpdfviewpdfviewpdfviewpdfviewpdfviewpdf")

  //   const updated = viewpdf.map(doc => {
  //     const makeUrl = (filePath) =>
  //       filePath
  //         ? `http://localhost:2000/pdfs/${filePath.split('\\').pop()}`
  //         : '';
    
  //     return {
  //       ...doc._doc,
  //       EmploymentApplication: makeUrl(doc.EmploymentApplication),
  //       MedicalCertificate: makeUrl(doc.MedicalCertificate),
  //       Dayscert: makeUrl(doc.Dayscert),
  //       SocialSecurityCard: makeUrl(doc.SocialSecurityCard),
  //       Violations: makeUrl(doc.Violations),
  //     };
  //   });
  //   const updated1 = viewpdf.map(doc => {
  //     const makeUrl = (filePath) =>
  //       filePath
  //         ? `http://localhost:2000${filePath}`
  //         : '';
    
  //     return {
  //       ...doc._doc,
  //       MVRRecord: makeUrl(doc.MVRRecord),
  //       RoadTest: makeUrl(doc.RoadTest),
  //       ClearingHouse: makeUrl(doc.ClearingHouse),
  //     };
  //   });
  

  //   res.render("Admin/user/viewUser", {
  //     title,
  //     userdetails,
  //     Clientdetails,
      
  //     viewpdf: updated, 
  //     session: req.session.user,
  //     msg: req.flash("msg"),
  //   });
  // }),

  customerList: helpers.AsyncHanddle(async (req, res) => {
    let title = "userList";
    const userId = req.params.id;
    const customerdetails = await Model.CustomerModel.find({
      userId: userId,
    }).populate("userId");
    res.render("Admin/user/customet", {
      title,
      customerdetails,
      session: req.session.user,
      msg: req.flash("msg"),
    });
  }),

  teamMemberlist: helpers.AsyncHanddle(async (req, res) => {
    let title = "userList";
    const userId = req.params.id;
    const teamMemberdetails = await Model.TeamMemberModel.find({
      userId: userId,
    }).populate("userId");
    res.render("Admin/user/teammember", {
      title,
      teamMemberdetails,
      session: req.session.user,
      msg: req.flash("msg"),
    });
  }),

  userStatus: helpers.AsyncHanddle(async (req, res) => {
    await Model.UserModel.updateOne(
      { _id: req.body.id },
      { status: req.body.value }
    );
    req.flash("msg", "Status updated successfully");
    if (req.body.value == 0) res.send(false);
    if (req.body.value == 1) res.send(true);
  }),

  deleteUser: helpers.AsyncHanddle(async (req, res) => {
    let userId = req.body.id;
    await Model.UserModel.findByIdAndUpdate(
      { _id: userId },
      { isDeleted: true },
      { new: true }
    );
    res.redirect("/userList");
  }),
};
