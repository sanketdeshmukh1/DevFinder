const userAuth=(req,res,next)=>{
console.log("I am in userAuth middleware")
next() 
}

module.exports={userAuth}