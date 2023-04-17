import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ShareAdapter extends JSONAPIAdapter {
    host = 'https://share.osf.io';
    namespace = 'api/v2';
}
