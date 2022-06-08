import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { enqueueTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import File from 'ember-osf-web/packages/files/file';
import captureException from 'ember-osf-web/utils/capture-exception';

interface Args {
    items: File[];
    reload: () => {};
}

export default class DeleteFileModal extends Component<Args> {
    @tracked deletingFiles: File[] = [];
    @tracked deletedFiles: File[] = [];
    @tracked failedFiles: File[] = [];

    @task
    @waitFor
    async confirmDelete() {
        this.deletingFiles = [...this.args.items];
        for (const item of this.deletingFiles) {
            try {
                await taskFor(item.delete).perform();
                this.deletedFiles.pushObject(item);
            } catch {
                this.failedFiles.pushObject(item);
            }
            this.deletingFiles.removeObject(item);
        }
    }

    get shouldShowDeletingModal() {
        return this.deletingFiles.length > 0;
    }

    get shouldShowSuccessModal() {
        return this.deletedFiles.length === this.args.items.length;
    }

    get shouldShowFailureModal() {
        return this.failedFiles.length > 0 && this.deletingFiles.length === 0;
    }

    @enqueueTask
    @waitFor
    async retryDelete(item: File) {
        try {
            await taskFor(item.delete).perform();
            this.failedFiles.removeObject(item);
            this.deletedFiles.pushObject(item);
        } catch (e) {
            captureException(e);
        }
    }

    @action
    reset() {
        this.deletingFiles = [];
        this.deletedFiles = [];
        this.failedFiles = [];
        this.args.reload();
    }
}
