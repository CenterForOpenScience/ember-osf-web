// app/models/user-message.js
import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserMessageModel extends Model {
  @attr('string') messageText;
  @attr('string') messageType;
  @attr('boolean') cc;
  @attr('boolean') replyTo;
  @belongsTo('institution') institution;
}
