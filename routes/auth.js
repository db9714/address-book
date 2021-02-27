const router = require("express").Router();
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, EMAIL } = require("../config/keys.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

let fromMail = "no-reply@addressbook.com";

// auth
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "addressbookByD@gmail.com",
    pass: "addressByD",
  },
});

router.route("/signup").post((req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }

  UserModel.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "user already exists with that email" });
      }

      bcrypt.hash(password, 12).then((hashedpassword) => {
        const newUser = new UserModel({
          name,
          password: hashedpassword,
          email,
        });

        newUser
          .save()
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: fromMail,
              subject: "signup success",
              html: "<h1>welcome to Address book</h1>",
            });
            res.json({ message: "User created successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/signin").post((req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please provide email and password" });
  }

  UserModel.findOne({ email: email })
    // .select('-password')
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            savedUser.resetToken = token;
            savedUser.save().then((result) => {
              res.json({ token, user: savedUser });
            });
          } else {
            return res.status(422).json({ error: "Invalid Email or password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

router.route("/reset-password").post((req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    UserModel.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "User dont exists with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: fromMail,
          subject: "password reset",
          html: `
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `,
        });
        res.json("Password reset link is send on your mail.");
      });
    });
  });
});

router.route("/new-password").post((req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  UserModel.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          transporter.sendMail({
            to: user.email,
            from: fromMail,
            subject: "Your Password is successfully changed",
            html: `
                      <p>Your Password is successfully changed.</p>
                      `,
          });
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.route("/change-password").post((req, res) => {
//   const newPassword = req.body.password;
//   const sentToken = req.body.token;
//   console.log("a", req.body);
//   UserModel.findOne({ resetToken: sentToken })
//     .then((user) => {
//       if (!user) {
//         return res.status(422).json({ error: "Try again session expired" });
//       }
//       console.log(user, req.body);
//       bcrypt.hash(newPassword, 12).then((hashedpassword) => {
//         user.password = hashedpassword;
//         user.resetToken = undefined;
//         user.expireToken = undefined;
//         user.save().then((saveduser) => {
//           transporter.sendMail({
//             to: user.email,
//             from: fromMail,
//             subject: "Your Password is successfully changed",
//             html: `
//                       <p>Your Password is successfully changed.</p>
//                       `,
//           });
//           res.json({ message: "password updated success" });
//         });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

module.exports = router;
