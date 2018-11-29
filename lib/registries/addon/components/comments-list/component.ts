import { layout } from '@ember-decorators/component';
import Component from '@ember/component';
import { TaskInstance } from 'ember-concurrency';
import OsfModel from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/osf-model';
import styles from './styles';
import template from './template';

@layout(template)
export default class CommentsList extends Component {
    styles = styles;

    node!: Registration;

    // Required parameters
    modelTaskInstance!: TaskInstance<OsfModel>;
    relationshipName!: string;

    // Optional parameters
    analyticsScope?: string;
    reloadComments?: (action: (page?: number) => void) => void;
    queryParams?: object = { embed: 'users' };
}
