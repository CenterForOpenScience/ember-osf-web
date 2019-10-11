import slugify from 'ember-osf-web/utils/slugify';

/*
*  pageIndex: index of current page in the pageManagers arrays
*  pageNumber: pageIndex + 1
*/

export const DefaultPage: number = 1;

export function getDefaultParam() {
    return DefaultPage;
}

export function getPageIndex(pageParam: string): number | undefined {
    const match = pageParam.match(/^\d+(?=-)/);
    return match ? Number.parseInt(match[0], 10) - 1 : undefined;
}

export function getPageParam(
    pageNumber: number,
    pageHeading?: string,
) {
    const slug = pageHeading ? slugify(pageHeading) : '';
    return slug ? `${pageNumber}-${slug}` : `${pageNumber}`;
}

export function getNextPageParam(
    pageIndex: number,
    pageHeading: string,
) {
    const nextPageNumber = pageIndex + 2;
    return getPageParam(nextPageNumber, pageHeading);
}

export function getPrevPageParam(
    pageIndex: number,
    pageHeading: string,
) {
    const prevPageNumber = pageIndex;
    return getPageParam(prevPageNumber, pageHeading);
}
