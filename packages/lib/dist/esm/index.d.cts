declare const chunk: <T>(array: T[], size: number) => T[][];

declare const console: Console;
type TLogger = typeof console & {
    success: (typeof console)["log"];
    subLog: (typeof console)["log"];
    allowDebug: () => boolean;
    prefix?: string | (() => string);
};
declare const logger: TLogger;

/**
 * Maintain a max number of lines in the terminal like a window
 */
declare const windowLog: (maxLines: number, opts?: {
    noPrint?: boolean;
    topPrefix?: () => string;
    topInterval?: number;
}) => {
    print: (line: string) => void;
    stop: (successMessage?: string, noClear?: boolean) => void;
};
/**
 * Start a task with a spinner and a window log
 * @param options
 * @returns
 */
declare function startTask(options: {
    name: string;
    successMessage?: string;
    maxLines?: number;
    noClear?: boolean;
}): Promise<{
    print: (data: string) => void;
    stop: (message?: string) => void;
}>;
/**
 * Stop a task
 * @param window
 */
declare function stopTask(window: ReturnType<typeof windowLog>, message?: string): void;

export { chunk, logger, startTask, stopTask, windowLog };
