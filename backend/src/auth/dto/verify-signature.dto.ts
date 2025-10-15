import { IsString, IsNotEmpty } from 'class-validator';

export class VerifySignatureDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
