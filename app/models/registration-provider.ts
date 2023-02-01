import { htmlSafe } from '@ember/string';
import { attr, belongsTo, hasMany, AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import ReviewActionModel from 'ember-osf-web/models/review-action';

import { computed } from '@ember/object';
import RegistrationSchemaModel from 'ember-osf-web/models/registration-schema';
import BrandModel from './brand';
import ProviderModel from './provider';
import RegistrationModel from './registration';
import RegistrationSubscriptionModel from './registration-subscription';

export default class RegistrationProviderModel extends ProviderModel {
    @hasMany('registration', { inverse: 'provider' })
    registrations!: AsyncHasMany<RegistrationModel>;

    @belongsTo('brand')
    brand!: AsyncBelongsTo<BrandModel> & BrandModel;

    @hasMany('registration-schema', { inverse: null })
    schemas!: AsyncHasMany<RegistrationSchemaModel> | RegistrationSchemaModel[];

    @hasMany('review-action', { inverse: null })
    actions!: AsyncHasMany<ReviewActionModel> | ReviewActionModel[];

    @hasMany('registration-subscriptions', { inverse: 'provider' })
    subscriptions!: AsyncHasMany<RegistrationSubscriptionModel>;

    @attr('fixstring')
    shareSource?: string;

    @attr('boolean')
    brandedDiscoveryPage?: boolean;

    @attr('boolean')
    allowBulkUploads!: boolean;

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
