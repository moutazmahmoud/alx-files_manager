const express = require("express");
const UsersController = require("../controllers/UsersController");
const AuthController = require("../controllers/AuthController");
const FilesController = require("../controllers/FilesController");

const router = express.Router();

// Users
router.post("/users", UsersController.postNew);
router.get("/users/me", UsersController.getMe);

// Authentication
router.get("/connect", AuthController.getConnect);
router.get("/disconnect", AuthController.getDisconnect);

// Files
router.post("/files", FilesController.postUpload);
router.get("/files/:id", FilesController.getShow);
router.get("/files", FilesController.getIndex);

module.exports = router;
