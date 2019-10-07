import DS from 'ember-data';

import NodeModel from './node';
import OsfModel from './osf-model';

const { attr, belongsTo } = DS;

export default class IdentifierModel extends OsfModel {
    @attr('fixstring') category!: string;
    @attr('fixstring') value!: string;

    @belongsTo('node', { inverse: 'identifiers', polymorphic: true })
    referent!: DS.PromiseObject<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'identifier': IdentifierModel;
    } // eslint-disable-line semi
}
