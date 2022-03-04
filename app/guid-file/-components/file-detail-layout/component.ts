import { action } from '@ember/object';
import Component from '@glimmer/component';


interface Args {
    rightColumnClosed: boolean;
}

export default class FileDetailLayout extends Component<Args> {
    @action
    noop() {
        // do nothing
    }
}

