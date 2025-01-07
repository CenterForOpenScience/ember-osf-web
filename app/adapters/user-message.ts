// app/adapters/user-message.js
import { inject as service } from '@ember/service';
import config from 'ember-osf-web/config/environment';
const { OSF: { apiUrl } } = config;
import OsfAdapter from './osf-adapter';

export default class UserMessageAdapter extends OsfAdapter {
    @service session;
    urlForCreateRecord(modelName, snapshot) {
        const userId = snapshot.record.messageRecipient;
        return `${apiUrl}/v2/users/${userId}/messages/`;
    }
}
