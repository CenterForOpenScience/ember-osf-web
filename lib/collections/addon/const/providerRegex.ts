
/**
 * @module ember-osf
 * @submodule const
 */

/**
 * @class providerRegex
 */

/**
 * A mapping of provider names to their url regex
 * @property providerUrlRegex
 * @type {Object}
 */

interface ProviderUrlRegex {
    [key: string]: RegExp;
}

const providerUrlRegex: ProviderUrlRegex = {
    // 'bioRxiv': '', doesnt currently have urls
    Cogprints: /cogprints/,
    OSF: /https?:\/\/((?!api).)*osf.io/, // Doesn't match api.osf urls
    PeerJ: /peerj/,
    arXiv: /arxivj/,
    'ClinicalTrials.gov': /http:\/\/clinicaltrials.gov/,

};

export default providerUrlRegex;
