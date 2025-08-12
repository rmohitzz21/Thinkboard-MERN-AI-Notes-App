import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
     summary: {
      type: String,       // AI-generated summary field
      default: "",        // empty string if not yet generated
    },
    


},{timestamps:true})

const Note = mongoose.model("Note",noteSchema);
export default Note;