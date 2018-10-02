import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import styles from './styles';
import layout from './template';

@classNames('container')
export default class SubmitSections extends Component {
    layout = layout;
    styles = styles;
}
