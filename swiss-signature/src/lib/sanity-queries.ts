export const ALL_PRODUCTS_QUERY = `*[_type == "product"] {
  _id,
  name,
  "slug": slug.current,
  price,
  category,
  fragranceFamily,
  description,
  longDescription,
  notes,
  rating,
  reviewCount,
  badge,
  "imageUrl": mainImage.asset->url
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  price,
  category,
  fragranceFamily,
  description,
  longDescription,
  notes,
  rating,
  reviewCount,
  badge,
  "images": images[].asset->url
}`;
