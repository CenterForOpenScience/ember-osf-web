import { attr, belongsTo } from '@ember-decorators/data';
import Node from './node';
import OsfModel from './osf-model';

export default class Wiki extends OsfModel {
    @attr('string') kind: string;
    @attr('string') name: string; // eslint-disable-line no-restricted-globals
    @attr('date') dateModified: Date;

    @attr('object') extra: any;
    @attr('string') contentType: string;
    @attr('string') path: string;
    @attr('boolean') currentUserCanComment: boolean;
    @attr('string') materializedPath: string;
    @attr('number') size: number;

    @belongsTo('node', { inverse: 'wikis' }) node: Node;
}

declare module 'ember-data' {
    interface ModelRegistry {
      'wiki': Wiki;
    }
}
