import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import moment from 'moment';

import Node, { NodeType } from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import { Question } from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import layout from './template';

export default class NodeCard extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    // Optional parameters
    node?: Node | Registration;
    showTags: boolean = defaultTo(this.showTags, false);
    onClickTag?: (tag: string) => void;

    @computed('node', 'node.nodeType')
    get nodeType() {
        return this.node ? this.node.nodeType : NodeType.Generic;
    }

    @computed('node.dateCreated')
    get timestamp(): string {
        if (!this.node) {
            return '';
        }
        return moment(this.node.dateCreated).format('YYYY-MM-DD h:mm A');
    }

    @computed('node.registrationSchema.name', 'node.registeredMeta.q1.value')
    get registrationTitle(): string | undefined {
        if (this.node && this.node.isRegistration) {
            const registration = this.node as Registration;
            const titleQuestion = registration.registrationSchema.get('schema').pages.reduce(
                (acc: Question, page) => (acc || page.questions.filter(
                    question => question.title === 'Title',
                ).firstObject),
                undefined,
            );
            return titleQuestion ? registration.registeredMeta[titleQuestion.qid].value : undefined;
        }
        return undefined;
    }

    @action
    clickTag(tag: string): void {
        if (this.onClickTag) {
            this.onClickTag(tag);
        }
    }
}
