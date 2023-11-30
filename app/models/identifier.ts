import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';

import NodeModel from './node';
import OsfModel from './osf-model';
import PreprintModel from './preprint';

export default class IdentifierModel extends OsfModel {
    @attr('fixstring') category!: string;
    @attr('fixstring') value!: string;

    @belongsTo('node', { inverse: 'identifiers', polymorphic: true })
    referent!: AsyncBelongsTo<NodeModel | PreprintModel> & (NodeModel | PreprintModel);
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'identifier': IdentifierModel;
    } // eslint-disable-line semi
}
