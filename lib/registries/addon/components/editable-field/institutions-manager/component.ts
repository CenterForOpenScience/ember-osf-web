import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, and } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import template from './template';

@tagName('')
@layout(template)
export default class InstitutionsManager extends Component.extend({
    loadNodeAffiliatedInstitutions: task(function *(this: InstitutionsManager) {
        if (!this.node) {
            return undefined;
        }

        try {
            const affiliatedList: QueryHasManyResult<Institution> = yield this.node.queryHasMany(
                'affiliatedInstitutions', {
                    pageSize: 100,
                },
            );
            this.setProperties({
                affiliatedList,
                currentAffiliatedList: [...affiliatedList],
            });
            return true;
        } catch (e) {
            return false;
        }
    }).on('didReceiveAttrs').restartable(),
    submitChanges: task(function *(this: InstitutionsManager) {
        yield this.node.updateM2MRelationship('affiliatedInstitutions', this.affiliatedList);
        this.setProperties({
            currentAffiliatedList: [...this.affiliatedList],
            requestedEditMode: false,
        });
        this.reloadList();
    }),
}) {
    // Required
    node!: Node;

    // private properties
    @service i18n!: I18N;
    @service toast!: Toast;

    affiliatedList!: QueryHasManyResult<Institution>;
    currentAffiliatedList!: QueryHasManyResult<Institution>;
    reloadList!: (page?: number) => void;
    requestedEditMode: boolean = false;

    @alias('node.userHasAdminPermission') userCanEdit!: boolean;

    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;

    @computed('currentAffiliatedList.[]', 'loadNodeAffiliatedInstitutions.isRunning')
    get fieldIsEmpty() {
        if (this.loadNodeAffiliatedInstitutions.isRunning) {
            return false;
        }
        return this.currentAffiliatedList && !this.currentAffiliatedList.length;
    }

    @computed('node.isRegistration')
    get emptyFieldText() {
        if (this.node.isRegistration) {
            return this.i18n.t('osf-components.institutions-widget.no_affiliated_institution.registration');
        }
        return this.i18n.t('osf-components.institutions-widget.no_affiliated_institution.project');
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @action
    startEditing() {
        this.set('requestedEditMode', true);
    }

    @action
    addInstitution(this: InstitutionsManager, institution: Institution) {
        this.affiliatedList.pushObject(institution);
    }

    @action
    removeInstitution(this: InstitutionsManager, institution: Institution) {
        this.affiliatedList.removeObject(institution);
    }

    @action
    cancel() {
        this.set('requestedEditMode', false);
    }
}
