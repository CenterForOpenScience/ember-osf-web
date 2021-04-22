/**
 * @module ember-osf-web
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
export default function humanFileSize(bytes: number, si = true): string {
    // Borrowed from osfHelpers:
    // https://github.com/CenterForOpenScience/osf.io/blob/develop/website/static/js/osfHelpers.js#L645

    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`;
    }

    const units: string[] = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    let u: number;
    let b = bytes / thresh;

    for (u = 0; Math.abs(b) > thresh && u < units.length; u++) {
        b /= thresh;
    }

    return `${b.toFixed(1)} ${units[u]}`;
}
