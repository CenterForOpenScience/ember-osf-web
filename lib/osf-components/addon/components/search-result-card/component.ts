import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Intl from 'ember-intl/services/intl';
import { dropTask } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import config from 'ember-osf-web/config/environment';
import SearchResultModel from 'ember-osf-web/models/search-result';
import UserModel from 'ember-osf-web/models/user';

const osfUrl = config.OSF.url;

interface Args {
    result: SearchResultModel;
}

export default class SearchResultCard extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;

    @tracked isOpenSecondaryMetadata = false;
    @tracked osfUser?: UserModel;

    @action
    toggleSecondaryMetadata() {
        this.isOpenSecondaryMetadata = !this.isOpenSecondaryMetadata;
        if (this.isUserResultCard && !this.osfUser) {
            taskFor(this.getOsfUserModel).perform();
        }
    }

    get cardTypeLabel() {
        return this.intl.t(`osf-components.search-result-card.${this.args.result.resourceType}`);
    }

    get isUserResultCard() {
        return this.args.result.resourceType === 'user';
    }

    get secondaryMetadataComponent() {
        const { resourceType } = this.args.result;

        return `search-result-card/${resourceType.replace('_component', '')}-secondary-metadata`;
    }

    @dropTask
    @waitFor
    async getOsfUserModel() {
        const { result } = this.args;
        if (result.resourceType === 'user') {
            const { identifier } = result.resourceMetadata;
            if (identifier) {
                const guid = this.guidFromIdentifierList(identifier);
                if (guid) {
                    const user = await this.store.findRecord('user', guid, {
                        adapterOptions: {
                            query: {
                                related_counts: 'nodes,registrations,preprints',
                            },
                        },
                        reload: true,
                    });
                    this.osfUser = user;
                }
            }
        }
    }

    guidFromIdentifierList(ids: Array<{'@value': string}>) {
        const osfId = ids.find(id => id['@value'].includes(osfUrl))?.['@value'];
        if (osfId) {
            // remove osfUrl from id and any leading/trailing slashes
            return osfId.replace(osfUrl, '').replace(/^\/|\/$/g, '');
        }
        return null;
    }
}
