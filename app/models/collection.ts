import { attr, belongsTo, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import DS from 'ember-data';
import { choiceFields } from 'ember-osf-web/models/collected-metadatum';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import OsfModel from './osf-model';

export const choicesFields = choiceFields.map(field => `${field}Choices`);

export default class Collection extends OsfModel {
    @attr('fixstring') title!: string;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') bookmarks!: boolean;
    @attr('boolean') isPromoted!: boolean;
    @attr('boolean') isPublic!: boolean;
    @attr('array') collectedTypeChoices!: string[];
    @attr('array') issueChoices!: string[];
    @attr('array') programAreaChoices!: string[];
    @attr('array') statusChoices!: string[];
    @attr('array') volumeChoices!: string[];

    @belongsTo('collection-provider', { inverse: 'collections' })
    provider!: DS.PromiseObject<CollectionProvider> & CollectionProvider;

    @hasMany('node', { inverse: null }) linkedNodes!: DS.PromiseManyArray<Node>;

    @hasMany('registration', { inverse: null }) linkedRegistrations!: DS.PromiseManyArray<Registration>;

    @computed(`{${choicesFields.join()}}.length`)
    get displayChoicesFields(): Array<keyof Collection> {
        return (choicesFields as Array<keyof Collection>).filter(field => !!this[field].length);
    }
}

declare module 'ember-data' {
    interface ModelRegistry {
        collection: Collection;
    }
}
