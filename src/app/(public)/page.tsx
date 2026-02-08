import { prisma } from "@/lib/db";
import LandingPage from "@/components/public/LandingPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, galleryItems, menuItems, settings] = await Promise.all([
    prisma.section.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.galleryItem.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.menuItem.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSetting.findMany(),
  ]);

  return (
    <LandingPage
      sections={JSON.parse(JSON.stringify(sections))}
      galleryItems={JSON.parse(JSON.stringify(galleryItems))}
      menuItems={JSON.parse(JSON.stringify(menuItems))}
      settings={JSON.parse(JSON.stringify(settings))}
    />
  );
}
