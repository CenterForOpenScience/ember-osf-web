import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'ember-osf-web/config/environment';

const osfUrl = config.OSF.url;

export default class ShareAdapter extends JSONAPIAdapter {
    host = config.OSF.shareBaseUrl.replace(/\/$/, ''); // Remove trailing slash to avoid // in URLs
    namespace = 'api/v3';

    queryRecord(store: any, type: any, query: any) {
        // check if we aren't serving locally, otherwise add accessService query param to card/value searches
        if (['index-card-search', 'index-value-search'].includes(type.modelName) && !osfUrl.includes('localhost')) {
            query.cardSearchFilter['accessService'] = osfUrl;
        }
        return super.queryRecord(store, type, query);
    }
}
