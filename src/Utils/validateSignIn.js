const validateSignInUser=(user)=>{
    const {age}=user
    if(age<12){
        throw new Error("age must be greater than 12")
    }
}

module.exports={validateSignInUser}