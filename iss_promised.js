const { initParams } = require('request');
const request = require('request-promise-native');

const fetchMyIP = function() {
  // use request to fetch IP address from JSON API
  return request('https://api.ipify.org/?format=json');
};


const fetchCoordsByIP = function(body) {
  const ipString = JSON.parse(body).ip;
  return request(`https://ipvigilante.com/${ipString}`);
};


const fetchISSFlyOverTimes = function(body) {
  const coords = JSON.parse(body).data;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`);
};

const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };