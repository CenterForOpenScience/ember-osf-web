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
import Media from 'ember-responsive';

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
    @service media!: Media;

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

    get isMobile() {
        return this.media.isMobile;
    }

    get isTablet() {
        return this.media.isTablet;
    }

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

        if (this.tagsClicked === true) {
            this.closeTags();
        }
        if (this.revisionClicked === true) {
            this.openVersions();
        }
        if (this.revisionClicked === false) {
            this.closeVersions();
        }
    }

    @action
    async toggleTags() {
        this.toggleProperty('tagsClicked');

        if (this.revisionClicked === true) {
            this.closeVersions();
        }
        if (this.tagsClicked === true) {
            this.openTags();
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
        if (this.tagsClicked === true) {
            this.closeTags();
            this.tagsClicked = false;
        }
        const mainPanel = document.getElementById('mainPanel');
        if (mainPanel) {
            mainPanel.classList.replace('col-lg-12', 'col-lg-8');
            mainPanel.style.marginLeft = '450px';
        }
        const versionSlide = document.getElementById('versions');
        if (versionSlide) {
            versionSlide.hidden = false;
            versionSlide.classList.add('col-lg-4');
            versionSlide.style.width = '450px';
        }
    }

    closeVersions() {
        const versionSlide = document.getElementById('versions');
        console.log('versions div found');
        if (versionSlide) {
            versionSlide.hidden = true;
            versionSlide.classList.remove('col-lg-4');
            versionSlide.style.width = '0px';
        }
        const mainPanel = document.getElementById('mainPanel');
        if (mainPanel) {
            mainPanel.classList.replace('col-lg-8', 'col-lg-12');
            mainPanel.style.marginLeft = '0px';
        }
    }

    openTags() {
        if (this.revisionClicked === true) {
            this.closeVersions();
            this.revisionClicked = false;
        }
        const mainPanel = document.getElementById('mainPanel');
        if (mainPanel) {
            mainPanel.classList.replace('col-lg-12', 'col-lg-8');
            mainPanel.style.marginRight = '450px';
        }
        const tagsSlide = document.getElementById('tags');
        if (tagsSlide) {
            tagsSlide.hidden = false;
            tagsSlide.classList.add('col-lg-4');
            tagsSlide.style.width = '450px';
        }
    }

    closeTags() {
        const tagsSlide = document.getElementById('tags');
        console.log('tags div found');
        if (tagsSlide) {
            tagsSlide.hidden = true;
            tagsSlide.classList.remove('col-lg-4');
            tagsSlide.style.width = '0px';
        }
        const mainPanel = document.getElementById('mainPanel');
        if (mainPanel) {
            mainPanel.classList.replace('col-lg-8', 'col-lg-12');
            mainPanel.style.marginRight = '0px';
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
