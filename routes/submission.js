const Submission = require('../models/Submission');
const express = require('express')
const router = express.Router();


    router.get('/user/submission/:id',async (req , res)=>{
    const params = req.params.id

    console.log(params);
    

    if(!params){
        return res.status(400).json({
            success : false,
            message : "failed to find id"
        })
    }
    try {
    
        // const getdata = await Submission.find()

        // console.log(getdata);
        

    const filtersubmission = await Submission.find({userId:params});

    console.log(filtersubmission,"filtersubmission");
    
    if(!filtersubmission){
        return res.status(404).json({
            success : false,
            message : "failed to fetch"
        })
    }

    res.status(200).json({
        success : true, 
        message : "fetched successfullyt",
        filtersubmission
    })

    } catch (error) {
        res.status(500).json({
            success : false,        
            message : error.message
        })
    }
})

module.exports = router;







