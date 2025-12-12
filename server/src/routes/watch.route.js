import express from "express";
import tokenMiddleware from "../middlewares/token.middleware.js";
import watchController from "../controllers/watch.controller.js";

const router = express.Router();

router.post("/add", tokenMiddleware.auth, watchController.add);
router.get("/history", tokenMiddleware.auth, watchController.getHistory);

export default router;
