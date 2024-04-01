import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Readable } from 'stream';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private s3: AWS.S3;
  constructor(private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') === 'development') {
      this.s3 = new AWS.S3({
        region: this.configService.get('awsS3.region') || 'ap-southeast-2',
        accessKeyId: this.configService.get('awsS3.accessKeyId') || '',
        secretAccessKey: this.configService.get('awsS3.secretAccessKey') || '',
      });
    } else {
      // deploy to ecs no need config access/secret key
      this.s3 = new AWS.S3({
        region: this.configService.get('awsS3.region') || 'ap-southeast-2',
      });
    }
  }

  async uploadFileToS3(
    bucketName: string,
    folderName: string,
    fileName: string,
    fileType: string, // e.g. image/jpeg, image/png, etc.
    fileStream: Readable,
  ): Promise<string> {
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: bucketName,
      Key: `${folderName}/${fileName}`,
      Body: fileStream,
      ContentType: fileType,
    };

    return new Promise<string>((resolve, reject) => {
      this.s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Key); // URL of the uploaded file
        }
      });
    });
  }
  async resizeAndUploadToS3(
    bucketName: string,
    folderName: string,
    fileName: string,
    fileType: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const resizedImageBuffer = await sharp(fileBuffer)
      .resize(200, 230, {
        fit: sharp.fit.inside,
        withoutEnlargement: true, // if image's original width or height is less than specified width and height, sharp will do nothing(i.e no enlargement)
      })
      .toBuffer();

    const fileStream = Readable.from(resizedImageBuffer);

    return this.uploadFileToS3(
      bucketName,
      folderName,
      fileName.trim(),
      fileType,
      fileStream,
    );
  }

  isImageType(mimeType: string): boolean {
    const regex = /^(image[/])+(jpg|jpeg|png|gif|bmp|tiff)$/;
    return regex.test(mimeType);
  }
}
