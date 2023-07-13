import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'collections/config/environment';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import styles from './styles';
import template from './template';

@layout(template, styles)
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
    maxTags = 10;
    maxCreators = 10;
    maxDescription = 300;
    showBody = false;
    expandable = false;

    item!: Node;

    domainRedirectProviders = [];

    @computed('item.description', 'maxDescription')
    get abbreviated(): boolean {
        return this.item!.description.length > this.maxDescription;
    }

    @computed('item.description', 'maxDescription')
    get abbreviation(): string {
        return this.item!.description.slice(0, this.maxDescription);
    }
}
