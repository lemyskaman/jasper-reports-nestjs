import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec, spawn } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';


const defaultExecAsync = promisify(exec);

@Injectable()
export class JasperService {
  private execAsync: typeof defaultExecAsync = defaultExecAsync;
  private jasperEngineDir: string;
  
  constructor(private configService?: ConfigService) {
    this.jasperEngineDir = this.configService?.get('JASPER_ENGINE_DIR', '/app/jasper-engine') || '/app/jasper-engine';
  }

  // For unit tests only: allow override of execAsync
  static withExecAsync(execAsync: typeof defaultExecAsync) {
    const instance = new JasperService();
    instance.execAsync = execAsync;
    return instance;
  }

  async processReport(reportPath: string, params: Record<string, any>): Promise<Buffer> {
    // Example: java -jar jasper-engine/runner.jar reportPath param1=value1 ...
    const paramStr = Object.entries(params).map(([k, v]) => `${k}=${v}`).join(' ');
    const command = `java -jar ${this.jasperEngineDir}/runner.jar ${reportPath} ${paramStr}`;
    const { stdout } = await this.execAsync(command, { encoding: 'buffer', maxBuffer: 10 * 1024 * 1024 });
    return stdout as Buffer;
  }

  async generatePdf(inputFile: string, outputFile: string, params: Record<string, string> = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      // Use absolute paths for Docker compatibility
      const inputAbs = path.isAbsolute(inputFile) ? inputFile : path.resolve(process.cwd(), inputFile);
      const outputAbs = path.isAbsolute(outputFile) ? outputFile : path.resolve(process.cwd(), outputFile);
      // Use wildcard to include all JARs in jasper-engine
      const javaArgs = [
        '-cp', `${this.jasperEngineDir}/*:${this.jasperEngineDir}`,
        'JasperCli',
        inputAbs,
        outputAbs,
        ...Object.entries(params).map(([k, v]) => `${k}=${v}`),
      ];
      const java = spawn('java', javaArgs, { cwd: this.jasperEngineDir });
      let stderr = '';
      java.stderr.on('data', (data) => { stderr += data.toString(); });
      java.on('close', (code) => {
        if (code === 0) {
          resolve(outputAbs);
        } else {
          reject(new Error(`Jasper CLI failed: ${stderr}`));
        }
      });
    });
  }
}
