import DS from 'ember-data';
import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export default class Wiki extends OsfModel.extend({
    kind: attr('string'),
    name: attr('string'),
    dateModified: attr('date'),

    extra: attr('object'),
    contentType: attr('string'),
    path: attr('string'),
    currentUserCanComment: attr('boolean'),
    materializedPath: attr('string'),
    size: attr('number'),

    node: belongsTo('node', {
        inverse: 'wikis',
    }),
}) {}

declare module 'ember-data' {
    interface ModelRegistry {
      'wiki': Wiki;
    }
}
