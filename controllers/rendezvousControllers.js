const UserModel = require("../model/UserModel")
const RendezvousModel = require("../model/rendezvousModel")
const addRendezvous = async (req , res) => {
     // const userId = req.params.id
     const {patientId  , userId  } = req.body


     // ! Verifier si utilisateur qui a effectué la requéte existe
     const user = await UserModel.findById(userId)
     if(!user) res.status(404).json({message : "L'utilisateur est introuvable."})
 
     const findPatient = await UserModel.findOne({ _id: patientId })
     if(!findPatient) res.status(404).json({message : "Patient improuvable."})
    try {
        const {nomCompletPatient, dateRendezvous,description, patientId  , userId} = req.body
        console.log(req.body);

        const rendezvous = await RendezvousModel.create({
            nomCompletPatient, 
            dateRendezvous,
            description,
            patientId,
            userId,
            dataPatient: findPatient
        })
        
        return res.status(200).json({data : rendezvous , message : "Rendez vous programmeé avec success."})

    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
}
const getRendezvous = async (req , res) => {
    try {
        const rendezvous = await RendezvousModel.find()
        res.status(200).json({data : rendezvous , message : "Rendez vous recuperée avec success."})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
}
const updateRendezvous = async (req , res) => {
    const {nomCompletPatient, dateRendezvous, description, patientId} = req.body;
    // const Id = req.params.id
 
    const userId = req.params.id

    const findPatient = await UserModel.findOne({ _id: patientId })
    const rv = await RendezvousModel.findById(req.params.id);
    if(!findPatient) res.status(404).json({message : "Patient improuvable."})
    if(!rv) return res.status(404).json("La rendez vous est introuvable")
    try {
        const rendezvous = await RendezvousModel.findByIdAndUpdate(
            req.params.id , 
            { nomCompletPatient, dateRendezvous, description,patientId, dataPatient : findPatient },
            { new : true }
        );
        return res.status(200).json({data : rendezvous , message : 'rendez vous modifié avec success.'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
    // console.log(rv);

    //  RendezvousModel.findOne({ _id: req.params.id })
    // .then(thing => res.status(200).json(thing))
    // .catch(error => res.status(404).json({ error }));





    // ! Verifier si utilisateur qui a effectué la requéte existe
    // const user = await UserModel.findById(userId)
    // if(!user) res.status(404).json({message : "L'utilisateur est introuvable."})

    // try {
    //         const prescription = await prescriptionModel.create({
    //             patientId ,
    //             userId ,
    //             description
    //         })
    //         return res.json({data : prescription , message : 'Prescription ajoutée avec success.' } )
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({message : error.message})
    // }
    
}
const deleteRendezvous = async (req , res) => {

    const verifieRendewvous = await RendezvousModel.findById(req.params.id)
    if(!verifieRendewvous) return res.status(404).json({message : "Rendez vous introuvable."})
    // console.log(req.body);

    try {
        const rendezvous = await RendezvousModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({data : rendezvous , message : "Rendez vous supprimé avec success."})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
}

module.exports = {addRendezvous, getRendezvous, updateRendezvous, deleteRendezvous}