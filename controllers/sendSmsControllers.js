const axios = require("axios");

const sendSms = async (req, res) => {
  try {
    const { msisdn } = req.body;
    const username = process.env.USERNAMEACCES;
    const password = process.env.PASSWORD;
    const message = `Vous avez fixer le rendez-vous pour le .`

    let data = `username=${username}&password=${password}&msisdn=%2B${msisdn}&msg=${message}&sender=Faju`;
    const response = await axios.post(
      "https://api-public-2.mtarget.fr/messages",
      data,
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );
    console.log(response.data);

    // Envoyer une réponse au client
    res.status(200).json({ success: true, message: "SMS envoyé avec succès" });
  } catch (error) {
    console.error("Erreur:", error.data);

    // Envoyer une réponse d'erreur au client
    res
      .status(500)
      .json({
        success: false,
        message: "Une erreur s'est produite lors de l'envoi du SMS",
      });
  }
};

module.exports = {
  sendSms,
};
