// import { action } from '@ember/object';
// import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
// import { taskFor } from 'ember-concurrency-ts';
// import Media from 'ember-responsive';

interface Args {
    rightColumnClosed: boolean;
}

export default class FileDetailLayout extends Component<Args> {
    @action
    noop() {
        // do nothing
    }
}

