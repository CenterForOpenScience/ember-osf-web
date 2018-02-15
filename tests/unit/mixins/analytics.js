import Ember from 'ember';
import AnalyticsMixin from 'ember-osf/mixins/analytics';
import { moduleFor, test } from 'ember-qunit';

const { getOwner } = Ember;

const service = Ember.Service.extend({
    props: null,
    trackEvent(...args) {
        this.set('props', [...args]);
    },
});

moduleFor('mixin:analytics', {
    subject() {
        this.register('service:metrics', service);
        this.inject.service('metrics');
        const analyticsObject = Ember.Controller.extend(AnalyticsMixin);
        this.registry.register('test:subject', analyticsObject);
        return getOwner(this).lookup('test:subject');
    },
});

test('Google Analytics mixin', function(assert) {
    const subject = this.subject();
    assert.ok(AnalyticsMixin.detect(subject));

    Ember.run(() => {
        subject.send('click', 'test category', 'test label');
        assert.ok(subject.get('metrics.props'));
        subject.send('track', 'test category', 'test label');
        assert.ok(subject.get('metrics.props'));
    });
});
