import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';

import RegistrationModel from 'ember-osf-web/models/registration';
import RevisionModel from 'ember-osf-web/models/revision';
import CurrentUserService from 'ember-osf-web/services/current-user';

import { taskFor } from 'ember-concurrency-ts';

interface Args {
    registration: RegistrationModel;
}

export default class UpdateDropdown extends Component<Args> {
    @service currentUser!: CurrentUserService;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        taskFor(this.getAllRevisions).perform();
    }
    @service intl!: Intl;
    @service user!: CurrentUserService;
    revisions?: QueryHasManyResult<RevisionModel>;

    @task
    @waitFor
    async getAllRevisions() {
        try {

            const { registration } = this.args;
            if (this.args.registration) {
                const revisions = await registration.queryHasMany('revisions');
                this.revisions = revisions;
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('No revisions found. Something went wrong: ', e);
        }
    }
}
