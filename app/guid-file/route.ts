import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import HeadTagsService from 'ember-cli-meta-tags/services/head-tags';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import moment from 'moment';

import Institution from 'ember-osf-web/models/institution';
import Analytics from 'ember-osf-web/services/analytics';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';

export default class GuidFile extends Route {
    @service analytics!: Analytics;
    @service('head-tags') headTagsService!: HeadTagsService;
    @service metaTags!: MetaTags;
    @service ready!: Ready;

    headTags?: HeadTagDef[];

    @task
    @waitFor
    async setHeadTags(model: any) {
        const blocker = this.ready.getBlocker();
        const dateCreated = model.dateCreated;
        const dateModified = model.dateModified;
        const institutions = await model.target.get('affiliatedInstitutions');
        const metaTagsData = {
            title: model.name,
            identifier: model.guid,
            publishedDate: dateCreated ? moment(dateCreated).format('YYYY-MM-DD') : undefined,
            modifiedDate: dateModified ? moment(dateModified).format('YYYY-MM-DD') : undefined,
            institution: institutions.map((institution: Institution) => institution.get('name')),
        };
        this.set('headTags', this.metaTags.getHeadTags(metaTagsData));
        this.headTagsService.collectHeadTags();
        blocker.done();
    }

    async model(params: { guid: string }) {
        const { guid } = params;
        try {
            const file = await this.store.findRecord('file', guid);

            return file;
        } catch (error) {
            this.transitionTo('not-found', guid);
            throw error;
        }
    }

    afterModel(model: any) {
        taskFor(this.setHeadTags).perform(model);
    }

    @action
    didTransition() {
        this.analytics.trackPage(true, 'files');
    }
}
