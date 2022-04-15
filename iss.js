const request = require('request');

 const fetchMyIP = function(callback) {
    request('https://api.ipify.org?format=json', (error, response, body) => {
      if (error) return callback(error, null);
  
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
        return;
      }
  
      const ip = JSON.parse(body).ip;
      callback(null, ip);
    });
  };



const fetchCoordsByIP = (ip, callback) => {
    request(`https://freegeoip.app/json/${ip}`, (error, response,  body) => {
      if (error) return callback("There has been an error retrieving the coordinates: " + error, null);
  
      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching the coordinates: ${body}`), null);
        return;
      }

      const ip = JSON.parse(body).ip;


      const fetchISSFlyOverTimes = (coords, callback) => {
        request(`http://api.open-notify.org/iss-pass.json?lat=37.38600&lon=-122.08380`,  (error, resp, body) => {
          if (error) return callback(error,null);
      
          if (resp.statusCode !== 200) {
            callback(Error(`Status Code ${resp.statusCode} when fetching coordinates for IP. Response: ${body}`), null);
            return;
          }
      
          const passes = JSON.parse(body).response;
      
          callback(null, passes);
        });
      };



    const nextISSTimesForMyLocation = function(callback) {
        fetchMyIP((error, ip) => {
          if (error) {
            return callback(error, null);
          }
          fetchCoordsByIP(ip, (error, coords) => {
            if (error) {
              return callback(error, null);
            }
            fetchISSFlyOverTimes(coords, (error, flyover) => {
              if (error) {
                return callback(error, null);
              }
              callback(null, flyover);
            });
          });
});


module.exports = { nextISSTimesForMyLocation };