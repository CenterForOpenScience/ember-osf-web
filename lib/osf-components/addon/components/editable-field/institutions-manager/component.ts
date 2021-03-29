import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';

import template from './template';

export interface InstitutionsManager {
    bindReload?: (page?: number) => void;
    toggleInstitution: (institution: Institution) => void;
    addInstitution: (institution: Institution) => void;
    removeInstitution: (institution: Institution) => void;
    affiliatedList: Institution[];
    node: Node;
    user: User;
}

@tagName('')
@layout(template)
export default class InstitutionsManagerComponent extends Component {
    // Required
    node!: Node;

    // private properties
    @service intl!: Intl;
    @service toast!: Toast;
    @service currentUser!: CurrentUser;

    affiliatedList!: QueryHasManyResult<Institution>;
    currentAffiliatedList!: QueryHasManyResult<Institution>;
    reloadList!: (page?: number) => void;
    requestedEditMode: boolean = false;

    @alias('node.userHasWritePermission') userCanEdit!: boolean;

    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @computed('affiliatedList.[]', 'loadNodeAffiliatedInstitutions.isRunning')
    get fieldIsEmpty() {
        if (this.loadNodeAffiliatedInstitutions.isRunning) {
            return false;
        }
        return this.affiliatedList && !this.affiliatedList.length;
    }

    @computed('node.isRegistration')
    get emptyFieldText() {
        if (this.node.get('isRegistration')) {
            return this.intl.t('osf-components.institutions-list.no_affiliated_institution.registration');
        }
        return this.intl.t('osf-components.institutions-list.no_affiliated_institution.project');
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @task({ withTestWaiter: true, restartable: true, on: 'didReceiveAttrs' })
    loadNodeAffiliatedInstitutions = task(function *(this: InstitutionsManagerComponent) {
        if (this.node) {
            const affiliatedList: QueryHasManyResult<Institution> = yield this.node.queryHasMany(
                'affiliatedInstitutions', {
                    pageSize: 100,
                },
            );
            this.setProperties({
                affiliatedList,
            });
        }
    });

    @task({ withTestWaiter: true })
    save = task(function *(this: InstitutionsManagerComponent) {
        try {
            yield this.node.updateM2MRelationship('affiliatedInstitutions', this.currentAffiliatedList);
        } catch (e) {
            this.node.rollbackAttributes();
            this.toast.error(this.intl.t('registries.registration_metadata.edit_institutions.error'));
            throw e;
        }
        this.setProperties({
            affiliatedList: [...this.currentAffiliatedList],
            requestedEditMode: false,
        });
        this.toast.success(this.intl.t('registries.registration_metadata.edit_institutions.success'));
        this.reloadList();
    });

    @action
    startEditing() {
        this.setProperties({
            requestedEditMode: true,
            currentAffiliatedList: [...this.affiliatedList],
        });
    }

    @action
    toggleInstitution(institution: Institution) {
        if (this.currentAffiliatedList.includes(institution)) {
            this.currentAffiliatedList.removeObject(institution);
        } else {
            this.currentAffiliatedList.pushObject(institution);
        }
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }
}
