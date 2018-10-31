import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import OsfModel from './osf-model';
import User from './user';

export default class IdentityModel extends OsfModel {
    @attr() status!: string;
    @attr() externalID!: string;
    @attr() name!: string;

    @belongsTo('user', { inverse: 'identities' }) user!: DS.PromiseObject<User> & User;
}

declare module 'ember-data' {
    interface ModelRegistry {
        'identity': IdentityModel;
    }
}
