// app/models/user-message.js
import Model, { attr, belongsTo } from '@ember-data/model';

export enum MessageTypeChoices {
    InstitutionalRequest = 'institutional_request',
}


export default class UserMessageModel extends Model {
  @attr('string') messageText;
  @attr('string') messageType: MessageTypeChoices;
  @attr('boolean') cc;
  @attr('boolean') replyTo;
  @belongsTo('institution') institution;
}
