const express = require("express");
const router = express.Router();
const {
  importExcel,
  getFilteredTraces,
  createTrace,
  getTraceById,
  editTrace,
  deleteTrace
} = require("../controllers/traceController");

router.post("/import", importExcel);
router.get("/", getFilteredTraces);
// Create a new trace
router.post("/", createTrace);
// Get a trace by ID
router.get("/:id", getTraceById);

// Edit a trace
router.put("/:id", editTrace);
// Delete a trace
router.delete('/:id',deleteTrace);

module.exports = router;    
