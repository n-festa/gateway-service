import { GeneralResponse } from './general-response.dto';

export class GetAvailableDeliveryTimeResponse extends GeneralResponse {
  data: TimeSlot[] | number;
}
interface TimeSlot {
  dayId: number; // 1->7: Sunday -> Saturday
  dayName: string; //sun,mon,tue,wed,thu,fri,sat
  date: string;
  hours: string;
  minutes: string;
  utc_offset: number;
}
