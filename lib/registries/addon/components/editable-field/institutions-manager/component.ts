import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { or } from '@ember-decorators/object/computed';
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
    submitChanges: task(function *(this: InstitutionsManager, hideEditable: () => void) {
        yield this.node.updateM2MRelationship('affiliatedInstitutions', this.affiliatedList);
        this.setProperties({ currentAffiliatedList: [...this.affiliatedList] });
        hideEditable();
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

    @or(
        'loadNodeAffiliatedInstitutions.isRunning',
        'submitChanges.isRunning',
    ) shouldDisableButtons!: boolean;

    @computed('currentAffiliatedList.length', 'loadNodeAffiliatedInstitutions.isRunning')
    get fieldIsEmpty() {
        if (this.loadNodeAffiliatedInstitutions.isRunning) {
            return false;
        }
        return this.currentAffiliatedList && !this.currentAffiliatedList.length;
    }

    @computed('node.isRegistration')
    get emptyFieldText() {
        return this.node.isRegistration ?
            this.i18n.t('osf-components.institutions-widget.no_affiliated_institution.node') :
            this.i18n.t('osf-components.institutions-widget.no_affiliated_institution.project');
    }

    @computed('fieldIsEmpty', 'node.userHasAdminPermission')
    get shouldShowTitle() {
        if (this.fieldIsEmpty === undefined) {
            return true;
        }
        return !this.fieldIsEmpty || this.node.userHasAdminPermission;
    }

    @computed('fieldIsEmpty', 'node.userHasAdminPermission')
    get shouldShowEmptyFieldText() {
        return this.node.userHasAdminPermission && this.fieldIsEmpty;
    }

    @computed('affiliatedList.{length}', 'currentAffiliatedList.{length}')
    get fieldChanged() {
        return ((this.affiliatedList || []).length !== (this.currentAffiliatedList || []).length) ||
            (!this.affiliatedList.mapBy('id').every(id => this.currentAffiliatedList.mapBy('id').includes(id)));
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
    save(this: InstitutionsManager, hideEditable: () => void) {
        this.submitChanges.perform(hideEditable);
    }

    @action
    cancel(hideEditable: () => void) {
        if (this.fieldChanged) {
            this.setProperties({ affiliatedList: [...this.currentAffiliatedList] });
            this.reloadList();
        }
        hideEditable();
    }
}
