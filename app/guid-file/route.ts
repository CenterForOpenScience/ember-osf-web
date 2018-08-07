import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import HeadTagsService from 'ember-cli-meta-tags/services/head-tags';
import { task } from 'ember-concurrency';
import moment from 'moment';

import GuidFileController from 'ember-osf-web/guid-file/controller';
import File from 'ember-osf-web/models/file';
import Institution from 'ember-osf-web/models/institution';
import User from 'ember-osf-web/models/user';
import ResolvedGuidRoute from 'ember-osf-web/resolve-guid/resolved-guid-route';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
import loadAll from 'ember-osf-web/utils/load-relationship';

export default class GuidFile extends ResolvedGuidRoute {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service('head-tags') headTagsService!: HeadTagsService;
    @service metaTags!: MetaTags;
    @service ready!: Ready;

    headTags?: HeadTagDef[];

    setHeadTags = task(function *(this: GuidFile, model: any) {
        const blocker = this.get('ready').getBlocker();
        const dateCreated = model.file.get('dateCreated');
        const dateModified = model.file.get('dateModified');
        const institutions = yield model.file.get('user').get('institutions');
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
    });

    async model(this: GuidFile, params: { file_guid: string }) {
        try {
            const file: File = await this.get('resolveGuid').perform(params.file_guid, 'file');
            const fileId = file.get('id');
            const fileUser: User = await file.get('user');
            const user: User = await fileUser.reload();
            const files: File[] = (await loadAll(user, 'quickfiles', { 'page[size]': 100 }))
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
            this.transitionTo('not-found', params.file_guid);
            throw error;
        }
    }

    afterModel(this: GuidFile, model: any) {
        this.get('setHeadTags').perform(model);
    }

    resetController(controller: GuidFileController, isExiting: boolean, transition: { targetName: string }) {
        if (isExiting && transition.targetName !== 'error') {
            controller.set('revision', null);
        }
    }

    @action
    didTransition() {
        this.analytics.trackPage(true, 'files');
    }
}
