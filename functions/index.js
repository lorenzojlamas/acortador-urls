"use strict";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nanoId = require("nanoid");
admin.initializeApp();

// TODO: podría ser configurable por variables de entorno.
const lengthOfShortUrls = 6;

exports.clipUrl = functions.https.onRequest((req, res) => {

    const url = req.query.url;

    // TODO: agregar trace al log
    // TODO: Definir librería y forma de logging
    console.info("Request clip url: ", url);

    const database = admin.database().ref('urls');


    // TODO: usar async functions, Callback hell !!!!
    createShortUrlInDatabese(database, url).then(clipedUrl => {
        res.status(200).send(clipedUrl);
    }).catch(error => {
        // TODO: manejo de errores
        res.status(500).send(error.message);
    });

});

function createShortUrlInDatabese(database, url) {
    return new Promise((resolve, reject) => {
        var clipedUrl;
        clipedUrl = nanoId.nanoid(lengthOfShortUrls);
        console.debug("ClipedUrl: ", clipedUrl);

        try {
            database.get(clipedUrl).then((value) => {
                console.log(value);
                if (value == null) {
                    pushAndResolve(database, url, clipedUrl, resolve);
                } else {
                    console.info('Value allready exist: ', value);
                    createShortUrlInDatabese(database, url).then((newClipedUrl) => {
                        resolve(newClipedUrl);
                    });
                }
            });
        } catch (error) {
            reject(error);
        }

    });
}

function pushAndResolve(database, url, clipedUrl, resolve) {
    database.push({
        clipedUrl: url
    }).then((value) => {
        console.debug('Value saved', value);
        resolve(clipedUrl);
    });
}