import express from "express";
import { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  applyToJob, 
  getApplicantsForJob 
} from "../controllers/jobController.js";
import { AuthUser } from "../middlewares/AuthUser.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";

const jobRouter = express.Router();

// Company creates a new job
jobRouter.post("/create", AuthCompany, createJob);

// Get all jobs (public)
jobRouter.get("/all", getAllJobs);

// Get job by ID (public)
jobRouter.get("/:job_id", getJobById);

// Company updates a job
jobRouter.put("/update/:job_id", AuthCompany, updateJob);

// Company deletes a job
jobRouter.delete("/delete/:job_id", AuthCompany, deleteJob);

// User applies to a job
jobRouter.post("/apply/:job_id", AuthUser, applyToJob);

// Company views applicants
jobRouter.get("/applicants/:job_id", AuthCompany, getApplicantsForJob);

export { jobRouter };
