// app/models/user-message.js
import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserMessageModel extends Model {
    @attr('string') messageText;
    @attr('string') messageType;
    @belongsTo('institution') institution: AsyncBelongsTo<InstitutionModel> & InstitutionModel;
}
