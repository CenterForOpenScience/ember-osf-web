import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { all, task, timeout } from 'ember-concurrency';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class UserQuickfiles extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service toast!: Toast;

    pageName = 'QuickFiles';

    filter: string = this.filter || '';
    // Initialized in setupController.
    newProject!: Node;
    sort: string = this.sort || 'name';

    @alias('model.taskInstance.value.user') user!: User;
    @alias('model.taskInstance.value.files') allFiles!: File[];

    updateFilter = task(function *(this: UserQuickfiles, filter: string) {
        yield timeout(250);
        this.setProperties({ filter });
        this.analytics.track('list', 'filter', 'Quick Files - Filter files');
    }).restartable();

    createProject = task(function *(this: UserQuickfiles, node: Node) {
        try {
            return yield node.save();
        } catch (ex) {
            this.get('toast').error(this.get('i18n').t('move_to_project.could_not_create_project'));
            return undefined;
        }
    });

    flash = task(function *(item: File, message: string, type: string = 'success', duration: number = 2000) {
        item.set('flash', { message, type });
        yield timeout(duration);
        item.set('flash', null);
    });

    addFile = task(function *(this: UserQuickfiles, id: string) {
        const allFiles = this.get('allFiles');
        const duplicate = allFiles.findBy('id', id);

        const file = yield this.get('store')
            .findRecord('file', id, duplicate ? {} : { adapterOptions: { query: { create_guid: 1 } } });

        if (duplicate) {
            allFiles.removeObject(duplicate);
        }

        allFiles.pushObject(file);

        if (duplicate) {
            return;
        }

        const i18n = this.get('i18n');
        this.get('toast').success(i18n.t('file_browser.file_added_toast'));
        this.get('flash').perform(file, i18n.t('file_browser.file_added'));
    });

    deleteFile = task(function *(this: UserQuickfiles, file: File) {
        try {
            yield file.destroyRecord();
            yield this.get('flash').perform(file, this.get('i18n').t('file_browser.file_deleted'), 'danger');
            this.get('allFiles').removeObject(file);
        } catch (e) {
            yield this.get('flash').perform(file, this.get('i18n').t('file_browser.delete_failed'), 'danger');
        }
    });

    deleteFiles = task(function *(this: UserQuickfiles, files: File[]) {
        const deleteFile = this.get('deleteFile');

        yield all(files.map(file => deleteFile.perform(file)));
    });

    moveFile = task(function *(this: UserQuickfiles, file: File, node: Node): IterableIterator<any> {
        try {
            if (node.get('isNew')) {
                yield this.get('createProject').perform(node);

                this.setProperties({
                    newProject: this.get('store').createRecord('node', {
                        public: true,
                        category: 'project',
                    }),
                });
            }

            yield file.move(node);
            yield this.get('flash').perform(file, this.get('i18n').t('file_browser.successfully_moved'));
            this.get('allFiles').removeObject(file);
            return true;
        } catch (ex) {
            this.get('toast').error(this.get('i18n').t('move_to_project.could_not_move_file'));
        }

        return false;
    });

    renameFile = task(function *(
        this: UserQuickfiles,
        file: File,
        name: string,
        conflict?: string,
        conflictingFile?: File,
    ) {
        const flash = this.get('flash');

        try {
            yield file.rename(name, conflict);

            // intentionally not yielded
            flash.perform(file, 'Successfully renamed');

            if (conflictingFile) {
                yield flash.perform(conflictingFile, this.get('i18n').t('file_browser.file_replaced'), 'danger');
                this.get('allFiles').removeObject(conflictingFile);
            }
        } catch (ex) {
            flash.perform(file, 'Failed to rename item', 'danger');
        }
    });

    @computed('allFiles.[]', 'filter', 'sort')
    get files(this: UserQuickfiles): File[] | null {
        const filter: string = this.get('filter');
        const sort: string = this.get('sort');

        let results = this.get('allFiles');
        if (!results) {
            return null;
        }

        if (filter) {
            const filterLowerCase = filter.toLowerCase();
            results = results.filter(file => file.get('name').toLowerCase().includes(filterLowerCase));
        }

        if (sort) {
            const reverse: boolean = sort.slice(0, 1) === '-';

            results = A(results).sortBy(sort.slice(+reverse));

            if (reverse) {
                results = results.reverse();
            }
        }

        return results;
    }

    @computed('currentUser.currentUserId', 'user.id')
    get canEdit(this: UserQuickfiles): boolean {
        const user = this.get('user');
        const userId = user && user.get('id');
        return !!userId && userId === this.get('currentUser').get('currentUserId');
    }

    @action
    async openFile(this: UserQuickfiles, file: File, show: string) {
        const guid = file.get('guid') || await file.getGuid();
        this.transitionToRoute('guid-file', guid, { queryParams: { show } });
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-user/quickfiles': UserQuickfiles;
    }
}
