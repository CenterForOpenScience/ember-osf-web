import { ModelInstance, Server } from 'ember-cli-mirage';
import config from 'ember-get-config';

import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';
import { placekitten } from '../utils';

const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

export function dashboardScenario(server: Server, currentUser: ModelInstance<User>) {
    server.create('user-setting', { user: currentUser });
    const firstNode = server.create('node', 'withAffiliatedInstitutions');
    server.create('contributor', { node: firstNode, users: currentUser, index: 0 });
    const component = server.create('node', {id: 'cmpnt', parent: firstNode}, 'withFiles', 'withStorage');
    server.create('contributor', { node: component, users: currentUser, index: 0, permission: Permission.Admin });
    const nodes = server.createList('node', 10, {
        currentUserPermissions: Object.values(Permission),
    }, 'withContributors');
    for (const node of nodes) {
        server.create('contributor', {
            node,
            users: currentUser,
            permission: Permission.Admin,
            index: 0,
        });
    }

    server.create('node', {
        id: noteworthyNode,
        linkedNodes: nodes.slice(0, 5),
        title: 'NNW',
        currentUserPermissions: [Permission.Read],
    });
    server.create('node', {
        id: popularNode,
        linkedNodes: nodes.slice(5, 10),
        title: 'Popular',
        currentUserPermissions: [Permission.Read],
    });
    for (const node of nodes.slice(4, 10)) {
        server.create('contributor', { node, users: currentUser, index: 11 });
    }

    const filesNode = server.create('node', {
        id: 'file5',
        title: 'With some files',
        currentUserPermissions: [Permission.Read, Permission.Write, Permission.Admin],
    }, 'withFiles', 'withStorage', 'withContributors', 'withAffiliatedInstitutions', 'withDoi', 'withLinkedByNodes');
    server.create('contributor', {
        node: filesNode,
        users: currentUser,
        permission: Permission.Admin,
        index: 0,
    });

    // NOTE: Some institutions are already created by this point
    server.createList('institution', 20);
    // Create a specific institution to test institutional dashboard with; should be ID 29 at this point
    server.create('institution', {
        id: 'has-users',
    }, 'withMetrics');

    // primary and secondary colors provided in mock-up
    server.create('institution', {
        id: 'mock-up',
        description: `In partnership with the University of Virginia Library Scholarly Communication Services & 
            Research Data Services, Vice President for Research, School of Data Science, and the Health Sciences 
            Library. Projects must abide by the University Security and Data Protection Policies.`,
        assets: {
            banner: placekitten(512, 80),
            primary_color: '#0c275c',
            secondary_color: '$color-text-white',
        },
    }, 'withMetrics');

    // default OSF colors when none provided
    server.create('institution', {
        id: 'default-colors',
        assets: {
            banner: placekitten(512, 80),
            primary_color: '',
            secondary_color: '',
        },
    }, 'withMetrics');
}
