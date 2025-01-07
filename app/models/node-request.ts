// app/models/node-request.js
import Model, { attr, belongsTo } from '@ember-data/model';

export enum RequestTypeChoices {
    AccessRequest = 'access',
    InstitutionalRequest = 'institutional_request',
}

export default class NodeRequestModel extends Model {
  @attr('string') comment;
  @attr('string') requestedPermission;
  @attr('string') requestType;
  @attr('boolean') bccSender;
  @attr('boolean') replyTo;
  @belongsTo('institution') institution;
  @belongsTo('user') messageRecipent;
  @belongsTo('node') node;

}
