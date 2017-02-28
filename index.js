/**
 * Created by Younis Shah
 * on 1.23.2017
 *
 * @type {Beacon}
 */

const express = require('express');
const eddyStoneBeacon = require('eddystone-beacon');
const ngrok = require('ngrok');
const Promise = require('promise');

const PORT = 8080;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello physical web!')
});

app.listen(PORT, () => {
    console.log("[+] App running on port " + PORT);
    new Promise((resolve, reject) => {
        console.log("[+] Creating an ngrok tunnel. Please wait...");
        ngrok.connect(PORT, (err, url) => {
            if (err) {
                console.log("[*] ngrock: tunnel error.");
                reject(err);
            } else {
                console.log("[+] ngrock: tunneling through port 8080");
                resolve(url)
            }
        })
    }).then(url => {
        const options = {
            name: 'Phiisical',
            txPowerLevel: -22,
            tlmCount: 2,
            tlmPeriod: 10
        };

        console.log("[+] Advertising URL: " + url);
        console.log("[+] Check youy Chrome browser on phone! [Privacy > Physical Web > On > See what's nearby]");
        eddyStoneBeacon.advertiseUrl(url, [options]);
    }).catch((err) => {
        console.log("[+] An unexpcted error occured. " + err);
        process.exit(1);
    });

});




