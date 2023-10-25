import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import { taskFor } from 'ember-concurrency-ts';

import SearchResultModel from 'ember-osf-web/models/search-result';
import UserModel from 'ember-osf-web/models/user';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';

interface Args {
    result: SearchResultModel;
}

export default class UserSecondaryMetadata extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;

    @alias('args.result.indexCard.osfModel') user?: UserModel;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        if (!this.user) {
            taskFor(this.getOsfUserModel).perform();
        }
    }

    @task
    @waitFor
    async getOsfUserModel() {
        const options = {
            adapterOptions: {
                query: {
                    related_counts: 'nodes,registrations,preprints',
                },
            },
            reload: true,
        };
        await taskFor(this.args.result.indexCard.get('getOsfModel')).perform(options);
    }
}
