#!/usr/bin/env python3
"""Generate PDF brochures for Pastor Portal and Follower Portal."""

import base64
from pathlib import Path
import weasyprint

ROOT = Path(__file__).parent.parent
SHOTS = ROOT / "e2e" / "results" / "pdf-shots"
IMAGES = ROOT / "frontend" / "apps" / "pastor-portal" / "public" / "images"
OUT = ROOT / "docs"
OUT.mkdir(exist_ok=True)


def img_b64(path: Path) -> str:
    data = path.read_bytes()
    return f"data:image/png;base64,{base64.b64encode(data).decode()}"


COMMON_CSS = """
@page {
    size: A4;
    margin: 0;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    color: #3d2b1f;
    line-height: 1.6;
}
.page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm 25mm;
    page-break-after: always;
    position: relative;
}
.page:last-child { page-break-after: auto; }

/* Cover page */
.cover {
    background: linear-gradient(135deg, #3d2b1f 0%, #5c4033 100%);
    color: #faf5ef;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 40mm 30mm;
}
.cover .logo { width: 80px; height: 80px; margin-bottom: 20px; border-radius: 16px; }
.cover h1 { font-size: 36pt; font-weight: 700; margin-bottom: 10px; line-height: 1.2; }
.cover .subtitle { font-size: 16pt; color: #d4a574; margin-bottom: 30px; }
.cover .tagline { font-size: 12pt; color: #c4a882; max-width: 400px; line-height: 1.8; }
.cover .brand { font-size: 10pt; color: #8b7355; margin-top: 40px; }

/* Section headers */
h2 {
    font-size: 22pt;
    color: #3d2b1f;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 3px solid #d4a574;
}
.section-sub { font-size: 11pt; color: #8b7355; margin-bottom: 20px; }

/* Feature cards */
.feature-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 15px;
}
.feature-card {
    flex: 1 1 45%;
    background: #faf5ef;
    border-radius: 12px;
    padding: 18px;
    border: 1px solid #e8ddd0;
}
.feature-card .icon { font-size: 24pt; margin-bottom: 8px; }
.feature-card h3 { font-size: 13pt; color: #3d2b1f; margin-bottom: 5px; }
.feature-card p { font-size: 9.5pt; color: #6b5744; line-height: 1.5; }

/* Screenshots */
.screenshot {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #e8ddd0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    margin: 12px 0;
}
.screenshot-label {
    font-size: 9pt;
    color: #8b7355;
    text-align: center;
    margin-bottom: 15px;
    font-style: italic;
}

/* Hero image */
.hero-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
}

/* CTA page */
.cta-page {
    background: #faf5ef;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 50mm 30mm;
}
.cta-page h2 { border: none; font-size: 28pt; margin-bottom: 15px; }
.cta-page p { font-size: 13pt; color: #6b5744; max-width: 420px; margin-bottom: 25px; line-height: 1.7; }
.cta-btn {
    display: inline-block;
    background: #3d2b1f;
    color: #faf5ef;
    padding: 14px 40px;
    border-radius: 10px;
    font-size: 14pt;
    font-weight: 600;
    text-decoration: none;
}
.cta-page .url { font-size: 10pt; color: #8b7355; margin-top: 20px; }

/* Benefit list */
.benefits { list-style: none; padding: 0; margin: 15px 0; }
.benefits li {
    padding: 10px 0 10px 30px;
    position: relative;
    font-size: 11pt;
    border-bottom: 1px solid #f0e8dd;
}
.benefits li:last-child { border-bottom: none; }
.benefits li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #d4a574;
    font-weight: 700;
    font-size: 14pt;
}
"""


def generate_pastor_pdf():
    logo = img_b64(IMAGES / "logo-icon.png")
    hero = img_b64(IMAGES / "hero-pastor.png")
    dashboard = img_b64(SHOTS / "pastor-dashboard.png")
    profile = img_b64(SHOTS / "pastor-profile.png")
    services = img_b64(SHOTS / "pastor-services.png")
    availability = img_b64(SHOTS / "pastor-availability.png")
    bookings = img_b64(SHOTS / "pastor-bookings.png")
    prayers = img_b64(SHOTS / "pastor-prayers.png")
    giving = img_b64(SHOTS / "pastor-giving.png")

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>{COMMON_CSS}</style></head><body>

<!-- PAGE 1: Cover -->
<div class="page cover">
    <img src="{logo}" class="logo" />
    <h1>MayTheLordBePraised</h1>
    <p class="subtitle">Pastor Portal</p>
    <p class="tagline">The all-in-one platform to manage your ministry, serve your congregation, and grow your church — so you can focus on what matters most.</p>
    <p class="brand">For Pastors & Ministry Leaders</p>
</div>

<!-- PAGE 2: Overview + Dashboard -->
<div class="page">
    <img src="{hero}" class="hero-img" />
    <h2>Your Ministry Command Center</h2>
    <p class="section-sub">Everything you need to manage your pastoral ministry in one place.</p>

    <p style="font-size: 11pt; margin-bottom: 15px;">
        MayTheLordBePraised gives pastors and ministry leaders a dedicated platform to manage every aspect of their pastoral care. From booking counseling sessions to responding to prayer requests, tracking donations to managing your availability — it's all here.
    </p>

    <img src="{dashboard}" class="screenshot" />
    <p class="screenshot-label">Your personalized dashboard — see pending bookings, active prayers, and key stats at a glance.</p>
</div>

<!-- PAGE 3: Features overview -->
<div class="page">
    <h2>Built for Pastoral Ministry</h2>
    <p class="section-sub">Powerful tools designed specifically for the unique needs of church leadership.</p>

    <div class="feature-grid">
        <div class="feature-card">
            <div class="icon">📅</div>
            <h3>Booking Management</h3>
            <p>Let followers book counseling sessions, ceremonies, and visits online. Set your availability, manage your calendar, and confirm appointments.</p>
        </div>
        <div class="feature-card">
            <div class="icon">🙏</div>
            <h3>Prayer Wall</h3>
            <p>Receive and respond to prayer requests from your community. Track answered prayers, share encouragement, and shepherd your flock.</p>
        </div>
        <div class="feature-card">
            <div class="icon">💝</div>
            <h3>Secure Giving</h3>
            <p>Accept tithes, offerings, and donations securely through Stripe. Track giving history, view donation summaries, and generate reports.</p>
        </div>
        <div class="feature-card">
            <div class="icon">📋</div>
            <h3>Service Catalog</h3>
            <p>Define your services — counseling, ceremonies, home visits. Set pricing, duration, and availability for each offering.</p>
        </div>
        <div class="feature-card">
            <div class="icon">👤</div>
            <h3>Pastor Profile</h3>
            <p>Showcase your background, denomination, specialties, and church. Help followers find the right spiritual match for their needs.</p>
        </div>
        <div class="feature-card">
            <div class="icon">🤝</div>
            <h3>Community Tools</h3>
            <p>Build deeper connections with your congregation through groups, events, and shared devotionals. Strengthen your church community.</p>
        </div>
    </div>
</div>

<!-- PAGE 4: Profile & Services -->
<div class="page">
    <h2>Profile & Services</h2>
    <p class="section-sub">Present yourself professionally and define the services you offer.</p>

    <img src="{profile}" class="screenshot" />
    <p class="screenshot-label">Manage your pastor profile — church name, denomination, location, specialties, and bio.</p>

    <img src="{services}" class="screenshot" style="margin-top: 10px;" />
    <p class="screenshot-label">Define your services with pricing, duration, and category. Followers can book directly.</p>
</div>

<!-- PAGE 5: Availability & Bookings -->
<div class="page">
    <h2>Availability & Bookings</h2>
    <p class="section-sub">Control your schedule and manage appointment requests.</p>

    <img src="{availability}" class="screenshot" />
    <p class="screenshot-label">Set your weekly availability — toggle days on/off and define working hours.</p>

    <img src="{bookings}" class="screenshot" style="margin-top: 10px;" />
    <p class="screenshot-label">View and manage bookings — confirm, decline, or reschedule sessions with one click.</p>
</div>

<!-- PAGE 6: Prayers & Giving -->
<div class="page">
    <h2>Prayers & Giving</h2>
    <p class="section-sub">Shepherd your flock and track the generosity of your community.</p>

    <img src="{prayers}" class="screenshot" />
    <p class="screenshot-label">View prayer requests from your community and respond with pastoral encouragement.</p>

    <img src="{giving}" class="screenshot" style="margin-top: 10px;" />
    <p class="screenshot-label">Track donations received — total giving, number of donations, and recent history.</p>
</div>

<!-- PAGE 7: Why Choose + CTA -->
<div class="page cta-page">
    <img src="{logo}" class="logo" style="margin-bottom: 20px;" />
    <h2>Ready to Transform Your Ministry?</h2>
    <p>Join hundreds of pastors who are using MayTheLordBePraised to serve their congregations more effectively.</p>

    <ul class="benefits" style="text-align: left; max-width: 400px;">
        <li>Save hours on administrative tasks every week</li>
        <li>Never miss a prayer request or booking again</li>
        <li>Accept donations securely with Stripe integration</li>
        <li>Let followers find and book you online</li>
        <li>Respond to prayer requests from anywhere</li>
        <li>Free tier available — no credit card required</li>
    </ul>

    <div class="cta-btn">Join the Waitlist</div>
    <p class="url">maythelordbepraised.com</p>
</div>

</body></html>"""

    out = OUT / "MayTheLordBePraised-Pastor-Portal.pdf"
    weasyprint.HTML(string=html).write_pdf(str(out))
    print(f"✓ Pastor PDF: {out} ({out.stat().st_size // 1024} KB)")


def generate_follower_pdf():
    logo = img_b64(IMAGES / "logo-icon.png")
    hero = img_b64(IMAGES / "hero-follower.png")
    browse = img_b64(SHOTS / "follower-browse-pastors.png")
    prayer = img_b64(SHOTS / "follower-prayer-wall.png")
    bookings = img_b64(SHOTS / "follower-bookings.png")
    giving = img_b64(SHOTS / "follower-giving.png")

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>{COMMON_CSS}</style></head><body>

<!-- PAGE 1: Cover -->
<div class="page cover">
    <img src="{logo}" class="logo" />
    <h1>MayTheLordBePraised</h1>
    <p class="subtitle">Follower Portal</p>
    <p class="tagline">Connect with your pastor, deepen your faith, and grow alongside a caring community — all in one place.</p>
    <p class="brand">For Church Members & Believers</p>
</div>

<!-- PAGE 2: Overview -->
<div class="page">
    <img src="{hero}" class="hero-img" />
    <h2>Your Spiritual Journey, Simplified</h2>
    <p class="section-sub">Everything a believer needs to connect with pastoral care and community.</p>

    <p style="font-size: 11pt; margin-bottom: 15px;">
        MayTheLordBePraised connects you with pastors who care about your spiritual growth. Whether you need counseling, want to share a prayer request, or want to support your church financially — this platform brings it all together in a warm, welcoming space.
    </p>

    <div class="feature-grid">
        <div class="feature-card">
            <div class="icon">🔍</div>
            <h3>Find a Pastor</h3>
            <p>Browse pastors by denomination, location, and specialty. Find the right spiritual guide for your needs — whether it's marriage counseling, grief support, or general guidance.</p>
        </div>
        <div class="feature-card">
            <div class="icon">📅</div>
            <h3>Book Sessions</h3>
            <p>Schedule counseling sessions, ceremonies, and pastoral visits online. Choose between virtual and in-person meetings at times that work for you.</p>
        </div>
        <div class="feature-card">
            <div class="icon">🙏</div>
            <h3>Prayer Wall</h3>
            <p>Share prayer requests with a caring community. Post anonymously or publicly, receive pastoral responses, and join others in prayer.</p>
        </div>
        <div class="feature-card">
            <div class="icon">💝</div>
            <h3>Give & Support</h3>
            <p>Support your pastor and church with tithes, offerings, and donations. Give securely through Stripe with multiple giving categories.</p>
        </div>
    </div>
</div>

<!-- PAGE 3: Browse Pastors -->
<div class="page">
    <h2>Find the Right Pastor</h2>
    <p class="section-sub">Browse a community of pastors ready to guide your spiritual journey.</p>

    <p style="font-size: 11pt; margin-bottom: 15px;">
        Every pastor on MayTheLordBePraised has a detailed profile showing their church, denomination, location, and areas of specialty. Whether you're looking for marriage counseling, grief support, youth mentoring, or pre-marital guidance — you can find a pastor whose experience matches your needs.
    </p>

    <img src="{browse}" class="screenshot" />
    <p class="screenshot-label">Browse pastors with their church, denomination, specialties, and location. Click to view their full profile and available services.</p>

    <ul class="benefits">
        <li>Search by denomination, location, or specialty</li>
        <li>View detailed pastor profiles with bios and qualifications</li>
        <li>See available services with pricing and duration</li>
        <li>Book sessions directly from the pastor's profile</li>
    </ul>
</div>

<!-- PAGE 4: Prayer Wall -->
<div class="page">
    <h2>Community Prayer Wall</h2>
    <p class="section-sub">You are never alone — share your burdens with a community that cares.</p>

    <p style="font-size: 11pt; margin-bottom: 15px;">
        The Prayer Wall is the heart of MayTheLordBePraised. Share your prayer requests — anonymously or publicly — and watch as your community rallies around you. Pastors respond with encouragement, and fellow believers can join you in prayer with a single click. When God answers, share your testimony to inspire others.
    </p>

    <img src="{prayer}" class="screenshot" />
    <p class="screenshot-label">Submit prayer requests, see how many people are praying, read pastoral responses, and share testimonies of answered prayers.</p>
</div>

<!-- PAGE 5: Bookings & Giving -->
<div class="page">
    <h2>Bookings & Giving</h2>
    <p class="section-sub">Manage your appointments and support your church community.</p>

    <img src="{bookings}" class="screenshot" />
    <p class="screenshot-label">Track your upcoming and past sessions — see dates, times, modes (virtual/in-person), and status.</p>

    <img src="{giving}" class="screenshot" style="margin-top: 15px;" />
    <p class="screenshot-label">Give tithes, offerings, and donations securely. Choose preset amounts or enter a custom gift.</p>

    <ul class="benefits" style="margin-top: 15px;">
        <li>Book counseling, ceremonies, and pastoral visits online</li>
        <li>Choose virtual or in-person sessions</li>
        <li>Track all your bookings in one place</li>
        <li>Give securely with multiple donation categories</li>
        <li>Support specific pastors or give to the general fund</li>
    </ul>
</div>

<!-- PAGE 6: CTA -->
<div class="page cta-page">
    <img src="{logo}" class="logo" style="margin-bottom: 20px;" />
    <h2>Start Your Journey Today</h2>
    <p>Join a growing community of believers who are deepening their faith and connecting with pastoral care through MayTheLordBePraised.</p>

    <ul class="benefits" style="text-align: left; max-width: 400px;">
        <li>Find pastors who understand your needs</li>
        <li>Book sessions at your convenience</li>
        <li>Share and receive prayer support</li>
        <li>Give back to your church community</li>
        <li>Access everything from any device</li>
        <li>Completely free for followers</li>
    </ul>

    <div class="cta-btn">Join the Waitlist</div>
    <p class="url">maythelordbepraised.com</p>
</div>

</body></html>"""

    out = OUT / "MayTheLordBePraised-Follower-Portal.pdf"
    weasyprint.HTML(string=html).write_pdf(str(out))
    print(f"✓ Follower PDF: {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    print("Generating PDF brochures...\n")
    generate_pastor_pdf()
    generate_follower_pdf()
    print("\nDone!")
