import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { copyFile, mkdir } from "fs/promises";
import path from "path";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const PROJECT_ROOT = process.cwd();
const IMAGES_DIR = path.join(PROJECT_ROOT, "images");
const IMAGES_THIS_DIR = path.join(IMAGES_DIR, "this");
const UPLOADS_SEED_DIR = path.join(PROJECT_ROOT, "uploads", "seed");

async function copyImage(filename: string, subdir: "root" | "this" = "root"): Promise<string> {
  const sourceDir = subdir === "this" ? IMAGES_THIS_DIR : IMAGES_DIR;
  const sourcePath = path.join(sourceDir, filename);
  await mkdir(UPLOADS_SEED_DIR, { recursive: true });
  const destPath = path.join(UPLOADS_SEED_DIR, filename);
  await copyFile(sourcePath, destPath);
  return `/api/uploads/seed/${filename}`;
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.galleryItemImage.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.sectionImage.deleteMany();
  await prisma.section.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      email: "admin@dwzizi.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Admin user created: admin@dwzizi.com / admin123");

  // Copy images and get URLs
  const heroImg = await copyImage("bd9502d3-f896-4ad6-96e3-c871ba120110.jpg", "this");
  const philosophyImg = await copyImage("0e55ee54-50da-4835-a20b-ae9be502fe84.jpg");
  const craftsmanship1 = await copyImage("fab8b9fb-9b21-471a-8fa2-d17b448ab008.jpg");
  const craftsmanship2 = await copyImage("2eaab332-871a-49e9-9d43-73c2122dc80d.jpg");
  const craftsmanship3 = await copyImage("91397ba7-119b-469a-b9cd-a35e112d6a64.jpg");

  // Gallery images
  const whisperingOak1 = await copyImage("a7efb45a-70b1-4e8a-8862-57f408f7c434.jpg");
  const whisperingOak2 = await copyImage("65c64e97-5e39-4186-86ce-fbc574bd4a5d.jpg");
  const whisperingOak3 = await copyImage("0c343815-ef42-442c-bafb-18d487ffef17.jpg", "this");
  const whisperingOak4 = await copyImage("4752a34d-11bd-43c8-8144-d456927e7e61.jpg", "this");
  const whisperingOak5 = await copyImage("52b762e4-208b-427f-bda7-e6951b526f1f.jpg", "this");

  const riverOak1 = await copyImage("1d83018b-0973-4a15-9cbf-2c50c16e4495.jpg");
  const riverOak2 = await copyImage("70f7387b-317b-446a-9ca6-3d1bb83104f0.jpg");
  const riverOak3 = await copyImage("27a6b06d-e9f4-45e3-a206-4a0f331cd102.jpg");
  const riverOak4 = await copyImage("72b53ce5-d838-4bb9-a805-b8cb5ef397ae.jpg");

  const ancientHeart1 = await copyImage("8885c546-e4dc-4981-ad29-ca7090edf8e4.jpg");
  const ancientHeart2 = await copyImage("64560597-448a-415d-8a54-0b338c41642e.jpg");

  const forestBurl1 = await copyImage("00dd3363-8d0d-4d63-8e04-e5644bcad148.jpg");
  const forestBurl2 = await copyImage("04b2b828-572c-4df7-a362-ae6222a12e7e.jpg");
  const forestBurl3 = await copyImage("b4a38af6-57fa-42ca-9954-c2b1c0c5a987.jpg");

  // Additional section images
  const extra1 = await copyImage("61f85004-fccb-4a51-b3ac-d3c344b4ea4c.jpg");
  const extra2 = await copyImage("ac0cd245-0450-4697-91a4-4978b1a94f41.jpg");
  const extra3 = await copyImage("1a1020d2-d369-4f1e-95d2-d061eca87a16.jpg", "this");
  const extra4 = await copyImage("1aecf9d9-d32c-4a72-878d-5ea5f7d0f17a.jpg", "this");
  const extra5 = await copyImage("6528243c-3252-48ca-b8a4-6f4cef5c2709.jpg", "this");
  const extra6 = await copyImage("97924ca3-ea2a-4ed2-afb8-436bb2e0ecc5.jpg", "this");
  const extra7 = await copyImage("b3b75d76-ac2d-449a-a0df-9b5070a8685e.jpg", "this");
  const extra8 = await copyImage("d806d835-e96b-4d65-96fa-22b6c27f5cbc.jpg", "this");

  // Create sections
  const hero = await prisma.section.create({
    data: {
      slug: "hero",
      title: "Where Nature Becomes Art",
      subtitle: "Handcrafted live edge oak tables that celebrate the raw beauty of ancient wood, transformed into functional sculptures for discerning spaces.",
      ctaText: "Explore the Collection",
      ctaLink: "#gallery",
      sortOrder: 0,
      images: {
        create: [
          { url: heroImg, alt: "Dramatic oak knot with teal resin", role: "background", sortOrder: 0 },
        ],
      },
    },
  });

  const philosophy = await prisma.section.create({
    data: {
      slug: "philosophy",
      title: "The Beauty of Imperfection",
      subtitle: "Every crack, every knot, every twist of grain tells a story centuries in the making.",
      body: `<p>We don't fight the wood — we listen to it. Each live edge table begins as a conversation between artisan and ancient oak, where natural imperfections become the defining features of extraordinary furniture.</p><p>The cracks that time has carved, the knots that mark decades of growth, the organic curves where bark once lived — these are not flaws to be hidden. They are the signatures of nature's artistry, preserved and elevated into pieces that bridge the gap between raw nature and refined living.</p><p>Our philosophy is simple: the most beautiful furniture doesn't try to improve upon nature. It simply reveals what was always there, waiting to be discovered.</p>`,
      sortOrder: 1,
      images: {
        create: [
          { url: philosophyImg, alt: "Live edge oak detail on dark background", role: "feature", sortOrder: 0 },
          { url: extra1, alt: "Oak grain texture", role: "decorative", sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.section.create({
    data: {
      slug: "gallery",
      title: "The Collection",
      subtitle: "Each piece is a one-of-a-kind creation, shaped by centuries of natural growth and months of meticulous craftsmanship.",
      sortOrder: 2,
    },
  });

  await prisma.section.create({
    data: {
      slug: "craftsmanship",
      title: "The Art of Making",
      subtitle: "From forest to finished masterpiece — a journey of patience, precision, and profound respect for the material.",
      body: `<p>Every table begins its journey in carefully selected forests, where we source oak that has weathered centuries. The selection process alone can take weeks — we search for pieces with extraordinary character, dramatic grain patterns, and the kind of natural beauty that cannot be manufactured.</p>`,
      sortOrder: 3,
      images: {
        create: [
          { url: craftsmanship1, alt: "Artisan working with oak slab", role: "feature", sortOrder: 0 },
          { url: craftsmanship2, alt: "Detail of wood shaping process", role: "feature", sortOrder: 1 },
          { url: craftsmanship3, alt: "Finishing touches on live edge", role: "feature", sortOrder: 2 },
          { url: extra2, alt: "Workshop detail", role: "decorative", sortOrder: 3 },
          { url: extra3, alt: "Wood selection", role: "decorative", sortOrder: 4 },
        ],
      },
    },
  });

  await prisma.section.create({
    data: {
      slug: "invitation",
      title: "Begin Your Story",
      subtitle: "Each table is a commission, crafted to your vision. Share your dream, and we'll bring nature's art to your space.",
      ctaText: "Get in Touch",
      ctaLink: "#contact",
      sortOrder: 4,
      images: {
        create: [
          { url: extra4, alt: "Ambient workshop atmosphere", role: "background", sortOrder: 0 },
        ],
      },
    },
  });

  await prisma.section.create({
    data: {
      slug: "footer",
      title: "DW ZIZI",
      subtitle: "Luxury Live Edge Oak Furniture",
      body: `<p>Handcrafted with passion in the heart of Europe. Each piece tells a story of nature, patience, and artistry.</p>`,
      sortOrder: 5,
    },
  });

  // Create gallery items
  await prisma.galleryItem.create({
    data: {
      name: "The Whispering Oak",
      slug: "the-whispering-oak",
      description: "Born from an oak that stood for three centuries in a forgotten forest clearing, this table captures the whispered secrets of generations. Its dramatic live edge, preserved in its most raw form, flows like a river of amber along the full length. Deep teal resin fills the natural voids where time had its way, creating pools that catch the light like mountain lakes at dawn.",
      woodType: "Ancient White Oak",
      dimensions: "280 cm × 95-120 cm × 76 cm",
      featured: true,
      sortOrder: 0,
      images: {
        create: [
          { url: whisperingOak1, alt: "The Whispering Oak - full view", type: "full", sortOrder: 0 },
          { url: whisperingOak2, alt: "The Whispering Oak - lifestyle setting", type: "lifestyle", sortOrder: 1 },
          { url: whisperingOak3, alt: "The Whispering Oak - edge detail", type: "detail", sortOrder: 2 },
          { url: whisperingOak4, alt: "The Whispering Oak - grain macro", type: "macro", sortOrder: 3 },
          { url: whisperingOak5, alt: "The Whispering Oak - room context", type: "lifestyle", sortOrder: 4 },
        ],
      },
    },
  });

  await prisma.galleryItem.create({
    data: {
      name: "The River Oak",
      slug: "the-river-oak",
      description: "Inspired by the rivers that once nourished its roots, this monumental table features a natural split that runs its entire length, filled with translucent emerald resin that seems to glow from within. The live edges ripple and undulate, mirroring the water's eternal dance.",
      woodType: "European Oak",
      dimensions: "320 cm × 100-130 cm × 76 cm",
      featured: true,
      sortOrder: 1,
      images: {
        create: [
          { url: riverOak1, alt: "The River Oak - full view", type: "full", sortOrder: 0 },
          { url: riverOak2, alt: "The River Oak - alternate angle", type: "full", sortOrder: 1 },
          { url: riverOak3, alt: "The River Oak - resin detail", type: "detail", sortOrder: 2 },
          { url: riverOak4, alt: "The River Oak - edge macro", type: "macro", sortOrder: 3 },
        ],
      },
    },
  });

  await prisma.galleryItem.create({
    data: {
      name: "The Ancient Heart",
      slug: "the-ancient-heart",
      description: "Cut from the very heart of a 400-year-old oak, this table reveals the tree's innermost secrets. Concentric growth rings radiate outward like a topographic map of time itself, each line marking a year of growth, drought, or plenty. The natural cavities at center have been filled with deep amber resin.",
      woodType: "Heritage Oak",
      dimensions: "240 cm × 85-110 cm × 76 cm",
      featured: true,
      sortOrder: 2,
      images: {
        create: [
          { url: ancientHeart1, alt: "The Ancient Heart - full view", type: "full", sortOrder: 0 },
          { url: ancientHeart2, alt: "The Ancient Heart - grain detail", type: "macro", sortOrder: 1 },
          { url: extra5, alt: "The Ancient Heart - surface detail", type: "detail", sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.galleryItem.create({
    data: {
      name: "The Forest Burl",
      slug: "the-forest-burl",
      description: "A rare burl formation gives this table its otherworldly character — swirling grain patterns that seem to move and shift as you walk around it. This anomaly of nature, where the tree healed itself around an ancient wound, creates a surface of mesmerizing complexity.",
      woodType: "Burled Oak",
      dimensions: "200 cm × 90-105 cm × 76 cm",
      featured: false,
      sortOrder: 3,
      images: {
        create: [
          { url: forestBurl1, alt: "The Forest Burl - full view", type: "full", sortOrder: 0 },
          { url: forestBurl2, alt: "The Forest Burl - alternate view", type: "full", sortOrder: 1 },
          { url: forestBurl3, alt: "The Forest Burl - burl detail", type: "detail", sortOrder: 2 },
        ],
      },
    },
  });

  // Create menu items
  const menuItems = [
    { label: "Collection", href: "#gallery", sortOrder: 0 },
    { label: "Philosophy", href: "#philosophy", sortOrder: 1 },
    { label: "Craftsmanship", href: "#craftsmanship", sortOrder: 2 },
    { label: "Contact", href: "#contact", sortOrder: 3 },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  // Create site settings
  const settings = [
    { key: "phone", value: "+48 123 456 789", label: "Phone Number" },
    { key: "email", value: "studio@dwzizi.com", label: "Contact Email" },
    { key: "instagram", value: "https://instagram.com/dwzizi", label: "Instagram URL" },
    { key: "facebook", value: "https://facebook.com/dwzizi", label: "Facebook URL" },
    { key: "metaDescription", value: "Handcrafted live edge oak tables — luxury furniture where nature becomes art. Each piece is a unique masterpiece.", label: "Meta Description" },
    { key: "address", value: "Warsaw, Poland", label: "Studio Address" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }

  console.log("Seed completed successfully!");
  console.log("  - 1 admin user");
  console.log("  - 6 sections with images");
  console.log("  - 4 gallery items with images");
  console.log("  - 4 menu items");
  console.log("  - 6 site settings");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
