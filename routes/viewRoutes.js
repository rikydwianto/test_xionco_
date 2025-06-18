var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const { render } = require("ejs");
require("dotenv").config();
var name = process.env.NAMA_APLIKASI;

function requireLogin(req, res, next) {
  if (!req.session.username || req.session.username === "") {
    return res.redirect("/login");
  }
  next();
}

router.get("/", requireLogin, (req, res) => {
  console.log(req.session);
  res.render("index", {
    title: "Dashboard",
    active: "dashboard",
    nama_halaman: "Dashboard",
    username: req.session.username, // jika perlu
  });
});
router.get("/dashboard", requireLogin, (req, res) => {
  res.render("index", {
    title: "Dashboard| " + name,
    active: "dashboard",
    nama_halaman: "Dashboard",
    username: req.session.username, // jika perlu
  });
});
router.get("/orders", requireLogin, (req, res) => {
  res.render("orders", {
    title: "Order | " + name,
    active: "order",
    nama_halaman: "Halaman Order",
    username: req.session.username, // jika perlu
  });
});
router.get("/products", requireLogin, (req, res) => {
  res.render("products", {
    title: "Products | " + name,
    active: "products",
    nama_halaman: "List Products",
    username: req.session.username, // jika perlu
  });
});
router.get("/transactions", requireLogin, (req, res) => {
  res.render("transactions", {
    title: "Transactions | " + name,
    active: "transactions",
    nama_halaman: "Contoh Pembalian(user) : user id 2",
    username: req.session.username, // jika perlu
  });
});
router.get("/transactions/checkout", requireLogin, (req, res) => {
  res.render("checkout", {
    title: "Checkout | " + name,
    active: "checkout",
    nama_halaman: "Contoh checkout(user) : user id 2",
    username: req.session.username, // jika perlu
  });
});

// AUTHETENTIKASI
router.get("/login", (req, res) => {
  res.render("login", { title: `${name} | Login`, layout: false });
});
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Gagal logout");
    res.redirect("/login");
  });
});
module.exports = router;
