import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import File from 'ember-osf-web/packages/files/file';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface Args {
    file: File;
    closeModal: () => {};
    onDelete: () => {};
}

export default class DeleteModal extends Component<Args> {
    @service toast!: Toastr;
    @service intl!: IntlService;

    @task
    @waitFor
    async confirmDelete() {
        try {
            await taskFor(this.args.file.delete).perform();
            this.args.closeModal();
            this.args.onDelete();
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e),
                this.intl.t('osf-components.file-browser.delete_fail', { fileName: this.args.file.name }));
        }
    }
}
