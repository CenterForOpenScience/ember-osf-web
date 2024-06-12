import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'ember-osf-web/config/environment';

const { addonServiceUrl } = config.OSF;

export const addonServiceNamespace = 'v1';
export const addonServiceAPIUrl = `${addonServiceUrl}${addonServiceNamespace}/`;

export default class AddonServiceAdapter extends JSONAPIAdapter {
    host = addonServiceUrl.replace(/\/$/, ''); // Remove trailing slash to avoid // in URLs
    namespace = addonServiceNamespace;

    ajaxOptions(url: string, type: string, options?: any): object {
        const _ajaxopts: any = super.ajaxOptions(url, type, options);
        _ajaxopts.credentials = 'include';
        return _ajaxopts;
    }
}
