// types/multer.d.ts
declare module 'multer' {
  import { Request, Response, NextFunction } from 'express';

  namespace multer {
    interface Multer {
      (req: Request, res: Response, next: NextFunction): void;
      any(): (req: Request, res: Response, next: NextFunction) => void;
      array(fieldName: string, maxCount?: number): (req: Request, res: Response, next: NextFunction) => void;
      fields(fields: { name: string, maxCount?: number }[]): (req: Request, res: Response, next: NextFunction) => void;
      none(): (req: Request, res: Response, next: NextFunction) => void;
      single(fieldName: string): (req: Request, res: Response, next: NextFunction) => void;
    }

    interface StorageEngine {
      _handleFile(req: Request, file: any, callback: (error?: any, info?: Partial<File>) => void): void;
      _removeFile(req: Request, file: any, callback: (error: Error) => void): void;
    }

    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }

    interface Field {
      name: string;
      maxCount?: number;
    }

    interface Options {
      dest?: string;
      storage?: StorageEngine;
      limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
      };
      preservePath?: boolean;
      fileFilter?: (req: Request, file: File, cb: (error: Error | null, acceptFile: boolean) => void) => void;
    }
  }

  function multer(options?: multer.Options): multer.Multer;
  export = multer;
}
