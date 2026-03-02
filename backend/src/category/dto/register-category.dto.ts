import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterCategory {
  @ApiProperty()
  @IsString()
  name: string;
}
