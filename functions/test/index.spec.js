const admin = require("firebase-admin");
const nanoId = require("nanoid");
admin.initializeApp = jest.fn();
const test = require("firebase-functions-test")();

// TODO: renombrar
const cliper = require("../index");


describe("clipUrl", () => {
    let oldDatabase;

    beforeEach(() => {
        oldDatabase = admin.database;
    });

    afterEach(() => {
        admin.database = oldDatabase;
    });

    it("Given a request with url in the query params when the method is called then a short identifier is returned", done => {


        const databaseStub = jest.fn(() => {
            return {
                ref: jest.fn(location => {
                    return refStub(location);
                })
            };
        });
        Object.defineProperty(admin, "database", { get: () => databaseStub });

        const url = "http://someUrlTo.cut";
        const mockRequest = {
            query: {
                url: url
            }
        };
        const mockResponse = {
            status: (code) => {
                expect(code).toEqual(200);
                return {
                    send: (response) => {
                        expect(response.length).toBe(6);
                        done();
                    }
                }
            }
        };
        cliper.clipUrl(mockRequest, mockResponse);
    });

    it("Given a request with a url in queryparams and the first short url obtained is already saved when the method is called, then a short identifier is returned", done => {

        const sanoIdStub = jest.fn().mockReturnValueOnce('123456').mockReturnValueOnce('654321');
        Object.defineProperty(nanoId, "nanoid", { get: () => sanoIdStub });

        const url = "http://someUrlTo.cut";
        const mockRequest = {
            query: {
                url: url
            }
        };
        const mockResponse = {
            status: (code) => {
                expect(code).toEqual(200);
                return {
                    send: (response) => {
                        expect(response.length).toBe(6);
                        done();
                    }
                }
            }
        };
        cliper.clipUrl(mockRequest, mockResponse);
    })
});

function refStub(location) {
    return {
        push: jest.fn(val => Promise.resolve({ ref: location })),
        child: jest.fn(val => {
            return {
                set: jest.fn(val => {
                    return Promise.resolve({ url: val })
                })
            }
        }),
        once: jest.fn(val => new Promise((resolve, reject) => {
            resolve(onceStub());

        }))
    };
}

function onceStub() {
    return {
        child: jest.fn(childStub())
    };
}

function childStub() {
    return (val) => {
        if (val === '123456') {
            return {
                exists: jest.fn(() => {
                    return true;
                })
            };
        } else {
            return {
                exists: jest.fn(() => {
                    return false;
                })
            };
        }

    };
}