import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

// import styles from './styles';
import template from './template';

@layout(template)
export default class CollectionSubmissionConfirmationModal extends Component {
    i18nKeyPrefix = 'collections.collection_submission_confirmation_modal.';
}
