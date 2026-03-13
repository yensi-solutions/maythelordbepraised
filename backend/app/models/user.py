from enum import Enum


class UserRole(str, Enum):
    pastor = "pastor"
    follower = "follower"
    admin = "admin"
