import express from 'express'
import { addNewAdmin, addNewAttorney, getAllAttorneys, getUserDetails, litigantRegister, loggedoutAdmin, loggedoutLitigant, login } from '../controllers/userController.js';
import {isAdminAuthenticated, isLitigantAuthenticated} from '../middlewares/auth.js'

const router = express.Router();

router.post("/litigant/register", litigantRegister)
router.post("/login", login)
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.get("/attorneys", getAllAttorneys);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/litigant/me", isLitigantAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, loggedoutAdmin);
router.get("/litigant/logout", isLitigantAuthenticated, loggedoutLitigant);
router.post("/Attorney/addnew",isAdminAuthenticated,addNewAttorney)

export default router;