import { IsString, IsNotEmpty, IsEnum, IsUrl, IsOptional, IsUUID } from 'class-validator';

export enum MaterialType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  LINK = 'LINK',
  IMAGE = 'IMAGE'
}

export class CreateMaterialDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(MaterialType)
  type: MaterialType;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class SubmitAssignmentDto {
  @IsNotEmpty()
  @IsString()
  content: string; // Text response or URL

  @IsOptional()
  @IsUrl()
  attachmentUrl?: string; // Optional external link
}