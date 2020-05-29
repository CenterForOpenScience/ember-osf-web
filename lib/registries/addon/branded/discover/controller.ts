import DiscoverController from 'registries/discover/controller';

import { ShareTermsFilter } from 'registries/services/share-search';

export default class Discover extends DiscoverController {
    // this route uses the registries.discover page template where the custom branding is handled
    get providerModel() {
        return this.model;
    }

    get additionalFilters() {
        const { shareSourceKey, name } = this.model;

        return [
            new ShareTermsFilter('sources', shareSourceKey, name),
        ];
    }
}
