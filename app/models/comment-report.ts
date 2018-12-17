import { attr, belongsTo } from '@ember-decorators/data';
import { buildValidations, validator } from 'ember-cp-validations';
import DS from 'ember-data';
<<<<<<< HEAD
=======

import Comment from 'ember-osf-web/models/comment';
import OsfModel from './osf-model';
>>>>>>> Respond to code review

import CommentModel from './comment';
import OsfModel from './osf-model';

/**
 * Model for OSF APIv2 comment reports. Primarily accessed via relationship fields.
 *
 * @class CommentReport
 */
<<<<<<< HEAD
export default class CommentReportModel extends OsfModel {
    @attr('fixstring') reporter!: ID;
=======
const Validations = buildValidations({
    message: [
        validator('presence', true),
        validator('length', { min: 1 }),
    ],
    category: [
        validator('presence', true),
    ],
});

export default class CommentReport extends OsfModel.extend(Validations) {
    @attr('fixstring') reporter!: string;
>>>>>>> Respond to code review
    @attr('fixstring') category!: string;
    @attr('fixstring') message!: string;

    @belongsTo('comment') comment!: DS.PromiseObject<CommentModel> & CommentModel;
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'comment-report': CommentReportModel;
    } // eslint-disable-line semi
}
