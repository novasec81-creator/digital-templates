import { describe, expect, it } from "vitest";
import {
  bundleSeparateTotal,
  DEMO_BUNDLES,
  DEMO_PRODUCTS,
  getBundlesForProduct,
  getCompatibility,
  getCoverImage,
  getDemoProduct,
  getGalleryImages,
  getHoverImage,
  getSimilarProducts,
  PRODUCT_CATEGORIES,
  resolveBundleMembers,
} from "@/lib/demo-data";
import { bundleOrderHref, orderAction, orderActionLabel, productOrderHref } from "@/lib/purchase";
import { getDiscountPercent } from "@/lib/utils";
import { canonicalPath } from "@/lib/constants";

describe("catalogue", () => {
  it("expose 12 produits, 5 catégories et 3 packs cohérents", () => {
    expect(DEMO_PRODUCTS).toHaveLength(12);
    expect(PRODUCT_CATEGORIES).toHaveLength(5);
    expect(DEMO_BUNDLES).toHaveLength(3);

    for (const bundle of DEMO_BUNDLES) {
      const members = resolveBundleMembers(bundle);
      expect(members).toHaveLength(bundle.memberSlugs.length);
      // L'économie annoncée correspond toujours à une réduction réelle.
      const total = bundleSeparateTotal(bundle);
      expect(bundle.packPriceCents).toBeLessThan(total);
    }
  });

  it("ne déclare aucune remise sur un produit sans prix barré", () => {
    for (const product of DEMO_PRODUCTS) {
      const discount = getDiscountPercent(
        product.priceCents,
        product.compareAtPriceCents
      );
      if (!product.compareAtPriceCents) expect(discount).toBeNull();
      else expect(discount).toBeGreaterThan(0);
    }
  });

  it("donne un prix de comparaison égal à la somme des membres pour un pack produit", () => {
    const pack = getDemoProduct("pack-bureau-notion-excel");
    expect(pack?.isBundle).toBe(true);
    expect(pack?.compareAtPriceCents).toBe(3100);
    expect(pack?.priceCents).toBe(2400);
  });
});

describe("images produit", () => {
  it("retombe sur une illustration quand aucune capture n'est fournie", () => {
    const product = getDemoProduct("budget-personnel-excel")!;
    expect(product.images).toHaveLength(0);
    expect(getCoverImage(product)).toBeUndefined();
    expect(getGalleryImages(product)).toHaveLength(0);
    expect(getHoverImage(product)).toBeUndefined();
  });

  it("place la cover en premier, retire les doublons et expose la 2e image au survol", () => {
    const base = getDemoProduct("cv-moderne-ats")!;
    const product = {
      ...base,
      images: [
        { src: "/images/cv-1.png", alt: "Vue du modèle", role: "preview" as const },
        { src: "/images/cv-cover.png", alt: "Couverture du modèle", role: "cover" as const },
        { src: "/images/cv-cover.png", alt: "Doublon", role: "preview" as const },
      ],
    };

    expect(getCoverImage(product)?.src).toBe("/images/cv-cover.png");
    // La cover gagne, et le doublon de `src` est retiré : la galerie contient
    // exactement deux entrées, sans clé React répétée.
    const gallery = getGalleryImages(product);
    expect(gallery.map((i) => i.src)).toEqual([
      "/images/cv-cover.png",
      "/images/cv-1.png",
    ]);
    expect(new Set(gallery.map((i) => i.src)).size).toBe(gallery.length);
    expect(getHoverImage(product)?.src).toBe("/images/cv-1.png");
  });
});

describe("compatibilité", () => {
  it("retombe sur les formats de la catégorie quand le produit n'en précise pas", () => {
    const product = getDemoProduct("gestionnaire-de-taches-notion")!;
    expect(product.formats).toEqual(["Lien de duplication Notion"]);
    expect(getCompatibility(product)).toEqual(["Lien de duplication Notion"]);
  });

  it("ne renvoie jamais de compatibilité inventée pour une catégorie inconnue", () => {
    const base = getDemoProduct("cv-moderne-ats")!;
    const orphan = {
      ...base,
      formats: undefined,
      category: { name: "Inconnu", slug: "inconnu" },
    };
    expect(getCompatibility(orphan)).toEqual([]);
  });
});

describe("recommandations et packs", () => {
  it("exclut le produit courant et plafonne à trois résultats", () => {
    const product = getDemoProduct("vie-360-notion")!;
    const similar = getSimilarProducts(product);
    expect(similar.length).toBeLessThanOrEqual(3);
    expect(similar.map((p) => p.id)).not.toContain(product.id);
    expect(new Set(similar.map((p) => p.id)).size).toBe(similar.length);
  });

  it("priorise les produits de la même catégorie", () => {
    const product = getDemoProduct("preset-lightroom-urbain")!;
    const similar = getSimilarProducts(product);
    expect(similar.length).toBeGreaterThan(0);
    expect(similar[0].category.slug).toBe(product.category.slug);
  });

  it("retrouve les packs qui contiennent réellement un produit", () => {
    const packs = getBundlesForProduct("base-clients-freelance-notion");
    expect(packs.map((p) => p.id)).toContain("bundle-freelance");
    for (const pack of packs) {
      expect(pack.memberSlugs).toContain("base-clients-freelance-notion");
    }
    expect(getBundlesForProduct("preset-lightroom-urbain").map((p) => p.id)).toEqual([
      "bundle-photographe",
    ]);
  });
});

describe("actions d'achat centralisées", () => {
  const product = getDemoProduct("budget-personnel-excel")!;
  const bundle = DEMO_BUNDLES[0];

  it("construit des URL de contact pré-remplies", () => {
    expect(productOrderHref(product)).toBe("/contact?produit=budget-personnel-excel");
    expect(bundleOrderHref(bundle)).toBe(`/contact?pack=${bundle.id}`);
  });

  it("encode les identifiants et distingue produits et packs", () => {
    const odd = { ...product, slug: "a b&c" };
    expect(productOrderHref(odd)).toBe("/contact?produit=a%20b%26c");
    expect(orderAction({ kind: "product", product: odd })).not.toBe(
      orderAction({ kind: "bundle", bundle })
    );
  });

  it("expose un libellé adapté à la cible", () => {
    expect(orderActionLabel({ kind: "product", product })).toContain("template");
    expect(orderActionLabel({ kind: "bundle", bundle })).toBe("Commander le pack");
  });
});

describe("canonical", () => {
  it("produit une URL absolue sans slash final pour l'accueil", () => {
    const url = canonicalPath("/");
    expect(url.startsWith("http")).toBe(true);
    expect(url.endsWith("/")).toBe(false);
  });

  it("normalise les slashs superflus des autres pages", () => {
    const url = canonicalPath("/produits/");
    expect(url.endsWith("/produits")).toBe(true);
    expect(url.endsWith("//")).toBe(false);
  });
});