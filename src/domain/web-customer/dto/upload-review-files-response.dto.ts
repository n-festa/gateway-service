import { GeneralResponse } from './general-response.dto';

export class UploadReviewFileResponse extends GeneralResponse {
  data: UploadReviewFile;
}
interface UploadReviewFile {
  urls: string[];
}
