exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['clients-basic.test.js'],

    capabilities: {
        'browserName': 'chrome'
    },

    jasmineNodeOpts: {
        showColors: true,
        //defaultTimeoutInterval: 30000,
        isVerbose: false
    }
};