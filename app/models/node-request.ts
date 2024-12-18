// app/models/node-request.js
import Model, { attr, belongsTo } from '@ember-data/model';

export default class NodeRequestModel extends Model {
  @attr('string') comment;
  @attr('string') request_type;
  @attr('boolean') bcc_sender;
  @attr('boolean') replyTo;
  @belongsTo('institution') institution;
  @belongsTo('user') message_recipent;
  @belongsTo('node') node;

}
