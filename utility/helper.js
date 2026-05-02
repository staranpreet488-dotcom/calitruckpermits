// var { v4: uuid } = require('uuid');
var path = require("path");
const user_model = require("../Model/userModel");
// const { v4: uuidv4 } = require('uuid');
const uuid = require("uuid").v4;
const bcrypt = require("bcrypt");
const { Validator } = require("node-input-validator");
var jwt = require("jsonwebtoken");
const secretCryptoKey =
  process.env.jwtSecretKey || "secret_iBabycoachs_@onlyF0r_JWT";
// const stripe = require('stripe')(process.env.SECRETKEY)
const SECRET_KEY = process.env.SECRET_KEY;
const PUBLISH_KEY = process.env.PUBLISH_KEY;
var FCM = require("fcm-node");
const nodemailer = require("nodemailer");
// let hash =  bcrypt.hash("secret_KeyFor_jobbie_@#!$", 10).then((res)=>{
//   console.log("🚀  file: ApiController.js:31  hash:", res)
// })

//  user: process.env.AUTHUSER,
//     pass: process.env.AUTHPASSWORD,

module.exports = {
  imageUpload: (file, folder = "user") => {
    if (file.name == "") return;
    let file_name_string = file.name;
    var file_name_array = file_name_string.split(".");
    var file_extension = file_name_array[file_name_array.length - 1];
    var letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    var result = "";
    result = uuid();
    let name = result + "." + file_extension;
    file.mv("public/" + folder + "/" + name, function (err) {
      if (err) throw err;
    });
    return "/" + folder + "/" + name;
  },

  imageUpload1: (file, folder = "images") => {
    return new Promise((resolve, reject) => {
      if (!file || !file.name) return reject("No file");
  
      const fileExt = path.extname(file.name);
      const name = uuid() + fileExt;
  
      const uploadPath = "public/" + folder + "/" + name;
  
      file.mv(uploadPath, function (err) {
        if (err) return reject(err);
  
        resolve("/" + folder + "/" + name);
      });
    });
  },
  async fileUpload(files, folder = "users") {
    const file_name_string = files.name;
    const file_name_array = file_name_string.split(".");
    const file_ext = file_name_array[file_name_array.length - 1];

    const letters = "ABCDE1234567890FGHJK1234567890MNPQRSTUXY";
    let result = "";

    while (result.length < 28) {
      const rand_int = Math.floor(Math.random() * letters.length);
      const rand_chr = letters[rand_int];
      if (result.substr(-1, 1) !== rand_chr) result += rand_chr;
    }

    const resultExt = `${result}.${file_ext}`;

    console.log("🚀 ~ file: file.js:2--1 ~ fileUpload ~ resultExt:", resultExt);
    await new Promise((resolve, reject) => {
      files.mv(`public/images/${folder}/${resultExt}`, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return resultExt;
  },

  session: async (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      return res.redirect("/loginPage");
    }
  },
  session1: async (req, res, next) => {
    if (req.session.website) {
      next();
    } else {
      return res.redirect("/");
    }
  },

  success: function (res, message = "", body = {}) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: message,
      body: body,
    });
  },

  error: function (res, err, req) {
    console.log(err, "====================>error");
    let code = typeof err === "object" ? (err.code ? err.code : 403) : 403;
    let message =
      typeof err === "object" ? (err.message ? err.message : "") : err;

    if (req) {
      req.flash("flashMessage", {
        color: "error",
        message,
      });

      const originalUrl = req.originalUrl.split("/")[1];
      return res.redirect(`/${originalUrl}`);
    }

    return res.status(code).json({
      success: false,
      message: message,
      code: code,
      body: {},
    });
  },

  failed: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(400).json({
      success: false,
      code: 400,
      message: message,
      body: {},
    });
  },

  failed2: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(400).json({
      success: true,
      code: 200,
      message: message,
      body: [],
    });
  },

  failed403: function (res, message = "") {
    message =
      typeof message === "object"
        ? message.message
          ? message.message
          : ""
        : message;
    return res.status(403).json({
      success: false,
      code: 403,
      message: message,
      body: {},
    });
  },

  unixTimestamp: function () {
    var time = Date.now();
    var n = time / 1000;
    return (time = Math.floor(n));
  },

  findUserDeviceToken: async (userid) => {
    try {
      let data = await user_model.find({ _id: { $in: userid } });
      console.log(
        "🚀  file: helper.js:153  findUserDeviceToken:async ~ data:",
        data
      );
      return data;
    } catch (error) {}
  },

  readFile: async (path) => {
    console.log("********* readFile *****************");
    console.log(path, "********** pathreadFile *****************");
    return new Promise((resolve, reject) => {
      const readFile = util.promisify(fs.readFile);
      readFile(path)
        .then((buffer) => {
          resolve(buffer);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  writeFile: async (path, buffer) => {
    console.log("  ********** write file *****************");
    return new Promise((resolve, reject) => {
      const writeFile1 = util.promisify(fs.writeFile);
      writeFile1(path, buffer)
        .then((buffer) => {
          resolve(buffer);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  createVideoThumb: async (fileData, thumbnailPath) => {
    var VIDEO_THUMBNAIL_TIME = "00:00:02";
    var VIDEO_THUMBNAIL_SIZE = "300x200";
    var VIDEO_THUMBNAIL_TYPE = "video";
    return new Promise(async (resolve, reject) => {
      Thumbler(
        {
          type: VIDEO_THUMBNAIL_TYPE,
          input: fileData,
          output: thumbnailPath,
          time: VIDEO_THUMBNAIL_TIME,
          size: VIDEO_THUMBNAIL_SIZE, // this optional if null will use the desimention of the video
        },
        function (err, path) {
          if (err) reject(err);
          resolve(path);
        }
      );
    });
  },

  fileUploadMultiparty: async function (FILE, FOLDER, FILE_TYPE) {
    console.log(FILE, FOLDER, FILE_TYPE, "[----------data-------]");
    try {
      var FILENAME = FILE.name; // actual filename of file
      var FILEPATH = FILE.tempFilePath; // will be put into a temp directory

      THUMBNAIL_IMAGE_SIZE = 300;
      THUMBNAIL_IMAGE_QUALITY = 100;

      let EXT = fileExtension(FILENAME); //get extension
      EXT = EXT ? EXT : "jpg";
      FOLDER_PATH = FOLDER ? FOLDER + "/" : ""; // if folder name then add following "/"
      var ORIGINAL_FILE_UPLOAD_PATH = "/public/uploads/" + FOLDER_PATH;
      var THUMBNAIL_FILE_UPLOAD_PATH = "/public/uploads/" + FOLDER_PATH;
      var THUMBNAIL_FILE_UPLOAD_PATH_RETURN = "/uploads/" + FOLDER_PATH;
      var NEW_FILE_NAME = new Date().getTime() + "-" + "file." + EXT;
      var NEW_THUMBNAIL_NAME =
        new Date().getTime() +
        "-" +
        "thumbnail" +
        "-" +
        "file." +
        (FILE_TYPE == "video" ? "jpg" : EXT);

      let NEWPATH = path.join(
        __dirname,
        "../",
        ORIGINAL_FILE_UPLOAD_PATH,
        NEW_FILE_NAME
      );
      console.log(NEWPATH, "[=======NEWPATH======]");
      let THUMBNAIL_PATH = path.join(
        __dirname,
        "../",
        ORIGINAL_FILE_UPLOAD_PATH,
        NEW_THUMBNAIL_NAME
      );

      let FILE_OBJECT = {
        image: "",
        thumbnail: "",
        fileName: FILENAME,
        folder: FOLDER,
        file_type: FILE_TYPE,
      };

      console.log(FILEPATH, "====================FILEPATH");
      // return

      let BUFFER = await this.readFile(FILEPATH); //read file from temp path
      await this.writeFile(NEWPATH, BUFFER); //write file to destination

      FILE_OBJECT.image = THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_FILE_NAME;

      let THUMB_BUFFER = "";

      if (FILE_TYPE == "image") {
        // image thumbnail code
        var THUMB_IMAGE_TYPE = EXT == "png" ? "png" : "jpeg";
        THUMB_BUFFER = await sharp(BUFFER)
          .resize(THUMBNAIL_IMAGE_SIZE)
          .toFormat(THUMB_IMAGE_TYPE, {
            quality: THUMBNAIL_IMAGE_QUALITY,
          })
          .toBuffer();
        // FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH + NEW_THUMBNAIL_NAME;
        FILE_OBJECT.thumbnail =
          THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_THUMBNAIL_NAME;
        await this.writeFile(THUMBNAIL_PATH, THUMB_BUFFER);
      } else if (FILE_TYPE == "video") {
        // video thumbnail code
        await this.createVideoThumb(
          NEWPATH,
          THUMBNAIL_PATH,
          NEW_THUMBNAIL_NAME
        );
        FILE_OBJECT.thumbnail =
          THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_THUMBNAIL_NAME;
      } else {
        FILE_OBJECT.thumbnail = "";
      }
      return FILE_OBJECT;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  checkValidation: async (v) => {
    var errorsResponse;

    await v.check().then(function (matched) {
      if (!matched) {
        var valdErrors = v.errors;
        var respErrors = [];
        Object.keys(valdErrors).forEach(function (key) {
          if (valdErrors && valdErrors[key] && valdErrors[key].message) {
            respErrors.push(valdErrors[key].message);
          }
        });
        errorsResponse = respErrors.join(", ");
      }
    });
    return errorsResponse;
  },

  authenticateHeader: async function (req, res, next) {
    const v = new Validator(req.headers, {
      secret_key: "required|string",
      publish_key: "required|string",
    });

    let errorsResponse = await module.exports.checkValidation(v); // Use the stored reference

    if (errorsResponse) {
      await module.exports.failed(res, errorsResponse);
    }

    if (
      req.headers.secret_key !== SECRET_KEY ||
      req.headers.publish_key !== PUBLISH_KEY
    ) {
      await module.exports.failed(res, "Key not matched!"); // Assuming failed function is defined somewhere
    }
    next();
  },

  authenticateJWT: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, secretCryptoKey, async (err, payload) => {
        if (err) {
          return res.status(401).json({
            success: false,
            code: 401,
            message: "invalid token",
            body: {},
          });
        }

        const existingUser = await user_model.findOne({
          _id: payload.data._id,
          // loginTime: payload.data.loginTime,
        });

        if (existingUser) {
          req.user = existingUser;

          next();
        } else {
          return res.status(401).json({
            success: false,
            code: 401,
            message: "Unauthorized token",
            body: {},
          });
        }
      });
    } else {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "Token required",
        body: {},
      });
    }
  },

  verifyUser: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("object");
      jwt.verify(token, SECRETCRYPTO_KEY, async (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }
        console.log("object,,,,,,,,", payload.data.id);
        const existingUser = await users.findOne({
          where: {
            id: payload.data.id,
            login_time: payload.data.login_time,
          },
        });
        console.log("existingUser,,,,,,,,,,,,,,,,,", existingUser);

        // const existingUser = await users.findOne({
        //   where: {
        //     id: payload.id,
        //     login_time: payload.login_time,
        //   },
        // });
        if (existingUser) {
          req.user = existingUser;
          next();
        } else {
          res.sendStatus(401);
        }
      });
    } else {
      res.sendStatus(401);
    }
  },

  //////////////////  STRIPE  /////////////////////
  strieCustomer: async (email) => {
    console.log(email);
    const customer = await stripe.customers.create({
      email: email,
    });
    return customer ? customer.id : "0";
  },

  stripeToken: async (req) => {
    const token = await stripe.tokens.create({
      card: {
        number: req.body.card_number,
        exp_month: req.body.expire_month,
        exp_year: req.body.expire_year,
      },
    });
    const source = await stripe.customers.createSource(
      req.user.stripe_customer,
      {
        source: token.id,
      }
    );

    return source ? source.id : "0";
  },

  stripePayment: async (req, res) => {
    var charge = await stripe.charges.create({
      amount: req.body.total * 1000,
      currency: "usd",
      customer: req.auth.customer_id,
      source: req.body.card_token,
      description: "Jobbie",
    });
    return charge;
  },

  paypalPayment: (order, req, item) => {
    return new Promise(async (resolve, reject) => {
      try {
        var formattedProducts = item.map((product) => {
          return {
            price: parseFloat(product.price).toFixed(2),
            quantity: parseInt(product.quantity),
          };
        });
        var totalQuantity = formattedProducts.reduce(
          (sum, product) => sum + product.quantity,
          0
        );

        await paypal.payment.create(
          {
            intent: "sale",
            payer: {
              payment_method: "paypal",
            },
            redirect_urls: {
              return_url: `${req.protocol}://${req.get(
                "host"
              )}/api/paypalSuccessURL?amount=${parseFloat(
                order.total
              )}&orderId=${parseInt(order.id)}&status=1`,
              cancel_url: `${req.protocol}://${req.get(
                "host"
              )}/api/cancleUrl?status=0`,
            },
            transactions: [
              {
                item_list: {
                  items: [
                    {
                      name: "",
                      price: order.total,
                      currency: "USD",
                      quantity: 1,
                    },
                  ],
                },
                amount: {
                  total: order.total,
                  currency: "USD",
                },
                description: "Payment description",
              },
            ],
          },
          (error, payment) => {
            if (error) {
              reject(error);
            } else {
              const approval_url = payment.links.find(
                (link) => link.rel === "approval_url"
              ).href;
              resolve(approval_url);
            }
          }
        );
      } catch (error) {
        console.error("PayPal API Error:", error);
        reject(error);
      }
    });
  },

  SMTP: function (object) {
    var transporter = nodemailer.createTransport(config.mail_auth);
    var mailOptions = object;
    transporter.sendMail(mailOptions, function (error, info) {
      if (err) {
        throw error;
      } else {
        throw message;
      }
    });
  },

  calculateAverageRating: async (spot_id) => {
    try {
      const averageRatingPipeline = [
        {
          $match: {
            workerId: spot_id,
          },
        },
        {
          $group: {
            _id: "$workerId",
            averageRating: { $avg: "$rating" },
            ratingCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            averageRating: 1,
            ratingCount: 1,
          },
        },
      ];

      const spotAverageRatings = await review_model.aggregate(
        averageRatingPipeline
      );
      const result = spotAverageRatings[0];

      return result;
    } catch (error) {
      console.log(error);
    }
  },
  mailsend: async function (data) {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.authuser,
        pass: process.env.authpassword,
      },
    });

    const mailOptions = {
      from: "taranpreet990401@gmail.com",
      to: data.getEmail.email,
      subject: "Node.js Email Tutorial",
      html: data.message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  },

  SMTP: function (object) {
    console.log(object, "object");
    // return;
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "240c56ba93e1a9",
        pass: "df3eb75176225f",
      },
    });
    // console.log(transporter, "transporter");
    var mailOptions = object;
    console.log(mailOptions, "SADAS>DSA>D>SADA>DAD"); 

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  },

  forgot: async function (link) {
    let tem = `<!DOCTYPE html>
    <html>

    <head>
      <title>Food and Grocery</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
      <style>
        * {
          padding: 0;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          border-collapse: collapse;
        }
      </style>
    </head>

    <body>

      <div style="width: 530px;margin: auto;border-radius: 13px;box-shadow: 0px 0px 3px #ddd;">
        <div style=" text-align: center;padding: 30px 30px;box-sizing: border-box;background: url(https://app.azonwheels.com/images/users/back.png);background-position: bottom right;background-size: cover;">
        <table>
          <tbody>
          <tr>
            <td>
            <div style="background: rgba(255, 255, 255, 0.8); box-sizing: border-box; padding: 22px 30px; border-radius: 50px;box-shadow: 0px 0px 9px #ddd;margin-top: 0px;">
              <p><img src="https://app.azonwheels.com/images/users/logo.png" alt="" style="width: 200px;border-radius: 20px;/! background: #fff; /padding: 20px 10px;margin-bottom: 20px;"> </p>

              <img src="lock.png" alt="" style="width: 80px;border-radius: 20px;margin-bottom: 30px;">			  <table>
              <tbody>
                <tr>
                <td style="padding: 0px 0 15px;">
                  <h3 style="font-size: 27px;color: #ff3008;text-transform: uppercase;margin-top: 0px;">Reset Password </h3>
                </td>
                </tr>
                <tr>
                <td style="padding: 0px 0 0px;color: #000;">If you've lost your password or wish to reset it, use the link to get started.
                </td>
                </tr>
                <tr>
                <td style="padding: 0px 0 0px;color: #fff;"><p> <a href="${link}" target="_blank" class="link c-white" style="display: block; padding: 15px 35px; text-decoration:none; color:#fff;background-image:linear-gradient(#ff3008, #641212);border-radius: 10px;font-weight: bold;font-size: 17px;width: 50%;margin: 0 auto;margin-top: 20px;">
                  Reset your Password
                </a>
              </p>
                </td>
                </tr>


                <tr>
                <td style="padding: 0 0 30px;color: #090909;font-size: 12px;letter-spacing: 2px;font-weight: 600;">Have fun.</td>
                </tr>
              </tbody>
              </table>
            </div>
            </td>
          </tr>
          </tbody>
        </table>

        </div>
        </div>

    </body>

    </html>`;
    return tem;
  },

  notificationData: async (data) => {
    const notificationObj = {
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      type: data.type,
      status: 1,
    };
    const notify = await notification_model.create(notificationObj);
    return notify;
  },

  // send_push_notification: async function (
  //   deviceType,
  //   deviceToken,
  //   // type,
  //   sender_name,
  //   sender_image,
  //   payload,
  //   save_noti_data,
  //   // sender,
  //   ) {
  //   let dataForSend = {
  //   title: 'ibabycoach',
  //   body: payload.message,
  //   message: payload.message,
  //   deviceToken: deviceToken,
  //   deviceType: deviceType,
  //   sender_name: sender_name,
  //   sender_image: sender_image,
  //   notificationType: save_noti_data.type,
  //   userId: save_noti_data.receiver,
  //   user2Id: save_noti_data.sender,
  //   // data: sender,
  //   }

  //   console.log('===ddddd====deviceType', deviceType);
  //   // return

  //   if (deviceType == 1) {

  //   // if (deviceToken != '' && deviceToken != null) {

  //   console.log('---------------1------------------------');
  //   let message = {
  //   to: deviceToken,

  //   data: dataForSend,
  //   notification: dataForSend
  //   };

  //   var serverKey = "AAAAwS9BkG8:APA91bHy4wzjoLwcYEhnDrbt1D1TavsyfKxsGMc3cRmR2Iciq-gxQlahfKq9B-s7nXVPg_cQnFv7nTy0p_cnx9uayMRbBwO2aG4HOB3gfZ0sDnetGOUYjX8IgwvYko-wf6naHzJJKnjm"; //put
  //   var fcm = new FCM(serverKey);
  //   console.log('--message---', message, '---dataForSend---', dataForSend, '--end------');

  //   fcm.send(message, function (err, response) {
  //   if (err) {
  //   console.log("Something has gone wrong!", err);
  //   } else {
  //   console.log("Successfully sent with response: ", response);
  //   }
  //   });

  //   return fcm;
  //   // }
  //   }
  // },

  send_push_notifications: (payLoad) => {
    try {
      if (payLoad && payLoad.device_token && payLoad.device_token != "") {
        var message = {
          to: payLoad.device_token,
          notification: {
            title: "ibabycoach",
            body: payLoad.message,
            content_available: true,
            priority: "high",
            notificationType: payLoad.type,
            sender_name: payLoad.sender_name,
          },
          data: {
            title: "ibabycoach",
            body: payLoad.message,
            content_available: true,
            priority: "high",
            notificationType: payLoad.type,
            sender_name: payLoad.sender_name,
            sender_id: payLoad.sender_id,
            receiver_id: payLoad.receiver_id,
          },
        };

        var serverKey =
          "AAAAwS9BkG8:APA91bHy4wzjoLwcYEhnDrbt1D1TavsyfKxsGMc3cRmR2Iciq-gxQlahfKq9B-s7nXVPg_cQnFv7nTy0p_cnx9uayMRbBwO2aG4HOB3gfZ0sDnetGOUYjX8IgwvYko-wf6naHzJJKnjm"; //put
        var fcm = new FCM(serverKey);

        fcm.send(message, function (err, response) {
          console.log("PUSH.....FCM . SEND............!!!");

          if (err) {
            console.log("Something has gone wrong!", err);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
