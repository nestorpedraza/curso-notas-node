const router = require("express").Router();

//const Note = require("../models/Notes");
const Note = require("../models/Note");

const { isAuthenticated } = require("../helpers/auth");

router.get("/notes/add", isAuthenticated, (req, res) => {
  res.render("notes/new-note");
});

router.post("/notes/new-note", isAuthenticated, async (req, res) => {
  const { titulo, descripcion } = req.body;
  const errors = [];
  if (!titulo) {
    errors.push({ text: "Por favor inserta el titulo" });
  }

  if (!descripcion) {
    errors.push({ text: "Por favor inserta la descripcion" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      titulo,
      descripcion
    });
  } else {
    const newNote = new Note({ titulo, descripcion });
    newNote.user = req.user._id;
    await newNote.save();
    req.flash("success_msg", "Nota Guardada!");
    res.redirect("/notes");
  }
});

router.get("/notes", isAuthenticated, async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ fecha: "desc" });
  res.render("notes/all-notes", { notes });
});

router.get("/notes/edit/:id", isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render("notes/edit-note", { note });
});

router.put("/notes/edit-note/:id", isAuthenticated, async (req, res) => {
  const { titulo, descripcion } = req.body;
  await Note.findByIdAndUpdate(req.params.id, {
    titulo,
    descripcion
  });
  req.flash("success_msg", "Nota Editada!");

  res.redirect("/notes");
});

router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Nota Borrada");
  res.redirect("/notes");
});
module.exports = router;
