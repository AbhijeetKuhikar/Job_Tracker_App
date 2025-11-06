import { jobModel } from "../models/jobSchema.js";
import { userModel } from "../models/userSchema.js";
import { companyModel } from "../models/companySchema.js";

// CREATE JOB (Company only)

export const createJob = async (req, res) => {
  try {
    const company_id = req.user.id;
    const { title, description, location, salary, job_type, skills_required, experience_required } = req.body;

    if (!title || !description || !location || !salary || !job_type) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newJob = await jobModel.create({
      company_id,
      title,
      description,
      location,
      salary,
      job_type,
      skills_required,
      experience_required,
      posted_date: new Date(),
    });

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (err) {
    console.error("Error creating job:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL JOBS (Public)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find().populate("company_id", "companyName email");
    res.status(200).json({ jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET JOB BY ID (Public)
export const getJobById = async (req, res) => {
  try {
    const { job_id } = req.params;
    const job = await jobModel.findById(job_id).populate("company_id", "companyName email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ job });
  } catch (err) {
    console.error("Error fetching job:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE JOB (Company only)
export const updateJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const company_id = req.user.id;

    const job = await jobModel.findById(job_id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company_id.toString() !== company_id) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await jobModel.findByIdAndUpdate(job_id, req.body, { new: true });
    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    console.error("Error updating job:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE JOB (Company only)
export const deleteJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const company_id = req.user.id;

    const job = await jobModel.findById(job_id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company_id.toString() !== company_id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await jobModel.findByIdAndDelete(job_id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// APPLY TO JOB (User only)
export const applyToJob = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { job_id } = req.params;

    const job = await jobModel.findById(job_id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Prevent multiple applications
    if (job.applicants.includes(user_id)) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    job.applicants.push(user_id);
    await job.save();

    res.status(200).json({ message: "Applied successfully", job });
  } catch (err) {
    console.error("Error applying to job:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET APPLICANTS (Company only)
export const getApplicantsForJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const company_id = req.user.id;

    const job = await jobModel.findById(job_id).populate("applicants", "name email profile_picture resume");
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company_id.toString() !== company_id) {
      return res.status(403).json({ message: "Not authorized to view applicants" });
    }

    res.status(200).json({ applicants: job.applicants });
  } catch (err) {
    console.error("Error fetching applicants:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
