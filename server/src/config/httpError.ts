const statusMap = {
  NOT_AUTHORIZED: 401,
  INTERNAL_ERROR: 500,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
};

export default class HttpError extends Error {
  public statusCode: number;
  public status: string;
  constructor({
    message,
    status,
  }: {
    status: keyof typeof statusMap;
    message: string;
  }) {
    super(message);
    this.status = status;
    this.statusCode = statusMap[status];
  }
}
