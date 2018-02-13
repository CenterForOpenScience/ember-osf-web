import { A } from '@ember/array';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import { mimeTypes } from 'ember-osf/const/mime-types';
import Analytics from 'ember-osf/mixins/analytics';
import pathJoin from 'ember-osf/utils/path-join';
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

export default class FileDetail extends Controller.extend(Analytics, {
    actions: {
        download(this: FileDetail, version) {
            const url = `${this.get('model.file.links.download')}?revision=${version}`;
            window.location.href = url;
        },

        async delete(this: FileDetail) {
            this.set('deleteModalOpen', false);

            try {
                await this.get('model.file').destroyRecord();
                this.transitionToRoute('user-quickfiles', this.get('model.user.id'));
                const message: string = this.get('i18n').t('file_detail.delete_success');
                return this.get('toast').success(message);
            } catch (e) {
                const message: string = this.get('i18n').t('file_detail.delete_fail');
                return this.get('toast').error(message);
            }
        },

        openDeleteModal(this: FileDetail) {
            this.set('deleteModalOpen', true);
        },

        closeDeleteModal(this: FileDetail) {
            this.set('deleteModalOpen', false);
        },

        changeView(this: FileDetail, button) {
            const show = lookupTable[this.get('show')][button];

            if (show) {
                this.set('show', show);
            }
        },

        async save(this: FileDetail, text) {
            const toast = this.get('toast');
            const i18n = this.get('i18n');

            try {
                await this.get('model.file').updateContents(text);
                const message: string = i18n.t('file_detail.save_success');
                return toast.success(message);
            } catch (e) {
                const message: string = i18n.t('file_detail.save_fail');
                return toast.error(message);
            }
        },

        async openFile(this: FileDetail, file) {
            const guid = file.get('guid') || await file.getGuid();

            this.set('revision', null);
            this.transitionToRoute('file-detail', guid, { queryParams: { show: 'view' } });
        },

        addTag(this: FileDetail, tag) {
            const model = this.get('model.file');
            this.get('fileTags').pushObject(tag);
            model.set('tags', this.get('fileTags'));
            model.save();
        },

        removeTagAtIndex(this: FileDetail, index) {
            const model = this.get('model.file');
            this.get('fileTags').removeAt(index);
            model.set('tags', this.get('fileTags'));
            model.save();
        },

        versionChange(this: FileDetail, version) {
            this.set('revision', version);
        },
    },
}) {
    private currentUser = service('currentUser');
    private i18n = service('i18n');
    private toast = service('toast');

    private queryParams = ['show'];

    private deleteModalOpen = false;
    private revision = null;
    private show = 'view';

    private displays = A([]);

    private searchUrl = pathJoin(config.OSF.url, 'search');

    private canDelete = computed.alias('canEdit');

    private canEdit = computed('currentUser', 'model.user', function(this: FileDetail) {
        const modelUserId = this.get('model.user.id');

        return modelUserId && modelUserId === this.get('currentUser.currentUserId');
    });

    private mfrVersion = computed('model.file.currentVersion', 'revision', function(this: FileDetail) {
        return this.get('revision') || this.get('model.file.currentVersion');
    });

    private fileTags = computed('model.file', function(this: FileDetail)  {
        return this.get('model.file.tags');
    });

    private fileVersions = computed('model.file.currentVersion', async function(this: FileDetail) {
        const { data } = await $.getJSON(`${this.get('model.file.links.download')}?revisions=&`);
        return data;
    });

    private isEditableFile = computed('model.file.name', function(this: FileDetail) {
        const filename = this.get('model.file.name');
        const mimeType = mime.lookup(filename);
        return /^text\//.test(mimeType);
    });

    private fileText = computed('model.file.currentVersion', function(this: FileDetail)  {
        return this.get('model.file').getContents();
    });
}

declare module '@ember/controller' {
    interface IRegistry {
        'file-detail': FileDetail;
    }
}
