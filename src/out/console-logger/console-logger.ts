import { IStreamLogger } from "../../core/handlers/stream-logger.interface";

export class ConsoleLogger implements IStreamLogger {
    private static _instance: ConsoleLogger;

    public static get Instance(): ConsoleLogger {
        if (!ConsoleLogger._instance) {
            ConsoleLogger._instance = new ConsoleLogger();
        }
        return ConsoleLogger._instance;
    }

    log(...args: any[]): void {
        console.log(...args);
    }
    error(...args: any[]): void {
        console.error(...args);
    }
    end(): void {
        console.log("Done");
    }
}