import { attr, belongsTo } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';

import CommentModel from './comment';
import OsfModel from './osf-model';

/**
 * Model for OSF APIv2 comment reports. Primarily accessed via relationship fields.
 *
 * @class CommentReport
 */
const Validations = buildValidations({
    message: [
        validator('presence', true),
        validator('length', { min: 1, max: 1000 }),
    ],
    category: [
        validator('presence', true),
    ],
});

export default class CommentReportModel extends OsfModel.extend(Validations) {
    @attr('fixstring') reporter!: string;
    @attr('fixstring') category!: string;
    @attr('fixstring') message!: string;

    @belongsTo('comment') comment!: DS.PromiseObject<CommentModel> & CommentModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'comment-report': CommentReportModel;
    } // eslint-disable-line semi
}
