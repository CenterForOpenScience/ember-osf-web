import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
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
export default class InstitutionsManagerComponent extends Component.extend({
    loadNodeAffiliatedInstitutions: task(function *(this: InstitutionsManagerComponent) {
        if (this.node) {
            try {
                const affiliatedList: QueryHasManyResult<Institution> = yield this.node.queryHasMany(
                    'affiliatedInstitutions', {
                        pageSize: 100,
                    },
                );
                this.setProperties({
                    affiliatedList,
                });
            } catch (e) {
                throw e;
            }
        }
    }).on('didReceiveAttrs').restartable(),
    save: task(function *(this: InstitutionsManagerComponent) {
        try {
            yield this.node.updateM2MRelationship('affiliatedInstitutions', this.currentAffiliatedList);
        } catch (e) {
            this.node.rollbackAttributes();
            this.toast.error(this.i18n.t('registries.registration_metadata.edit_institutions.error'));
            throw e;
        }
        this.setProperties({
            affiliatedList: [...this.currentAffiliatedList],
            requestedEditMode: false,
        });
        this.toast.success(this.i18n.t('registries.registration_metadata.edit_institutions.success'));
        this.reloadList();
    }),
}) {
    // Required
    node!: Node;

    // private properties
    @service i18n!: I18N;
    @service toast!: Toast;
    @service currentUser!: CurrentUser;

    affiliatedList!: QueryHasManyResult<Institution>;
    currentAffiliatedList!: QueryHasManyResult<Institution>;
    reloadList!: (page?: number) => void;
    requestedEditMode: boolean = false;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;

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
            return this.i18n.t('osf-components.institutions-list.no_affiliated_institution.registration');
        }
        return this.i18n.t('osf-components.institutions-list.no_affiliated_institution.project');
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @action
    startEditing() {
        this.setProperties({
            requestedEditMode: true,
            currentAffiliatedList: [...this.affiliatedList],
        });
    }

    @action
    addInstitution(institution: Institution) {
        this.currentAffiliatedList.pushObject(institution);
    }

    @action
    removeInstitution(institution: Institution) {
        this.currentAffiliatedList.removeObject(institution);
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
