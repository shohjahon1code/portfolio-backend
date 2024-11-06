import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string
}