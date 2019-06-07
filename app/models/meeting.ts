import { attr, hasMany } from '@ember-decorators/data';
import DS from 'ember-data';

import MeetingSubmissionModel from 'ember-osf-web/models/meeting-submission';
import OsfModel from './osf-model';

export interface FieldNames {
    /* eslint-disable camelcase */
    mail_message_body: string;
    add_submission: string;
    submission1_plural: string;
    meeting_title_type: string;
    mail_subject: string;
    submission2_plural: string;
    mail_attachment: string;
    submission2: string;
    submission1: string;
    homepage_link_text: string;
    /* eslint-enable camelcase */
}

export default class MeetingModel extends OsfModel {
    @attr('fixstring') name!: string;
    @attr('number') submissionsCount!: number;
    @attr('fixstring') location!: string;
    @attr('date') startDate!: Date;
    @attr('date') endDate!: Date;
    @attr('fixstring') infoUrl!: string;
    @attr('fixstring') typeOneSubmissionEmail!: string;
    @attr('fixstring') typeTwoSubmissionEmail!: string;
    @attr('boolean') isAcceptingTypeOne!: boolean;
    @attr('boolean') isAcceptingTypeTwo!: boolean;
    @attr('boolean') active!: boolean;
    @attr('fixstring') logoUrl!: string;
    @attr('object') fieldNames!: FieldNames;
    @hasMany('meeting-submission') submissions!: DS.PromiseManyArray<MeetingSubmissionModel>;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        meeting: MeetingModel;
    } // eslint-disable-line semi
}
