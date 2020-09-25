const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org/?format=json', (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      callback(null, JSON.parse(body)['ip']);
    }
  });
};


const fetchCoordsByIP = function(ipString, callback) {
  request(`https://ipvigilante.com/${ipString}`, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP adress . Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      let parsedBodyData = JSON.parse(body).data;
      let latitude = parsedBodyData.latitude;
      let longitude = parsedBodyData.longitude;
      let data = {
        latitude,
        longitude
      };
      callback(null, data);
    }
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching risetimes & duration for coordinates . Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      let parsedBodyResponse = JSON.parse(body).response;
      callback(null, parsedBodyResponse);
    }
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) {
          callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };
