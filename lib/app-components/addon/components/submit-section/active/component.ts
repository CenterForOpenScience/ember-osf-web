import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import styles from './styles';
import layout from './template';

@tagName('')
export default class SubmitSectionActive extends Component {
    layout = layout;
    styles = styles;

    title: string = this.title;
    isOpen: boolean = this.isOpen;
    didSave: boolean = this.didSave;
    panel: any = this.panel;
    description?: string = this.description;
}
