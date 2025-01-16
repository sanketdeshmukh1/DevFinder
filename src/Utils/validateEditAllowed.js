const validateEditAllowed=(req)=>{
    const allowed_update=["photoUrl","age","city"]
    const result=Object.keys(req.body).every(k=>allowed_update.includes(k))
    return result

}

module.exports=validateEditAllowed