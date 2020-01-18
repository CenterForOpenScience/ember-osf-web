import { assert } from '@ember/debug';
import Ember from 'ember';

const WindowLocation = {
    assignLocation(url: string) {
        assert(
            'WindowLocation.assignLocation should not be used in a testing environment. Stub it instead.',
            !Ember.testing,
        );
        window.location.assign(url);
    },

    reloadPage() {
        assert(
            'WindowLocation.reloadPage should not be used in a testing environment. Stub it instead.',
            !Ember.testing,
        );
        window.location.reload();
    },
};

export default WindowLocation;
