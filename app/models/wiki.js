import DS from 'ember-data';
import OsfModel from './osf-model';

export default OsfModel.extend({
    kind: DS.attr('string'),
    name: DS.attr('string'),
    dateModified: DS.attr('date'),

    extra: DS.attr(),
    contentType: DS.attr('string'),
    path: DS.attr('string'),
    currentUserCanComment: DS.attr('boolean'),
    materializedPath: DS.attr('string'),
    size: DS.attr('number'),

    node: DS.belongsTo('node', {
        inverse: 'wikis',
    }),
});
