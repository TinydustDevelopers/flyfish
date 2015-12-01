var expect = require('chai').expect;
var containerApi = require('../apis/container.js');

var container = {};

describe('container api', function () {
  describe('create', function () {
    it('expect result to be an object have property Id and Warnings and Warings\' value is null', function (done) {
      var containerName = 'mocha-test';
      var containerInfo = {
        'Image': 'nodejs:5.0.0',
        'Cmd': ['/bin/bash', '-c', 'npm install; npm start;'],
        'Volumes': { '/code': {} },
        'WorkingDir': '/code',
        'ExposedPorts': { '3000/tcp': {} },
        'HostConfig': {
          'Binds': [ '/root/projects/docker-ci-nodejs-test' + ':/code' ],
          'PortBindings': { '3000/tcp': [{ 'HostPort': '9999' }] }
        }
      };
      containerApi.createContainer(containerName, containerInfo, function (error, result) {
        if (error) {
          return done(error);
        }
        expect(result).to.be.an('object');
        expect(result).to.have.property('Id');
        expect(result).to.have.property('Warnings').to.equal(null);
        container.Id = result.Id;
        done();
      });
    })
  });

  describe('start', function () {
    it('expect result to be a string and reulst\'s value to be equal \'\'', function (done) {
      containerApi.startContainer(container.Id, function (error, result) {
        if (error) {
          return done(error);
        }
        expect(result).to.be.a('string').to.be.equal('');
        done();
      });
    });
  });

  describe('restart', function () {
    it('expect result to be a string and reulst\'s value to be equal \'\'', function (done) {
      containerApi.reStartContainer(container.Id, function (error, result) {
        if (error) {
          return done(error);
        }
        expect(result).to.be.a('string').to.be.equal('');
        done();
      });
    });
  });

  describe('stop', function () {
    it('expect result to be a string and reulst\'s value to be equal \'\'', function (done) {
      containerApi.stopContainer(container.Id, function (error, result) {
        if (error) {
          return done(error);
        }
        expect(result).to.be.a('string').to.be.equal('');
        done();
      });
    });
  });

  describe('get', function () {
    it('expect result to be an object and result\'s length above 0', function (done) {
      containerApi.getContainers(function (error, result) {
        if (error) {
          return done(error);
        }
        expect(result).to.be.a('array').to.have.length.above(0);
        done();
      })
    })
  });

  describe('remove', function () {
    it('expect result to be a string and reulst\'s value to be equal \'\'', function (done) {
      containerApi.removeContainer(container.Id, function (error, result) {
        if (error) {
          return done(error);
        }
        expect(result).to.be.a('string').to.be.equal('');
        done();
      });
    });
  });
});