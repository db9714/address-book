const router = require("express").Router();
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, EMAIL } = require("../config/keys.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
let sib = require("sendinblue-v3-node-client")("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");

const nodemailer = require("nodemailer");

let fromMail = "no-reply@addressbook.com";
let senderMail = { name: "Address Book", email: "no-reply@addressbook.com" };
let replyTo = { email: "no-reply@addressbook.com", name: "Address Book" };
// auth const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "addressbookByD@gmail.com",
//     pass: "addressByD",
//   },
// });

var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = "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";
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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
            let firstname, lastname;
            firstname = user.name.split(" ")[0];
            lastname = user.name.split(" ")[1];
            let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            sendSmtpEmail.subject = "Welcome to Address Book";
            sendSmtpEmail.templateId = 2;
            sendSmtpEmail.sender = senderMail;
            sendSmtpEmail.to = [{ email: user.email, name: user.name }];
            sendSmtpEmail.replyTo = replyTo;
            sendSmtpEmail.params = { firstname: `${firstname}`, lastname: `${lastname}` };
            apiInstance.sendTransacEmail(sendSmtpEmail).then(
              function (data) {
                console.log("API called successfully. Returned data: " + JSON.stringify(data));
              },
              function (error) {
                console.error(error);
                throw error
              }
            )
            .catch((err1) => {
              console.log(err1);
              throw err1
            });

            res.json({ message: "User created successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      }).catch((err) => {
        console.log(err);
        throw err
      });
    })
    .catch((err) => {
      console.log(err);
      throw err
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
          throw error
        });
    })
    .catch((err) => {
      console.log(err);
      throw err
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
        let firstname, lastname;
        firstname = result.name.split(" ")[0];
        lastname = result.name.split(" ")[1];
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "Forgot Password";
        sendSmtpEmail.templateId = 6;
        sendSmtpEmail.sender = senderMail;
        sendSmtpEmail.to = [{ email: user.email, name: user.full_name }];
        sendSmtpEmail.replyTo = replyTo;
        sendSmtpEmail.params = { firstname: `${firstname}`, lastname: `${lastname}`, token: `${token}` };
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          function (data) {
            console.log("API called successfully. Returned data: " + JSON.stringify(data));
          },
          function (error) {
            console.error(error);
            throw error
          }
        )
        .catch((err1)=>{
          throw err1
        });
        res.json("Password reset link is send on your mail.");
      }).catch((er)=>{
        throw er
      });
    })
    .catch((error) => {
      console.log(error);
      throw error
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
          let firstname, lastname;
          firstname = saveduser.name.split(" ")[0];
          lastname = saveduser.name.split(" ")[1];

          let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.subject = "Your Password is successfully changed";
          sendSmtpEmail.templateId = 8;
          sendSmtpEmail.sender = senderMail;
          sendSmtpEmail.to = [{ email: user.email, name: user.full_name }];
          sendSmtpEmail.replyTo = replyTo;
          sendSmtpEmail.params = { firstname: `${firstname}`, lastname: `${lastname}` };

          apiInstance.sendTransacEmail(sendSmtpEmail).then(
            function (data) {
              console.log("API called successfully. Returned data: " + JSON.stringify(data));
            },
            function (error) {
              console.error(error);
            }
          )
          .catch((err1)=>{
            throw err1
          });
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      throw error
    });
});

// change router.route("/change-password").post((req, res) => {
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
