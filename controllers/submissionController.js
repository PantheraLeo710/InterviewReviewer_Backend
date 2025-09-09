
const Submission = require("../models/Submission");


exports.viewsubmit =async(req ,res)=>{

    let {pages = 1 , limit = 10  } = req.query

        if(!pages  && !limit){
            return res.status(404).json({
                success : false,
                message : "somthing went wrong"
            })
        }

        if(pages < 1)pages = 1
        if(limit < 10)limit = 10

         const skip = (pages - 1)*limit 

         console.log("skip",skip);
         

 try { 
        const subdata = await Submission.find().populate('userId','name email').skip(skip).limit(limit)

        console.log("subdata",subdata);
        
    
        
        if(!subdata || subdata.length === 0){
           return res.status(404).json({
                success : false ,
                message : "not found"
            })
        }

           const totalUser = await Submission.countDocuments();
        
        console.log(totalUser);

        const totalpages = Math.ceil(totalUser / limit)

        res.status(200).json({
            success : true ,
            message:"data fetched",
            pages : totalpages,
            subdata
        })

    } catch (error) {
        console.error("Error fetching submission data:", error);
       return res.status(500).json({
            success : false,
            message : "Internal error on submitton"
        })
    }
}
