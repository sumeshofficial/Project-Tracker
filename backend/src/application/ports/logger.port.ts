export interface Logger {
    info(message: string, meta?: object): void;

    error(message: string, meta?: object): void;
}