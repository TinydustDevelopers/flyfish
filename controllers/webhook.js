var exec = require('child_process').exec;
var execFile = require('child_process').execFile;

var config = require('../config/index.js');

var Container = require('../models/container.js');
var User = require('../models/user.js');

module.exports = {
  'container': function (req, res, next) {
    var containerName = req.params.containerName;
    var body = req.body;
    var repositoryBranch = body.ref;
    var containerUrl = config.server.host + '/webhook/container/' + containerName;

    if (repositoryBranch == 'refs/heads/master') {
      Container.getFromMongodbByUrl(containerUrl, function (error, container) {
        if (error) {
          console.log(error);
          return res.redirect('/internal_error');
        }

        User.getById(container.user_id, function (error, user) {
          if (error) {
            console.log(error);
            return res.redirect('/internal_error');
          }

          var repositoryLocation = config.repository.location + '/' + user.username + '/' + container.name;
          var repositoryCloneUrl = body.repository.clone_url;
          execFile('./scripts/pull.sh', [repositoryLocation, repositoryCloneUrl], function (error, stdout, stderr) {
            if (error) {
              console.log(error);
              return res.redirect('/internal_error');
            }

            var index = repositoryCloneUrl.indexOf('.git');
            if (stderr.indexOf(repositoryCloneUrl.slice(0, index)) == -1) {
              console.log('stderr: ' + stderr);
              return res.redirect('/internal_error');
            }

            console.log('stdout: ' + stdout);

            var command = 'docker run --name ' + container.name + ' -d -v ' + repositoryLocation + ':/code -p 30000:3000 ' + container.image_name + ' /bin/bash -c "' + container.command + '"';
            console.log(command);
            exec(command, function (error, stdout, stderr) {
              if (error) {
                console.log(error);
                return res.redirect('/internal_error');
              }

              if (stderr) {
                console.log('stderr: ' + stderr);
                return res.redirect('/internal_error');
              }

              console.log('stdout: ' + stdout);
            });
          });
        });
        // var command = 'docker run --name' + container.name
      })
    }
  }, // end container
}
