import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'ember-get-config';

export default class ShareAdapter extends JSONAPIAdapter {
    host = config.OSF.shareBaseUrl.replace(/\/$/, ''); // Remove trailing slash to avoid // in URLs
    namespace = 'api/v3';
}
