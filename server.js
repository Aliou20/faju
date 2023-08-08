require("dotenv").config();
const path = require("path");
const cron = require("node-cron");
const express = require("express");
// const session = require('express-session')
const authRoutes = require("./routes/authenticationRoutes");
const unAvaiblityRoutes = require("./routes/unAvaiblityRoutes");
const appointmentRoutes = require("./routes/appoinmentsRoutes");
const busyTimeRoutes = require("./routes/busyTimesRoute");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const patientsRoutes = require("./routes/patientsRoutes");
const rendezvousRoutes = require("./routes/rendezvousRoutes");
const sendSmsRoutes = require("./routes/sendSmsRoute");
const { default: axios } = require("axios");
// const moment = require('moment');

// 0 0 * * *

const RendezvousModel = require("./model/rendezvousModel");
const moment = require("moment-timezone");

// cron.schedule("*/15 * * * * *", async () => {
//   try {
//     const timezone = "Africa/Dakar";
//     const maintenant = moment().tz(timezone);
//     const allRendezVous = await RendezvousModel.find({
//       dateRendezvous: { $gt: maintenant.toDate() },
//     });
//     const renderVousDemain = allRendezVous.filter(
//       (renderVous) =>
//         moment(renderVous.dateRendezvous).diff(moment(), "days") === 0
//     );

//     console.log(renderVousDemain);

//     const dateFormat = formatDate(response.dateRendezvous);
//     const username = process.env.USERNAMEACCES;
//     const password = process.env.PASSWORD;

//     const sendRenderVous = renderVousDemain.map((renderVous) => {
//       const message = `Vous avez fixé le rendez-vous pour demain de ${renderVous.heureDebut} à ${renderVous.heureFin}.`;
//       return message;
//     });

//     console.log(sendRenderVous);

//     const smsData = `username=${username}&password=${password}&msisdn=%2B${findPatient.phone}&msg=${message}&sender=Faju`;

// await axios.post("https://api-public-2.mtarget.fr/messages", smsData, {
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   }
// });

// const differenceJours = moment(dateRendezvous).diff(moment(), 'days');

// if(differenceJours === 1) {

// }
//   } catch (error) {}
// });

const username = process.env.USERNAMEACCES;
const password = process.env.PASSWORD;

/**
 *
 */
cron.schedule("0 0 * * *", async () => {
  // Cette expression cron exécute la tâche tous les jours à minuit
  try {
    const timezone = "Africa/Dakar";
    const maintenant = moment().tz(timezone);
    // Ajouter un jour à la date actuelle
    const demain = maintenant.clone().add(1, "days");

    const allRendezVous = await RendezvousModel.find({
      dateRendezvous: {
        $gte: demain.startOf("day").toDate(), // Récupérer les rendez-vous à partir du début de demain
        $lte: demain.endOf("day").toDate(), // jusqu'à la fin de demain
      },
    });

    allRendezVous.length > 0 &&
      allRendezVous.map(async (renderVous) => {
        const message = `Vous avez fixé le rendez-vous pour demain de ${renderVous.heureDebut} à ${renderVous.heureFin}.`;
        const smsData = `username=${username}&password=${password}&msisdn=%2B${renderVous.dataPatient.phone}&msg=${message}&sender=Faju`;
        const sendMessage = await axios.post(
          "https://api-public-2.mtarget.fr/messages",
          smsData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        return sendMessage;
      });
  } catch (error) {
    console.error("Une erreur est survenue:", error);
  }
});

cron.schedule("0 0 * * *", async () => {
  try {
    const timezone = "Africa/Dakar";
    const maintenant = moment().tz(timezone);

    const allRendezVousOfToday = await RendezvousModel.find({
      dateRendezvous: {
        $gte: maintenant.startOf("day").toDate(), // Récupérer les rendez-vous à partir du début de demain
        $lte: maintenant.endOf("day").toDate(), // jusqu'à la fin de demain
      },
    });

    console.log(allRendezVousOfToday);

    // allRendezVousOfToday.length > 0 &&
    //   allRendezVousOfToday.map(async (rendezVous) => {
    //     const message = `Vous avez fixé le rendez-vous pour aujourd'hui de ${rendezVous.heureDebut} à ${rendezVous.heureFin}.`;
    //     const smsData = `username=${username}&password=${password}&msisdn=%2B${rendezVous.dataPatient.phone}&msg=${message}&sender=Faju`;
    //     const sendMessage = await axios.post(
    //       "https://api-public-2.mtarget.fr/messages",
    //       smsData,
    //       {
    //         headers: {
    //           "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //       }
    //     );
    //     return sendMessage;
    //   });
  } catch (error) {}
});

cron.schedule("0 * * * *", async () => {
  // Récupérer l'heure actuelle
  const timezone = "Africa/Dakar";
  const maintenant = moment().tz(timezone);
  const heureDans1Heure = maintenant.clone().add(1, 'hour').format('HH:mm');
  console.log({ heureDans1Heure });

  // const allRendezVousOfToday = await RendezvousModel.find({
  //   dateRendezvous: {
  //     $gte: maintenant.startOf("day").toDate(), // Récupérer les rendez-vous à partir du début de la journée actuelle
  //     $lte: maintenant.endOf("day").toDate(), // jusqu'à la fin de la journée actuelle
  //   },
  //   heureDebut: {
  //     $gte: heureDans1Heure.toString(), // L'heure de début est dans 1 heure ou plus
  //     // $gte : maintenant.toString()
  //   },
  // });


  const allRendezVousOfToday = await RendezvousModel.find({
    dateRendezvous: {
      $gte: maintenant.startOf('day').toDate(),
      $lte: maintenant.endOf('day').toDate(),
    },
    heureDebut: {
      $gte: heureDans1Heure,
    },
  });

  console.log({allRendezVousOfToday});
  

  allRendezVousOfToday.length > 0 &&
    allRendezVousOfToday.map(async (renderVous) => {
      const message = `Notre rendez-vous est fixé dans une heure à ${renderVous.heureDebut}.`;
      const smsData = `username=${username}&password=${password}&msisdn=%2B${renderVous.dataPatient.phone}&msg=${message}&sender=Faju`;
      console.log({smsData});
      // const sendMessage = await axios.post(
      //   "https://api-public-2.mtarget.fr/messages",
      //   smsData,
      //   {
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded",
      //     },
      //   }
      // );
      // return sendMessage;
    });
});

const cors = require("cors");
const connectToMongoDB = require("./config/db");
const { error } = require("console");

const app = express();

app.use(cors());

// database connexion
connectToMongoDB();

const port = process.env.PORT || 5050;
// const port =  5050

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//

app.use("/api", authRoutes);
app.use("/api", unAvaiblityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/busy-times", busyTimeRoutes);

app.use("/api/prescription", prescriptionRoutes);
app.use("/api/patient", patientsRoutes);
app.use("/api/rendezvous", rendezvousRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/patient", patientsRoutes);
app.use("/api/sms", sendSmsRoutes);

// serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "./", "client", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("Please set to production");
  });
}

app.listen(port, () => console.log("The server is running on port : ", port));

// "build": "CI=false react-scripts build",
