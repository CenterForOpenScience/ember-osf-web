import { htmlSafe } from '@ember/string';
import DS from 'ember-data';
import ReviewActionModel from 'ember-osf-web/models/review-action';

import { computed } from '@ember/object';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import BrandModel from './brand';
import ModeratorModel from './moderator';
import ProviderModel, { ReviewPermissions } from './provider';
import RegistrationModel from './registration';

const { attr, hasMany, belongsTo } = DS;

export default class RegistrationProviderModel extends ProviderModel {
    @hasMany('registration', { inverse: 'provider' })
    registrations!: DS.PromiseManyArray<RegistrationModel>;

    @belongsTo('brand')
    brand!: DS.PromiseObject<BrandModel> & BrandModel;

    @hasMany('registration-schema', { inverse: null })
    schemas!: DS.PromiseManyArray<RegistrationSchemaModel> | RegistrationSchemaModel[];

    @hasMany('moderator', { inverse: 'provider' })
    moderators!: DS.PromiseManyArray<ModeratorModel> | ModeratorModel[];

    @hasMany('review-action', { inverse: null })
    actions!: DS.PromiseManyArray<ReviewActionModel> | ReviewActionModel[];

    @attr('fixstring')
    shareSource?: string;

    @attr('boolean')
    brandedDiscoveryPage?: boolean;

    @attr('array')
    permissions!: ReviewPermissions[];

    @computed('permissions')
    get currentUserCanReview() {
        if (this.permissions) {
            return this.permissions.includes(ReviewPermissions.ViewSubmissions);
        }
        return false;
    }

    @computed('description')
    get htmlSafeDescription() {
        if (this.description) {
            return htmlSafe(this.description);
        }
        return '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'registration-provider': RegistrationProviderModel;
    } // eslint-disable-line semi
}
