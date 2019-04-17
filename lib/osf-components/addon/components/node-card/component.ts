import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Node, { NodeType } from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import { Question } from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class NodeCard extends Component {
    @service analytics!: Analytics;

    // Optional parameters
    node?: Node | Registration;
    delete?: (node: Node) => void;
    showTags: boolean = defaultTo(this.showTags, false);
    readOnly: boolean = defaultTo(this.readOnly, false);

    // Private properties
    searchUrl = pathJoin(baseURL, 'search');

    @computed('node', 'node.{isRegistration,registrationSchema,registeredMeta.@each}')
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
                    return answer.value as string;
                }
            }
        }
        return undefined;
    }

    @computed('readOnly', 'node', 'node.{nodeType,userHasWritePermission}')
    get showDropdown() {
        return !this.readOnly && this.node && this.node.nodeType === NodeType.Fork && this.node.userHasWritePermission;
    }
}
