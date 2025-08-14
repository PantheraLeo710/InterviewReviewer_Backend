

const custom_err = (err ,req ,res , next)=>{

    internalerror(err ,res)
    res.status(500).json({
        success : false,
        message : err.message
    })
}

module.exports = custom_err;


const internalerror = (err ,res)=>{
    if(err.name === "internal error" ){
        return res.status(400).json({
            success : false ,
            message : "server error"
        })
    }
}