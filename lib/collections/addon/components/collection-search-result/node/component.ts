
import { classNames } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'collections/config/environment';
import I18N from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import { SubjectRef } from 'ember-osf-web/models/taxonomy';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
@classNames('row')
export default class SearchResultNode extends Component.extend({
    didRender(...args: any[]) {
        this._super(...args);
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.$()[0]]);
    },
}) {
    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service theme!: Theme;

    hostAppName = config.hostAppName;
    maxTags: number = defaultTo(this.maxTags, 10);
    maxSubjects: number = defaultTo(this.maxSubjects, 10);
    maxCreators: number = defaultTo(this.maxCreators, 10);
    maxDescription: number = defaultTo(this.maxDescription, 300);
    showBody: boolean = defaultTo(this.showBody, false);
    expandable: boolean = defaultTo(this.expandable, false);

    subjects: SubjectRef[] = defaultTo(this.subjects, []);

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
