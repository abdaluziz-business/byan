import { Injectable } from '@nestjs/common';
import { R2Service } from '../../integrations/r2/r2.service';

@Injectable()
export class UploadsService {
  constructor(private readonly r2Service: R2Service) {}

  upload(file: Express.Multer.File): Promise<string> {
    return this.r2Service.uploadFile(file.buffer, file.originalname, file.mimetype);
  }
}
