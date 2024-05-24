import mongoose from "mongoose";
const dataScheme = mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
            
        }
    },

);

const Data = mongoose.model("password", dataScheme );
export default Data;