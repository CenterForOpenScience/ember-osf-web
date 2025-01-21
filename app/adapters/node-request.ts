import config from 'ember-osf-web/config/environment';
const { OSF: { apiUrl } } = config;
import OsfAdapter from './osf-adapter';

export default class NodeRequestAdapter extends OsfAdapter {
    urlForCreateRecord(modelName, snapshot) {
        const nodeId = snapshot.record.target;
        return `${apiUrl}/v2/nodes/${nodeId}/requests/`;
    }
}
