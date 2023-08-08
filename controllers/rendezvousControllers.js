const { default: axios } = require("axios");
const UserModel = require("../model/UserModel");
const PatientModel = require("../model/patientsModel");
const RendezvousModel = require("../model/rendezvousModel");
const formatDate = require("../utils/converteDate");

// const addRendezvous = async (req, res) => {
//   const {
//     nomCompletPatient,
//     dateRendezvous,
//     description,
//     patientId,
//     userId,
//     heureDebut,
//     heureFin,
//   } = req.body;

//   // ! Verifier si utilisateur qui a effectué la requéte existe
//   const user = await UserModel.findById(userId);
//   if (!user)
//     res.status(404).json({ message: "L'utilisateur est introuvable." });

//   const findPatient = await PatientModel.findOne({ _id: patientId });
//   if (!findPatient) res.status(404).json({ message: "Patient improuvable." });

//   //  ?#########################################
//   const rendezVousDate = new Date(dateRendezvous);
//   const currentDate = new Date();

//   if (rendezVousDate < currentDate) {
//     res.status(400).json({ message: "La date est passé." });
//     return;
//   }

//   if (heureDebut > heureFin) {
//     res
//       .status(400)
//       .json({ message: "Heure debut superieur a l'heure de fin." });
//     return;
//   }

//   // ?####################################################
//   const existingRendezVous = await RendezvousModel.findOne({
//     dateRendezvous: dateRendezvous,
//     heureDebut: { $lte: heureDebut },
//     heureFin: { $gte: heureFin },
//   });

//   if (existingRendezVous) {
//     res.status(400).json({ message: "Cette heure est deja occupeée ." });
//     return;
//   }

//   try {
//     const response = await RendezvousModel.create({
//       nomCompletPatient,
//       dateRendezvous,
//       description,
//       patientId,
//       userId,
//       dataPatient: findPatient,
//       heureDebut,
//       heureFin,
//     });

//     const username = process.env.USERNAMEACCES;
//     const password = process.env.PASSWORD;
//     const message = `Vous avez fixer le rendez-vous pour le ${response.dateRendezvous} de ${heureDebut} à ${heureFin} .`

//     let data = `username=${username}&password=${password}&msisdn=%2B${findPatient.phone}&msg=${message}&sender=Faju`;

//     const sendSms = await axios.post(
//       "https://api-public-2.mtarget.fr/messages",
//       data,
//       {
//         "Content-Type": "application/x-www-form-urlencoded",
//       }
//     );

//     return res
//       .status(200)
//       .json({
//         data: response,
//         message: "Rendez vous programmeé avec success.",
//       });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

const addRendezvous = async (req, res) => {
  const {
    dateRendezvous,
    description,
    patientId,
    userId,
    heureDebut,
    heureFin,
  } = req.body;

  const currentDate = new Date();
  // Vérification des données en amont
  if (
    !userId ||
    !dateRendezvous ||
    !heureDebut ||
    !heureFin
  ) {
    return res.status(400).json({ message: "Données manquantes." });
  }

  try {
    const [user, findPatient, existingRendezVous] = await Promise.all([
      UserModel.findById(userId),
      PatientModel.findOne({ _id: patientId }),
      RendezvousModel.findOne({
        dateRendezvous: dateRendezvous,
        heureDebut: { $lte: heureDebut },
        heureFin: { $gte: heureFin },
      }),
    ]);


    if (!user) {
      return res
        .status(404)
        .json({ message: "L'utilisateur est introuvable." });
    }


    if (!findPatient) {
      return res.status(404).json({ message: "Patient introuvable." });
    }


    if (dateRendezvous < currentDate) {
      return res.status(400).json({ message: "La date est passée." });
    }


    if (heureDebut > heureFin) {
      return res
        .status(400)
        .json({ message: "Heure début supérieure à l'heure de fin." });
    }


    if (existingRendezVous) {
      return res.status(400).json({ message: "Cette heure est déjà occupée." });
    }

    const response = await RendezvousModel.create({
      dateRendezvous,
      description,
      patientId,
      userId,
      dataPatient: findPatient,
      heureDebut,
      heureFin,
    });

    const dateFormat = formatDate(response.dateRendezvous)
    const username = process.env.USERNAMEACCES;
    const password = process.env.PASSWORD;
    const message = `Vous avez fixé le rendez-vous pour le ${dateFormat} de ${heureDebut} à ${heureFin}.`;

    const smsData = `username=${username}&password=${password}&msisdn=%2B${findPatient.phone}&msg=${message}&sender=Faju`;
    
    await axios.post("https://api-public-2.mtarget.fr/messages", smsData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });

    return res.status(200).json({
      data: response,
      message: "Rendez-vous programmé avec succès.",
    });


    
    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getRendezvous = async (req, res) => {
  try {
    const rendezvous = await RendezvousModel.find();
    res.status(200).json({
      data: rendezvous,
      message: "Rendez vous recuperée avec success.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateRendezvous = async (req, res) => {
  const {
    nomCompletPatient,
    dateRendezvous,
    description,
    patientId,
    heureDebut,
    heureFin,
  } = req.body;

  const findPatient = await UserModel.findOne({ _id: patientId });
  const rv = await RendezvousModel.findById(req.params.id);
  if (!findPatient) res.status(404).json({ message: "Patient improuvable." });
  if (!rv) return res.status(404).json("La rendez vous est introuvable");

  //  ?#########################################
  const rendezVousDate = new Date(dateRendezvous);
  const currentDate = new Date();

  if (rendezVousDate < currentDate) {
    res.status(400).json({ message: "La date est passé." });
    return;
  }

  if (heureDebut > heureFin) {
    res
      .status(400)
      .json({ message: "Heure debut superieur a l'heure de fin." });
    return;
  }

  // ?####################################################
  const existingRendezVous = await RendezvousModel.findOne({
    _id: { $ne: rv._id },
    dateRendezvous: dateRendezvous,
    heureDebut: { $lte: heureDebut },
    heureFin: { $gte: heureFin },
  });

  if (existingRendezVous) {
    res.status(400).json({ message: "Cette heure est deja occupeée ." });
    return;
  }

  try {
    const rendezvous = await RendezvousModel.findByIdAndUpdate(
      req.params.id,
      {
        nomCompletPatient,
        dateRendezvous,
        description,
        patientId,
        dataPatient: findPatient,
        heureDebut,
        heureFin,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ data: rendezvous, message: "rendez vous modifié avec success." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteRendezvous = async (req, res) => {
  const verifieRendewvous = await RendezvousModel.findById(req.params.id);
  if (!verifieRendewvous)
    return res.status(404).json({ message: "Rendez vous introuvable." });
  // console.log(req.body);

  try {
    const rendezvous = await RendezvousModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      data: rendezvous,
      message: "Rendez vous supprimé avec success.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addRendezvous,
  getRendezvous,
  updateRendezvous,
  deleteRendezvous,
};
