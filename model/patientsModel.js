const mongoose = require("mongoose");

const patientsModel = mongoose.Schema({
  CIN: {
    type: Number,
    require: [
      false,
      "Vieullez écrire le numéro de carte d'entité du patient .",
    ],
    unique: true,
  },
  lastname: {
    type: String,
    minlength: 3,
    maxlength: 200,
    require: [true, "Vieullez écrire le nom du patient."],
  },
  firstname: {
    type: String,
    minlength: 3,
    maxlength: 200,
    require: [true, "Vieullez écrire le prénom du patient."],
  },
  dateNaissance: {
    type: Date,
    require: [false, "Vieullez écrire la date de naissance du patient."],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: false,
  },
  phone: {
    type: String,
    required: [true, "Vieullez le écrire le numéro de téléphone du patient."],
    unique: true,
    // match: [/^\+(?:[0-9] ?){6,14}[0-9]$/, 'Please enter a valid phone number'],
  },
  adress: {
    type: String,
    require: [true, "Vieullez écrire l'addresse du patient."],
    minlength: 3,
    maxlength: 200,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  idMedecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  password: {
    type: String,
    required: [false, "Please give the password"],
  },
  role: {
    type: String,
  },
});

const PatientModel = mongoose.model("Patient", patientsModel);

module.exports = PatientModel;
