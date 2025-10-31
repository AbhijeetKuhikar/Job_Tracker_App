import express from "express"
import { 
    test, 
    handleCompanyRegister, 
    handleCompanyOTPVerification, 
    handleCompanyLogin, 
    handleCompanyPasswordResetRequest, 
    handleCompanyOTPForPasswordReset 
} from "../controllers/companyController.js"

let companyRouter = express.Router()

// test route
companyRouter.get("/test", test)

// register new company
companyRouter.post("/register", handleCompanyRegister)

// verify company OTP after registration
companyRouter.post("/verify-otp", handleCompanyOTPVerification)

// company login
companyRouter.post("/login", handleCompanyLogin)

// send OTP for password reset
companyRouter.post("/password-reset-request", handleCompanyPasswordResetRequest)

// verify OTP and reset password
companyRouter.post("/verify-reset-password-request", handleCompanyOTPForPasswordReset)

export { companyRouter }
