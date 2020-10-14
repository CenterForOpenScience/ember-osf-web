import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { all, timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export default class UserQuickfiles extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;

    pageName = 'QuickFiles';

    filter: string = this.filter || '';
    // Initialized in setupController.
    newProject!: Node;
    sort: string = this.sort || 'name';

    @alias('model.taskInstance.value.user') user!: User;
    @alias('model.taskInstance.value.files') allFiles!: File[];

    @task({ withTestWaiter: true, restartable: true })
    updateFilter = task(function *(this: UserQuickfiles, filter: string) {
        yield timeout(250);
        this.setProperties({ filter });
        this.analytics.track('list', 'filter', 'Quick Files - Filter files');
    });

    @task({ withTestWaiter: true })
    createProject = task(function *(this: UserQuickfiles, node: Node) {
        try {
            return yield node.save();
        } catch (e) {
            const errorMessage = this.intl.t('move_to_project.could_not_create_project');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            return undefined;
        }
    });

    @task({ withTestWaiter: true })
    flash = task(function *(item: File, message: string, type: string = 'success', duration: number = 2000) {
        item.set('flash', { message, type });
        yield timeout(duration);
        item.set('flash', null);
    });

    @task({ withTestWaiter: true })
    addFile = task(function *(this: UserQuickfiles, id: string) {
        const duplicate = this.allFiles.findBy('id', id);

        const file = yield this.store
            .findRecord('file', id, duplicate ? {} : { adapterOptions: { query: { create_guid: 1 } } });

        if (duplicate) {
            this.allFiles.removeObject(duplicate);
        }

        this.allFiles.pushObject(file);

        if (duplicate) {
            return;
        }

        this.toast.success(this.intl.t('file_browser.file_added_toast'));
        this.flash.perform(file, this.intl.t('file_browser.file_added'));
    });

    @task({ withTestWaiter: true })
    deleteFile = task(function *(this: UserQuickfiles, file: File) {
        try {
            yield file.destroyRecord();
            yield this.flash.perform(file, this.intl.t('file_browser.file_deleted'), 'danger');
            this.allFiles.removeObject(file);
        } catch (e) {
            yield this.flash.perform(file, this.intl.t('file_browser.delete_failed'), 'danger');
        }
    });

    @task({ withTestWaiter: true })
    deleteFiles = task(function *(this: UserQuickfiles, files: File[]) {
        yield all(files.map(file => this.deleteFile.perform(file)));
    });

    @task({ withTestWaiter: true })
    moveFile = task(function *(this: UserQuickfiles, file: File, node: Node): IterableIterator<any> {
        try {
            if (node.isNew) {
                yield this.createProject.perform(node);

                this.setProperties({
                    newProject: this.store.createRecord('node', {
                        public: true,
                        category: 'project',
                    }),
                });
            }
            yield file.move(node);
            yield this.flash.perform(file, this.intl.t('file_browser.successfully_moved'));
            this.allFiles.removeObject(file);
            return true;
        } catch (e) {
            let toastMessage = this.intl.t('move_to_project.could_not_move_file');
            if (e.status === 507) {
                toastMessage = this.intl.t('move_to_project.storage_error');
            }
            captureException(e);
            this.toast.error(toastMessage);
        }

        return false;
    });

    @task({ withTestWaiter: true })
    renameFile = task(function *(
        this: UserQuickfiles,
        file: File,
        name: string,
        conflict?: string,
        conflictingFile?: File,
    ) {
        try {
            yield file.rename(name, conflict);

            // intentionally not yielded
            this.flash.perform(file, 'Successfully renamed');

            if (conflictingFile) {
                yield this.flash.perform(conflictingFile, this.intl.t('file_browser.file_replaced'), 'danger');
                this.allFiles.removeObject(conflictingFile);
            }
        } catch (ex) {
            this.flash.perform(file, 'Failed to rename item', 'danger');
        }
    });

    @computed('allFiles.[]', 'filter', 'sort')
    get files(): File[] | null {
        if (!this.allFiles) {
            return null;
        }
        let results = [...this.allFiles];

        if (this.filter) {
            const filterLowerCase = this.filter.toLowerCase();
            results = results.filter(file => file.name.toLowerCase().includes(filterLowerCase));
        }

        if (this.sort) {
            const reverse = this.sort.slice(0, 1) === '-';

            results = A(results).sortBy(this.sort.slice(+reverse));

            if (reverse) {
                results = results.reverse();
            }
        }

        return results;
    }

    @computed('currentUser.currentUserId', 'user.id')
    get canEdit(): boolean {
        return this.user && this.user.id === this.currentUser.currentUserId;
    }

    @action
    async openFile(file: File, show: string) {
        const guid = file.guid || await file.getGuid();
        this.transitionToRoute('guid-file', guid, { queryParams: { show } });
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-user/quickfiles': UserQuickfiles;
    }
}
