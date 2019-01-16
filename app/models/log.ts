import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import NodeModel from './node';
import OsfModel from './osf-model';
import UserModel from './user';

export default class LogModel extends OsfModel {
    @attr('date') date!: Date;
    @attr('fixstring') action!: string;
    @attr('object') params!: any;

    @belongsTo('node', { inverse: null })
    node!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: 'logs' })
    originalNode!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('user')
    user!: DS.PromiseObject<UserModel> & UserModel;

    @belongsTo('node', { inverse: null })
    linkedNode!: DS.PromiseObject<NodeModel> & NodeModel;

    @belongsTo('node', { inverse: null })
    templateNode!: DS.PromiseObject<NodeModel> & NodeModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        log: LogModel;
    } // eslint-disable-line semi
}
