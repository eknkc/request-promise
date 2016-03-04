var Promise = require("bluebird")
var request = require("request")

module.exports = function(options) {
  return new Promise(function(res, rej) {
    var length = 0
      , sizeLimit = options.sizeLimit

    var req = request(options, function (err, response, body) {
      if (err || response.statusCode != 200) {
        err = err || new Error("Response status: " + response.statusCode)
        err.body = body;
        return rej(err);
      }

      res(body);
    }).on("data", function(data) {
      length += data.length;

      if (sizeLimit && length > sizeLimit) {
        req.abort();
        rej(new Error("Response too large."));
      }
    });
  });
};

module.exports.request = request;
