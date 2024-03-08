import { FileTypeValidator } from '@nestjs/common';

export class DefinedFileTypeValidation extends FileTypeValidator {
  buildErrorMessage(): string {
    return 'File type must be jpg, jpeg, png, gif, bmp or tiff';
  }
}
