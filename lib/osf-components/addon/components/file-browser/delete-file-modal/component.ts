import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { allSettled, enqueueTask, task, TaskInstance } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import File from 'ember-osf-web/packages/files/file';
import captureException from 'ember-osf-web/utils/capture-exception';

interface Args {
    items: File[];
    reload: () => {};
}

export default class FileBrowser extends Component<Args> {
    @tracked deleteItemTasks: Array<TaskInstance<any>> = [];
    @tracked deletedFiles: File[] = [];
    @tracked failedFiles: File[] = [];

    @task
    @waitFor
    async confirmDelete() {
        this.deleteItemTasks = this.args.items.map(item => taskFor(item.delete).perform());
        await allSettled(this.deleteItemTasks);
        this.deletedFiles = this.args.items.filter((_, index) => this.deleteItemTasks[index].isSuccessful);
        this.failedFiles = this.args.items.filter( (_, index) => this.deleteItemTasks[index].isError);
    }

    get shouldShowSuccessModal() {
        return this.deleteItemTasks.length === this.deletedFiles.length
            && this.deleteItemTasks.length !== 0
            && this.deletedFiles.length !== 0;
    }

    get shouldShowFailureModal() {
        return this.failedFiles.length > 0;
    }

    @enqueueTask
    @waitFor
    async retryDelete(item: File) {
        try {
            await taskFor(item.delete).perform();
            this.failedFiles.removeObject(item);
            this.deletedFiles.push(item);
        } catch (e) {
            captureException(e);
        }
    }

    @action
    reset() {
        this.deleteItemTasks = [];
        this.deletedFiles = [];
        this.failedFiles = [];
        this.args.reload();
    }
}
