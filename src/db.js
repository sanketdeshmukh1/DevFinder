const mongoose=require("mongoose")

const dbConnect=async ()=>{
   await mongoose.connect("mongodb+srv://sanket:mongo@cluster-sanket.ldqlp.mongodb.net/devfinder")
}

module.exports={dbConnect}
