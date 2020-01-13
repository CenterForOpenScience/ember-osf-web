import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';

import template from './template';

@tagName('')
@layout(template)
export default class MetadataInstitutionsManagerComponent extends Component {
    // Required
    node!: Node;

    // private properties
    @service i18n!: I18N;
    @service toast!: Toast;
    @service currentUser!: CurrentUser;

    affiliatedList!: QueryHasManyResult<Institution>;
    currentAffiliatedList!: QueryHasManyResult<Institution>;

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

    @task({ restartable: true, on: 'didReceiveAttrs' })
    loadNodeAffiliatedInstitutions = task(function *(this: MetadataInstitutionsManagerComponent) {
        if (this.node) {
            try {
                const affiliatedList: QueryHasManyResult<Institution> = yield this.node.queryHasMany(
                    'affiliatedInstitutions', {
                        pageSize: 100,
                    },
                );
                this.setProperties({
                    affiliatedList,
                    currentAffiliatedList: affiliatedList,
                });
            } catch (e) {
                throw e;
            }
        }
    });

    @task
    save = task(function *(this: MetadataInstitutionsManagerComponent) {
        try {
            yield this.node.updateM2MRelationship('affiliatedInstitutions', this.currentAffiliatedList);
        } catch (e) {
            this.node.rollbackAttributes();
            throw e;
        }
        this.setProperties({
            affiliatedList: [...this.currentAffiliatedList],
        });
    });

    @action
    toggleInstitution(institution: Institution) {
        if (this.currentAffiliatedList.includes(institution)) {
            this.currentAffiliatedList.removeObject(institution);
        } else {
            this.currentAffiliatedList.pushObject(institution);
        }
    }
}
