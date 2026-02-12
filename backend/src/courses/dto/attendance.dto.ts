import { IsString, IsNotEmpty, IsEnum, IsUUID, ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

class StudentAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string; // e.g. "Arrived 15 mins late due to rain"
}

export class BatchAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  records: StudentAttendanceDto[];
}