

export abstract class BaseController {
  protected constructor() {}
  response(status = 200, message = 'Success', data = []) {
    return {
      success: true,
      message,
      data,
    };
  }
}
