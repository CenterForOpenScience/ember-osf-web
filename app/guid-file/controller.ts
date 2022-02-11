/* eslint-disable no-console */
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';
import Registration from 'ember-osf-web/models/registration';

import mimeTypes from 'ember-osf-web/const/mime-types';
import File from 'ember-osf-web/models/file';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import pathJoin from 'ember-osf-web/utils/path-join';
import $ from 'jquery';
import mime from 'mime-types';

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
    @service intl!: Intl;
    @service toast!: Toast;

    registration?: Registration;

    queryParams = ['show'];

    deleteModalOpen = false;
    filter = '';
    sort = 'name';
    revision: null | number = null;
    show = 'view';
    revisionClicked = false;
    tagsClicked = false;


    searchUrl = pathJoin(config.OSF.url, 'search');

    fileTypeList = ['JournalArticle', 'AudioVideo', 'Dataset', 'Image',
        'Model', 'Software', 'Book', 'Poster', 'Presentation'];

    // Private properties
    @alias('canEdit') canDelete!: boolean;
    @alias('model.file') file!: File;
    @alias('model.file.links.download') downloadLink!: string;
    @alias('model.files') allFiles!: File[];
    @alias('model.user') user!: User;


    @computed('currentUser.currentUserId', 'user.id')
    get canEdit(): boolean {
        const modelUserId = this.user.id;

        return !!modelUserId && modelUserId === this.currentUser.currentUserId;
    }

    @computed('revision', 'file.currentVersion')
    get mfrVersion(): number {
        return this.revision || this.file.currentVersion;
    }

    // TODO: get this from the model
    @computed('downloadLink', 'file.currentVersion')
    get fileVersions(): Promise<any> {
        return (async () => {
            const { data } = await $.getJSON(`${this.downloadLink}?revisions=&`);
            return data;
        })();
    }

    @computed('file.name')
    get isEditableFile(): boolean {
        const filename = this.file.name;
        const mimeType = mime.lookup(filename);
        return !!mimeType && /^text\//.test(mimeType);
    }

    @computed('file.currentVersion')
    get fileText() {
        return Boolean(this.file) && this.file.getContents();
    }


    @restartableTask
    @waitFor
    async updateFilter(filter: string) {
        await timeout(250);
        this.setProperties({ filter });
        this.analytics.track('list', 'filter', 'Quick Files - Filter file browser');
    }

    @computed('allFiles.[]', 'filter', 'sort')
    get files() {
        let results: File[] = this.allFiles;

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

    @action
    download(version: number) {
        // To do: make this a link that looks like a button rather than calling this
        const url = `${this.downloadLink}?revision=${version}`;
        window.location.href = url;
    }

    @action
    async delete() {
        this.set('deleteModalOpen', false);

        try {
            await this.file.destroyRecord();
            this.transitionToRoute('guid-user.quickfiles', this.user.id);
            const message = this.intl.t('file_detail.delete_success');
            return this.toast.success(message);
        } catch (e) {
            const errorMessage = this.intl.t('file_detail.delete_fail');
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @action
    changeView(button: string) {
        const show = lookupTable[this.show][button];

        if (show) {
            this.set('show', show);
        }
    }

    @action
    async save(text: string) {
        this.analytics.click('button', 'Quick Files - Save');

        try {
            await this.file.updateContents(text);
            return this.toast.success(this.intl.t('file_detail.save_success'));
        } catch (e) {
            const errorMessage = this.intl.t('file_detail.save_fail');
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @action
    async openFile() {
        this.set('revision', null);
    }

    @action
    versionChange(version: number) {
        this.set('revision', version);
    }

    @action
    async toggleVersions() {
        this.toggleProperty('revisionClicked');

        if (this.revisionClicked === true) {
            this.openVersions();
        }

        if (this.tagsClicked === true) {
            this.closeTags();
        }

        if (this.revisionClicked === false) {
            this.closeVersions();
        }
    }

    @action
    async toggleTags() {
        this.toggleProperty('tagsClicked');

        if (this.tagsClicked === true) {
            this.openTags();
        }
        if (this.revisionClicked === true) {
            this.closeVersions();
        }
        if (this.tagsClicked === false) {
            this.closeTags();
        }
    }

    @action
    async showMoreButtons() {
        console.log('Open more button clicked');
    }

    @action
    async share() {
        console.log('File shared with service:');
    }

    openVersions() {
        const rightPanel = document.getElementById('rightPanel');
        if (rightPanel) {
            rightPanel.style.marginLeft = '-400px';
            rightPanel.classList.add('col-sm-4');
        }

        const versionSlide = document.getElementById('versions');
        if (versionSlide) {
            // versionSlide.removeAttribute('hidden');
            versionSlide.style.width = '400px';
        }
    }

    closeVersions() {
        const versionSlide = document.getElementById('versions');
        if (versionSlide) {
            versionSlide.style.width = '0px';
            // versionSlide.addAttribute('hidden');
        }

        const rightPanel = document.getElementById('rightPanel');
        if (rightPanel) {
            rightPanel.style.marginLeft = '0px';
            rightPanel.classList.replace('col-sm-5', 'col-sm-1');
        }
    }

    openTags() {
        const rightPanel = document.getElementById('rightPanel');

        if (rightPanel) {
            rightPanel.style.marginLeft = '-400px';
            rightPanel.classList.replace('col-sm-1', 'col-sm-5');
        }
        const tagsSlide = document.getElementById('tags');
        if (tagsSlide) {
            // tagsSlide.removeAttribute('hidden');
            tagsSlide.classList.add('col-sm-4');
            tagsSlide.style.width = '400px';
        }
    }

    closeTags() {
        const tagsSlide = document.getElementById('tags');
        if (tagsSlide) {
            tagsSlide.style.width = '0px';
        }

        const rightPanel = document.getElementById('rightPanel');

        if (rightPanel) {
            rightPanel.style.marginLeft = '0px';
            // rightPanel.classList.replace('col-sm-5', 'col-sm-1');
        }
    }

    async getVersions() {
        const versions = await this.store.findAll('file-version');

        versions.forEach(version => {
            console.log(version.id); // TODO update to array
            console.log(version.dateCreated);
        });
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-file': GuidFile;
    }
}
