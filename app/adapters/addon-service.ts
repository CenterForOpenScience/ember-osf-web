import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'ember-osf-web/config/environment';
import { inject as service } from '@ember/service';
import CurrentUser from 'ember-osf-web/services/current-user';

const { addonServiceUrl } = config.OSF;

export const addonServiceNamespace = 'v1';
export const addonServiceAPIUrl = `${addonServiceUrl}${addonServiceNamespace}/`;

export default class AddonServiceAdapter extends JSONAPIAdapter {
    host = addonServiceUrl.replace(/\/$/, ''); // Remove trailing slash to avoid // in URLs
    namespace = addonServiceNamespace;
    @service currentUser!: CurrentUser;

    ajaxOptions(url: string, type: string, options?: any): object {
        const _ajaxopts: any = super.ajaxOptions(url, type, options);
        _ajaxopts.credentials = 'include';
        return _ajaxopts;
    }

    ajax(url, method, options) {
        return super.ajax(method === 'GET' ? this.transformUrl(url) : url, method, options);
    }

    transformUrl(url: string): string {
        const { viewOnlyToken } = this.currentUser;
        if (!viewOnlyToken) {
            return url;
        }
        const returnUrl = new URL(url);
        returnUrl.searchParams.set('view_only', viewOnlyToken);
        return returnUrl.toString();
    }

}
