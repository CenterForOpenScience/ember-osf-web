import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { DS } from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class UnregisteredContributor extends Component {
    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service toast!: Toast;

    model?: Contributor;
    node: Node = this.node;
    didValidate: boolean = false;

    @requiredAction closeForm!: () => void;

    add = task(function *(this: UnregisteredContributor) {
        const { validations } = yield this.model!.validate();
        this.set('didValidate', true);

        if (validations.get('isInvalid')) {
            return;
        }

        this.analytics.track('form', 'submit', 'Collections - Contributors - Add Unregistered Contributor');

        try {
            yield this.model!.save();
            this.toast.success(
                this.i18n.t('app_components.project_contributors.search.unregistered_contributor.add_success'),
            );
        } catch (e) {
            this.toast.error(
                this.i18n.t('app_components.project_contributors.search.unregistered_contributor.add_error'),
            );
        }

        this.reset(false);
        this.closeForm();
    }).drop();

    didReceiveAttrs(this: UnregisteredContributor) {
        this.reset();
    }

    reset(this: UnregisteredContributor, rollback: boolean = true) {
        if (this.model && rollback) {
            this.model.rollbackAttributes();
        }

        this.setProperties({
            model: this.store.createRecord('contributor', {
                nodeId: this.node.id,
                permission: Permission.Write,
                isUnregistered: true,
            }),
        });
    }

    @action
    cancel(this: UnregisteredContributor) {
        this.reset();
        this.closeForm();
    }
}
