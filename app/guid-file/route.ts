import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import HeadTagsService from 'ember-cli-meta-tags/services/head-tags';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import moment from 'moment';

import GuidFileController from 'ember-osf-web/guid-file/controller';
import File from 'ember-osf-web/models/file';
import Institution from 'ember-osf-web/models/institution';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';

export default class GuidFile extends Route {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service('head-tags') headTagsService!: HeadTagsService;
    @service metaTags!: MetaTags;
    @service ready!: Ready;

    headTags?: HeadTagDef[];

    @task
    @waitFor
    async setHeadTags(model: any) {
        const blocker = this.get('ready').getBlocker();
        const dateCreated = model.file.get('dateCreated');
        const dateModified = model.file.get('dateModified');
        const institutions = await model.file.get('user').get('institutions');
        const metaTagsData = {
            title: model.file.get('name'),
            identifier: model.file.get('guid'),
            publishedDate: dateCreated ? moment(dateCreated).format('YYYY-MM-DD') : undefined,
            modifiedDate: dateModified ? moment(dateModified).format('YYYY-MM-DD') : undefined,
            institution: institutions.map((institution: Institution) => institution.get('name')),
        };
        this.set('headTags', this.get('metaTags').getHeadTags(metaTagsData));
        this.get('headTagsService').collectHeadTags();
        blocker.done();
    }

    async model(params: { guid: string }) {
        const { guid } = params;
        try {
            let file = this.store.peekAll('file').findBy('guid', guid);
            if (!file) {
                file = await this.store.findRecord('file', guid);
            }
            const fileId = file.get('id');
            const fileUser: User = await file.get('user');
            const user: User = await fileUser.reload();
            const files: File[] = (await user.loadAll('quickfiles'))
                .map((item: File) => {
                    item.set('isSelected', item.get('id') === fileId);
                    return item;
                });

            return {
                file,
                user,
                files,
            };
        } catch (error) {
            this.transitionTo('not-found', guid);
            throw error;
        }
    }

    afterModel(model: any) {
        taskFor(this.setHeadTags).perform(model);
    }

    resetController(controller: GuidFileController, isExiting: boolean, transition: Transition) {
        if (isExiting && transition.targetName !== 'error') {
            controller.set('revision', null);
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage(true, 'files');
    }
}
