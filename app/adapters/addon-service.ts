import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'ember-osf-web/config/environment';

const addonServiceUrl = config.OSF.url;

export default class AddonServiceAdapter extends JSONAPIAdapter {
    host = addonServiceUrl.replace(/\/$/, ''); // Remove trailing slash to avoid // in URLs
    // TODO: namespace??
}
