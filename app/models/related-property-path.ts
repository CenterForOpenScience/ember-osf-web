import { attr } from '@ember-data/model';
import { getOwner } from '@ember/application';

import GetLocalizedPropertyHelper from 'ember-osf-web/helpers/get-localized-property';

import OsfModel from './osf-model';
import { LanguageText } from './index-card';

interface PropertyPath {
    '@id': string;
    resourceType: Array<{ '@id': string }>;
    displayLabel: LanguageText[];
    shortFormLabel: LanguageText[];
}

export default class RelatedPropertyPathModel extends OsfModel {
    @attr('string') propertyPathKey!: string;
    @attr('string') cardSearchResultCount!: string;
    @attr('array') osfmapPropertyPath!: string[];
    @attr('array') propertyPath!: PropertyPath[];

    getLocalizedString = new GetLocalizedPropertyHelper(getOwner(this));

    get shortFormLabel() {
        const hash = this.propertyPath[0] as unknown as Record<string, LanguageText[]>;
        const label = this.getLocalizedString.compute([hash, 'shortFormLabel']);
        return label || '';
    }

    get displayLabel() {
        const hash = this.propertyPath[0] as unknown as Record<string, LanguageText[]>;
        const label = this.getLocalizedString.compute([hash, 'displayLabel']);
        return label || '';
    }

}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'related-property-path': RelatedPropertyPathModel;
    } // eslint-disable-line semi
}
