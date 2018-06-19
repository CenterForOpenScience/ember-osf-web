/* eslint-env node */

'use strict';

const express = require('express');
const path = require('path');
const config = require('../../config/environment')('development');

module.exports = {
    name: 'assets-prefix-middleware',

    serverMiddleware({ app }) {
        // Serve dist directory at config.assetsPrefix.
        app.use(config.assetsPrefix, express.static(path.join(__dirname, '../../dist')));
    },
};
