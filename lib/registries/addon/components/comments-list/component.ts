import Component from '@ember/component';
import { TaskInstance } from 'ember-concurrency';
import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class CommentsList extends Component {
    // Required parameters
    modelTaskInstance!: TaskInstance<OsfModel>;
    relationshipName!: string;

    // Optional parameters
    queryParams?: object = {
        embed: 'user',
        'filter[deleted]': 'false',
    };
}
