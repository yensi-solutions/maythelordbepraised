/**
 * Seed demo data into MongoDB for the Playwright walkthrough.
 * Run: node scripts/seed-demo-data.js
 */
const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URL = process.env.MONGODB_URL || "mongodb://localhost:15783";
const DB_NAME = process.env.MONGODB_DB_NAME || "maythelordbepraised";

async function seed() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);

  // Clear existing demo data
  await Promise.all([
    db.collection("users").deleteMany({}),
    db.collection("services").deleteMany({}),
    db.collection("availability").deleteMany({}),
    db.collection("bookings").deleteMany({}),
    db.collection("prayers").deleteMany({}),
    db.collection("donations").deleteMany({}),
  ]);

  const now = new Date();

  // --- Pastors ---
  const pastors = [
    {
      _id: new ObjectId(),
      keycloak_id: "demo-pastor-1",
      email: "pastor.grace@example.com",
      first_name: "Grace",
      last_name: "Thompson",
      role: "pastor",
      profile: {
        bio: "Senior pastor with 15 years of experience in family counseling and spiritual guidance. Passionate about helping couples build strong, faith-centered marriages.",
        church_name: "New Hope Community Church",
        denomination: "Non-denominational",
        location: "Atlanta, GA",
        photo_url: null,
        specialties: ["Marriage Counseling", "Family Ministry", "Youth Mentoring"],
        is_visible: true,
      },
      created_at: now,
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      keycloak_id: "demo-pastor-2",
      email: "pastor.james@example.com",
      first_name: "James",
      last_name: "Mitchell",
      role: "pastor",
      profile: {
        bio: "Associate pastor specializing in grief support and life transitions. Certified biblical counselor with a heart for those walking through difficult seasons.",
        church_name: "Cornerstone Baptist Church",
        denomination: "Baptist",
        location: "Nashville, TN",
        photo_url: null,
        specialties: ["Grief Support", "Life Transitions", "Biblical Counseling"],
        is_visible: true,
      },
      created_at: now,
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      keycloak_id: "demo-pastor-3",
      email: "pastor.sarah@example.com",
      first_name: "Sarah",
      last_name: "Williams",
      role: "pastor",
      profile: {
        bio: "Worship pastor and certified pre-marital counselor. Leads couples through faith-based preparation for lifelong commitment.",
        church_name: "Grace Fellowship",
        denomination: "Methodist",
        location: "Charlotte, NC",
        photo_url: null,
        specialties: ["Pre-Marital Counseling", "Worship", "Women's Ministry"],
        is_visible: true,
      },
      created_at: now,
      updated_at: now,
    },
  ];

  await db.collection("users").insertMany(pastors);

  // --- Follower ---
  const follower = {
    _id: new ObjectId(),
    keycloak_id: "demo-follower-1",
    email: "mary.johnson@example.com",
    first_name: "Mary",
    last_name: "Johnson",
    role: "follower",
    created_at: now,
    updated_at: now,
  };
  await db.collection("users").insertOne(follower);

  // --- Services ---
  const services = [
    {
      _id: new ObjectId(),
      pastor_id: pastors[0]._id,
      name: "Marriage Counseling Session",
      description: "60-minute couples counseling session focused on communication, conflict resolution, and spiritual growth together.",
      category: "counseling",
      duration_minutes: 60,
      price_cents: 7500,
      mode: "both",
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      pastor_id: pastors[0]._id,
      name: "Wedding Ceremony",
      description: "Full wedding ceremony including rehearsal, personalized vows consultation, and ceremony officiation.",
      category: "ceremony",
      duration_minutes: 120,
      price_cents: 50000,
      mode: "in_person",
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      pastor_id: pastors[1]._id,
      name: "Grief Support Session",
      description: "Compassionate 45-minute session for those processing loss. Safe space for healing through faith.",
      category: "counseling",
      duration_minutes: 45,
      price_cents: 0,
      mode: "both",
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      pastor_id: pastors[1]._id,
      name: "Hospital Visit",
      description: "Pastoral visit for comfort, prayer, and spiritual support during hospital stays.",
      category: "visit",
      duration_minutes: 30,
      price_cents: 0,
      mode: "in_person",
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      pastor_id: pastors[2]._id,
      name: "Pre-Marital Counseling Package",
      description: "6-session pre-marital counseling program covering communication, finances, faith, and family planning.",
      category: "counseling",
      duration_minutes: 60,
      price_cents: 30000,
      mode: "both",
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ];

  await db.collection("services").insertMany(services);

  // --- Availability ---
  const daysMap = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const availability = [];
  for (const pastor of pastors) {
    for (const day of daysMap) {
      availability.push({
        _id: new ObjectId(),
        pastor_id: pastor._id,
        day_of_week: day,
        start_time: "09:00",
        end_time: "17:00",
        created_at: now,
      });
    }
  }
  await db.collection("availability").insertMany(availability);

  // --- Bookings ---
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const bookings = [
    {
      _id: new ObjectId(),
      pastor_id: pastors[0]._id,
      follower_id: follower._id,
      service_id: services[0]._id,
      date: tomorrowStr,
      start_time: "10:00",
      end_time: "11:00",
      mode: "virtual",
      status: "confirmed",
      meeting_link: "https://meet.example.com/session-1",
      notes: null,
      created_at: now,
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      pastor_id: pastors[1]._id,
      follower_id: follower._id,
      service_id: services[2]._id,
      date: tomorrowStr,
      start_time: "14:00",
      end_time: "14:45",
      mode: "virtual",
      status: "pending",
      meeting_link: null,
      notes: null,
      created_at: now,
      updated_at: now,
    },
  ];
  await db.collection("bookings").insertMany(bookings);

  // --- Prayers ---
  const prayers = [
    {
      _id: new ObjectId(),
      author_id: follower._id,
      is_anonymous: false,
      text: "Please pray for my mother's surgery next week. She has been so strong through this journey and we trust God's healing hands.",
      status: "active",
      pray_count: 24,
      testimony: null,
      pastor_responses: [
        {
          pastor_id: pastors[0]._id.toString(),
          text: "Lifting your mother up in prayer. God is the Great Physician and we trust in His perfect plan. Praying for peace and successful surgery.",
          created_at: now,
        },
      ],
      assigned_pastor_id: null,
      created_at: new Date(now.getTime() - 86400000),
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      author_id: null,
      is_anonymous: true,
      text: "Going through a really difficult divorce. Pray for wisdom and strength for me and my children during this time.",
      status: "active",
      pray_count: 47,
      testimony: null,
      pastor_responses: [
        {
          pastor_id: pastors[1]._id.toString(),
          text: "You are not alone in this. God sees your pain and walks with you through every valley. Praying for supernatural strength and wisdom.",
          created_at: now,
        },
      ],
      assigned_pastor_id: null,
      created_at: new Date(now.getTime() - 172800000),
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      author_id: follower._id,
      is_anonymous: false,
      text: "Praise report! After months of praying, I got the job I've been hoping for. God is faithful!",
      status: "answered",
      pray_count: 63,
      testimony: "I prayed for months and God opened doors I never imagined. He is truly faithful to those who trust in Him!",
      pastor_responses: [],
      assigned_pastor_id: null,
      created_at: new Date(now.getTime() - 604800000),
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      author_id: null,
      is_anonymous: true,
      text: "Please pray for our community after the recent storms. Many families have lost their homes and need support.",
      status: "active",
      pray_count: 112,
      testimony: null,
      pastor_responses: [],
      assigned_pastor_id: null,
      created_at: new Date(now.getTime() - 43200000),
      updated_at: now,
    },
    {
      _id: new ObjectId(),
      author_id: follower._id,
      is_anonymous: false,
      text: "Pray for my son starting college this fall. That he stays grounded in faith and finds a good church community.",
      status: "active",
      pray_count: 18,
      testimony: null,
      pastor_responses: [],
      assigned_pastor_id: null,
      created_at: new Date(now.getTime() - 21600000),
      updated_at: now,
    },
  ];
  await db.collection("prayers").insertMany(prayers);

  // --- Donations ---
  const donations = [
    {
      _id: new ObjectId(),
      donor_id: follower._id,
      amount_cents: 5000,
      type: "tithe",
      pastor_id: pastors[0]._id,
      stripe_payment_id: "pi_demo_001",
      created_at: new Date(now.getTime() - 604800000),
    },
    {
      _id: new ObjectId(),
      donor_id: follower._id,
      amount_cents: 2500,
      type: "offering",
      pastor_id: null,
      stripe_payment_id: "pi_demo_002",
      created_at: new Date(now.getTime() - 259200000),
    },
    {
      _id: new ObjectId(),
      donor_id: follower._id,
      amount_cents: 10000,
      type: "general",
      pastor_id: pastors[1]._id,
      stripe_payment_id: "pi_demo_003",
      created_at: new Date(now.getTime() - 86400000),
    },
  ];
  await db.collection("donations").insertMany(donations);

  console.log("Demo data seeded successfully:");
  console.log(`  - ${pastors.length} pastors`);
  console.log(`  - 1 follower`);
  console.log(`  - ${services.length} services`);
  console.log(`  - ${availability.length} availability slots`);
  console.log(`  - ${bookings.length} bookings`);
  console.log(`  - ${prayers.length} prayers`);
  console.log(`  - ${donations.length} donations`);

  await client.close();
}

seed().catch(console.error);
