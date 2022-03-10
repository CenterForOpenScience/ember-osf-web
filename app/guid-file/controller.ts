import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import $ from 'jquery';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';

import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export default class GuidFile extends Controller {
    @service media!: Media;
    @service toast!: Toast;

    @tracked revisionsOpened = false;
    @tracked tagsOpened = false;

    @tracked revisions: any[] = [];
    @tracked viewedVersion?: number = this.model.currentVersion;

    get rightColumnClosed() {
        return !(this.revisionsOpened || this.tagsOpened);
    }

    get isMobile() {
        return this.media.isMobile;
    }

    get isTablet() {
        return this.media.isTablet;
    }

    // get versions from Waterbutler
    @task
    @waitFor
    async loadRevisions() {
        let response;
        try {
            response = await $.ajax({
                type: 'GET',
                url: `${this.model.links.download}?revisions=&`,
            });
        } catch (error) {
            captureException(error);
            this.toast.error(getApiErrorMessage(error));
            throw error;
        }
        this.revisions = response.data;
    }

    @action
    changeVersion(version: number) {
        this.viewedVersion = version;
    }

    @action
    toggleRevisions() {
        if (this.isMobile) {
            this.revisionsOpened = true;
            this.tagsOpened = false;
        } else {
            if (this.tagsOpened) {
                this.tagsOpened = false;
            }
            this.toggleProperty('revisionsOpened');
        }
    }

    @action
    toggleTags() {
        if (this.isMobile) {
            this.tagsOpened = true;
            this.revisionsOpened = false;
        } else {
            if (this.revisionsOpened) {
                this.revisionsOpened = false;
            }
            this.toggleProperty('tagsOpened');
        }
    }

    @action
    toggleFileRenderer() {
        if (this.isMobile) {
            this.tagsOpened = false;
            this.revisionsOpened = false;
        } else {
            if (this.rightColumnClosed) {
                this.revisionsOpened = true;
                this.tagsOpened = false;
            } else {
                this.revisionsOpened = false;
                this.tagsOpened = false;
            }
        }
    }
}
