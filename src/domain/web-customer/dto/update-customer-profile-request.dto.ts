import { PhysicalActivityLevel, SEX } from 'src/enum';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateCustomerProfileRequest {
  @IsNotEmpty()
  customer_id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthday: string;

  @IsNotEmpty()
  @IsEnum(SEX)
  sex: string;

  @IsNotEmpty()
  height_m: number;

  @IsNotEmpty()
  weight_kg: number;

  @IsNotEmpty()
  @IsEnum(PhysicalActivityLevel)
  physical_activity_level: PhysicalActivityLevel;

  current_diet: string;
  allergic_food: string;
  chronic_disease: string;
  expected_diet: string;
}
