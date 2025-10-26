import { Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'invoices', resource_type: 'image' },
          (error, result?: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result!.secure_url);
          },
        )
        .end(file.buffer);
    });
  }
}
