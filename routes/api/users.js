const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const router = express.Router();
const passport = require("passport");

// Load User
const User = require("../../models/User");
// @route  GET api/users/test
// @desc  tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "User Works" }));

// @route  POST api/users/register
// @desc  Register user
// @access Public
router.post("/register", express.json(), (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: "email already exists",
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm", //Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt
        .genSalt(10)
        .then((salt) => {
          bcrypt
            .hash(newUser.password, salt)
            .then((hash) => {
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  res.json(user);
                  console.log(user);
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  });
});

// @route  POST api/users/login
// @desc  Login user Returning JWT Token
// @access Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        //Check Password
        bcrypt.compare(password, user.password).then((isMatched) => {
          if (isMatched) {
            //User Matched
            const payload = {
              // Create JWT payload
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            };

            //Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            return res.status(400).json({
              password: "Password inccorrect",
            });
          }
        });
      } else {
        return res.status(404).json({ Email: `${email} not found` });
      }
    })
    .catch((err) => console.log(err));
});

// @route  GET api/users/current
// @desc  Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);
module.exports = router;
