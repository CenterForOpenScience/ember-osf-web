
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import requiredAction from 'ember-osf-web/decorators/required-action';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import styles from './styles';
import layout from './template';

export default class ProjectContributors extends Component {
    layout = layout;
    styles = styles;

    node: Node = this.node;
    contributors: ArrayProxy<Contributor> = this.contributors;

    @requiredAction discard!: () => void;
    @requiredAction continue!: () => void;
}
