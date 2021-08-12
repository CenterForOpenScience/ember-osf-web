import { attr, belongsTo, AsyncBelongsTo } from '@ember-data/model';

import NodeModel from './node';
import OsfModel from './osf-model';

export default class WikiModel extends OsfModel {
    @attr('string') kind!: string;
    @attr('string') name!: string;
    @attr('date') dateModified!: Date;

    @attr('object') extra!: any;
    @attr('string') contentType!: string;
    @attr('string') path!: string;
    @attr('boolean') currentUserCanComment!: boolean;
    @attr('string') materializedPath!: string;
    @attr('number') size!: number;

    @belongsTo('node', { inverse: 'wikis' })
    node!: AsyncBelongsTo<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        wiki: WikiModel;
    } // eslint-disable-line semi
}
