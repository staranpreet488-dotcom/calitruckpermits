const Model = require("../../Model/Index");
const bcrypt = require("bcrypt");
const helper = require("../../utility/helper");
const { Validator } = require("node-input-validator");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
// const phto = require("../../public")
module.exports = {
  userListPdf: async (req, res) => {
      
    const userData = await Model.Driver.find({})
      .populate("companyLinkId")
      .sort({ createdAt: -1 });
  
    const doc = new PDFDocument();
  
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=DriverList.pdf");
  
    doc.pipe(res);
  
    // Title
    doc.fontSize(18).text("Driver List Report", { align: "center" });
    doc.moveDown();
  
    userData.forEach((user, index) => {
      doc.fontSize(12).text(`No: ${index + 1}`);
      doc.text(`Name: ${user.driverName}`);
      doc.text(`Phone No: ${user.phone}`);
      doc.text(`License No: ${user.license}`);
      doc.text(`Company Name: ${user.companyLinkId?.name || "N/A"}`);

      if (user.licensefront) {
        const frontPath = path.join(__dirname, "../../public", user.licensefront);
  
        if (fs.existsSync(frontPath)) {
          doc.text("License Front:");
          doc.image(frontPath, {
            width: 90,
          });
        }
      }
  
      // 👉 License Back Image
      if (user.licenseback) {
        const backPath = path.join(__dirname, "../../public", user.licenseback);
  
        if (fs.existsSync(backPath)) {
          doc.text("License Back:");
          doc.image(backPath, {
            width: 90,
          });
        }
      }

      doc.moveDown();
    });
  
    doc.end();
  },
  loginPage: async (req, res) => {
    try {
      res.render("Admin/admin/loginPage", { msg: req.flash("msg") });
    } catch (error) {
      console.log(error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUser = await Model.UserModel.findOne({ email, role: 0 });
      if (!findUser) {
        console.log("incorrect email");
        req.flash("msg", "Incorrect email");
        return res.redirect("/loginPage");
      }
      const checkPassword = await bcrypt.compare(password, findUser.password);
      if (!checkPassword) {
        console.log("incorrect password");
        req.flash("msg", "Incorrect password");
        return res.redirect("/loginPage");
      }
      req.session.user = findUser;
      req.flash("msg", "Login successfully");
      return res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  },
  // dashboard: async (req, res) => {
  //   try {
  //     const title = "dashboard";
  
     
  //     res.render("Admin/admin/dashboard", {
  //       title,
  //       users: months, // 👈 send array
  //       session: req.session.user,
  //       msg: req.flash("msg"),
  //     });
  
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  dashboard: async (req, res) => {
    try {
      const title = "dashboard";
      const users = await Model.Driver.count();
      const Clients =await Model.LinkModel.count();
  const monthlyData = await Model.LinkModel.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" }, // month extract
        total: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // Initialize all months with 0
  let months = Array(12).fill(0);

  monthlyData.forEach(item => {
    months[item._id - 1] = item.total;
  });
  console.log(months,"monthsmonthsmonths")

      res.render("Admin/admin/dashboard", {
        title,
        users,
  monthusers: months, 
  Clients,
        session: req.session.user,
        msg: req.flash("msg"),
      });
    } catch (error) {
      console.log(error);
    }
  },

  profile: async (req, res) => {
    try {
      let title = "profile";
      res.render("Admin/admin/profile", {
        title,
        session: req.session.user,
        msg: req.flash("msg"),
      });
    } catch (error) {
      console.log(error);
    }
  },

  editprofile: async (req, res) => {
    try {
      let title = "editprofile";
      res.render("Admin/admin/editprofile", {
        title,
        session: req.session.user,
        msg: req.flash("msg"),
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateAdminProfile: async (req, res) => {
  
    try {
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          req.body.image = helper.imageUpload(image, "images");
        }
      }
      const updateData = await Model.UserModel.findByIdAndUpdate(
        { _id: req.session.user._id },
        {
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          image: req.body.image,
        }
      );

      const data = await Model.UserModel.findById({
        _id: req.session.user._id,
      });
      req.session.user = data;
      // res.json("updated successfully")
      if (updateData) {
        res.redirect("back");
        // res.json("error")
      } else {
        res.redirect("back");
        // res.json("failed")
      }
      res.json("here");
      // res.redirect("/profile")
    } catch (error) {
      console.log(error);
    }
  },

  changePassword: async (req, res) => {
    try {
      let title = "changePassword";
      res.render("Admin/admin/changePassword", {
        title,
        session: req.session.user,
        msg: req.flash("msg"),
      });
    } catch (error) {
      console.log(error);
    }
  },

  updatepassword: async function (req, res) {
    try {
      const V = new Validator(req.body, {
        oldPassword: "required",
        newPassword: "required",
        confirm_password: "required|same:newPassword",
      });
      V.check().then(function (matched) {
        console.log(matched);
        console.log(V.errors);
      });
      let data = req.session.user;
      if (data) {
        let comp = await bcrypt.compare(V.inputs.oldPassword, data.password);
        if (comp) {
          const bcryptPassword = await bcrypt.hash(req.body.newPassword, 10);
          let create = await Model.UserModel.updateOne(
            { _id: data._id },
            { password: bcryptPassword }
          );
          req.session.user = create;
          req.flash("msg", "Password updated successfully");
          res.redirect("/loginPage");
          // res.json("updated successfully")
        } else {
          req.flash("msg", "Invalid old password");
          res.redirect("/changePassword");
          // res.json("Old password do not match")
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  logout: async (req, res) => {
    try {
      req.session.destroy((err) => {});
      res.redirect("/loginPage");
    } catch (error) {
      helper.error(res, error);
    }
  },

  errorPage: async (req, res) => {
    try {
      res.render("Admin/admin/errorPage", { msg: req.flash("msg") });
    } catch (error) {
      console.log(error);
    }
  },
};
