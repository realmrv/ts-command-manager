import { ChildProcessWithoutNullStreams } from 'child_process';
import { IStreamLogger } from '../handlers/stream-logger.interface.js'
import { ICommandExec } from './command.types.js';

export abstract class CommandExecutor<Input> {
    constructor(private logger: IStreamLogger) { }

    public async execute() {
        this.stream(this.spawn(this.build(await this.prompt())), this.logger);
    }

    protected abstract prompt(): Promise<Input>;
    protected abstract build(input: Input): ICommandExec;
    protected abstract spawn(command: ICommandExec): ChildProcessWithoutNullStreams;
    protected abstract stream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void;
}