import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

@tagName('') // Don't wrap this component in a div
export default class HyperLink extends Component {
    static positionalParams = ['positionalRoute', 'positionalModel'];

    layout = layout;

    @service analytics!: Analytics;

    route?: string;
    positionalRoute!: string;

    model?: any;
    positionalModel?: any;

    text?: string;
    analyticsLabel?: string;
    hidden: boolean = defaultTo(this.hidden, false);

    @computed('route', 'positionalRoute')
    get resolvedRoute(): string {
        return this.route || this.positionalRoute;
    }

    @computed('model', 'positionalModel')
    get resolvedModel(): any {
        return this.model || this.positionalModel;
    }

    @computed('route', 'positionalRoute')
    get isEmber(): boolean {
        return !/^(?:http|\/)/i.test(this.resolvedRoute);
    }

    @action
    onclick(...args: any[]) {
        if (this.analyticsLabel) {
            return this.analytics.click('link', this.analyticsLabel, ...args);
        }

        return true;
    }
}
