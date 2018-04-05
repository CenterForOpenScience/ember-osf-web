import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-get-config';
import mimeTypes from 'ember-osf-web/const/mime-types';
import File from 'ember-osf-web/models/file';
import analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';
import mime from 'npm:mime-types';

Object.assign(mime.types, mimeTypes);

const lookupTable = {
    edit: {
        revision: 'revision',
        view: 'view_edit',
    },
    revision: {
        edit: 'edit',
        revision: 'view',
        view: 'view',
    },
    view: {
        edit: 'view_edit',
        revision: 'revision',
    },
    view_edit: {
        edit: 'view',
        revision: 'revision',
        view: 'edit',
    },
};

export default class GuidFile extends Controller {
    @service analytics;
    @service currentUser;
    @service i18n;
    @service toast;

    queryParams = ['show'];

    deleteModalOpen: boolean = false;
    filter: string = '';
    sort: string = this.sort || 'name';
    revision: null | number = null;
    show = 'view';

    searchUrl = pathJoin(config.OSF.url, 'search');

    @alias('canEdit') canDelete;
    @alias('model.file.tags') tags;
    @alias('model.files') allFiles: File[];

    @computed('currentUser', 'model.user')
    get canEdit(this: GuidFile): boolean {
        const modelUserId = this.get('model.user.id');

        return modelUserId && modelUserId === this.get('currentUser.currentUserId');
    }

    @computed('revision', 'model.file.currentVersion')
    get mfrVersion(this: GuidFile): number {
        return this.get('revision') || this.get('model.file.currentVersion');
    }

    // TODO: get this from the model
    @computed('model.file.currentVersion')
    get fileVersions(this: GuidFile): Promise<any> {
        return (async () => {
            const { data } = await $.getJSON(`${this.get('model.file.links.download')}?revisions=&`);
            return data;
        })();
    }

    @computed('model.file.name')
    get isEditableFile(this: GuidFile) {
        const filename = this.get('model.file.name');
        const mimeType = mime.lookup(filename);
        return /^text\//.test(mimeType);
    }

    @computed('model.file.currentVersion')
    get fileText(this: GuidFile) {
        return this.get('model.file').getContents();
    }

    updateFilter = task(function* (this: GuidFile, filter) {
        yield timeout(250);
        this.setProperties({ filter });
    }).drop();

    @computed('allFiles.[]', 'filter', 'sort')
    get files(this: GuidFile) {
        const filter: string = this.get('filter');
        const sort: string = this.get('sort');

        let results: File[] = this.get('allFiles');

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

    @action
    download(this: GuidFile, version) {
        const url = `${this.get('model.file.links.download')}?revision=${version}`;
        window.location.href = url;
    }

    @action
    async delete(this: GuidFile) {
        this.set('deleteModalOpen', false);

        try {
            await this.get('model.file').destroyRecord();
            this.transitionToRoute('guid-user.quickfiles', this.get('model.user.id'));
            const message: string = this.get('i18n').t('file_detail.delete_success');
            return this.get('toast').success(message);
        } catch (e) {
            const message: string = this.get('i18n').t('file_detail.delete_fail');
            return this.get('toast').error(message);
        }
    }

    @action
    openDeleteModal(this: GuidFile) {
        this.set('deleteModalOpen', true);
    }

    @action
    closeDeleteModal(this: GuidFile) {
        this.set('deleteModalOpen', false);
    }

    @action
    changeView(this: GuidFile, button) {
        const show = lookupTable[this.get('show')][button];

        if (show) {
            this.set('show', show);
        }
    }

    @action
    async save(this: GuidFile, text) {
        const toast = this.get('toast');
        const i18n = this.get('i18n');

        try {
            await this.get('model.file').updateContents(text);
            return toast.success(i18n.t('file_detail.save_success'));
        } catch (e) {
            return toast.error(i18n.t('file_detail.save_fail'));
        }
    }

    @action
    async openFile(this: GuidFile, file) {
        const guid = file.get('guid') || await file.getGuid();

        this.set('revision', null);
        this.transitionToRoute('guid-file', guid, { queryParams: { show: 'view' } });
    }

    @action
    addTag(this: GuidFile, tag) {
        const model = this.get('model.file');
        model.set('tags', [...this.get('tags').slice(), tag].sort());
        model.save();
    }

    @action
    removeTagAtIndex(this: GuidFile, index) {
        const model = this.get('model.file');
        model.set('tags', this.get('tags').slice().removeAt(index));
        model.save();
    }

    @action
    versionChange(this: GuidFile, version) {
        this.set('revision', version);
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-file': GuidFile;
    }
}
