const express = require('express');
const router = express.Router();
const nodeMailer = require("nodemailer");
const config = require('../config/config');
const logger = require('log4js').getLogger("index");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/sendEmail', async (req, res, next) => {
    try {
        //基本配置
        let transporter = nodeMailer.createTransport({
            host: config.host,
            port: config.port,
            auth: {
                user: config.user,
                pass: config.pass
            }
        });
        logger.info('请求参数:', JSON.stringify(req.body));

        //判断请求体中是否存在发送邮件的必要参数,不存在直接返回错误
        if (!req.body.mailOptions) {
            logger.error('本次请求缺失配置参数!');
            res.status(500).send({errMsg: "缺失邮件配置参数"});
            return;
        }
        let mailOptions = JSON.parse(req.body.mailOptions);

        //调用发送邮件的方法
        let info = await transporter.sendMail(mailOptions);

        logger.info('邮件服务器返回信息:', info);

        res.status(200).send({data: info});
    } catch (e) {
        logger.error(e);
        res.status(500).send({errMsg: "服务器错误!"});
    }
});

module.exports = router;
