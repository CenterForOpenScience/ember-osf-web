import { inject as service } from '@ember/service';
import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import IntlService from 'ember-intl/services/intl';

export interface LanguageText {
    '@language': string;
    '@value': string;
}

export default class MetadataRecordModel extends Model {
    @service intl!: IntlService;

    @attr('array') resourceType!: string[];
    @attr('array') resourceIdentifier!: string[];
    @attr('object') resourceMetadata!: any;

    @hasMany('metadata-record', { inverse: null })
    relatedRecordSet!: AsyncHasMany<MetadataRecordModel> & MetadataRecordModel[];

    get label() {
        const { resourceMetadata } = this;
        const preferredLanguage = this.intl.locale;
        const labels = resourceMetadata?.label;
        if (labels) {
            const languageAppropriateLabel = labels.filter((label: any) => label['@language'] === preferredLanguage);
            // give the locale appropriate label if it exists, otherwise give the first label
            if (languageAppropriateLabel.length > 0) {
                return labels.filter((label: any) => label['@language'] === preferredLanguage)[0]['@value'];
            } else if (labels.length > 0) {
                return labels[0]['@value'];
            }
        }
        return 'No label found';
    }

    get title() {
        const { resourceMetadata } = this;
        const preferredLanguage = this.intl.locale;
        const titles = resourceMetadata?.title;
        if (titles) {
            const languageAppropriateTitle = titles.filter((title: any) => title['@language'] === preferredLanguage);
            // give the locale appropriate title if it exists, otherwise give the first title
            if (languageAppropriateTitle.length > 0) {
                return titles.filter((title: any) => title['@language'] === preferredLanguage)[0]['@value'];
            } else if (titles.length > 0) {
                return titles[0]['@value'];
            }
        }
        return 'No title found';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'metadata-record': MetadataRecordModel;
    } // eslint-disable-line semi
}
