import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { SparseModel } from 'ember-osf-web/utils/sparse-fieldsets';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class InstitutionSelectList extends Component.extend({
    loadNodeAffiliatedInstitutions: task(function *(this: InstitutionSelectList) {
        if (!this.node) {
            return;
        }

        const affiliatedList: SparseModel[] = yield this.node.sparseLoadAll(
            'affiliatedInstitutions',
            { institution: ['id'] },
        );
        this.set('affiliatedList', affiliatedList.mapBy('id'));
    }).on('didReceiveAttrs').restartable(),

    addInstitution: task(function *(this: InstitutionSelectList, institution: Institution) {
        if (!this.node) {
            return;
        }
        const errorMessage = this.i18n.t('osf-components.institutions-widget.add_institution_error');

        try {
            yield this.node.createM2MRelationship('affiliatedInstitutions', institution);
            this.affiliatedList.pushObject(institution.id);
            this.reloadList();
        } catch (e) {
            this.toast.error(errorMessage);
        }
    }),

    removeInstitution: task(function *(this: InstitutionSelectList, institution: Institution) {
        if (!this.node) {
            return;
        }
        const errorMessage = this.i18n.t('osf-components.institutions-widget.remove_institution_error');

        try {
            yield this.node.deleteM2MRelationship('affiliatedInstitutions', institution);
            this.affiliatedList.removeObject(institution.id);
            this.reloadList();
        } catch (e) {
            this.toast.error(errorMessage);
        }
    }),
}) {
    // Required
    node!: Node;

    // optional properties
    analyticsScope: string = defaultTo(this.analyticsScope, '');
    usePlaceholders: boolean = defaultTo(this.usePlaceholders, false);

    // private properties
    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service toast!: Toast;

    affiliatedList!: Array<string|number>;
    reloadList!: (page?: number) => void;

    @or(
        'addInstitution.isRunning',
        'removeInstitution.isRunning',
        'loadNodeAffiliatedInstitutions.isRunning',
    ) shouldDisableButtons!: boolean;
}
