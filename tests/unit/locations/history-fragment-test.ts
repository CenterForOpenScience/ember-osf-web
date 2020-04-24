/* eslint-disable max-classes-per-file */
import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import sinon from 'sinon';

import HistoryLocation from 'ember-osf-web/locations/history';

interface HistoryState {
    path: string;
    uuid: string;
}

class FakeHistory {
    state: HistoryState | null = null;

    private states: HistoryState[] = [];

    replaceState(state: HistoryState) {
        this.state = state;
        this.states[0] = state;
    }

    pushState(state: HistoryState) {
        this.state = state;
        this.states.unshift(state);
    }
}

class OsfRouterStub extends Service {
    currentTransitionTargetFragment: string | null = null;

    transitionTo() {
        // empty
    }
}

class ReadyStub extends Service {
    ready() {
        return Promise.resolve();
    }
}

function mockBrowserLocation(path: string): typeof window.location {
    // This is a neat trick to auto-magically extract the hostname from any
    // url by letting the browser do the work ;)
    const tmp = document.createElement('a');
    tmp.href = path;

    const protocol = !tmp.protocol || tmp.protocol === ':' ? 'http' : tmp.protocol;
    const pathname = tmp.pathname.match(/^\//) ? tmp.pathname : `/${tmp.pathname}`;

    return {
        hash: tmp.hash,
        host: tmp.host || 'localhost',
        hostname: tmp.hostname || 'localhost',
        href: tmp.href,
        pathname,
        port: tmp.port || '',
        protocol,
        search: tmp.search,
    } as typeof window.location;
}

module('Unit | Location | history with fragments', hooks => {
    setupTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:osf-router', OsfRouterStub);
    });

    test('replaceURL preserves URL fragment', assert => {
        const testCases = [
            { start: '/', replaceWith: '/boron', expect: '/boron' },
            { start: '/boron', replaceWith: '/boron#summary', expect: '/boron#summary' },
            { start: '/boron#summary', replaceWith: '/boron', expect: '/boron#summary' },
            { start: '/boron/#summary', replaceWith: '/boron', expect: '/boron#summary' },
            { start: '/boron#summary', replaceWith: '/borox', expect: '/borox' },
            { start: '/boron?foo#summary', replaceWith: '/boron', expect: '/boron' },
            { start: '/boron?foo#summary', replaceWith: '/boron?foo', expect: '/boron?foo#summary' },
            { start: '/boron/?foo#summary', replaceWith: '/boron?foo', expect: '/boron?foo#summary' },
        ];
        for (const testCase of testCases) {
            const historyLocation = HistoryLocation.create({
                history: new FakeHistory(),
                location: mockBrowserLocation(testCase.start),
                scrollToFragment: { perform: () => null },
                osfRouter: OsfRouterStub.create() as any,
                ready: ReadyStub.create() as any,
            });

            historyLocation.replaceURL(testCase.replaceWith);

            assert.equal(
                historyLocation.history.state.path,
                testCase.expect,
                `Correctly handled fragment replacing '${testCase.start}' with '${testCase.replaceWith}'`,
            );
        }
    });

    test('onUpdateURL callback called only when path/query update', assert => {
        const testCases = [
            // yes callback
            { previousURL: '/', newURL: '/foo', expectCall: true },
            { previousURL: '/foo', newURL: '/', expectCall: true },
            { previousURL: '/boron', newURL: '/boron?foo', expectCall: true },
            { previousURL: '/boron/#summary', newURL: '/boron/foo#summary', expectCall: true },
            { previousURL: '/boron/#summary', newURL: '/boron/foo#foo', expectCall: true },

            // no callback
            { previousURL: '/', newURL: '/#foo', expectCall: false },
            { previousURL: '/boron', newURL: '/boron#summary', expectCall: false },
            { previousURL: '/boron#summary', newURL: '/boron#foo', expectCall: false },
            { previousURL: '/boron#summary', newURL: '/boron/#foo', expectCall: false },
            { previousURL: '/boron#summary', newURL: '/boron/#summary', expectCall: false },
            { previousURL: '/boron/#summary', newURL: '/boron/#foo', expectCall: false },
            { previousURL: '/boron/#summary', newURL: '/boron#foo', expectCall: false },
            { previousURL: '/boron/#summary', newURL: '/boron#summary', expectCall: false },
            { previousURL: '/boron?foo', newURL: '/boron?foo', expectCall: false },
            { previousURL: '/boron?foo', newURL: '/boron?foo#hash', expectCall: false },
            { previousURL: '/boron?foo', newURL: '/boron/?foo', expectCall: false },
            { previousURL: '/boron?foo', newURL: '/boron/?foo#hash', expectCall: false },
            { previousURL: '/boron/?foo', newURL: '/boron/?foo', expectCall: false },
            { previousURL: '/boron/?foo', newURL: '/boron/?foo#hash', expectCall: false },
            { previousURL: '/boron/?foo', newURL: '/boron?foo', expectCall: false },
            { previousURL: '/boron/?foo', newURL: '/boron?foo#hash', expectCall: false },
            { previousURL: '/boron?foo#summary', newURL: '/boron?foo', expectCall: false },
            { previousURL: '/boron?foo#summary', newURL: '/boron?foo#hash', expectCall: false },
            { previousURL: '/boron?foo#summary', newURL: '/boron/?foo#summary', expectCall: false },
            { previousURL: '/boron?foo#summary', newURL: '/boron?foo#hash', expectCall: false },
            { previousURL: '/boron/?foo#summary', newURL: '/boron?foo', expectCall: false },
            { previousURL: '/boron/?foo#summary', newURL: '/boron?foo#hash', expectCall: false },
            { previousURL: '/boron/?foo#summary', newURL: '/boron/?foo#summary', expectCall: false },
            { previousURL: '/boron/?foo#summary', newURL: '/boron?foo#hash', expectCall: false },
        ];

        assert.expect(testCases.length);

        for (const testCase of testCases) {
            const historyLocation = HistoryLocation.create({
                history: new FakeHistory(),
                _previousURL: testCase.previousURL,
                location: mockBrowserLocation(testCase.newURL),
            });

            const callback = sinon.stub();

            historyLocation.onUpdateURL(callback);
            window.dispatchEvent(new Event('popstate'));
            historyLocation.destroy();

            if (testCase.expectCall) {
                assert.ok(
                    callback.calledOnceWithExactly(testCase.newURL),
                    `onUpdateURL callback called on transiton from ${testCase.previousURL} to ${testCase.newURL}`,
                );
            } else {
                assert.ok(
                    callback.notCalled,
                    `onUpdateURL callback not called on transiton from ${testCase.previousURL} to ${testCase.newURL}`,
                );
            }
        }
    });
});
/* eslint-enable max-classes-per-file */
