import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmOtpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
