import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { avatarUpload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/profile", getProfile);
router.put("/profile", avatarUpload.single("avatar"), updateProfile);

export default router;