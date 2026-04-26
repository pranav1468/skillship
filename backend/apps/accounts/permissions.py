"""
File:    backend/apps/accounts/permissions.py
Purpose: Permission classes specific to /api/v1/users/ user-management endpoints.
Owner:   Prashant

Two layers in one class because they always travel together:

  Surface (`has_permission`)
      Only MAIN_ADMIN and PRINCIPAL can even reach this surface — students
      and teachers don't manage users through this API. (TEACHER reading
      their own roster is a Class-scoped concern, not a User-scoped one.)

  Object (`has_object_permission`)
      MAIN_ADMIN may act on any user. PRINCIPAL may only act on users in
      their own school — never another school's. The check is on the
      *target* user's school_id, not the actor's, because a PRINCIPAL of
      School A passing a UUID belonging to a School B user must be 403,
      not 404 (404 would leak that the id exists).
"""

from __future__ import annotations

from rest_framework.permissions import BasePermission

from apps.common.permissions import Role


class CanManageUsers(BasePermission):
    """Two-layer guard for the /api/v1/users/ surface."""

    SURFACE_ROLES = {Role.MAIN_ADMIN, Role.PRINCIPAL}

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role in self.SURFACE_ROLES)

    def has_object_permission(self, request, view, obj):
        actor = request.user
        if actor.role == Role.MAIN_ADMIN:
            return True
        # PRINCIPAL: must share a school with the target.
        return actor.school_id is not None and obj.school_id == actor.school_id
