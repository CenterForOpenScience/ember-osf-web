import Component from '@ember/component';
import { TaskInstance } from 'ember-concurrency';
import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class CommentsList extends Component {
    node!: Registration;

    // Required parameters
    modelTaskInstance!: TaskInstance<OsfModel>;
    relationshipName!: string;

    // Optional parameters
    analyticsScope?: string;
    reloadComments?: (action: (page?: number) => void) => void;
    queryParams?: object = { embed: 'users', 'filter[deleted]': 'false' };
}
