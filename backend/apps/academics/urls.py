"""
File:    backend/apps/academics/urls.py
Purpose: URL routes for the academics app — four ViewSets under /api/v1/academics/.
Owner:   Prashant

  /api/v1/academics/years/         → AcademicYear CRUD
  /api/v1/academics/classes/       → Class CRUD
  /api/v1/academics/courses/       → Course CRUD
  /api/v1/academics/enrollments/   → Enrollment CRUD + /bulk-csv/ action
"""

from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearViewSet,
    ClassViewSet,
    CourseViewSet,
    EnrollmentViewSet,
)

app_name = "academics"

router = DefaultRouter()
router.register(r"years", AcademicYearViewSet, basename="academic-year")
router.register(r"classes", ClassViewSet, basename="class")
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollment")

urlpatterns = router.urls
