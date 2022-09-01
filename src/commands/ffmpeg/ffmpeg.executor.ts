import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor";
import { FileService } from "../../core/files/file.service";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { StreamHandler } from "../../core/handlers/stream.handler";
import { PromptService } from "../../core/prompt/prompt.service.js";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { ICommandExecFfmpeg, IFfmpegInput } from "./ffmpeg.types";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
    private fileService: FileService = new FileService();
    protected async prompt(): Promise<IFfmpegInput> {
        const service = new PromptService();
        const width = await service.input<number>('width', 'number')
        const height = await service.input<number>('height', 'number')
        const path = await service.input<string>('path', 'input')
        const name = await service.input<string>('name', 'input')

        return { width, height, path, name };
    }
    protected build(input: IFfmpegInput): ICommandExecFfmpeg {
        const output = FileService.getPath(input.path, input.name, 'mp4')
        return {
            command: 'ffmpeg',
            output,
            args: new FfmpegBuilder()
                .input(input.path)
                .setVideoSize(input.width, input.height)
                .output(output)
        }
    }
    protected spawn(command: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
        this.fileService.deleteIfExists(command.output)
        return spawn(command.command, command.args);
    }
    protected stream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        new StreamHandler(logger).processOutput(stream)
    }
}
