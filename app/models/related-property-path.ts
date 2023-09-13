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

export enum SuggestedFilterOperators {
    AnyOf = 'any-of',
    IsPresent = 'is-present'
}

export default class RelatedPropertyPathModel extends OsfModel {
    @attr('string') propertyPathKey!: string;
    @attr('number') cardSearchResultCount!: number;
    @attr('array') osfmapPropertyPath!: string[];
    @attr('array') propertyPath!: PropertyPath[];
    @attr('string') suggestedFilterOperator!: SuggestedFilterOperators;

    getLocalizedString = new GetLocalizedPropertyHelper(getOwner(this));

    get displayLabel() {
        // propertyPath is likely an array of length 1,
        // unless it is nested property(e.g. file's isContainedBy.funder, file's isContainedBy.license)
        // in which case we just use the last property
        const hash = this.propertyPath[this.propertyPath.length-1] as unknown as Record<string, LanguageText[]>;
        const label = this.getLocalizedString.compute([hash, 'displayLabel']);
        return label || '';
    }

}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'related-property-path': RelatedPropertyPathModel;
    } // eslint-disable-line semi
}
