#!/usr/bin/env node
var git = require('nodegit');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var fs = require('fs');

program
    .arguments('<file>')
    .option('-u, --username <username>', 'The user to authenticate as')
    .option('-p, --password <password>', 'The user\'s password')
    .action(function(file) {
        console.log('user: %s pass: %s file: %s',
        program.username, program.password, file);
    })
    .parse(process.argv);