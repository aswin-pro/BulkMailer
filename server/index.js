const express = require('express')
const cors = require('cors')
const nodemailer = require("nodemailer"); //nodemailer module to enable email sending functionality in our application.
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://Aswin:123@bulkmailer.gzvte.mongodb.net/bulkmailer?retryWrites=true&w=majority&appName=BulkMailer")
    .then(() => console.log("Connected to DB"))
    .catch(() => console.log("Failed to connect"))

const credential = mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", (req, res) => {

    var msg = req.body.msg
    var emailList = req.body.emailList
    var subject = req.body.sub

    credential.find()
        .then(retdata => {
            const transporter = nodemailer.createTransport({  //createTransport method is used define how the how the email will send
                service: "gmail",    //specifing that we are going to use email services to send the emails
                auth: { //auth object contains the authentication details needed to access to gmail account (for access gmeil account)
                    user: retdata[0].toJSON().user,  //this email address is used to send mail (reterived from db)
                    pass: retdata[0].toJSON().pass,  //app password of the gmail account (reterived from db)
                },
            });

            new Promise(async (resolve, reject) => {
                try {
                    for (var i = 0; i < emailList.length; i++) {
                        await transporter.sendMail({   //this method is used to send mail
                            from: "aswinramesh2016@gmail.com",
                            to: emailList[i],
                            subject: subject,
                            text: msg
                        },
                        )
                        console.log("Email sent to:" + emailList[i])
                    }
                    resolve("Success")
                } catch (error) {
                    reject("Failed")
                }
            }).then(() => res.status(200).send(true))
                .catch(() => res.status(500).send(false))


        })
        .catch(err => console.log(err.message))
})


app.listen(5000, () => {
    console.log("Server Started...")
})

