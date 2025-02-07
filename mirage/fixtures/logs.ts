import LogModel from 'ember-osf-web/models/log';

const logs: Array<Partial<LogModel>> = [
    {
        id: 'edit_description',
        action: 'edit_description',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'license_changed',
        action: 'license_changed',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            license: 'Apache License 2.0',
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'osf_storage_file_added',
        action: 'osf_storage_file_added',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            path: '/hat.jpg',
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'osf_storage_file_removed',
        action: 'osf_storage_file_removed',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            path: '/hat.jpg',
            path_type: 'the path type',
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'osf_storage_file_updated',
        action: 'osf_storage_file_updated',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            path: '/hat.jpg',
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'osf_storage_folder_created',
        action: 'osf_storage_folder_created',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            path: '/hat.jpg',
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'project_created',
        action: 'project_created',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'subjects_updated',
        action: 'subjects_updated',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            pointer: null,
            preprint_provider: null,
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'tag_added',
        action: 'tag_added',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            pointer: null,
            preprint_provider: null,
            tag: 'Food',
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
    {
        id: 'tag_removed',
        action: 'tag_removed',
        date: new Date('2025-02-06T19:51:35.017269Z'),
        params: Object({
            contributors: [],
            params_node: {
                id: 'c2het',
                title: 'A new project for testing file components',
            },
            params_project: null,
            pointer: null,
            preprint_provider: null,
            tag: 'Food',
            urls: {
                view: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het',
                download: '/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het?action=download',
            },
        }),
    },
];

export default logs;
