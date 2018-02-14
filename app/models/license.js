import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    name: DS.attr('fixstring'),
    text: DS.attr('fixstring'),
    requiredFields: DS.attr(),
});
