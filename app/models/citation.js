import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 citation styles
 *
 * @class Citation
 */
export default OsfModel.extend({
    citation: DS.attr('string'),
});
