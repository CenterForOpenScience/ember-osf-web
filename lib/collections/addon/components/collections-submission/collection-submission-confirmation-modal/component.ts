import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';

import { layout } from 'ember-osf-web/decorators/component';

import style from './styles';
import template from './template';

@layout(template, style)
export default class CollectionSubmissionConfirmationModal extends Component {
    @tracked removeReason?: string;
}
