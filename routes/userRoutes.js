const router = require("express").Router();
const UserModel = require("../models/user.model");
const requireLogin = require("../middleware/requiredLogin");

router.route("/").get(requireLogin, (req, res) => {
  UserModel.find()
    // .select("-password")
    .then((users) => {
      res.json({
        count: users.length,
        results: [users],
      });
    })
    .catch((err) => {
      res.status(400).json("Error :" + err);
    });
});

router.route("/:id").get(requireLogin, (req, res) => {
  UserModel.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error :" + err));
});

router.route("/:id").post((req, res) => {
  UserModel.findById(req.params.id)
    .then((user) => {
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user
        .save()
        .then((user_) => res.json(user_))
        .catch((err) => res.status(400).json("Error : " + err));
    })
    .catch((err) => res.status(400).json("Error : " + err));
});

router.route("/:id").delete(requireLogin, (req, res) => {
  UserModel.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted "))
    .catch((err) => res.status(400).json("Error " + err));
});


module.exports = router;
