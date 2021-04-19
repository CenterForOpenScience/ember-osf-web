import { AsyncBelongsTo, AsyncHasMany, attr, belongsTo, hasMany } from '@ember-data/model';

import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import ContributorModel from 'ember-osf-web/models/contributor';
import NodeModel, { NodeCategory } from 'ember-osf-web/models/node';
import OsfModel, { Permission } from './osf-model';

export default class SparseNodeModel extends OsfModel {
    @attr('fixstring') title!: string;
    @attr('fixstring') description!: string;
    @attr('node-category') category!: NodeCategory;
    @attr('date') dateCreated!: Date;
    @attr('date') dateModified!: Date;
    @attr('boolean') fork!: boolean;
    @alias('fork') isFork!: boolean;
    @attr('fixstringarray') tags!: string[];
    @attr('array') currentUserPermissions!: Permission[];
    @attr('boolean') currentUserIsContributor!: boolean;
    @attr('boolean') public!: boolean;

    @hasMany('node', { inverse: 'parent' })
    children!: AsyncHasMany<NodeModel>;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: AsyncHasMany<ContributorModel>;

    @hasMany('contributor', { inverse: null })
    bibliographicContributors!: AsyncHasMany<ContributorModel>;

    @belongsTo('node', { inverse: 'children' })
    parent!: AsyncBelongsTo<NodeModel>;

    @belongsTo('node', { inverse: null })
    root!: AsyncBelongsTo<NodeModel>;

    @belongsTo('node', { inverse: null })
    detail!: AsyncBelongsTo<NodeModel>;

    @computed('root')
    get isRoot() {
        const rootId = (this as SparseNodeModel).belongsTo('root').id();
        return !rootId || rootId === this.id;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'sparse-node': SparseNodeModel;
    } // eslint-disable-line semi
}
