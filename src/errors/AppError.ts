export class AppError {
  public readonly message: string | string[];
  public readonly statusCode: number;

  constructor(message: string | string[], statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
