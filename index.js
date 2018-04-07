#!/usr/bin/env node
var NodeGit = require('nodegit');
var program = require('commander');
var fs = require('fs');
var path = require('path');
var copy = require('recursive-copy');
var rimraf = require('rimraf');

var tempPath = path.join(__dirname, "tmp");
var localPath = path.join(__dirname);

program
    .arguments('<file>')
    .action(async function (file) {
        console.log('file: %s', file);
        var contents = fs.readFileSync(file);
        var configuration = JSON.parse(contents);

        await Promise
            .all(configuration.projects.map(async p => {
                console.log('processing "%s" [%s]', p.name, p.repository);
                await processProject(p)
            }))
            .catch((err) => console.log(err));

        if (fs.existsSync(tempPath)) {
            rimraf(tempPath, () => console.log('cleaning up all of temp'));
        };
    })
    .parse(process.argv);

async function processProject(project) {

    var cloneUrl = `https://github.com/${project.repository}.git`;
    var cloneOptions = {
        checkoutBranch: project.branch
    };
    cloneOptions.fetchOpts = {
        callbacks: {
            certificateCheck: function () { return 1; },
        }
    };

    if (project.token) {
        cloneURL = `https://${project.token}:x-oauth-basic@github.com/${project.repository}`;
        cloneOptions.fetchOpts.callbacks.credentials =
            function () {
                return NodeGit.Cred.userpassPlaintextNew(project.token, "x-oauth-basic");
            };
    }

    var repoPath = path.join(tempPath, project.name);
    var source = path.join(repoPath, project.source);
    var destination = path.join(__dirname, project.target);

    var errorAndAttemptOpen = function (error) {
        console.log(error);
        return NodeGit.Repository.open(repoPath);
    };

    var cloneRepository = NodeGit.Clone(cloneUrl, repoPath, cloneOptions);

    await cloneRepository
        .catch(errorAndAttemptOpen)
        .then(function (repository) {
            console.log('cloned and copying files from %s to %s', source, destination);
            copy(source, destination, { overwrite : true })
                .then(function (results) {
                    console.info('Copied ' + results.length + ' files');
                })
                .catch(function (error) {
                    console.error('Copy failed: ' + error);
                });
        });
}