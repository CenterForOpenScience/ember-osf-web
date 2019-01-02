import { layout } from '@ember-decorators/component';
import Component from '@ember/component';
import styles from './styles';
import template from './template';

@layout(template)
export default class InstitutionsList extends Component {
    styles = styles;

    reloadList?: (page?: number) => void; // bound by paginated-list
}
