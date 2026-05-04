const allpdf = require("../../Model/allpdf");
const Model = require("../../Model/Index");
const LinkModel = require("../../Model/LinkModel");

const helper = require("../../utility/helper");
const helpers = require("../../utility/helpers");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");



module.exports = {
    Link_Create: async (req, res) => {
        try {
          let title = "Link_Create";
          res.render("Admin/Link/LinkGenrator.ejs", {
            title,
            session: req.session.user,
            msg: req.flash("msg"),
          });
        } catch (error) {
          console.log(error);
        }
      },
    create_companyLink: async (req, res) => {
    // app.post("/admin/create-company", async (req, res) => {
        const name = req.body.name;
      
        // 🔥 slug generate
        const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      
        const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.LIVE_BASE_URL
      : process.env.LOCAL_BASE_URL;

  const link = `${baseUrl}/${slug}`;
      
        const company = await LinkModel.create({
          ...req.body,
          slug,
          link
        });
    
       
   
      
        res.redirect("/LinkList");
      },
      LinkList: helpers.AsyncHanddle(async (req, res) => {
        let title = "Link_Create";
        const userData = await Model.LinkModel.find({
      
        }).sort({ createdAt: -1 });

        res.render("Admin/Link/LinkList", {
          title,
          userData,
          session: req.session.user,
          msg: req.flash("msg"),
        });
      }),
      deleteList: helpers.AsyncHanddle(async (req, res) => {
        let userId = req.body.id;
        console.log(userId,"userIduserIduserId")
        await Model.LinkModel.findByIdAndDelete(
          { _id: userId },
         
          { new: true }
        );
        res.redirect("/LinkList");
      }),
      
      deleteDriver: helpers.AsyncHanddle(async (req, res) => {
        let userId = req.body.id;
        console.log(userId,"userIduserIduserId")
        await Model.Driver.findByIdAndDelete(
          { _id: userId },
         
          { new: true }
        );
        res.redirect("/LinkList");
      }),
      ClinetStatus: helpers.AsyncHanddle(async (req, res) => {
        await Model.LinkModel.updateOne(
          { _id: req.body.id },
          { AccountStatus: req.body.value } // ✅ correct field
        );
      
        // req.flash("msg", "Status updated successfully");
      
        res.json({ success: true }); 
      }),
      viewcleint: helpers.AsyncHanddle(async (req, res) => {
        let title = "Link_Create";
        const userdetails = await Model.LinkModel.findById({ _id: req.params.id });
        const userData = await Model.Driver.find({ companyLinkId:userdetails._id}).populate("companyLinkId").sort({ createdAt: -1 });
        const usercount = await Model.Driver.find({ companyLinkId:userdetails._id}).count();

        console.log(userData,"userDatauserDatauserDatauserData")
        res.render("Admin/Link/Viewlink", {
          title,
          userData,
          usercount,
          userdetails,
          session: req.session.user,
          msg: req.flash("msg"),
        });
      }),


 exportallpdfs : async (req,res)=>{
  try {
    console.log("===== PDF EXPORT START =====");
console.log("CWD:", process.cwd());
console.log("__dirname:", __dirname);
    const record = await allpdf.findOne({ Driverid: req.params.id }).populate("Driverid")
 
    if (!record) {
      return res.status(404).send("No record found");
    }
 
    const mergedPdf = await PDFDocument.create();
 
    // 🟢 Function to add PDF
    const addPdf = async (filePath) => {
      if (!filePath) return;
 
      // URL ya relative path dono handle karo
      let localPath;
      if (filePath.startsWith('http')) {
        // e.g. http://portal.calipermits.com/pdfs/driver_John.pdf
        try {
          const urlObj = new URL(filePath);
          // urlObj.pathname = /pdfs/driver_John.pdf
          localPath = path.join(process.cwd(), 'public', urlObj.pathname);
        } catch(e) {
          localPath = path.join(process.cwd(), 'public', filePath);
        }
      } else {
        // relative path e.g. /pdfs/driver_John.pdf
        const cleanPath = filePath.replace(/^\/+/, '');
        localPath = path.join(process.cwd(), 'public', cleanPath);
      }
 
      if (!fs.existsSync(localPath)) {
        console.log('PDF NOT found:', localPath);
        return;
      }
 
      const pdfBytes = fs.readFileSync(localPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    };
 
    // 🟢 Function to add Image
const addImage = async (filePath) => {
  if (!filePath) return;
 
  let fullPath;
  if (filePath.startsWith('http')) {
    try {
      const urlObj = new URL(filePath);
      fullPath = path.join(process.cwd(), "public", urlObj.pathname);
    } catch(e) {
      fullPath = path.join(process.cwd(), "public", filePath);
    }
  } else {
    const cleanPath = filePath.replace(/^\/+/, "");
    fullPath = path.join(process.cwd(), "public", cleanPath);
  }
 
  if (!fs.existsSync(fullPath)) {
    console.log("Image NOT found:", fullPath);
    return;
  }
 
  const imageBytes = fs.readFileSync(fullPath);
  const cleanPath = fullPath.replace(/\\/g, '/');
 
  let image;
  if (cleanPath.toLowerCase().endsWith(".png")) {
    image = await mergedPdf.embedPng(imageBytes);
  } else {
    image = await mergedPdf.embedJpg(imageBytes);
  }
 
  const page = mergedPdf.addPage([595, 842]);
 
  const scale = Math.min(500 / image.width, 700 / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
 
  page.drawImage(image, {
    x: (595 - width) / 2,
    y: (842 - height) / 2,
    width,
    height,
  });
};
 
    // ✅ Add all PDFs
    await addPdf(record.EmploymentApplication);
    await addPdf(record.MedicalCertificate);
    await addPdf(record.Dayscert);
    await addPdf(record.SocialSecurityCard);
    await addPdf(record.Violations);
 
    // ✅ Add Consent PDFs
    if (record.Consents && record.Consents.length > 0) {
      for (let consent of record.Consents) {
        await addPdf(consent);
      }
    }
 
    // ✅ Add Images
    await addImage(record.MVRRecord);
    await addImage(record.RoadTest);
    await addImage(record.ClearingHouse);
 
    const finalPdf = await mergedPdf.save();
 
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${record.Driverid?.FirstName}.pdf`);
 
    res.send(Buffer.from(finalPdf));
 
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating PDF");
  }
}
//  exportallpdfs : async (req,res)=>{
//   try {
//     const record = await allpdf.findOne({ Driverid: req.params.id }).populate("Driverid")

//     if (!record) {
//       return res.status(404).send("No record found");
//     }

//     const mergedPdf = await PDFDocument.create();

//     // 🟢 Function to add PDF
//     const addPdf = async (filePath) => {
//       if (!filePath) return;

//       const fullPath = path.resolve(filePath);
//       if (!fs.existsSync(fullPath)) return;
 
//       const pdfBytes = fs.readFileSync(fullPath);
//       const pdf = await PDFDocument.load(pdfBytes);
//       const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//       copiedPages.forEach((page) => mergedPdf.addPage(page));
//     };

//     // 🟢 Function to add Image
// const addImage = async (filePath) => {
//   if (!filePath) return;

//   const cleanPath = filePath.replace(/^\/+/, "");
//   const fullPath = path.join(process.cwd(), "public", cleanPath);



//   if (!fs.existsSync(fullPath)) {
//     console.log("Image NOT found:", fullPath);
//     return;
//   }

//   const imageBytes = fs.readFileSync(fullPath);

//   let image;
//   if (cleanPath.toLowerCase().endsWith(".png")) {
//     image = await mergedPdf.embedPng(imageBytes);
//   } else {
//     image = await mergedPdf.embedJpg(imageBytes);
//   }

//   const page = mergedPdf.addPage([595, 842]);

//   const scale = Math.min(500 / image.width, 700 / image.height);
//   const width = image.width * scale;
//   const height = image.height * scale;

//   page.drawImage(image, {
//     x: (595 - width) / 2,
//     y: (842 - height) / 2,
//     width,
//     height,
//   });
// };

//     // ✅ Add all PDFs
//     await addPdf(record.EmploymentApplication);
//     await addPdf(record.MedicalCertificate);
//     await addPdf(record.Dayscert);
//     await addPdf(record.SocialSecurityCard);
//     await addPdf(record.Violations);

//     // ✅ Add Consent PDFs
//     if (record.Consents && record.Consents.length > 0) {
//       for (let consent of record.Consents) {
//         await addPdf(consent);
//       }
//     }

//     // ✅ Add Images
//     await addImage(record.MVRRecord);
//     await addImage(record.RoadTest);
//     await addImage(record.ClearingHouse);

//     const finalPdf = await mergedPdf.save();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=${record.Driverid?.FirstName}.pdf`);

//     res.send(Buffer.from(finalPdf));

//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error generating PDF");
//   }
// }
}