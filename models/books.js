const mongoose = require('mongoose');


const boooksSchema = new mongoose.Schema({
    title:{
        type : String,
        required:true,
        unique:true,
    },
    author:{
        type :String,
        required:true
    },
    category:{
        type :String,
        required:true
    },
    publish_date:{
        type :String,
        required:true
    },
    copies_available:{
        type :Number,
        required:true
    },
    copies_total:{
        type :Number,
        required:true
    }
}
)
const Books  = mongoose.model("library" , boooksSchema,"library")

module.exports = Books