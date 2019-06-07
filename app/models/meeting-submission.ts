import { attr, belongsTo } from '@ember-decorators/data';
import DS from 'ember-data';

import OsfModel from './osf-model';
import UserModel from './user';

export interface MeetingSubmissionLinks {
    download?: string;
    self?: string;
    html?: string;
}

export default class MeetingSubmissionModel extends OsfModel {
    @attr('string') title!: string;
    @attr('string') meetingCategory!: string;
    @attr('string') authorName!: string;
    @attr('number') downloadCount!: number;
    @attr('date') created!: Date;
    @attr() links!: MeetingSubmissionLinks;

    @belongsTo('user', { inverse: null })
    author!: DS.PromiseObject<UserModel> & UserModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'meeting-submission': MeetingSubmissionModel;
    } // eslint-disable-line semi
}
