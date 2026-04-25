"""
File:    backend/apps/accounts/users_urls.py
Purpose: URL routes for /api/v1/users/ — kept in its own module so
         apps/accounts/urls.py stays focused on the /auth/ surface.
Owner:   Prashant
"""

from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import UsersViewSet

app_name = "accounts-users"

router = DefaultRouter()
router.register(r"", UsersViewSet, basename="user")

urlpatterns = router.urls
