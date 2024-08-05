import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import Institution from 'ember-osf-web/models/institution';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import PreprintModel from 'ember-osf-web/models/preprint';
import { tracked } from '@glimmer/tracking';

/**
 * The Institution Manager Args
 */
interface InstitutionArgs {
    preprint: PreprintModel;
}

export default class InstitutionsManagerComponent extends Component<InstitutionArgs> {
    // Required
    preprint = this.args.preprint;

    // private properties
    @service toast!: Toast;
    @service intl!: Intl;
    @service currentUser!: CurrentUser;

    @tracked affiliatedList!: QueryHasManyResult<Institution>;
    @tracked currentAffiliatedList!: QueryHasManyResult<Institution>;

    constructor(owner: unknown, args: InstitutionArgs) {
        super(owner, args);

        taskFor(this.loadInstitutions).perform();
    }

    @task
    @waitFor
    private async loadInstitutions()  {
        if (this.preprint) {
            try {
                this.affiliatedList = await this.preprint.queryHasMany(
                    'affiliatedInstitutions', {
                        pageSize: 100,
                    },
                );
                this.currentAffiliatedList = this.affiliatedList;
            } catch (e) {
                const errorMessage = this.intl.t('registries.drafts.draft.metadata.load_institutions_error');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
        }
    }

    @task
    @waitFor
    async save() {
        try {
            await this.preprint.updateM2MRelationship('affiliatedInstitutions', this.currentAffiliatedList);
            await this.preprint.reload();
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.metadata.save_institutions_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }

        this.affiliatedList = this.currentAffiliatedList;
    }

    @action
    toggleInstitution(institution: Institution) {
        if (this.currentAffiliatedList.includes(institution)) {
            this.currentAffiliatedList.removeObject(institution);
        } else {
            this.currentAffiliatedList.pushObject(institution);
        }
        taskFor(this.save).perform();
    }
}
