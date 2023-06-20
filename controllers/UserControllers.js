const UserModel = require('../model/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../config/auth')
require("dotenv").config();
const BusyModel = require('../model/busyTimeModel');
const PrescriptionModel = require('../model/prescriptionModel');


// @desc: dignup
// @route: /api/signup
const signup = async (req, res) => {
    // console.log(res.sendStatus(401));
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            role: "admin"
        }
        // console.log(user)
        const { email } = user
        // console.log(email)
        const findUser = await UserModel.find({ email })
        if (findUser.length) {
            res.status(402).send({ error: "Cet patient exist deja" })
            return
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)

        try {
            const createdUser = await UserModel.create({ ...user, password: hashedPassword })
            res.status(200).json({
                // 'res':user,
                // 'message': "l'inscription est reuissie", 
                token: generateToken(createdUser._id)
            })
        }
        catch (err) {
            res.status(400).json(err)
        }
    // }
}

// @desc: get the user by the token
// @route: /api/user
const getUser = (req, res) => {
    res.json(req.user)
}

// @desc: login
// @route: /api/login
const login = async (req, res) => {
   
        const { email, password } = req.body
        console.log(email, password)
        const user = await UserModel.find({ email })
        // console.log(user[0])


        if (user.length) {
            // check if the given password matches with user password in database
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (!result) {
                    res.status(400).json({ error: "Utilisateur introuvable" })
                    return
                }
                res.status(200).json({
                    token: generateToken(user[0]._id),
                     
                    'reponse': 'la connexion est etabli',
                    'user' : user,
                })
            });
        }
        else {
            res.status(400).json({ error: "L'utilisateur n'existe pas" })
        }
    // }

}

const logout = (req, res) => {
    req.logout()
    req.session.destroy()
}

const editUser = async (req, res) => {
    const id = req.params.id
    const findUser = await UserModel.findById(id)

    if(!findUser){
        res.status(404).json({message: "Utilisateur introuvable"})
        return
    }

    try {
        await UserModel.findByIdAndUpdate(id, {...req.body})
        res.json({message: "Utilisateur modifier"})
    } catch (error) {
        res.status(400).json({message: "une erreur s'est produite"})
    }
}

const getUsers = async (req, res) => {
    const users = await UserModel.find().select("-password")
    res.json(users)
}

const generateToken = (userId) => {
    // return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' })
    return jwt.sign({ userId }, 'kkxsjgshgsyudyusydhsgfdybufdh-r', { expiresIn: '30d' })
}


const AddPatient = async (req , res) => {
    const user = {
        idMedecin : req.body.idMedecin,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        role: "client"
    }
    console.log(req.body);

    // ! Verifier le phone existe
    const { phone } = user

    const findUser = await UserModel.findOne({ phone : phone })
    if(findUser) return res.status(402).json({ error: "L'utilisateur exist deja" })


    // ? HACK PASSWORD 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)

    try {
        const createdUser = await UserModel.create({ ...user, password: hashedPassword })
        return res.status(200).json({data : createdUser , message : "patient ajouté avec success"})
    }
    catch (err) {
        return res.status(400).json(err)
    }
         
}

const getPatient = async (req , res) => {
    try {
        const patient = await UserModel.find({ role: 'client' }).select("-password")
        // const filterPatient = await 
        return res.status(200).json({data : patient , message : 'success'})
    } catch (error)  {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
}

const deletePatients = async (req  , res) => {
    const verifiePatient = await UserModel.findById(req.params.id)
    if(!verifiePatient) return res.status(404).json({message : "Patient introuvable."})

    try {
        const patient = await UserModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({data : patient , message : "Patient supprimé avec success."})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
}

const  updatePatients = async (req , res) => {
    const verifiePatient = await UserModel.findById(req.params.id)
    if(!verifiePatient) return res.status(404).json({message : "Patient introuvable."})

    try {
        const {firstname , lastname , phone , email} = req.body
        const patient = await UserModel.findByIdAndUpdate(verifiePatient , {
            firstname ,
            lastname ,
            phone ,
            email
        },
        {new : true}
        )

        return res.status(200).json({message : "Success" , data : patient })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
}

const detailPatient = async (req , res) => {
    const patientId = req.params.id
    const verifiePatient = await UserModel.findById(patientId)
    if(!verifiePatient) return res.status(404).json({message : "Patient introuvable..."})

    const prescription = await PrescriptionModel.find({patientId : patientId})

    try {
        const detail = await UserModel.findOne({_id : patientId})
        return res.status(200).json({data : detail , prescription : prescription , message : "success"}) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : error.message})
    }
}



module.exports = {
    login,
    signup,
    getUser,
    logout,
    getUsers,
    editUser,
    getPatient,
    deletePatients,
    updatePatients,
    AddPatient,
    detailPatient
}