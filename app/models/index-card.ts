import { inject as service } from '@ember/service';
import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import IntlService from 'ember-intl/services/intl';

import GetLocalizedPropertyHelper from 'ember-osf-web/helpers/get-localized-property';
import { getOwner } from '@ember/application';

export interface LanguageText {
    '@language': string;
    '@value': string;
}

export default class IndexCardModel extends Model {
    @service intl!: IntlService;

    @attr('array') resourceType!: string[];
    @attr('array') resourceIdentifier!: string[];
    // TODO: can we add a type for resourceMetadata?
    @attr('object') resourceMetadata!: any;

    @hasMany('index-card', { inverse: null })
    relatedRecordSet!: AsyncHasMany<IndexCardModel> & IndexCardModel[];

    getLocalizedString = new GetLocalizedPropertyHelper(getOwner(this));

    get resourceId() {
        return this.resourceIdentifier[0];
    }

    get label() {
        const possibleLabelKeys = ['label', 'name', 'title'];
        for (const key of possibleLabelKeys) {
            if (this.resourceMetadata[key]) {
                const label = this.getLocalizedString.compute([this.resourceMetadata, key]);
                return label;
            }
        }
        return '';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-card': IndexCardModel;
    } // eslint-disable-line semi
}
