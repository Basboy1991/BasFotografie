import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  import.meta.env.PUBLIC_SANITY_DATASET || import.meta.env.SANITY_STUDIO_DATASET || "production";
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-07-07";

export const sanityEnabled =
  Boolean(projectId) && projectId !== "replace-me" && Boolean(dataset);

export const sanityClient = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const imageBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  if (!sanityClient) {
    return null;
  }

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    console.warn("Sanity fetch failed; using local fallback content.", error);
    return null;
  }
}

export function imageUrlFor(
  source: unknown,
  options: { width?: number; height?: number } = {},
): string | null {
  if (!imageBuilder || !source) {
    return null;
  }

  let image = imageBuilder.image(source).fit("crop");
  if (options.width) {
    image = image.width(options.width);
  }
  if (options.height) {
    image = image.height(options.height);
  }

  return image.auto("format").url();
}
