import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { all, task, timeout } from 'ember-concurrency';
import File from 'ember-osf-web/models/file';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';

export default class UserQuickfiles extends Controller {
    @service currentUser;
    @service i18n;
    @service toast;

    pageName = 'QuickFiles';

    filter: string = this.filter || '';
    newProject: Node;
    sort: string = this.sort || 'name';

    @alias('model.taskInstance.value.user') user: User;
    @alias('model.taskInstance.value.files') allFiles: File[];

    updateFilter = task(function* (this: UserQuickfiles, filter) {
        yield timeout(250);
        this.setProperties({ filter });
    }).restartable();

    createProject = task(function* (this: UserQuickfiles, node) {
        try {
            return yield node.save();
        } catch (ex) {
            this.get('toast').error(this.get('i18n').t('move_to_project.could_not_create_project'));
        }
    });

    flash = task(function* (item, message, type = 'success', duration = 2000) {
        item.set('flash', { message, type });
        yield timeout(duration);
        item.set('flash', null);
    });

    addFile = task(function* (this: UserQuickfiles, id) {
        const file = yield this.get('store')
            .findRecord('file', id, { adapterOptions: { query: { create_guid: 1 } } });

        this.get('allFiles').pushObject(file);
        yield this.get('flash').perform(file, this.get('i18n').t('file_browser.file_added'));
    });

    deleteFile = task(function* (this: UserQuickfiles, file: File) {
        try {
            yield file.destroyRecord();
            yield this.get('flash').perform(file, this.get('i18n').t('file_browser.file_deleted'), 'danger');
            this.get('allFiles').removeObject(file);
        } catch (e) {
            yield this.get('flash').perform(file, this.get('i18n').t('file_browser.delete_failed'), 'danger');
        }
    });

    deleteFiles = task(function* (this: UserQuickfiles, files: File[]) {
        const deleteFile = this.get('deleteFile');

        yield all(files.map(file => deleteFile.perform(file)));
    });

    moveFile = task(function* (this: UserQuickfiles, file: File, node: Node) {
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
        } catch (ex) {
            this.get('toast').error(this.get('i18n').t('move_to_project.could_not_move_file'));
        }
    });

    renameFile = task(function* (
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
    get files(this: UserQuickfiles) {
        const filter: string = this.get('filter');
        const sort: string = this.get('sort');

        let results = this.get('allFiles');

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
        const userId = this.get('user.id');
        return userId && userId === this.get('currentUser').get('currentUserId');
    }

    @action
    async openFile(this: UserQuickfiles, file, show) {
        const guid = file.get('guid') || await file.getGuid();
        this.transitionToRoute('guid-file', guid, { queryParams: { show } });
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-user/quickfiles': UserQuickfiles;
    }
}
