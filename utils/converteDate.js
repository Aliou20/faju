const moment = require('moment');
require('moment/locale/fr');

function formatDate(dateStr) {
    moment.locale('fr');
  const date = moment(dateStr);
  const dayOfWeek = date.format('dddd'); // Jour de la semaine
  const day = date.format('DD'); // Jour du mois (deux chiffres)
  const month = date.format('MMMM'); // Nom complet du mois
  const year = date.format('YYYY'); // Année

  return `${dayOfWeek} ${day} ${month} ${year}`;
}


module.exports = formatDate;


