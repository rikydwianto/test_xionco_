require("dotenv").config();
const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const FileStore = require("session-file-store")(session);

const expressLayouts = require("express-ejs-layouts");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Untuk parsing form
app.use(
  session({
    store: new FileStore({}),
    secret: "dljfhdklfhdofjhl",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    },
  })
);
app.use((req, res, next) => {
  res.locals.nama_halaman = "";
  res.locals.active = "";
  next();
});

// Set EJS sebagai view engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout/main-layout"); // Default layout
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const viewRoutes = require("./routes/viewRoutes");
const apiRoutes = require("./routes/apiRoutes");

app.use("/", viewRoutes); // render EJS
app.use("/api", apiRoutes); // JSON API

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
