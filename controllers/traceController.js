const Trace = require("../models/Trace");

const multer = require("multer");
const xlsx = require("xlsx");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // Files will be temporarily stored in the "uploads" folder

// Import Excel file and save traces
exports.importExcel = [
  upload.single("file"), // Middleware to handle single file upload
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Read the uploaded file
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheet = workbook.Sheets[sheetName];

      // Parse the sheet into JSON
      const traces = xlsx.utils.sheet_to_json(sheet);

      // Validate and save each trace to the database
      const savedTraces = [];
      for (const traceData of traces) {
        const { numSerie, operation, trace, date } = traceData;

        if (!numSerie || !operation  || !date) {
          console.warn("Skipping invalid trace:", traceData);
          continue; // Skip invalid entries
        }

        const newTrace = new Trace({ numSerie, operation, date });
        await newTrace.save();
        savedTraces.push(newTrace);
      }

      res.json({
        message: "Excel import successful",
        traces: savedTraces,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to import Excel file" });
    }
  },
];

// Get filtered traces
exports.getFilteredTraces = async (req, res) => {
  const { numSerie, operation, trace, startDate, endDate } = req.query;

  const filters = {};

  // Use regex for partial matches on numSerie and operation
  if (numSerie) {
    filters.numSerie = { $regex: new RegExp(numSerie, "i") }; // "i" makes it case-insensitive
  }
  if (operation) {
    filters.operation = { $regex: new RegExp(operation, "i") }; // Case-insensitive regex
  }

  if (trace) {
    filters.trace = { $regex: new RegExp(trace, "i") }; // Case-insensitive regex
  }

  // Date range filter
  if (startDate && endDate) {
    filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const traces = await Trace.find(filters);
    res.json(traces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch traces" });
  }
};
// Create a new trace
exports.createTrace = async (req, res) => {
  const { numSerie, operation, trace, date } = req.body;

  try {
    const newTrace = new Trace({ numSerie, operation, trace, date });
    await newTrace.save();
    res
      .status(201)
      .json({ message: "Trace created successfully", trace: newTrace });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create trace" });
  }
};

// Get a trace by ID
exports.getTraceById = async (req, res) => {
  try {
    const trace = await Trace.findById(req.params.id);
    if (!trace) {
      return res.status(404).json({ message: "Trace not found" });
    }
    res.json(trace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch trace" });
  }
};

// Edit a trace
exports.editTrace = async (req, res) => {
  const { numSerie, operation, trace, date } = req.body;

  try {
    const updatedTrace = await Trace.findByIdAndUpdate(
      req.params.id,
      { numSerie, operation, trace, date },
      { new: true } // Return the updated document
    );

    if (!updatedTrace) {
      return res.status(404).json({ message: "Trace not found" });
    }

    res.json({ message: "Trace updated successfully", trace: updatedTrace });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update trace" });
  }
};

// Delete a trace
exports.deleteTrace = async (req, res) => {
  try {
    const deletedTrace = await Trace.findByIdAndDelete(req.params.id);

    if (!deletedTrace) {
      return res.status(404).json({ message: "Trace not found" });
    }

    res.json({ message: "Trace deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete trace" });
  }
};
