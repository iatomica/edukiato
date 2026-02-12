# Evaluation & Attendance API

## 1. Flexible Attendance
Attendance is recorded per session. It allows qualitative remarks (e.g., "Left early").

### Mark Batch Attendance
`POST /courses/:courseId/sessions/:sessionId/attendance`

**Payload:**
```json
{
  "records": [
    { "studentId": "s1...", "status": "PRESENT" },
    { "studentId": "s2...", "status": "LATE", "remarks": "Bus broke down" },
    { "studentId": "s3...", "status": "EXCUSED", "remarks": "Medical reason" }
  ]
}
```

**Response:**
```json
{
  "message": "Attendance recorded successfully",
  "summary": { "present": 1, "late": 1, "excused": 1, "absent": 0 }
}
```

---

## 2. Qualitative Grading
Focuses on feedback text over numbers.

### Grade Submission
`POST /courses/:courseId/assignments/:assignmentId/grade/:studentId`

**Payload:**
```json
{
  "feedbackText": "Excellent conceptual approach. The execution of the glaze needs more consistency, but the form is solid.",
  "score": 85, // Optional
  "status": "GRADED"
}
```

---

## 3. Certificates
Generates a lightweight digital credential for students who have completed the course.

### Generate Certificate
`POST /courses/:courseId/students/:studentId/certificate`

**Response:**
```json
{
  "message": "Certificate generated",
  "data": {
    "certificateId": "CERT-X9S2A",
    "studentName": "Sofia Chen",
    "courseTitle": "Intro to Wheel Throwing",
    "issueDate": "2024-03-20T10:00:00.000Z"
  }
}
```
