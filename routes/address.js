const router = require("express").Router();
let Address = require("../models/address.model");
let User = require("../models/user.model");

const requireLogin = require("../middleware/requiredLogin");

// get addresses based on user request
router.route("/").get(requireLogin, (req, res) => {
  Address.find({ createdBy: req.user._id })
    .populate("createdBy")
    .then((posts) => {
      let count = posts.length;
      res.json({ count: count, results: posts.reverse() });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//Route to add a new address

router.route("/create").post((req, res) => {
  //Retrieve data for address
  const { full_name, email, zip_code, street, city, mobile_no, state, createdBy } = req.body;

  User.findById({ _id: createdBy })
    .then((user) => {
      //Create a new Address and save it to DB
      const newAddress = new Address({ full_name, email, zip_code, street, city, mobile_no, state, createdBy: user });

      // Save the new Address
      newAddress
        .save()
        .then(() => res.json(newAddress))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error :" + err));
});

//route to display a particular address
router.route("/:id").get(requireLogin, (req, res) => {
  Address.findById(req.params.id)
    .then((address) => res.json(address))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route to edit a particular address
router.route("/edit/:id").post(requireLogin, (req, res) => {
  Address.findById(req.params.id)
    .then((address) => {
      address.full_name = req.body.full_name;
      address.email = req.body.email;
      address.zip_code = req.body.zip_code;
      address.street = req.body.street;
      address.city = req.body.city;
      address.mobile_no = req.body.mobile_no;
      address.state = req.body.state;

      address
        .save()
        .then(() => res.json(address))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route to Delete a route
router.route("/:id").delete(requireLogin, (req, res) => {
  Address.findByIdAndDelete(req.params.id)
    .then(() => res.json("Address Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
