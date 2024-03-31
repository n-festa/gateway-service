import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Readable } from 'stream';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private s3: AWS.S3;
  folderName = 'review';
  constructor(private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') === 'development') {
      this.s3 = new AWS.S3({
        region: this.configService.get('aws.region') || 'ap-southeast-2',
        accessKeyId: this.configService.get('aws.accessKeyId') || '',
        secretAccessKey: this.configService.get('aws.secretAccessKey') || '',
      });
    } else {
      // deploy to ecs no need config access/secret key
      this.s3 = new AWS.S3({
        region: this.configService.get('aws.region') || 'ap-southeast-2',
      });
    }
  }

  async uploadFileToS3(
    bucketName: string,
    fileName: string,
    fileStream: Readable,
  ): Promise<string> {
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: bucketName,
      Key: `${this.folderName}/${fileName}`,
      Body: fileStream,
    };

    return new Promise<string>((resolve, reject) => {
      this.s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location); // URL of the uploaded file
        }
      });
    });
  }
  async resizeAndUploadToS3(
    bucketName: string,
    fileName: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const resizedImageBuffer = await sharp(fileBuffer)
      .resize(200, 230)
      .toBuffer();

    const fileStream = Readable.from(resizedImageBuffer);

    return this.uploadFileToS3(bucketName, fileName.trim(), fileStream);
  }

  isImageType(mimeType: string): boolean {
    const regex = /^(image[/])+(jpg|jpeg|png|gif|bmp|tiff)$/;
    return regex.test(mimeType);
  }
}
