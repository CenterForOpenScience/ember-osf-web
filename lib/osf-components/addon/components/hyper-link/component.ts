import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

@tagName('') // Don't wrap this component in a div
export default class HyperLink extends Component {
    static positionalParams = ['route', 'model'];

    layout = layout;

    @service analytics!: Analytics;

    route!: string;
    text?: string;
    analyticsLabel?: string;
    model?: any;
    hidden: boolean = defaultTo(this.hidden, false);

    @computed('route')
    get isEmber(): boolean {
        return !/^(?:http|\/)/i.test(this.route);
    }

    @action
    onclick(...args: any[]) {
        if (this.analyticsLabel) {
            return this.analytics.click('link', this.analyticsLabel, ...args);
        }

        return true;
    }
}
