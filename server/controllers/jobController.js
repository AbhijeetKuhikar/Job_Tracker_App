import { companyModel } from "../models/companySchema.js";
import { jobModel } from "../models/jobSchema.js";
import { userModel } from "../models/userSchema.js";
import mongoose from "mongoose";

// ✅ Test route
const test = (req, res) => res.status(200).json({ message: "Job routes working fine!" });

// ✅ Create a Job
const createJob = async (req, res) => {
    try {
        const { companyEmail } = req;
        const company = await companyModel.findOne({ "email.userEmail": companyEmail });

        if (!company) throw "Invalid request. Please login as company.";

        const { title, jobRequirements } = req.body;
        if (!title || !jobRequirements) throw "Missing job data!";

        const { type, category, exprience, location, postDate, offeredSalary, description } =
            jobRequirements;

        if (!type || !category || !exprience || !location || !postDate || !offeredSalary || !description)
            throw "Invalid job requirements!";

        const newJob = new jobModel({
            title,
            jobCreatedBy: company._id,
            jobRequirements,
        });

        const savedJob = await newJob.save();

        await companyModel.findByIdAndUpdate(company._id, {
            $push: { createJobs: savedJob._id },
        });

        res.status(201).json({ message: "Job created successfully!", jobId: savedJob._id });
    } catch (err) {
        console.error("Create Job Error:", err);
        res.status(400).json({ message: "Unable to create job!", error: err });
    }
};

// ✅ Handle Job Actions (Delete / Close)
const handleJobAction = async (req, res) => {
    try {
        const { companyEmail } = req;
        const { jobId, action } = req.params;

        const company = await companyModel.findOne({ "email.userEmail": companyEmail });
        if (!company) throw "Invalid request. Please login as company.";

        if (!mongoose.Types.ObjectId.isValid(jobId)) throw "Invalid job ID!";

        if (action === "delete") {
            const deletedJob = await jobModel.findByIdAndDelete(jobId);
            if (!deletedJob) throw "Unable to delete job.";

            await companyModel.findByIdAndUpdate(company._id, {
                $pull: { createJobs: jobId },
            });

            await userModel.updateMany(
                { appliedJobs: jobId },
                { $pull: { appliedJobs: jobId } }
            );

            res.status(200).json({ message: "Job deleted successfully!" });
        } else if (action === "close") {
            const updatedJob = await jobModel.findByIdAndUpdate(
                jobId,
                { $set: { closed: true } },
                { new: true }
            );
            if (!updatedJob) throw "Unable to close job.";

            res.status(200).json({ message: "Job closed successfully!" });
        } else {
            throw "Invalid job action!";
        }
    } catch (err) {
        console.error("Job Action Error:", err);
        res.status(400).json({ message: "Job action failed!", error: err });
    }
};

// ✅ Apply for a Job (User)
const handleJobApplication = async (req, res) => {
    try {
        const { userEmail } = req;
        const { jobId } = req.params;

        const user = await userModel.findOne({ "email.userEmail": userEmail });
        if (!user) throw "User not logged in.";

        const job = await jobModel.findById(jobId);
        if (!job) throw "Job not found!";
        if (job.closed) throw "This job is closed!";

        await jobModel.findByIdAndUpdate(jobId, {
            $addToSet: { applications: user._id },
        });

        await userModel.findByIdAndUpdate(user._id, {
            $addToSet: { appliedJobs: jobId },
        });

        res.status(200).json({ message: "Applied for job successfully!" });
    } catch (err) {
        console.error("Job Application Error:", err);
        res.status(400).json({ message: "Unable to apply for this job!", error: err });
    }
};

// ✅ Get All Jobs (with filters)
const getJobData = async (req, res) => {
    try {
        const filters = req.query || {};
        const jobs = await jobModel.find(filters).populate("jobCreatedBy", "companyDetails.name email.userEmail");
        res.status(200).json({ message: "Jobs fetched successfully!", jobs });
    } catch (err) {
        console.error("Get Job Data Error:", err);
        res.status(500).json({ message: "Unable to fetch jobs!", error: err });
    }
};

export { test, createJob, handleJobAction, handleJobApplication, getJobData };
