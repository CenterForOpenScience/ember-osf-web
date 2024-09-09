import Component from '@glimmer/component';
import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { tracked } from '@glimmer/tracking';
import Store from '@ember-data/store';
import CurrentUser from 'ember-osf-web/services/current-user';
import InstitutionModel from 'ember-osf-web/models/institution';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';


interface PreprintInstitutionModel extends InstitutionModel {
    isSelected: boolean;
}

/**
 * The Institution Manager Args
 */
interface InstitutionArgs {
    manager: PreprintStateMachine;
}

export default class InstitutionsManagerComponent extends Component<InstitutionArgs> {
    // Required
    manager = this.args.manager;

    // private properties
    @service toast!: Toast;
    @service intl!: Intl;
    @service store!: Store;
    @service currentUser!: CurrentUser;
    @tracked institutions!: PreprintInstitutionModel[];
    @tracked preprintWord = this.manager.provider.documentType.singular;

    constructor(owner: unknown, args: InstitutionArgs) {
        super(owner, args);

        this.manager.resetAffiliatedInstitutions();
        taskFor(this.loadInstitutions).perform();
    }

    @task
    @waitFor
    private async loadInstitutions()  {
        if (this.manager.preprint) {
            try {
                this.institutions = [] as PreprintInstitutionModel[];
                const userInstitutions = await this.currentUser.user!.institutions;

                await this.manager.preprint.affiliatedInstitutions;

                userInstitutions.map((institution: PreprintInstitutionModel) => {
                    this.institutions.push(institution);
                });

                /**
                 * The affiliated institutions of a preprint is in
                 * "edit" mode if there are institutions on the
                 * preprint model or the flow is in edit mode.
                 * Since the affiliated institutions
                 * are persisted by clicking the next button, the
                 * affiliated institutions can be in "Edit mode" even
                 * when the manager is not in edit mode.
                 */
                let isEditMode = this.manager.isEditFlow;
                this.manager.preprint.affiliatedInstitutions.map((institution: PreprintInstitutionModel) => {
                    isEditMode = true;
                    if(this.isAffiliatedInstitutionOwnerByUser(institution.id)) {
                        institution.isSelected = true;
                        this.manager.updateAffiliatedInstitution(institution);
                    }
                });

                /**
                 * The business rule is during the create flow or
                 * "non-edit-flow" all of the institutions should be
                 * checked by default
                 */
                if (!isEditMode) {
                    userInstitutions.map((institution: PreprintInstitutionModel) => {
                        institution.isSelected = true;
                        this.manager.updateAffiliatedInstitution(institution);
                    });
                }

                notifyPropertyChange(this, 'institutions');

            } catch (e) {
                const errorMessage = this.intl.t('preprints.submit.step-metadata.institutions.load-institutions-error');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
        }
    }

    private isAffiliatedInstitutionOwnerByUser(id: string): boolean {
        return this.institutions.find(
            institution => institution.id === id,
        ) !== undefined;
    }

    @action
    toggleInstitution(institution: PreprintInstitutionModel) {
        this.manager.updateAffiliatedInstitution(institution);
    }

    public get isElementDisabled(): boolean {
        return this.manager.isAffiliatedInstitutionsDisabled();
    }
}
