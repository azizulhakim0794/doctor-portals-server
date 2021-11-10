const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsgbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortals").collection("appointment");
    const doctorCollection = client.db("doctorsPortals").collection("doctors");
    const PatientsAppointmentCollection = client.db("doctorsPortals").collection("patients");
    app.get('/', (req, res) => {
        res.send("hello from db it's working working")
    })
    // app.post('/addAppointment', (req, res) => {
    //     const appointment = req.body;
    //     appointmentCollection.insertOne(appointment)
    //         .then(result => {
    //             res.send(result.insertedCount > 0)
    //         })
    // });

    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                // console.log(documents)
            })
    })
    app.get('/doctor/:appointmentName', (req, res) => {
        const appointmentId = req.params.appointmentName
        // console.log(appointmentId)
        appointmentCollection.find({ _id: ObjectId(appointmentId) })
            .toArray((err, documents) => {
                res.send(documents[0]);
                // console.log(documents)
            })
    })

    // app.post('/appointmentsByDate', (req, res) => {
    //     const date = req.body;
    //     const email = req.body.email;
    //     doctorCollection.find({ email: email })
    //         .toArray((err, doctors) => {
    //             const filter = { date: date.date }
    //             if (doctors.length === 0) {
    //                 filter.email = email;
    //             }
    //             appointmentCollection.find(filter)
    //                 .toArray((err, documents) => {
    //                     console.log(email, date.date, doctors, documents)
    //                     res.send(documents);
    //                 })
    //         })
    // })

    // app.post('/addADoctor', (req, res) => {
    //     const file = req.files.file;
    //     const name = req.body.name;
    //     const email = req.body.email;
    //     const newImg = file.data;
    //     const encImg = newImg.toString('base64');

    //     var image = {
    //         contentType: file.mimetype,
    //         size: file.size,
    //         img: Buffer.from(encImg, 'base64')
    //     };

    //     doctorCollection.insertOne({ name, email, image })
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // })


    app.post('/patients', (req, res) => {
        const patientsName = req.body.patientsName
        const patientsAge = req.body.patientsAge
        const patientsPhoneNumber = req.body.patientsPhoneNumber
        const email = req.body.email
        const appointmentDate = req.body.appointmentDate
        const appointmentTime = req.body.appointmentTime
        const serviceName = req.body.serviceName
        // console.log({patientsName,patientsPhoneNumber,patientsAge,email,appointmentTime})
        PatientsAppointmentCollection.insertOne({ patientsName, email, patientsPhoneNumber, patientsAge ,appointmentTime,serviceName,appointmentDate })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });
    app.get('/doctors', (req, res) => {
        doctorCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                // console.log(documents)
            })
    });

    app.get('/patients/:email', (req, res) => {
        const email = req.params.email;
        // console.log(email)
        PatientsAppointmentCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.delete('/patients/:deleteId', (req, res) => {
        const id = req.params.deleteId;
        // console.log(id)
        PatientsAppointmentCollection.deleteOne({ _id:ObjectId(id)})
        .then(result => {
            res.send(result.deletedCount > 0);
            // console.log(result.deletedCount > 0)
        })
    })

});


app.listen(process.env.PORT || port)