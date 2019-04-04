const express = require('express');
const router = express.Router();
const nodeMailer = require("nodemailer");
const config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sendEmail', async (req, res, next) => {
   try {
       let transporter = nodeMailer.createTransport({
           host: config.host,
           port: config.port,
           auth: {
               user: config.user,
               pass: config.pass
           }
       });

       // setup email data with unicode symbols
       let mailOptions = req.body.mailOptions;

       // send mail with defined transport object
       let info = await transporter.sendMail(mailOptions);

       console.log("Message sent: %s", info.messageId);
       // Preview only available when sending through an Ethereal account
       //console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
       res.status(200).send({data:info});
   } catch (e) {
       res.status(500).send({err:e});
   }
});

module.exports = router;
