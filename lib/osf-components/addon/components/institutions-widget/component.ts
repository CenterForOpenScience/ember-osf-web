import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { task } from 'ember-concurrency';
import { layout } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class InstitutionWidget extends Component.extend({
    loadNodeAffiliatedInstitutions: task(function *(this: InstitutionWidget) {
        if (!this.node) {
            return undefined;
        }

        try {
            const affiliatedList: QueryHasManyResult<Institution> =
                yield this.node.queryHasMany('affiliatedInstitutions');
            this.set('affiliatedList', affiliatedList);
        } catch (e) {
            return false;
        }
    }),
    addInstitution: task(function *(this: InstitutionWidget, institution: Institution) {
        const errorMessage = this.i18n.t('osf-components.institutions-widget.add_institution_error');

        if (!this.node) {
            return undefined;
        }

        try {
            yield this.node.createM2MRelationship('affiliatedInstitutions', institution);
            this.affiliatedList.pushObject(institution);
            this.reloadList();
        } catch (e) {
            return this.toast.error(errorMessage);
        }
    }),
    removeInstitution: task(function *(this: InstitutionWidget, institution: Institution) {
        const errorMessage = this.i18n.t('osf-components.institutions-widget.remove_institution_error');

        if (!this.node) {
            return undefined;
        }

        try {
            yield this.node.deleteM2MRelationship('affiliatedInstitutions', institution);
            this.affiliatedList.removeObject(institution);
            this.reloadList();
        } catch (e) {
            return this.toast.error(errorMessage);
        }
    }),
}) {
    // optional properties
    readOnly: boolean = defaultTo(this.readOnly, false);
    analyticsScope: string = defaultTo(this.analyticsScope, '');
    node?: Node;
    hasAffiliations: boolean = true;

    // private properties
    reloadList!: (page?: number) => void; // bound by paginated-list
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service toast!: Toast;
    shouldShowModal: boolean = false;
    affiliatedList: Institution[] = [];

    init() {
        super.init();
        this.loadNodeAffiliatedInstitutions.perform();
    }

    @action
    showModal() {
        this.set('shouldShowModal', true);
    }

    @action
    add(institution: Institution) {
        this.addInstitution.perform(institution);
    }

    @action
    remove(institution: Institution) {
        this.removeInstitution.perform(institution);
    }
}
