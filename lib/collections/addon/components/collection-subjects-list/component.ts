import Component from '@ember/component';
import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Subject from 'ember-osf-web/models/subject';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class CollectionMetadata extends Component {
    subjects: Subject[] = defaultTo(this.subjects, []);

    @requiredAction
    onClickSubject!: () => void;
}
