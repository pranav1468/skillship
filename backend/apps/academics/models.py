"""
File:    backend/apps/academics/models.py
Purpose: Structural models — AcademicYear, Class, Course, Enrollment.
Owner:   Prashant

Why these four are the foundation:
    Every quiz, every piece of content, every analytic eventually rolls up
    to a Class (which students belong to) and a Course (which subject the
    quiz / content covers). Get these shapes wrong and we re-migrate every
    downstream app, so the constraints below are deliberate:

    - All four inherit TenantModel → UUID pk + school FK + .for_school()
      manager. Forgetting the tenant filter on a query is impossible by
      construction.
    - AcademicYear is unique per (school, name) — "2025-26" can exist
      across schools without colliding.
    - Class is unique per (school, academic_year, grade, section) —
      "Grade 10 / A" is unique per year per school.
    - Course is unique per (school, code) — "MATH-10" is one course in
      one school.
    - Enrollment is unique per (student, klass, course). NULL course is
      treated distinctly by Postgres, so the simple "student in class"
      and the richer "student in class for course X" can coexist.
"""

from __future__ import annotations

from django.db import models

from apps.common.models import TenantModel


class AcademicYear(TenantModel):
    """One school year — e.g. "2025-26" — owned by a school."""

    name = models.CharField(max_length=20, help_text="e.g. 2025-26")
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(
        default=False,
        help_text="At most one is_current=True per school is enforced at save time.",
    )

    class Meta(TenantModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["school", "name"],
                name="academic_year_unique_name_per_school",
            ),
        ]
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.name} ({self.school.name})"


class Course(TenantModel):
    """A subject offered by a school (e.g. Mathematics, Robotics 101)."""

    class Stream(models.TextChoices):
        AI = "AI", "AI"
        CODE = "CODE", "Coding"
        ROBOT = "ROBOT", "Robotics"
        STEM = "STEM", "STEM"
        GENERAL = "GENERAL", "General"

    name = models.CharField(max_length=120)
    code = models.CharField(max_length=30, help_text="e.g. MATH-10, AI-INTRO")
    stream = models.CharField(max_length=10, choices=Stream.choices, default=Stream.GENERAL)
    grade_min = models.PositiveSmallIntegerField(default=1)
    grade_max = models.PositiveSmallIntegerField(default=12)
    description = models.TextField(blank=True)

    class Meta(TenantModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["school", "code"],
                name="course_unique_code_per_school",
            ),
            models.CheckConstraint(
                name="course_grade_range_valid",
                condition=models.Q(grade_min__lte=models.F("grade_max")),
            ),
        ]
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} – {self.name}"


class Class(TenantModel):
    """A section within a grade for a given academic year (e.g. Grade 10-A)."""

    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.PROTECT,
        related_name="classes",
    )
    grade = models.PositiveSmallIntegerField()
    section = models.CharField(max_length=4)
    class_teacher = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="classes_as_teacher",
        help_text="Optional. Must be a TEACHER in the same school.",
    )

    class Meta(TenantModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["school", "academic_year", "grade", "section"],
                name="class_unique_grade_section_per_year",
            ),
            models.CheckConstraint(
                name="class_grade_in_range",
                condition=models.Q(grade__gte=1) & models.Q(grade__lte=12),
            ),
        ]
        ordering = ["grade", "section"]
        verbose_name_plural = "Classes"

    def __str__(self):
        return f"Grade {self.grade}-{self.section} ({self.academic_year.name})"


class Enrollment(TenantModel):
    """A student's enrolment in a class, optionally narrowed to a specific course.

    `course` is nullable: the simple case is "this student is in this class".
    The richer case is "this student takes this course in this class" — useful
    once schools start tracking per-subject electives.
    """

    student = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    klass = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="enrollments",
    )
    enrolled_on = models.DateField(auto_now_add=True)
    withdrawn_on = models.DateField(null=True, blank=True)

    class Meta(TenantModel.Meta):
        constraints = [
            # When course is set: (student, klass, course) is unique.
            # PG treats NULLs as distinct in plain UniqueConstraints, so this
            # one only really fires when course IS NOT NULL.
            models.UniqueConstraint(
                fields=["student", "klass", "course"],
                name="enrollment_unique_student_class_course",
            ),
            # When course is null (bare class membership): (student, klass)
            # itself must be unique. Without this partial index a student
            # could be "enrolled in 10-A" twice with no course on either row.
            models.UniqueConstraint(
                fields=["student", "klass"],
                condition=models.Q(course__isnull=True),
                name="enrollment_unique_student_class_when_no_course",
            ),
        ]
        ordering = ["-enrolled_on"]

    def __str__(self):
        return f"{self.student} → {self.klass}" + (f" / {self.course.code}" if self.course else "")
