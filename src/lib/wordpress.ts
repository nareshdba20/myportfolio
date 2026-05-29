export type WPPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
};

export type WPCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

const BASE = "https://public-api.wordpress.com/wp/v2/sites/focusondb.wordpress.com";

export async function getPosts(params?: { per_page?: number; categories?: number }): Promise<WPPost[]> {
  const url = new URL(`${BASE}/posts`);
  url.searchParams.set("per_page", String(params?.per_page ?? 10));
  if (params?.categories) url.searchParams.set("categories", String(params.categories));

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    const res = await fetch(`${BASE}/categories?per_page=20`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const cats: WPCategory[] = await res.json();
    return cats.filter((c) => c.count > 0);
  } catch {
    return [];
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
