import DS from 'ember-data';

import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import ContributorModel from 'ember-osf-web/models/contributor';
import NodeModel, { NodeCategory } from 'ember-osf-web/models/node';
import OsfModel, { Permission } from './osf-model';

const { attr, belongsTo, hasMany } = DS;

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
    children!: DS.PromiseManyArray<NodeModel>;

    @hasMany('contributor', { inverse: 'node' })
    contributors!: DS.PromiseManyArray<ContributorModel>;

    @hasMany('contributor', { inverse: null })
    bibliographicContributors!: DS.PromiseManyArray<ContributorModel>;

    @belongsTo('node', { inverse: 'children' })
    parent!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: null })
    root!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: null })
    detail!: DS.PromiseObject<NodeModel> & NodeModel;

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
