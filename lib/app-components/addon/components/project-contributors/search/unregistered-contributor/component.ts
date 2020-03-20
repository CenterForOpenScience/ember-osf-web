import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { DS } from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';
import captureException from 'ember-osf-web/utils/capture-exception';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class UnregisteredContributor extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service store!: DS.Store;
    @service toast!: Toast;

    model?: Contributor;
    node: Node = this.node;
    didValidate: boolean = false;

    @requiredAction closeForm!: () => void;

    @task({ drop: true })
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
                this.intl.t('app_components.project_contributors.search.unregistered_contributor.add_success'),
            );
        } catch (e) {
            captureException(e);
            this.toast.error(
                this.intl.t('app_components.project_contributors.search.unregistered_contributor.add_error'),
            );
        }

        this.reset(false);
        this.closeForm();
    });

    didReceiveAttrs() {
        this.reset();
    }

    reset(rollback: boolean = true) {
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
    cancel() {
        this.reset();
        this.closeForm();
    }
}
