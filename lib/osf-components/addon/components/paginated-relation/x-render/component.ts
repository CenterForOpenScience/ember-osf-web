import Component from '@ember/component';
import layout from './template';

export default class XRender extends Component {
    layout = layout;

    yieldObj?: any;
}
