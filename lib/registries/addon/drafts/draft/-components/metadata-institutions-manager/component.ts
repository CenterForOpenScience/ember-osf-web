import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import template from './template';

@tagName('')
@layout(template)
export default class MetadataInstitutionsManagerComponent extends Component {
    // Required
    node!: Node;

    // private properties
    @service toast!: Toast;
    @service intl!: Intl;
    @service currentUser!: CurrentUser;

    affiliatedList!: QueryHasManyResult<Institution>;
    currentAffiliatedList!: QueryHasManyResult<Institution>;

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
                const errorMessage = this.intl.t('registries.drafts.draft.metadata.load_institutions_error');
                captureException(e, { errorMessage });
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
        }
    });

    @task
    save = task(function *(this: MetadataInstitutionsManagerComponent) {
        try {
            yield this.node.updateM2MRelationship('affiliatedInstitutions', this.currentAffiliatedList);
            yield this.node.reload();
        } catch (e) {
            const errorMessage = this.intl.t('registries.drafts.draft.metadata.save_institutions_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
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
        this.save.perform();
    }
}
