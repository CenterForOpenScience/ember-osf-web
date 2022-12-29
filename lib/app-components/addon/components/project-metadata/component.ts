import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { validatePresence } from 'ember-changeset-validations/validators';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import { BufferedChangeset } from 'validated-changeset';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import { validateNodeLicense } from 'ember-osf-web/packages/registration-schema/validations';
import Analytics from 'ember-osf-web/services/analytics';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import styles from './styles';
import template from './template';

const nodeValidations = {
    title: [
        validatePresence({ presence: true, ignoreBlank: true, type: 'empty' }),
    ],
    description: [
        validatePresence({ presence: true, ignoreBlank: true, type: 'empty' }),
    ],
    license: [
        validatePresence({ presence: true, ignoreBlank: true, type: 'mustSelect' }),
    ],
    nodeLicense: [
        validateNodeLicense(),
    ],
};

@layout(template, styles)
@tagName('')
export default class ProjectMetadata extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;

    node!: Node;
    changeset!: BufferedChangeset;

    @requiredAction continue!: () => void;

    init() {
        super.init();
        this.changeset = buildChangeset(this.node, nodeValidations);
    }

    @task
    @waitFor
    async reset() {
        this.node.rollbackAttributes();
        await this.node.reload();
    }

    @task
    @waitFor
    async save() {
        this.changeset.validate();
        if (this.changeset.isValid) {
            try {
                await this.changeset.save();
                this.onSave();
            } catch (e) {
                this.onError();
            }
        } else {
            this.toast.error(this.intl.t('app_components.project_metadata.save_error'));
        }
    }

    @action
    addTag(tag: string) {
        this.analytics.click('button', 'Collection - Submit - Add tag');
        this.node.set('tags', [...this.node.tags.slice(), tag].sort());
    }

    @action
    removeTagAtIndex(index: number) {
        this.analytics.click('button', 'Collections - Submit - Remove tag');
        this.node.set('tags', this.node.tags.slice().removeAt(index));
    }


    @action
    onSave() {
        this.toast.success(this.intl.t('app_components.project_metadata.save_success'));
        this.continue();
    }

    @action
    onError() {
        this.toast.error(this.intl.t('app_components.project_metadata.save_error'));
    }
}
