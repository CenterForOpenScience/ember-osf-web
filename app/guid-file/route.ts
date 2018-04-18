import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Computed from '@ember/object/computed';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import File from 'ember-osf-web/models/file';
import User from 'ember-osf-web/models/user';
import { analyticPrivacy } from 'ember-osf-web/services/analytics';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
import loadAll from 'ember-osf-web/utils/load-relationship';
import moment from 'moment';

export default class GuidFile extends Route {
    @service analytics;
    @service currentUser;
    @service('head-tags') headTagsService;
    @service metaTags: Computed<MetaTags>;
    @service ready: Computed<Ready>;

    headTags: HeadTagDef[];

    setHeadTags = task(function* (this: GuidFile, model) {
        const blocker = this.get('ready').getBlocker();
        const dateCreated = model.file.get('dateCreated');
        const dateModified = model.file.get('dateModified');
        const institutions = yield model.file.get('user').get('institutions');
        const metaTagsData = {
            title: model.file.get('name'),
            type: 'file',
            identifier: model.file.get('guid'),
            publishedDate: dateCreated ? moment(dateCreated).format('YYYY-MM-DD') : undefined,
            modifiedDate: dateModified ? moment(dateModified).format('YYYY-MM-DD') : undefined,
            institution: institutions.map(institution => institution.get('name')),
        };
        this.set('headTags', this.get('metaTags').getHeadTags(metaTagsData));
        this.get('headTagsService').collectHeadTags();
        blocker.done();
    });

    async model(this: GuidFile, params) {
        try {
            const file: File = await this.store.findRecord('file', params.file_guid);
            const fileId = file.get('id');
            const fileUser: User = await file.get('user');
            const user: User = await fileUser.reload();
            const files: File[] = (await loadAll(user, 'quickfiles', { 'page[size]': 100 }))
                .map(item => {
                    item.set('isSelected', item.get('id') === fileId);
                    return item;
                });

            return {
                file,
                user,
                files,
            };
        } catch (error) {
            this.transitionTo('not-found', params.file_guid);
            throw error;
        }
    }

    afterModel(this: GuidFile, model) {
        this.get('setHeadTags').perform(model);
    }

    resetController(controller, isExiting, transition) {
        if (isExiting && transition.targetName !== 'error') {
            controller.set('revision', null);
        }
    }

    @action
    didTransition(this: GuidFile) {
        this.get('analytics').trackPage(analyticPrivacy.public, 'files');
    }
}
