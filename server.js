require('dotenv').config()
const path = require('path')
const express = require('express')
const session = require('express-session')
const authRoutes = require('./routes/authenticationRoutes')
const unAvaiblityRoutes = require('./routes/unAvaiblityRoutes')
const appointmentRoutes = require('./routes/appoinmentsRoutes')
const busyTimeRoutes = require('./routes/busyTimesRoute')
const prescriptionRoutes = require('./routes/prescriptionRoutes')
const patientsRoutes = require('./routes/patientsRoutes')
const rendezvousRoutes = require('./routes/rendezvousRoutes')
const cors = require('cors')
const connectToMongoDB = require('./config/db')


const app = express()

app.use(cors())

// database connexion
connectToMongoDB()

const port = process.env.PORT || 5050
// const port =  5050

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', authRoutes)
app.use('/api', unAvaiblityRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/busy-times', busyTimeRoutes)

app.use('/api/prescription' , prescriptionRoutes )
app.use('/api/patient' , patientsRoutes)
app.use('/api/rendezvous' , rendezvousRoutes)
app.use('/api/prescription' , prescriptionRoutes )
app.use('/api/patient' , patientsRoutes)
// serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './', 'client', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send("Please set to production")
  })
}

app.listen(port, () => console.log("The server is running on port : ", port))

// "build": "CI=false react-scripts build",