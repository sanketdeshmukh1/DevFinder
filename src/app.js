const express=require("express")

const app=express()

app.use("/name",(req,res)=>{
    res.send("sanket this side")
})

app.listen(4000,()=>{
 console.log("i am listning")
})