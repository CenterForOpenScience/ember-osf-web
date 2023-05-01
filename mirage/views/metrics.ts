import { HandlerContext, Schema, Request, Response } from 'ember-cli-mirage';

export function postCountedUsage(this: HandlerContext, schema: Schema) {
    schema.countedUsages.create(this.normalizedRequestAttrs('counted-usage') as any);
    return new Response(201);
}

export function getNodeAnalytics(this: HandlerContext, _: Schema, request: Request) {
    const { nodeID } = request.params;
    // just a hard-coded response for now
    return {
        data: {
            id: 'blahblah',
            type: 'node-analytics',
            attributes: {
                popular_pages: [
                    {
                        path: `/${nodeID}/wiki/home`,
                        route: 'OsfWebRenderer.project_wiki_view',
                        title: 'OSF | My Project Wiki',
                        count: 175,
                    },
                    {
                        path: `/${nodeID}`,
                        route: 'OsfWebRenderer.view_project',
                        title: 'OSF | My Project',
                        count: 143,
                    },
                ],
                unique_visits: [
                    {
                        date: '2023-03-16',
                        count: 125,
                    },
                    {
                        date: '2023-03-17',
                        count: 157,
                    },
                    {
                        date: '2023-03-18',
                        count: 96,
                    },
                    {
                        date: '2023-03-19',
                        count: 107,
                    },
                    {
                        date: '2023-03-20',
                        count: 274,
                    },
                    {
                        date: '2023-03-21',
                        count: 93,
                    },
                    {
                        date: '2023-03-22',
                        count: 128,
                    },
                    {
                        date: '2023-03-23',
                        count: 121,
                    },
                ],
                time_of_day: [
                    {
                        hour: 4,
                        count: 95,
                    },
                    {
                        hour: 3,
                        count: 85,
                    },
                    {
                        hour: 9,
                        count: 77,
                    },
                    {
                        hour: 5,
                        count: 58,
                    },
                    {
                        hour: 13,
                        count: 53,
                    },
                    {
                        hour: 14,
                        count: 53,
                    },
                    {
                        hour: 6,
                        count: 51,
                    },
                    {
                        hour: 8,
                        count: 50,
                    },
                    {
                        hour: 23,
                        count: 48,
                    },
                    {
                        hour: 7,
                        count: 47,
                    },
                    {
                        hour: 20,
                        count: 47,
                    },
                    {
                        hour: 10,
                        count: 44,
                    },
                    {
                        hour: 16,
                        count: 44,
                    },
                    {
                        hour: 21,
                        count: 39,
                    },
                    {
                        hour: 0,
                        count: 38,
                    },
                    {
                        hour: 17,
                        count: 38,
                    },
                    {
                        hour: 22,
                        count: 36,
                    },
                    {
                        hour: 15,
                        count: 33,
                    },
                    {
                        hour: 12,
                        count: 32,
                    },
                    {
                        hour: 1,
                        count: 31,
                    },
                    {
                        hour: 18,
                        count: 29,
                    },
                    {
                        hour: 11,
                        count: 25,
                    },
                    {
                        hour: 2,
                        count: 24,
                    },
                    {
                        hour: 19,
                        count: 24,
                    },
                ],
                referer_domain: [
                    {
                        referer_domain: 'osf.io',
                        count: 312,
                    },
                    {
                        referer_domain: 'www.google.com',
                        count: 95,
                    },
                ],
            },
        },
    };
}
