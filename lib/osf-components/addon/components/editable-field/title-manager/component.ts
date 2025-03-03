import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import Node from 'ember-osf-web/models/node';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { taskFor } from 'ember-concurrency-ts';

export interface TitleManagerArgs {
    node: Node;
}

export default class TitleManagerComponent extends Component<TitleManagerArgs> {
    @service intl!: Intl;
    @service toast!: Toast;

    @tracked currentTitle = this.args.node.title;

    get userCanEdit() {
        return this.args.node.userHasAdminPermission;
    }

    get fieldIsEmpty() {
        return !this.currentTitle;
    }

    get disableSave() {
        return this.fieldIsEmpty || taskFor(this.save).isRunning;
    }

    @action
    onOpen() {
        this.currentTitle = this.args.node.title;
    }

    @task
    @waitFor
    async save() {
        if (this.args.node) {
            this.args.node.title = this.currentTitle;
            try {
                await this.args.node.save();
            } catch (e) {
                const errorMessage = this.intl.t('registries.registration_metadata.edit_title.error');
                captureException(e, { errorMessage });
                this.args.node.rollbackAttributes();
                this.toast.error(getApiErrorMessage(e), errorMessage);
                throw e;
            }
            this.toast.success(this.intl.t('registries.registration_metadata.edit_title.success'));
        }
    }
}
