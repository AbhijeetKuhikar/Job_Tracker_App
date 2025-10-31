import mongoose from "mongoose";
import bcrypt from "bcrypt";

let addressObject = {
    street: "", city: "", state: "", country: "", pincode: ""
};

let emailObject = {
    companyEmail: "", verified: false
};

let companySchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: Object,
        required: true,
        default: emailObject
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true,
        default: addressObject
    },
    description: {
        type: String,
        default: ""
    },
    postedJobs: {
        type: Array,
        default: []
    },
    verifiedJobs: {
        type: Array,
        default: []
    },
    timeStamp: {
        type: Date,
        default: Date.now()
    }
});

// Hash password before saving
companySchema.pre("save", async function (next) {
    try {
        // Only hash if the password is new or modified
        if (!this.isModified("password")) return next();

        console.log("Original company password:", this.password);

        this.password = await bcrypt.hash(this.password, 10);

        console.log("Company password hashed successfully!");
        next();
    } catch (err) {
        console.log("Error in company pre-save hook:", err);
        next(err);
    }
});

let companyModel = new mongoose.model("companies", companySchema);

export { companyModel };
