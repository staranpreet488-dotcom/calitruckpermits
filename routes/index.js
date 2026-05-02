var express = require('express');   
const AdminController = require('../controller/Admin/AdminController');
const userController = require('../controller/Admin/userController');
const { session } = require('../utility/helper');
const LinkGenController = require('../controller/Admin/LinkGenController');
const DriverController = require('../controller/Admin/DriverController');

let router = express.Router();

router.get("/Driver-exportPdf", AdminController.userListPdf);
router.get('/Driver-List', session, userController.userList);
//<-------------------auth----------------------------------->
router.get('/loginPage', AdminController.loginPage);
router.post('/login', AdminController.login);
router.get('/dashboard', session, AdminController.dashboard);
router.get('/profile', session, AdminController.profile);
router.get('/editprofile', session, AdminController.editprofile);
router.post('/updateAdminProfile', AdminController.updateAdminProfile);
router.get('/changePassword', session, AdminController.changePassword);
router.post('/updatepassword', AdminController.updatepassword);
router.get('/logout', AdminController.logout);
router.get('/errorPage', AdminController.errorPage);


//<-------------------- USER ----------------------------------------->

router.get('/viewUser/:id', session,userController.viewUser);
router.get('/customerList/:id', userController.customerList);
router.get('/teamMemberlist/:id', userController.teamMemberlist);


router.get('/addUser', session, userController.addUser);
router.get('/editUser/:id', session, userController.editUser);
router.post('/createUser', userController.createUser);
router.post('/updateUser', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.post('/userStatus', userController.userStatus);

//<------------------------ Links ------------------------->
router.get('/Link_Create', session,LinkGenController.Link_Create);
router.get('/LinkList', session,LinkGenController.LinkList);
router.put('/deleteList/:id', LinkGenController.deleteList);


router.post('/create_companyLink', LinkGenController.create_companyLink);

// ---------------------------Driver----------------------//
router.get('/:slug', DriverController.slug);

router.post('/:slug/add-driver', DriverController.create_Driver);
router.put('/deleteDriver/:id', LinkGenController.deleteDriver);
router.post('/ClinetStatus', LinkGenController.ClinetStatus);
router.post('/companydocument/:id', DriverController.Companydocument);


router.get('/viewcleint/:id', session,LinkGenController.viewcleint);
router.get('/exportallpdfs/:id', LinkGenController.exportallpdfs);


// router.get('/List', session,userController.List);




module.exports = router;
