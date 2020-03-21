const express = require('express')
const router = express.Router()
var nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const user = require('../Schema/User')
const team = require('../Schema/Team')



var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mayurgaikwad7474@gmail.com",
    pass: "8149367376"
  }
});

//create the user and give him token as well as bcrypt the password
router.post('/signup', (req, res, next) => {
  user.find({ email: req.body.email }).then(data => {
    if (data.length >= 1) {
      return res.status(409).json({
        message: 'user exists'
      })
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          user.create({
            email: req.body.email,
            password: hash,
          }).then(data => {
            const token = jwt.sign({
              email: data.email,
              userId: data._id
            }, "secret",
              {
                expiresIn: "1h"
              })
            return res.status(200).json({
              message: 'User Created',
              token: token,
            })
          }).catch(err => {
            res.status(500).json({
              error: err
            })
          })
        }
      })
    }
  })
})

//find the user with credentials 
router.post('/login', (req, res, next) => {
  user.find({ email: req.body.email }).then(data => {
    if (data.length < 1) {
      return res.status(401).json({
        message: 'Auth Failed'
      })
    }
    bcrypt.compare(req.body.password, data[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: 'Auth Failed',
        })
      }
      if (result) {
        const token = jwt.sign({
          email: data[0].email,
          userId: data[0]._id
        }, "secret",
          {
            expiresIn: "1h"
          })
        return res.status(200).json({
          message: 'Auth Sucess',
          token: token,
        })
      } return res.status(401).json({
        message: 'Auth Failed'
      })
    })
  })
})

//create the team
router.post('/team', (req, res, next) => {
  team.find({ creator_email: req.body.creator_email }).then(data => {
    if (data.length === 0) {
      team.create(req.body).then(data => {
        res.send("Team created")
      }).catch(err => {
        return res.status(500).json({ error: err })
      })
    } else {
      return res.status(409).json({
        message: 'You already have team'
      })
    }
  })
})


//add the users to the team
router.put('/team/:email', (req, res, next) => {
  user.find({ email: req.body.joiner_email }).then(data => {
    if (data.length >= 1) {
      team.find({ creator_email: req.params.email, peoples: req.body.joiner_email }).then(data => {
        if (data.length === 0) {
          team.updateOne({ creator_email: req.params.email }, { $push: { peoples: req.body.joiner_email } }).then(data => {
            res.send('user added')
          }).catch(err => {
            return res.status(500).json({ error: err })
          })
        } else {
          return res.status(409).json({ message: 'User exists already' })
        }
      })
    } else {
      return res.status(404).json({ message: "User not have account" })
    }
  })
})

router.get('/team/:email', (req, res, next) => {
  team.find({ creator_email: req.params.email }).then(data => {
    res.send(data)
  })
})


//sending mail to the user for joining a team
router.get('/email/:user_email/:sender_email', (req, res, next) => {

  const token = jwt.sign({
    user_email: req.params.user_email,
    sender_email: req.params.sender_email
  }, "secret",
    {
      expiresIn: "24h"
    })

  let mailOptions = {
    from: "mayurgaikwad7474@gmail.com",
    to: req.params.user_email,
    subject: "Join the team of your friend",
    html: `<a href="https://muse-backend.herokuapp.com/user/accept/${token}">JOIN TEAM</h5>`
  }

  user.find({ email: req.params.sender_email }).then(data => {
    if (data.length >= 1) {
      smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
          res.send('failed to send' + err)
        } else {
          res.send(info.response)
        }
      })
    } else {
      return res.status(404).json({ message: "You dont have account" })
    }
  })

})

router.get('/accept/:token', (req, res, next) => {
  var dateNow = new Date();
  var decoded = jwt.decode(req.params.token)

  if (decoded.exp < dateNow.getTime() / 1000) {
    res.send('Token Expired')
  } else {
    user.find({ email: decoded.user_email }).then(data => {
      if (data.length >= 1) {
        team.find({ creator_email: decoded.sender_email, peoples: decoded.user_email }).then(data => {
          if (data.length === 0) {
            team.updateOne({ creator_email: decoded.sender_email }, { $push: { peoples: decoded.user_email } }).then(data => {
              res.redirect(`http://192.168.43.29:3000/`)
            }).catch(err => {
              return res.status(500).json({ error: err })
            })
          } else {
            return res.status(409).json({ message: 'User exists already' })
          }
        })
      } else {
        res.redirect(`http://192.168.43.29:3000/signin/${token}`)
      }
    })
  }
})



module.exports = router




