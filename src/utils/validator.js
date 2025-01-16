
const validator = require("validator")
const validateSignUpData =(req)=>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Missing first name or last name")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please enter correct email Id")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password")
    }
}

module.exports ={
    validateSignUpData
}