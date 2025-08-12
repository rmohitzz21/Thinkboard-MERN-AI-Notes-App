import express from 'express';
import { createNotes, deleteNotes, getNoteById, getNotes, updateNotes } from '../controller/notesController.js';

const router  =  express.Router();

router.get("/",getNotes);
router.get("/:id", getNoteById)
router.post("/", createNotes);
router.put("/:id", updateNotes);
router.delete("/:id", deleteNotes);

export default router;