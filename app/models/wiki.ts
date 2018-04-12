import { attr, belongsTo } from '@ember-decorators/data';
import OsfModel from './osf-model';

export default class Wiki extends OsfModel {
    @attr('string') kind;
    @attr('string') name; // eslint-disable-line no-restricted-globals
    @attr('date') dateModified;

    @attr('object') extra;
    @attr('string') contentType;
    @attr('string') path;
    @attr('boolean') currentUserCanComment;
    @attr('string') materializedPath;
    @attr('number') size;

    @belongsTo('node', { inverse: 'wikis' }) node;
}

declare module 'ember-data' {
    interface ModelRegistry {
      'wiki': Wiki;
    }
}
