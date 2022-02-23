/* eslint-disable no-console */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import Media from 'ember-responsive';


export default class GuidFile extends Controller {
    @service media!: Media;

    revisionClicked = false;
    tagsClicked = false;

    get isMobile() {
        return this.media.isMobile;
    }

    get isTablet() {
        return this.media.isTablet;
    }

    @action
    toggleVersions() {
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
    toggleTags() {
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
            mainPanel.style.marginLeft = '450px';
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
        if (tagsSlide) {
            tagsSlide.hidden = true;
            tagsSlide.classList.remove('col-lg-4');
            tagsSlide.style.width = '0px';
        }
        const mainPanel = document.getElementById('mainPanel');
        if (mainPanel) {
            mainPanel.classList.replace('col-lg-8', 'col-lg-12');
            mainPanel.style.marginLeft = '0px';
        }
    }
}
