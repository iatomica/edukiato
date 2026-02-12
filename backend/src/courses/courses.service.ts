import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { BatchAttendanceDto } from './dto/attendance.dto';
import { CreateAssignmentDto, GradeSubmissionDto } from './dto/evaluation.dto';
import { CreateMaterialDto, SubmitAssignmentDto } from './dto/classroom.dto';

@Injectable()
export class CoursesService {
  
  // ... (Previous Core Methods: findAll, findOne, create, update, enrollStudent, removeStudent)
  async findAll(termId?: string) {
    return [
      {
        id: 'c1',
        title: 'Intro to Wheel Throwing',
        instructor: { id: 't1...', name: 'Elena Fisher', avatar: 'https://picsum.photos/seed/elena/200' },
        schedule: 'Mon/Wed 18:00',
        capacity: 8,
        enrolledCount: 6,
        status: 'IN_PROGRESS',
        image: 'https://images.unsplash.com/photo-1565193566173-7a64c27876e9?auto=format&fit=crop&q=80&w=400'
      }
    ];
  }

  async findOne(id: string) {
    return {
      id,
      title: 'Intro to Wheel Throwing',
      description: 'Hands-on introduction...',
      students: [
        { id: 's1...', name: 'Sofia Chen', status: 'ACTIVE' },
      ],
      nextSession: {
        date: '2024-03-25T18:00:00Z',
        location: 'Studio B'
      }
    };
  }

  async create(dto: CreateCourseDto) {
    return { id: 'new-uuid', ...dto, status: 'DRAFT' };
  }

  async update(id: string, dto: UpdateCourseDto) {
    return { id, ...dto, success: true };
  }

  async enrollStudent(courseId: string, studentId: string) {
    const currentEnrollment = 6;
    const capacity = 8;
    
    if (currentEnrollment >= capacity) {
      throw new BadRequestException('Course is at full capacity.');
    }
    return { message: 'Student successfully enrolled', remainingSpots: capacity - (currentEnrollment + 1) };
  }

  async removeStudent(courseId: string, studentId: string) {
    return { message: 'Student removed from course' };
  }

  // --- VIRTUAL CLASSROOM ---

  async getClassroomStream(courseId: string) {
    // This aggregates Materials, Assignments, and Live Links into a chronological feed.
    return {
      courseId,
      liveLink: 'https://meet.google.com/abc-defg-hij', // Example dynamic link
      stream: [
        {
          id: 'm1',
          type: 'MATERIAL',
          title: 'Safety Guidelines PDF',
          materialType: 'PDF',
          url: 'https://example.com/safety.pdf',
          postedAt: '2024-03-20T09:00:00Z'
        },
        {
          id: 'a1',
          type: 'ASSIGNMENT',
          title: 'Cylinder Challenge',
          dueDate: '2024-03-27T23:59:00Z',
          status: 'PENDING', // Context aware for student
          postedAt: '2024-03-21T10:00:00Z'
        },
        {
          id: 'm2',
          type: 'MATERIAL',
          title: 'Inspiration Video: Japanese Pottery',
          materialType: 'VIDEO',
          url: 'https://youtube.com/...',
          postedAt: '2024-03-22T14:00:00Z'
        }
      ]
    };
  }

  async addMaterial(courseId: string, dto: CreateMaterialDto) {
    // DB: INSERT INTO course_materials...
    return {
      id: 'mat-' + Math.random().toString(36),
      courseId,
      ...dto,
      postedAt: new Date()
    };
  }

  async submitAssignment(courseId: string, assignmentId: string, studentId: string, dto: SubmitAssignmentDto) {
    // DB: INSERT INTO submissions...
    return {
      message: 'Work submitted successfully',
      submissionId: 'sub-' + Math.random().toString(36),
      timestamp: new Date()
    };
  }

  // --- CALENDAR & ATTENDANCE ---

  async getCourseSchedule(courseId: string) {
    return [
        { id: 'sess1', title: 'Session 1', start: '2024-03-01T10:00:00Z', end: '2024-03-01T12:00:00Z' }
    ];
  }

  async addSession(courseId: string, dto: CreateSessionDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (start >= end) throw new BadRequestException('Start time must be before end time.');
    return { id: 'new-session-id', courseId, ...dto };
  }

  async markBatchAttendance(sessionId: string, dto: BatchAttendanceDto) {
    const stats = {
      present: dto.records.filter(r => r.status === 'PRESENT').length,
      absent: dto.records.filter(r => r.status === 'ABSENT').length,
      late: dto.records.filter(r => r.status === 'LATE').length,
      excused: dto.records.filter(r => r.status === 'EXCUSED').length,
    };

    return {
      message: 'Attendance recorded successfully',
      sessionId,
      summary: stats
    };
  }

  // --- EVALUATIONS ---

  async createAssignment(courseId: string, dto: CreateAssignmentDto) {
    return {
      id: 'assign-uuid-new',
      courseId,
      ...dto,
      createdAt: new Date()
    };
  }

  async gradeSubmission(assignmentId: string, studentId: string, dto: GradeSubmissionDto) {
    return {
      success: true,
      assignmentId,
      studentId,
      status: dto.status || 'GRADED',
      feedbackStored: true,
      notifiedStudent: true 
    };
  }

  // --- CERTIFICATION ---

  async generateCertificate(courseId: string, studentId: string) {
    const isEligible = true;
    
    if (!isEligible) {
      throw new BadRequestException('Student has not met the criteria for certification yet.');
    }

    const certificateData = {
      certificateId: 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      issueDate: new Date().toISOString(),
      studentName: 'Sofia Chen',
      courseTitle: 'Intro to Wheel Throwing',
      institution: 'Edukiato Educational Institute',
      signature: 'Alex Rivera, Director',
      metadata: {
        totalHours: 40,
        skills: ['Centering', 'Glazing', 'Kiln Safety']
      }
    };

    return {
      message: 'Certificate generated',
      url: `https://api.edukiato.edu/certificates/${certificateData.certificateId}`,
      data: certificateData
    };
  }
}