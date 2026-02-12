import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { BatchAttendanceDto } from './dto/attendance.dto';
import { CreateAssignmentDto, GradeSubmissionDto } from './dto/evaluation.dto';
import { CreateMaterialDto, SubmitAssignmentDto } from './dto/classroom.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // --- CORE COURSE MANAGEMENT ---

  @Get()
  findAll(@Query('termId') termId?: string) {
    return this.coursesService.findAll(termId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TEACHER')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  // --- VIRTUAL CLASSROOM (The Stream) ---

  @Get(':id/classroom')
  getClassroomStream(@Param('id') courseId: string) {
    return this.coursesService.getClassroomStream(courseId);
  }

  @Post(':id/materials')
  @Roles('ADMIN', 'TEACHER')
  addMaterial(@Param('id') courseId: string, @Body() dto: CreateMaterialDto) {
    return this.coursesService.addMaterial(courseId, dto);
  }

  @Post(':id/assignments/:assignmentId/submit')
  // Students can submit
  submitAssignment(
    @Param('id') courseId: string, 
    @Param('assignmentId') assignmentId: string,
    @Body() dto: SubmitAssignmentDto
  ) {
    // In real app, get studentId from Request user
    const mockStudentId = 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11'; 
    return this.coursesService.submitAssignment(courseId, assignmentId, mockStudentId, dto);
  }

  // --- STUDENT ENROLLMENT ---

  @Post(':id/enroll')
  @Roles('ADMIN')
  enrollStudent(@Param('id') courseId: string, @Body('studentId') studentId: string) {
    return this.coursesService.enrollStudent(courseId, studentId);
  }

  @Delete(':id/enroll/:studentId')
  @Roles('ADMIN')
  removeStudent(@Param('id') courseId: string, @Param('studentId') studentId: string) {
    return this.coursesService.removeStudent(courseId, studentId);
  }

  // --- ACADEMIC CALENDAR & ATTENDANCE ---

  @Get(':id/schedule')
  getSchedule(@Param('id') courseId: string) {
    return this.coursesService.getCourseSchedule(courseId);
  }

  @Post(':id/sessions')
  @Roles('ADMIN', 'TEACHER')
  addSession(@Param('id') courseId: string, @Body() sessionDto: CreateSessionDto) {
    return this.coursesService.addSession(courseId, sessionDto);
  }

  @Post(':id/sessions/:sessionId/attendance')
  @Roles('ADMIN', 'TEACHER')
  markAttendance(
    @Param('id') courseId: string,
    @Param('sessionId') sessionId: string,
    @Body() batchDto: BatchAttendanceDto
  ) {
    return this.coursesService.markBatchAttendance(sessionId, batchDto);
  }

  // --- EVALUATIONS & FEEDBACK ---

  @Post(':id/assignments')
  @Roles('ADMIN', 'TEACHER')
  createAssignment(@Param('id') courseId: string, @Body() dto: CreateAssignmentDto) {
    return this.coursesService.createAssignment(courseId, dto);
  }

  @Post(':id/assignments/:assignmentId/grade/:studentId')
  @Roles('ADMIN', 'TEACHER')
  gradeStudent(
    @Param('assignmentId') assignmentId: string,
    @Param('studentId') studentId: string,
    @Body() dto: GradeSubmissionDto
  ) {
    return this.coursesService.gradeSubmission(assignmentId, studentId, dto);
  }

  // --- CERTIFICATION ---

  @Post(':id/students/:studentId/certificate')
  @Roles('ADMIN', 'TEACHER')
  generateCertificate(@Param('id') courseId: string, @Param('studentId') studentId: string) {
    return this.coursesService.generateCertificate(courseId, studentId);
  }
}