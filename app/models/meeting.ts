import { attr } from '@ember-decorators/data';

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
    @attr('fixstring') submission1Email!: string;
    @attr('fixstring') submission2Email!: string;
    @attr('boolean') active!: boolean;
    @attr('fixstring') logoUrl!: string;
    @attr('object') fieldNames!: object;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        meeting: MeetingModel;
    } // eslint-disable-line semi
}
