import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const sectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().max(500).optional().or(z.literal("")),
  body: z.string().optional().or(z.literal("")),
  ctaText: z.string().max(100).optional().or(z.literal("")),
  ctaLink: z.string().max(500).optional().or(z.literal("")),
  visible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const galleryItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional().or(z.literal("")),
  woodType: z.string().max(100).optional().or(z.literal("")),
  dimensions: z.string().max(100).optional().or(z.literal("")),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const menuItemSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  href: z.string().min(1, "Link is required").max(500),
  sortOrder: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const siteSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  label: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
