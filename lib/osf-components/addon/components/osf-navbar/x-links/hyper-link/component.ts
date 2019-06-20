import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
@tagName('') // Don't wrap this component in a div
export default class HyperLink extends Component {
    static positionalParams = ['positionalRoute', 'positionalModel'];

    @service analytics!: Analytics;

    route?: string;
    positionalRoute!: string;

    model?: any;
    positionalModel?: any;

    text?: string;
    analyticsLabel?: string;
    hidden: boolean = defaultTo(this.hidden, false);
    queryParams?: { [k: string]: string };
    params: any[] = defaultTo(this.params, []);
    onClicked?: () => void;

    @computed('route', 'positionalRoute')
    get resolvedRoute(): string {
        return this.route || this.positionalRoute;
    }

    @computed('model', 'positionalModel')
    get resolvedModel(): any {
        return this.model || this.positionalModel;
    }

    @computed('resolvedRoute')
    get isEmber(): boolean {
        return !/^(?:http|\/)/i.test(this.resolvedRoute);
    }

    @computed('params', 'queryParams', 'resolvedModel', 'resolvedRoute')
    get _params() {
        const params = this.params.slice();
        if (this.queryParams) {
            params.push({ isQueryParams: true, values: this.queryParams });
        }
        if (this.resolvedModel) {
            params.unshift(this.resolvedModel);
        }
        params.unshift(this.resolvedRoute);
        return params;
    }

    @action
    onclick() {
        if (this.onClicked) {
            this.onClicked();
        }
    }
}
