import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';

import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import { Answer, Question } from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import layout from './template';

const { OSF: { url: baseURL } } = config;

export default class NodeCard extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    // Optional parameters
    node?: Node | Registration;
    delete?: (node: Node) => void;
    showTags: boolean = defaultTo(this.showTags, false);
    analyticsScope?: string;

    // Private properties
    searchUrl = pathJoin(baseURL, 'search');

    @computed('node', 'node.isRegistration', 'node.registrationSchema', 'node.registeredMeta.@each')
    get registrationTitle(): string | undefined {
        if (this.node && this.node.isRegistration) {
            const registration = this.node as Registration;
            const titleQuestion = registration.registrationSchema.get('schema') &&
                registration.registrationSchema.get('schema').pages.reduce(
                    (acc: Question, page) => (acc || page.questions.filter(
                        question => question.title === 'Title',
                    ).firstObject),
                    undefined,
                );

            if (titleQuestion && typeof registration.registeredMeta === 'object' &&
                titleQuestion.qid in registration.registeredMeta) {
                const answer = registration.registeredMeta[titleQuestion.qid];
                if ('value' in answer) {
                    return (answer as Answer).value;
                }
            }
        }
        return undefined;
    }

    @computed('analyticsScope')
    get analyticsScopePrefix() {
        return this.analyticsScope ? `${this.analyticsScope} - ` : '';
    }

    @action
    clickTag(tag: string): void {
        this.analytics.click('link', `${this.analyticsScopePrefix}Node Card - Tag: ${tag}`);
        window.location.assign(`${this.searchUrl}?q=(tags:"${tag}")`);
    }
}
