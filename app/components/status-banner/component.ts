import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

interface StatusBannerInterface {
    messages: Array<{
        id: string;
        jumbo?: boolean;
        dismiss: boolean;
        extra?: any;
        class: string;
    }> | null;
}

export default class StatusBanner extends Component.extend({
    cookies: service(),
    messages: null,
    didReceiveAttrs() {
        const cookies = this.get('cookies');
        if (!cookies.read('status')) {
            return;
        }
        let status = cookies.read('status').replace(/\\054/g, ',').replace(/\\/g, ''); // decode commas and \\
        status = status.slice(1).slice(0, -1); // remove outside quotes
        let stat = JSON.parse(status);
        stat = stat.map(each => {
            const updated = each;
            updated.id = `status.${each.id}`;
            return updated;
        });
        this.set('messages', stat);
        cookies.clear('status', { domain: config.environment === 'development' ? 'localhost' : '.osf.io', path: '/' });
    },
}) implements StatusBannerInterface {
}
