import $ from 'jquery';
import Service from '@ember/service';
import { module, skip, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import FactoryGuy, {
    mockFindRecord, mockUpdate, mockReload,
    setupFactoryGuy, make,
} from 'ember-data-factory-guy';

// TODO: All the tests here that expect a failed request/assertion are failing. Those fail with "assertion called
// after test is finished".
// Tests expecting all assertions to pass were working under the "old" way of writing tests, now some pass, some fail.
// Maybe the whole file manager needs to be looked at. Here is the ticket looking at refactoring tests:
// https://openscience.atlassian.net/browse/EMB-134

// assert once for the path and once if queryParams is specified
async function assertURL(assert, actual, expected, queryParams) {
    if (!queryParams) {
        assert.equal(actual, expected, 'correct request URL');
        return;
    }
    const [actualBase, actualParams] = actual.split('?');
    assert.equal(actualBase, expected, 'correct base URL');

    const expectedParams = [];
    for (const key of Object.keys(queryParams)) {
        expectedParams.push(`${key}=${queryParams[key]}`);
    }
    assert.deepEqual(actualParams.split('&').sort(), expectedParams.sort(), 'correct query params');
}

// assert once for each expected header
async function assertHeaders(assert, actual, expected) {
    for (const header of Object.keys(expected || {})) {
        assert.equal(actual[header], expected[header], `request has expected header '${header}'`);
    }
}

// assert once for each expected ajax setting
async function assertSettings(assert, actual, expected) {
    for (const s of Object.keys(expected)) {
        // Check for a JSON payload
        if (typeof expected[s] === 'object' &&
            typeof actual[s] === 'string') {
            const payload = JSON.parse(actual[s]);
            assert.deepEqual(payload, expected[s], `request has expected JSON payload '${s}'`);
        } else {
            assert.equal(actual[s], expected[s], `request has expected option '${s}'`);
        }
    }
}

/*
 * assertions:
 *  - once for expectedRequest.url
 *  - once for expectedRequest.query
 *  - once for each key in expectedRequest.headers
 *  - once for each key in expectedRequest.settings
 */
function mockWaterbutler(assert, expectedRequest, response) {
    $.mockjax(function (requestSettings) {
        if (requestSettings.url.indexOf(expectedRequest.url) === 0) {
            return {
                response () {
                    assertURL(assert, requestSettings.url, expectedRequest.url, expectedRequest.query);
                    assertHeaders(assert, requestSettings.headers, expectedRequest.headers);
                    assertSettings(assert, requestSettings, expectedRequest.settings);
                    this.responseText = response.data || {};
                    this.status = response.status;
                },
            };
        }
    });
}


const fakeUserID = 'thisisafakeuseridbanana';
const sessionStub = Service.extend({
    data: {
        authenticated: {
            id: fakeUserID,
        },
    },
});


module('Unit | Service | file manager', function(hooks) {
    setupTest(hooks);
    setupFactoryGuy(hooks);

    hooks.beforeEach(function() {
        this.owner.register('service:session', sessionStub);
    });
    test('getContents sends valid waterbutler request', async function (assert) {
        assert.expect(3);
        const service = this.owner.lookup('service:file-manager');
        const file = make('file');

        const request = {
            url: file.get('links').download,
            settings: { method: 'GET' },
        };
        const response = {
            status: 200,
            data: 'file contents here',
        };
        mockWaterbutler(assert, request, response);

        const data = await service.getContents(file);

        assert.equal(data, response.data);
    });
    skip('getContents passes along error', async function (assert) {
        assert.expect(4);
        const service = this.owner.lookup('service:file-manager');
        const file = make('file');

        const request = {
            url: file.get('links').download,
            settings: { method: 'GET' },
        };
        const response = { status: 404 };

        try {
            mockWaterbutler(assert, request, response);
            await service.getContents(file);
            assert.ok(false, 'promise should reject');
        } catch (e) {
            assert.ok(true, 'promise rejects on error');
        }
    });

    skip('updateContents sends valid waterbutler request', async function (assert) {
        assert.expect(6);
        const service = this.owner.lookup('service:file-manager');
        const file = make('file');

        const request = {
            url: file.get('links').upload,
            query: { kind: 'file' },
            settings: { method: 'PUT', data: 'contents contents' },
        };
        const response = {
            status: 200,
        };
        const freshModel = FactoryGuy.build('file', {
            id: file.id,
            dateModified: new Date(),
        });
        mockFindRecord('file').returns({ json: freshModel });

        mockWaterbutler(assert, request, response);

        const fresh = await service.updateContents(file, request.settings.data);
        assert.equal(fresh.get('id'), file.get('id'));
    });
});


skip('updateContents passes along error', function (assert) {
    assert.expect(6);
    const service = this.subject();
    const file = FactoryGuy.make('file');
    const done = assert.async();

    const request = {
        url: file.get('links').upload,
        query: { kind: 'file' },
        settings: { method: 'PUT', data: 'contents contents' },
    };
    const response = {
        status: 404,
    };
    mockWaterbutler(assert, request, response);

    service.updateContents(file, request.settings.data).then(function () {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function () {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

skip('addSubfolder sends valid waterbutler request', function (assert) {
    assert.expect(4);
    const service = this.subject();
    const folder = FactoryGuy.make('file', 'isFolder');
    const done = assert.async();

    const request = {
        url: folder.get('links').new_folder,
        query: { name: 'fooname', kind: 'folder' },
        settings: { method: 'PUT' },
    };
    const response = { status: 200 };
    mockWaterbutler(assert, request, response);

    const p = service.addSubfolder(folder, request.query.name);

    p.then(function () {
        done();
    }).catch(function () {
        done();
    });
});

skip('addSubfolder passes along error', function (assert) {
    assert.expect(5);
    const service = this.subject();
    const folder = FactoryGuy.make('file', 'isFolder');
    const done = assert.async();

    const request = {
        url: folder.get('links').new_folder,
        query: { name: 'fooname', kind: 'folder' },
        settings: { method: 'PUT' },
    };
    const response = {
        status: 404,
    };
    mockWaterbutler(assert, request, response);

    service.addSubfolder(folder, request.query.name).then(function () {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function () {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

skip('uploadFile sends valid waterbutler request', function (assert) {
    assert.expect(5);
    const service = this.subject();
    const folder = FactoryGuy.make('file', 'isFolder');
    const done = assert.async();

    const request = {
        url: folder.get('links').upload,
        query: { name: 'fooname', kind: 'file' },
        settings: { method: 'PUT', data: 'contents contents' },
    };
    const response = {
        status: 200,
    };
    mockWaterbutler(assert, request, response);

    const p = service.uploadFile(folder, request.query.name, request.settings.data);

    p.then(function () {
        done();
    }).catch(function () {
        done();
    });
});

skip('uploadFile passes along error', function (assert) {
    assert.expect(6);
    const service = this.subject();
    const file = FactoryGuy.make('file', 'isFolder');
    const done = assert.async();

    const request = {
        url: file.get('links').upload,
        query: { name: 'fooname', kind: 'file' },
        settings: { method: 'PUT', data: 'contents contents' },
    };
    const response = {
        status: 401,
    };
    mockWaterbutler(assert, request, response);

    service.uploadFile(file, request.query.name, request.settings.data).then(function () {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function () {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

skip('move sends valid waterbutler request', function (assert) {
    assert.expect(4);
    const service = this.subject();
    const done = assert.async();
    const file = FactoryGuy.make('file');
    const folder = FactoryGuy.make('file', 'isFolder', { path: '/path/path/this/is/a/path/' });
    const request = {
        url: file.get('links').move,
        settings: {
            method: 'POST',
            data: {
                action: 'move',
                path: folder.get('path'),
            },
        },
    };
    const response = {
        status: 200,
        data: {
            data: {
                attributes: { name: file.get('name') },
            },
        },
    };
    mockWaterbutler(assert, request, response);

    const p = service.move(file, folder);

    p.then(function () {
        done();
    }).catch(function () {
        done();
    });
});

skip('move passes along error', function (assert) {
    assert.expect(5);
    const service = this.subject();
    const done = assert.async();
    const file = FactoryGuy.make('file');
    const folder = FactoryGuy.make('file', 'isFolder', { path: '/path/path/this/is/a/path/' });

    const request = {
        url: file.get('links').move,
        settings: {
            method: 'POST',
            data: {
                action: 'move',
                path: folder.get('path'),
            },
        },
    };
    const response = {
        status: 402,
    };
    mockWaterbutler(assert, request, response);

    service.move(file, folder).then(function () {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function () {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

skip('copy sends valid waterbutler request', function (assert) {
    assert.expect(4);
    const service = this.subject();
    const done = assert.async();
    const file = FactoryGuy.make('file');
    const folder = FactoryGuy.make('file', 'isFolder', { path: '/path/path/this/is/a/path/' });

    const request = {
        url: file.get('links').move,
        settings: {
            method: 'POST',
            data: {
                action: 'copy',
                path: folder.get('path'),
            },
        },
    };
    const response = {
        status: 200,
        data: {
            data: {
                attributes: { name: file.get('name') },
            },
        },
    };
    mockWaterbutler(assert, request, response);

    const p = service.copy(file, folder);

    p.then(function () {
        done();
    }).catch(function () {
        done();
    });
});

skip('copy passes along error', function (assert) {
    assert.expect(5);
    const service = this.subject();
    const done = assert.async();
    const file = FactoryGuy.make('file');
    const folder = FactoryGuy.make('file', 'isFolder', { path: '/path/path/this/is/a/path/' });

    const request = {
        url: file.get('links').move,
        settings: {
            method: 'POST',
            data: {
                action: 'copy',
                path: folder.get('path'),
            },
        },
    };
    const response = {
        status: 402,
    };
    mockWaterbutler(assert, request, response);

    service.copy(file, folder).then(function () {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function () {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

skip('rename sends valid waterbutler request', function (assert) {
    assert.expect(4);
    const service = this.subject();
    const file = FactoryGuy.make('file');
    const done = assert.async();

    const request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: { action: 'rename', rename: 'flooby' } },
    };
    const response = {
        status: 200,
    };

    mockWaterbutler(assert, request, response);
    mockReload(file).returns({
        json: FactoryGuy.build('file', {
            id: file.get('id'),
            name: request.settings.data.rename,
        }),
    });

    const p = service.rename(file, request.settings.data.rename);

    p.then(function () {
        done();
    }).catch(function () {
        done();
    });
});

skip('rename passes along error', function (assert) {
    assert.expect(5);
    const service = this.subject();
    const file = FactoryGuy.make('file');
    const done = assert.async();

    const request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: { action: 'rename', rename: 'flooby' } },
    };
    const response = {
        status: 401,
    };
    mockWaterbutler(assert, request, response);

    service.rename(file, request.settings.data.rename).then(function () {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function () {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

skip('deleteFile sends valid waterbutler request', function (assert) {
    assert.expect(4);
    const service = this.subject();
    const file = FactoryGuy.make('file');
    const done = assert.async();

    const request = {
        url: file.get('links').delete,
        settings: { method: 'DELETE' },
    };
    const response = {
        status: 200,
    };
    mockWaterbutler(assert, request, response);

    service.deleteFile(file).then(function () {
        assert.ok(true);
        done();
    }).catch(function () {
        assert.ok(false, 'promise rejected!');
        done();
    });
});

skip('deleteFile passes along error', function (assert) {
    assert.expect(4);
    const service = this.subject();
    const file = FactoryGuy.make('file');
    const done = assert.async();

    const request = {
        url: file.get('links').delete,
        settings: { method: 'DELETE' },
    };
    const response = {
        status: 401,
    };
    mockWaterbutler(assert, request, response);

    service.deleteFile(file).then(function () {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function () {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

skip('checkOut checks out', function (assert) {
    assert.expect(2);
    const service = this.subject();
    const file = FactoryGuy.make('file');
    const done = assert.async();

    assert.equal(file.get('checkout'), null, 'file starts with null checkout');

    mockUpdate(file);
    service.checkOut(file).then(() => {
        assert.equal(file.get('checkout'), fakeUserID, 'file.checkout set');
        done();
    });
});

skip('checkIn checks in', function (assert) {
    assert.expect(2);
    const service = this.subject();
    const file = FactoryGuy.make('file', { checkout: fakeUserID });
    const done = assert.async();

    assert.equal(file.get('checkout'), fakeUserID, 'file.checkout already set');

    mockUpdate(file);
    service.checkIn(file).then(() => {
        assert.equal(file.get('checkout'), null, 'file.checkout null after check-in');
        done();
    });
});

skip('checkOut fails on checked-out file', function (assert) {
    assert.expect(1);
    const service = this.subject();
    const file = FactoryGuy.make('file', { checkout: 'someoneelse' });
    const done = assert.async();

    mockUpdate(file).fails({ status: 403 });
    service.checkIn(file).catch(() => {
        assert.equal(file.get('checkout'), 'someoneelse', 'file.checkout unaffected by failure');
        done();
    });
});
