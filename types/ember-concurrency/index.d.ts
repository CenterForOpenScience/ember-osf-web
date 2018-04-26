export interface Task {
    perform(...args: any[]);
    restartable();
    drop();
}

export function allSettled(promiseLikeObjects: any[]): Promise<any>;
export function task(generator: any): Task;
export function waitForQueue(queue: string): Promise<any>;
export function timeout(seconds: number): Promise<any>;
export function all(...args: any[]): Promise<any>;
