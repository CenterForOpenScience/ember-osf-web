import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import mimeTypes from 'ember-osf-web/const/mime-types';
import File from 'ember-osf-web/models/file';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import pathJoin from 'ember-osf-web/utils/path-join';
import Toast from 'ember-toastr/services/toast';
import $ from 'jquery';
import mime from 'npm:mime-types';

Object.assign(mime.types, mimeTypes);

const lookupTable: { [k: string]: { [s: string]: string} } = {
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
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service toast!: Toast;

    queryParams = ['show'];

    deleteModalOpen: boolean = false;
    filter: string = '';
    sort: string = this.sort || 'name';
    revision: null | number = null;
    show = 'view';

    searchUrl = pathJoin(config.OSF.url, 'search');

    @alias('canEdit') canDelete!: boolean;
    @alias('model.file') file!: File;
    @alias('model.file.links.download') downloadLink!: string;
    @alias('model.files') allFiles!: File[];
    @alias('model.user') user!: User;

    @computed('currentUser', 'user.id')
    get canEdit(this: GuidFile): boolean {
        const modelUserId = this.user.id;

        return !!modelUserId && modelUserId === this.currentUser.currentUserId;
    }

    @computed('revision', 'file.currentVersion')
    get mfrVersion(this: GuidFile): number {
        return this.revision || this.file.currentVersion;
    }

    // TODO: get this from the model
    @computed('file.currentVersion')
    get fileVersions(this: GuidFile): Promise<any> {
        return (async () => {
            const { data } = await $.getJSON(`${this.downloadLink}?revisions=&`);
            return data;
        })();
    }

    @computed('file.name')
    get isEditableFile(this: GuidFile): boolean {
        const filename = this.file.name;
        const mimeType = mime.lookup(filename);
        return !!mimeType && /^text\//.test(mimeType);
    }

    @computed('file.currentVersion')
    get fileText(this: GuidFile) {
        return Boolean(this.file) && this.file.getContents();
    }

    updateFilter = task(function *(this: GuidFile, filter: string) {
        yield timeout(250);
        this.setProperties({ filter });
        this.analytics.track('list', 'filter', 'Quick Files - Filter file browser');
    }).restartable();

    @computed('allFiles.[]', 'filter', 'sort')
    get files(this: GuidFile) {
        let results: File[] = this.allFiles;

        if (this.filter) {
            const filterLowerCase = this.filter.toLowerCase();
            results = results.filter(file => file.name.toLowerCase().includes(filterLowerCase));
        }

        if (this.sort) {
            const reverse: boolean = this.sort.slice(0, 1) === '-';

            results = A(results).sortBy(this.sort.slice(+reverse));

            if (reverse) {
                results = results.reverse();
            }
        }

        return results;
    }

    @action
    download(this: GuidFile, version: number) {
        // To do: make this a link that looks like a button rather than calling this
        const url = `${this.downloadLink}?revision=${version}`;
        window.location.href = url;
    }

    @action
    async delete(this: GuidFile) {
        this.set('deleteModalOpen', false);

        try {
            await this.file.destroyRecord();
            this.transitionToRoute('guid-user.quickfiles', this.user.id);
            const message: string = this.i18n.t('file_detail.delete_success');
            return this.toast.success(message);
        } catch (e) {
            const message: string = this.i18n.t('file_detail.delete_fail');
            return this.toast.error(message);
        }
    }

    @action
    changeView(this: GuidFile, button: string) {
        const show = lookupTable[this.show][button];

        if (show) {
            this.set('show', show);
        }
    }

    @action
    async save(this: GuidFile, text: string) {
        this.analytics.click('button', 'Quick Files - Save');

        try {
            await this.file.updateContents(text);
            return this.toast.success(this.i18n.t('file_detail.save_success'));
        } catch (e) {
            return this.toast.error(this.i18n.t('file_detail.save_fail'));
        }
    }

    @action
    async openFile() {
        this.set('revision', null);
    }

    @action
    versionChange(this: GuidFile, version: number) {
        this.set('revision', +version);
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-file': GuidFile;
    }
}
