
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'collections/config/environment';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
@tagName('')
export default class SearchResultNode extends Component.extend({
    didRender(...args: any[]) {
        this._super(...args);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element]);
    },
}) {
    @service analytics!: Analytics;

    @service theme!: Theme;

    hostAppName = config.hostAppName;

    maxTags: number = defaultTo(this.maxTags, 10);

    maxCreators: number = defaultTo(this.maxCreators, 10);

    maxDescription: number = defaultTo(this.maxDescription, 300);

    showBody: boolean = defaultTo(this.showBody, false);

    expandable: boolean = defaultTo(this.expandable, false);

    item: Node = this.item;

    domainRedirectProviders = [];

    @computed('item.description', 'maxDescription')
    get abbreviated(): boolean {
        return this.item!.description.length > this.maxDescription;
    }

    @computed('item.description')
    get abbreviation(): string {
        return this.item!.description.slice(0, this.maxDescription);
    }
}
