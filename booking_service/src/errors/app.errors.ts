
  export interface AppError extends Error {
    statusCode: number;
  }

  
  export class internalServerError  implements AppError {
       statusCode: number;
       message: string;
       name: string;

       constructor (message:string) {
          this.statusCode = 500
          this.message = message
          this.name = "internal server error"
       }
  }

  export class badRequest implements AppError {
        statusCode: number;
        message: string;
        name: string;
        constructor(message:string){
             this.statusCode = 400
             this.message = message
             this.name = "bad request"
        }
  }

  export class NotFoundError implements AppError {
        statusCode: number;
        message: string;
        name: string;
        constructor(message:string){
             this.statusCode = 404
             this.message = message
             this.name = "not found error"
        }
 }


