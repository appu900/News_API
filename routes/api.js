import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import authMiddleWare from "../middleware/Authenticate.js";
import ProfileController from "../controller/ProfileController.js";
import NewsController from "../controller/NewsController.js";
const router = Router();

// * auth routes

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// * profile routes

router.get("/profile", authMiddleWare, ProfileController.index);
router.put("/profile/:id", authMiddleWare, ProfileController.update);

// * news routes

router.get("/news", NewsController.index);
router.get("/news/:id", NewsController.show);
router.post("/news", authMiddleWare, NewsController.store);
router.put("/news/:id", authMiddleWare, NewsController.update);
router.delete("/news/:id", authMiddleWare, NewsController.destroy);

export default router;
