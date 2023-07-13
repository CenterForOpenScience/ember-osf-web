import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';

import { LanguageText } from 'ember-osf-web/models/index-card';

/**
 * This helper is used to get a locale-appropriate string for a property from a metadata hash.
 * It is used to fetch metadata fields from a index-card's resourceMetadata attribute, but can be used for any
 * hash that contains an array of LangaugeText objects.
 * If the property is not found, the first value in the array is returned, or if the property is found,
 * but there is no locale-appropriate value, the first value in the array is returned.
 *
 * @example
 * ```handlebars
 * {{get-localized-property indexCard.resourceMetadata 'title'}}
 * ```
 *  where `indexCard` is an index-card model instance.
 * @class get-localized-property
 * @param {Object} metadataHash The metadata hash to search for the property
 * @param {String} propertyName The name of the property to search for
 * @return {String} The locale-appropriate string or the first value in the array or 'Not provided' message
 */
export default class GetLocalizedPropertyHelper extends Helper {
    @service intl!: IntlService;

    compute([metadataHash, propertyName]: [Record<string, LanguageText[]>, string]): string {
        const locale = this.intl.locale;
        const valueOptions = metadataHash?.[propertyName];
        if (!metadataHash || !valueOptions || valueOptions.length === 0) {
            return this.intl.t('helpers.get-localized-property.not-provided');
        }

        const index = valueOptions.findIndex((valueOption: LanguageText) => valueOption['@language'] === locale);
        if (index === -1) {
            return valueOptions[0]['@value'];
        }
        return valueOptions[index]['@value'];
    }
}
