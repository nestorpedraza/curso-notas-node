const router = require("express").Router();
const User = require("../models/Users");
const passport = require("passport");

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

router.post(
  "/users/signin",
  passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
  })
);

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
  const { nombre, email, password, confirm_password } = req.body;
  const errors = [];
  if (password != confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden" });
  }

  if (nombre.length <= 0) {
    errors.push({ text: "El Nombre no puede estar vacio" });
  }

  if (email.length <= 0) {
    errors.push({ text: "El email no puede estar vacio" });
  }

  if (password.length <= 0) {
    errors.push({ text: "La contraseña no puede estar vacia" });
  } else if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener por lo menos 4 caracteres" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      nombre,
      email,
      password,
      confirm_password
    });
  } else {
    const emailUser = await User.findOne({ email: email });

    if (emailUser) {
      req.flash("error_msg", "Este email ya esta registrado");
      res.redirect("/users/signup");
    } else {
      const newUser = new User({ nombre, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "Usuario registrado");
      res.redirect("/users/signin");
    }
  }
});

router.get("/users/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
