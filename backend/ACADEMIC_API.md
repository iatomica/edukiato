# Academic Management API

## Courses

### List All Courses
`GET /courses?termId={uuid}`

**Response:**
```json
[
  {
    "id": "c1...",
    "title": "Ceramics 101",
    "schedule": "Mon/Wed 18:00",
    "enrolledCount": 12,
    "capacity": 15,
    "status": "OPEN"
  }
]
```

### Create Course
`POST /courses`

**Payload:**
```json
{
  "title": "Advanced Jazz",
  "termId": "term-uuid...",
  "teacherId": "teacher-uuid...",
  "scheduleText": "Tue 19:00",
  "capacity": 10,
  "price": 200
}
```

---

## Enrollment (One-Click Actions)

### Enroll Student
`POST /courses/:id/enroll`

**Payload:**
```json
{ "studentId": "student-uuid..." }
```

**Success (201):**
```json
{
  "message": "Student successfully enrolled",
  "remainingSpots": 2
}
```

**Error (400):**
```json
{
  "statusCode": 400,
  "message": "Course is at full capacity.",
  "error": "Bad Request"
}
```

---

## Calendar

### Add Class Session
`POST /courses/:id/sessions`

**Payload:**
```json
{
  "title": "Special Workshop: Glazing",
  "startTime": "2024-04-10T14:00:00Z",
  "endTime": "2024-04-10T17:00:00Z",
  "location": "Studio B"
}
```
