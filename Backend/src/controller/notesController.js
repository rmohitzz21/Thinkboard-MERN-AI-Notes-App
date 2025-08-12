
import { getSummaryFromPerplexity } from "../ai/perplexity.js";
import Note from "../models/Notes.js";

export async function getNotes(req,res){
    
    try {
        const notes = await Note.find().sort({createdAt: -1}); // -1 for descending order newest first
        res.status(200).json(notes);

    } catch (error) {
        console.log("Error : ",error);
        res.status(500).json({message: "Error fetching notes", error: error.message});
    }
    // res.status(200).send("You Just Fetched The Notes");
}

export async function createNotes (req,res)  {
    try {
        const {title, content} = req.body;
        if(!title || !content){
            return res.status(400).json({message: "Title and content are required"});

        }

        const summary = await getSummaryFromPerplexity(content) || "Summary unavailable";


        const NewNote = new Note({title, content, summary});

        await NewNote.save()
        res.status(201).json({message: "Note Created Successfully", note: NewNote});    
    } catch (error) {
        
    }
}

export async function updateNotes(req,res) {
    // res.status(200).json({message : "Note Updated Successfully"});
    try {

        const { title, content } = req.body;
       const updateNote =  await Note.findByIdAndUpdate(req.params.id,{title, content},{
        new : true
       })
       if(!updateNote){
            return res.status(404).json({message: "Note not found"});
       }

        res.status(200).json({message: "Note Updated Successfully"});

    } catch (error) {
        
        console.log("Error : ", error);
        res.status(500).json({message: "Error updating note", error: error.message});

    }
  

}

export async function deleteNotes(req,res) {
    try {
        
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote){
            return res.status(404).json({message: "Note not found"});
        }
        res.json({message: "Note Deleted Successfully", note: deletedNote});

    } catch (error) {
        console.log("Error : ", error);
        res.status(500).json({message: "Error deleting note", error: error.message});
    }
}

export async function getNoteById(req,res){
    try {
        const note = await Note.findById(req.params.id);

        if(!note) return res.status(404).json({
            message: "Note Not Found"
        });
        res.json(note); 
    } catch (error) {
        
        console.error("Error in GetNoteById controoler",error);
        res.status(500).json({message : "Internal server Error"});
    }
}