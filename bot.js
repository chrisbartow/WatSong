// ----------------------------------------------------------------------------
//
// WatSong v1.0 - The twitch.tv !song indentifier
// Copyright (C) 2019 Chris Bartow <chris@codenut.io>
// All rights reserved
//
// This source file is licensed under the terms of the MIT license.
// See the LICENSE file to learn about this license.
//
// ----------------------------------------------------------------------------

// Read in configuration
const opts = require('./config.json');

// Require Twitch Messaging Service
const tmi = require('tmi.js');

// Create a chat client
const client = new tmi.client(opts);

// Register chat event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch
client.connect();

function onConnectedHandler(addr, port) {
    console.log(`Connected to ${addr}:${port}`);
}

// Process Messages
function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    const cmd = msg.trim();

    if (/^!song/i.test(cmd)) {
        getSongInfo().then(x => client.say(target, "The current song playing is " + x));
    }
}

function runCmd(type) {
    var exec = require('child_process').exec;
    return new Promise(resolve => {
        exec(`osascript -e 'tell application "${opts['player']}" to ${type} of current track as string'`,
            function(error, stdOut, stdErr) {
                resolve(stdOut);
            });
    });
}

async function getSongInfo() {
    var track = await runCmd("name");
    var artist = await runCmd("artist");
    // console.log("The current song playing is ", track, " by ", artist);
    var song = track.trim() + ' by ' + artist.trim();
    return song;
}