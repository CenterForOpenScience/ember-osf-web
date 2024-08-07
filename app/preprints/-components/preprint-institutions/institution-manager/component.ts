import Component from '@glimmer/component';
import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import PreprintModel from 'ember-osf-web/models/preprint';
import { tracked } from '@glimmer/tracking';
import { PreprintInstitutionModel } from 'ember-osf-web/models/institution';
import Store from '@ember-data/store';
import CurrentUser from 'ember-osf-web/services/current-user';

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
    @service store!: Store;
    @service currentUser!: CurrentUser;

    @tracked private affiliatedList!: QueryHasManyResult<PreprintInstitutionModel>;
    @tracked institutions!: PreprintInstitutionModel[];

    constructor(owner: unknown, args: InstitutionArgs) {
        super(owner, args);

        taskFor(this.loadInstitutions).perform();
    }

    @task
    @waitFor
    private async loadInstitutions()  {
        if (this.preprint) {
            try {
                this.institutions = [] as PreprintInstitutionModel[];
                const userInstitutions = await this.currentUser.user!.institutions;

                this.affiliatedList = await this.preprint.queryHasMany(
                    'affiliatedInstitutions', {
                        pageSize: 100,
                    },
                );

                userInstitutions.forEach((institution: PreprintInstitutionModel) => {
                    institution.isSelected = this.isInstitutionAffiliated(institution.id);
                    this.institutions.push(institution);
                });

                notifyPropertyChange(this, 'institutions');

            } catch (e) {
                const errorMessage = this.intl.t('preprints.submit.step-metadata.load_institutions_error');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
        }
    }

    private isInstitutionAffiliated(id: string): boolean {
        return this.affiliatedList.find(institution => institution.id === id) !== undefined;
    }

    /*
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
    */

    @action
    toggleInstitution(institution: PreprintInstitutionModel) {
        institution.isSelected = !institution.isSelected;
        // taskFor(this.save).perform();
    }
}
