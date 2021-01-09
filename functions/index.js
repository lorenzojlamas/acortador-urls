"use strict";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nanoId = require("nanoid");
admin.initializeApp();

// TODO: podría ser configurable por variables de entorno.
const lengthOfShortUrls = 6;

exports.clipUrl = functions.https.onRequest(async(req, res) => {

    const url = req.query.url;

    // TODO: agregar trace al log
    // TODO: Definir librería y forma de logging
    console.info("Request clip url: ", url);

    const database = admin.database().ref('urls');
    const clipedUrl = await createShortUrlInDatabese(database, url).catch((error) => {
        // TODO: manejo de errores
        console.error(error);
        return res.status(500).send();
    });

    return res.status(200).send(clipedUrl);
});

exports.goTo = functions.https.onRequest(async(req, res) => {
    const key = req.query.key;

    // TODO: agregar trace al log
    // TODO: Definir librería y forma de logging
    console.log("Request original url for key: ", key);
    const snapshot = await admin.database().ref(`urls/${key}`).once('value').catch((error) => {
        console.error(error);
        return res.status(500).send();
    });

    const value = snapshot.val();
    if (value != null) {
        console.log('URL to redirect: ', value.url)
        return res.redirect(303, snapshot.val().url);
    } else {
        console.warn('Key not found: ', key);
        return res.status(404).send();
    }
});

function createShortUrlInDatabese(database, url) {
    return new Promise(async(resolve, reject) => {
        var clipedUrl;
        clipedUrl = nanoId.nanoid(lengthOfShortUrls);
        console.debug("ClipedUrl: ", clipedUrl);

        const snapshot = await database.once("value").catch((error) => {
            reject(error);
        });
        if (snapshot.child(clipedUrl).exists()) {
            console.info('Value allready exist: ', clipedUrl);
            return resolve(await createShortUrlInDatabese(database, url));
        } else {
            return await pushAndResolve(database, clipedUrl, url, resolve);
        }

    });
}

async function pushAndResolve(database, clipedUrl, url, resolve) {
    const child = database.child(clipedUrl);
    await child.set({
        url: url
    });
    console.debug('Value saved', clipedUrl);
    return resolve(clipedUrl);
}