import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import OsfModel from './osf-model';

type statusChoice = 'good';

/**
 * @module ember-osf-web
 * @submodule models
 */

/**
 * Model for OSF APIv2 collections
 *
 * @class Collection
 */
export default class Collection extends OsfModel {
    @attr('fixstring') title!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') bookmarks!: boolean;
    @attr('boolean') isPromoted!: boolean;
    @attr('boolean') isPublic!: boolean;
    @attr('array') collectedTypeChoices!: Array<'node' | 'preprint' | 'collection' | 'registration'>;
    @attr('array') statusChoices!: statusChoice[];

    @belongsTo('collection-provider', { inverse: 'collections' })
    provider!: DS.PromiseObject<CollectionProvider> & CollectionProvider;

    @hasMany('node', { inverse: null }) linkedNodes!: DS.PromiseManyArray<Node>;

    @hasMany('registration', { inverse: null }) linkedRegistrations!: DS.PromiseManyArray<Registration>;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'collection': Collection;
    }
}
