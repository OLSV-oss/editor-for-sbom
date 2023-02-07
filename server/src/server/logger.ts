import { Connection } from "vscode-languageserver";

export class Logger {
  constructor(private readonly connection: Connection){}

  public log(message: string): void {
    this.connection.console.log(message);
  }

  public info(message: string): void {
    this.connection.console.info(message);
  }

  public warn(message: string): void {
    this.connection.console.warn(message);
  }

  public error(message: string): void {
    this.connection.console.error(message);
  }
}
