import { getOwner } from '@ember/application';
import Service from '@ember/service';
import Controller from '@ember/controller';
import { run } from '@ember/runloop';
import AnalyticsMixin from 'ember-osf-web/mixins/analytics';
import { moduleFor, test } from 'ember-qunit';

const service = Service.extend({
    props: null,
    trackEvent(...args) {
        this.set('props', [...args]);
    },
});

moduleFor('mixin:analytics', {
    subject() {
        this.register('service:metrics', service);
        this.inject.service('metrics');
        const analyticsObject = Controller.extend(AnalyticsMixin);
        this.registry.register('test:subject', analyticsObject);
        return getOwner(this).lookup('test:subject');
    },
});

test('Google Analytics mixin', function(assert) {
    const subject = this.subject();
    assert.ok(AnalyticsMixin.detect(subject));

    run(() => {
        subject.send('click', 'test category', 'test label');
        assert.ok(subject.get('metrics.props'));
        subject.send('track', 'test category', 'test label');
        assert.ok(subject.get('metrics.props'));
    });
});
