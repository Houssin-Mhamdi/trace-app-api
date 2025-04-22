const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserById,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
