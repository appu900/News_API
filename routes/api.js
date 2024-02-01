
import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import authMiddleWare from "../middleware/Authenticate.js";
import ProfileController from "../controller/ProfileController.js";
const router = Router();

// * auth routes

router.post("/auth/register",AuthController.register)
router.post("/auth/login",AuthController.login)

// * profile routes

router.get("/profile",authMiddleWare,ProfileController.index)
router.put("/profile/:id",authMiddleWare,ProfileController.update)


export default router;