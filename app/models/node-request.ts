// app/models/node-request.js
import Model, { attr, belongsTo } from '@ember-data/model';
import { AsyncBelongsTo } from '@ember-data/model';
import UserModel from 'ember-osf-web/models/user';
import NodeModel from 'ember-osf-web/models/node';
import InstitutionModel from 'ember-osf-web/models/institution';


export enum RequestTypeChoices {
    AccessRequest = 'access',
    InstitutionalRequest = 'institutional_request',
}

export default class NodeRequestModel extends Model {
  @attr('string') comment;
  @attr('string') requestedPermissions;
  @attr('string') requestType;
  @attr('boolean') bccSender;
  @attr('boolean') replyTo;
  @belongsTo('institution') institution!: AsyncBelongsTo<InstitutionModel> & InstitutionModel;
  @belongsTo('user') messageRecipent!: AsyncBelongsTo<UserModel> & UserModel;
  @belongsTo('node') node!: AsyncBelongsTo<NodeModel> & NodeModel;
}
