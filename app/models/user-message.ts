// app/models/user-message.js
import Model, { attr, belongsTo } from '@ember-data/model';
import InstitutionModel from 'ember-osf-web/models/institution';

export enum MessageTypeChoices {
    InstitutionalRequest = 'institutional_request',
}


export default class UserMessageModel extends Model {
  @attr('string') messageText;
  @attr('string') messageType: MessageTypeChoices;
  @attr('boolean') bccSender;
  @attr('boolean') replyTo;
  @belongsTo('institution') institution!: AsyncBelongsTo<InstitutionModel> & InstitutionModel;
}
