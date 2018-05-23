'use strict';

const fs = require('fs');

module.exports = function() {
    fs.symlinkSync(`${__dirname}/../../../blueprints`, `${process.cwd()}/blueprints`);
};
