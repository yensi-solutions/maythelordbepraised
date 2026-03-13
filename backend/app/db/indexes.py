from motor.motor_asyncio import AsyncIOMotorDatabase


async def create_indexes(db: AsyncIOMotorDatabase) -> None:
    # Users
    await db.users.create_index("email", unique=True)
    await db.users.create_index("keycloak_id", unique=True)
    await db.users.create_index("role")

    # Pastor profiles (embedded in users, but also queried by visibility)
    await db.users.create_index([("role", 1), ("profile.is_visible", 1)])

    # Services
    await db.services.create_index("pastor_id")
    await db.services.create_index([("pastor_id", 1), ("is_active", 1)])

    # Availability
    await db.availability.create_index([("pastor_id", 1), ("day_of_week", 1)])

    # Bookings
    await db.bookings.create_index([("pastor_id", 1), ("date", 1)])
    await db.bookings.create_index("follower_id")
    await db.bookings.create_index([("pastor_id", 1), ("status", 1)])

    # Prayers
    await db.prayers.create_index("status")
    await db.prayers.create_index("assigned_pastor_id")
    await db.prayers.create_index("author_id")

    # Donations
    await db.donations.create_index("donor_id")
    await db.donations.create_index("pastor_id")

    # Notifications
    await db.notifications.create_index([("user_id", 1), ("is_read", 1)])
    await db.notifications.create_index("created_at")
