/**
 * @module ember-osf
 * @submodule utils
 */

/**
 * @class human-file-size
 */

/**
 * Borrowed from osf code, transforms received number of bytes size into human-
 * readable sizing.
 *
 * @method humanFileSize
 * @param {Number|String} bytes Number of bytes
 * @param {Boolean} bool Whether to use 1000 as the base for conversion or 1024
 * @return {String}
 */
export default function humanFileSize(bytes_, si) {
    // Borrowed from osfHelpers:
    // https://github.com/CenterForOpenScience/osf.io/blob/develop/website/static/js/osfHelpers.js#L645
    let bytes = bytes_;
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`;
    }
    const units = si ?
        ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] :
        ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return `${bytes.toFixed(1)} ${units[u]}`;
}
