const uuidv4 = require('uuid').v4;
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const UserModel = require('../Model/userModel');
require('dotenv').config();

// Regular expression for validating UUIDs
const uuidRegex = /^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i;

// Mapping MIME types to file types
const supportedTypes = {
    'image/jpeg': 'images',
    'image/png': 'images',
    'application/pdf': 'pdf',
    'application/msword': 'docs',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docs',
    'audio/mpeg': 'audio',
    'video/mp4': 'video'
};

// Function to determine file type based on MIME type
const getFileType = function (mimeType) {
    return supportedTypes[mimeType] || null;
};

const failed = async function (res, message = "") {
    message = typeof message === "object" ? (message.message ? message.message : "") : message;
    return res.status(200).json({
        success: false,
        code: 200,
        message: message,
        body: {},
    });
};

// Exporting an object containing uploadFile function
module.exports = {
    // Function to handle file uploads
    uploadFile: async function (req, res) {
        try {
            // Extracting uploaded files from request object
            const files = Array.isArray(req.files.file) ? req?.files?.file : [req?.files?.file];
            // Iterating over each file
            const uploadResults = await Promise.all(files.map(async function (file) {
                if (!file) {
                    return {
                        success: false,
                        message: 'No file uploaded'
                    };
                };
                // Determining file type based on MIME type
                const fileType = getFileType(file.mimetype);
                if (!fileType) {
                    return {
                        success: false,
                        message: 'Invalid file type'
                    };
                };
                // Creating upload directory if it doesn't exist
                const uploadDir = path.join(path.resolve(), '/public/', fileType);
                const isDirExist = fs.existsSync(uploadDir);
                if (!isDirExist) fs.mkdirSync(uploadDir);
                // Generating unique file name
                const fileNameUnic = uuidv4() + '-' + file.name;
                const fileBasePath = fileType + '/' + fileNameUnic;
                // Constructing file path
                const filePath = path.join(uploadDir, fileNameUnic);
                // Moving the file to the specified path
                await file.mv(filePath);
                return {
                    success: true,
                    fileUrl: process.env.BASE_URL + '/' + fileBasePath
                };
            }));

            // Filtering successfully uploaded files and failed uploads
            const successUploads = uploadResults.filter(function (result) {
                return result.success;
            });
            const failedUploads = uploadResults.filter(function (result) {
                return !result.success;
            });


            // Responding with appropriate status and messages
            if (failedUploads.length > 0) {
                return res.status(400).send({
                    message: 'Some files failed to upload',
                    success: false,
                    failedUploads: failedUploads.map(function (upload) {
                        return upload.message;
                    })
                });
            }

            return res.status(200).send({
                message: 'All files uploaded successfully',
                success: true,
                uploadedFiles: successUploads.map(function (upload) {
                    return upload.fileUrl;
                })
            });

        } catch (error) {
            console.log(error);
            return failed(res, "Internal server error", error);
        }
    },

    catchServerError: async function (err, req, res, next) {
        try {
            if (err) {
                if (err.statusCode) {
                    return res.status(err.statusCode).send(err);
                } else throw err;
            }
        } catch (err) {
            console.log("err : -", err);
            return res.status(501).send({
                statusCode: 501,
                message: "Internal server error",
                // body: {
                //     apiVersion: apiVersion,
                //     apiType: apiType,
                //     apiDoc: apiDoc,
                //     info: "We are unable for handdle this request at this time",
                // },
            });
        }
    },

    TryCatchHanddler: function (fun) {
        return async function (req, res, next) {
            try {
                await fun(req, res, next);
            } catch (err) {
                console.error(err);
                const errorResponse = {
                    message: err.message || "Internal server error",
                    statusCode: err.statusCode || 500,
                    body: {}
                };
                return res.status(errorResponse.statusCode).send(errorResponse);
            }
        };
    },

    dataValidator: function (validationSchema, data) {
        try {
            let validation = validationSchema.validate(data);
            if (validation.error) {
                let message = validation.error.details[0].message;
                message = message.split(" ");
                message[0] = message[0].split('"')[1];
                let erroeMessage = "";
                message.map(function (w) {
                    erroeMessage += ' ' + w;
                });
                throw {
                    message: erroeMessage.trim(),
                    statusCode: 400
                };
            }
            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    success: async function (res, message = "", body = {}) {
        return res.status(200).json({
            success: true,
            code: 200,
            message: message,
            body: body,
        })
    },

    failed: failed,

    AsyncHanddle: function (fn) {
        return async function (req, res, next) {
            try {
                await fn(req, res, next);
            } catch (err) {
                console.log("error: -", err);
                let errorMEssage = "";
                if (typeof err == 'string') errorMEssage = err;
                if (typeof err == 'object') errorMEssage = err;
                return failed(res, errorMEssage);
            }
        };
    },

    asyncMiddleware: async function (req, res, next) {
        try {
            const SECRET_KEY = req.headers['secret_key'];
            const PUBLISH_KEY = req.headers['publish_key'];
            if (process.env.SECRET_KEY === SECRET_KEY &&
                process.env.PUBLISH_KEY === PUBLISH_KEY) {
                next();
            } else {
                return res.status(404).send({
                    message: "key is not macth"
                });
            }

        } catch (error) {
            console.log(error);
        }
    },

    authenticateToken: async function (req, res, next) {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader.split(' ')[1];
            if (!token) {
                return failed(res, "Unauthorized");
            }
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const isValidUser = await UserModel.findOne({
                _id: decodedToken._id
            });
            if (!isValidUser) {
                return failed(res, "Invalid token");
            }
            req.user = isValidUser;
            next();
        } catch (error) {
            console.log(error);
            return failed(res, "Invalid token");
        }
    }
};
