import config from 'ember-osf-web/config/environment';
const { OSF: { apiUrl } } = config;
import OsfAdapter from './osf-adapter';

export default class UserMessageAdapter extends OsfAdapter {
    urlForCreateRecord(modelName, snapshot) {
        const userId = snapshot.record.messageRecipient;
        return `${apiUrl}/v2/users/${userId}/messages/`;
    }
}
