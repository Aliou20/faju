const PatientModel = require("../model/patientsModel");

const getPatient = async (req, res) => {
  try {
    const patient = await PatientModel.find();
    res
      .status(200)
      .json({ data: patient, message: "Patient ajouté avec success." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getOnePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await PatientModel.findById(id);
    res
      .status(200)
      .json({ data: patient, message: "Patients recupérer avec succes." });
  } catch (error) {
    console.log(res);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite lors de l'envoi du SMS" });
  }
};

const addPatient = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      phone,
      adress,
      email,
      password,
      role,
      idMedecin,
    } = req.body;

    const patient = await PatientModel.create({
      lastname,
      firstname,
      phone,
      adress,
      email,
      password,
      role,
      idMedecin,
    });

    res
      .status(200)
      .json({ data: patient, message: "Patient ajouté avec success." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updatePatient = async (req, res) => {
  const verifiePatient = await PatientModel.findById(req.params.id);
  if (!verifiePatient)
    return res.status(404).json({ message: "Patient introuvable." });

  try {
    const {
      CIN,
      nomPatient,
      prenomPatient,
      dateNaissance,
      gender,
      telephone,
      adress,
      email,
    } = req.body;

    console.log(req.body);

    const patient = await PatientModel.findByIdAndUpdate(
      req.params.id,
      {
        CIN,
        nomPatient,
        prenomPatient,
        dateNaissance,
        gender,
        telephone,
        adress,
        email,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Patient ajouté avec success.", data: patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deletePatient = async (req, res) => {
  const verifiePatient = await PatientModel.findById(req.params.id);
  if (!verifiePatient)
    return res.status(404).json({ message: "Patient introuvable." });
  console.log(req.body);

  try {
    const patient = await PatientModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ data: patient, message: "Patient supprimé avec success." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPatient,
  addPatient,
  updatePatient,
  deletePatient,
  getOnePatient,
};
