import { Router } from "express";

import multer from "multer";
import multerConfig from "./config/multer";

import AvatarController from "./app/controllers/AvatarController";
import NotificationController from "./app/controllers/NotificationController";
import PerformerController from "./app/controllers/PerformerController";
import SessionController from "./app/controllers/SessionController";
import UserController from "./app/controllers/UserController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

// ROTAS PÚBLICAS
routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

// ROTAS PRIVADAS
routes.use(authMiddleware);

// Users
routes.put("/users", UserController.update);
routes.get("/users/:id?", UserController.index);

// Performers
routes.get("/performers", PerformerController.index);

// Notifications
routes.post("/notifications", NotificationController.store);
routes.put("/notifications/:id", NotificationController.update);
routes.get("/notifications/:id", NotificationController.index);

// Files
routes.post("/files", upload.single("file"), AvatarController.store);

export default routes;
