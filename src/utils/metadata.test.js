import { applyPublicPageMetadata, resetDefaultMetadata } from "./metadata";

describe("public metadata", () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
    document.head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], meta[name="description"]').forEach((element) => {
      if (
        element.getAttribute("property")?.startsWith("og:") ||
        element.getAttribute("name")?.startsWith("twitter:") ||
        element.getAttribute("rel") === "canonical"
      ) {
        element.remove();
      }
    });
  });

  it("applies public page metadata tags", () => {
    applyPublicPageMetadata({
      title: "Jane Doe | Frontend Engineer",
      description: "Frontend engineer building polished products.",
      image: "https://example.com/jane.png",
      url: "https://example.com/p/jane-doe"
    });

    expect(document.title).toBe("Jane Doe | Frontend Engineer");
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(
      "Jane Doe | Frontend Engineer"
    );
    expect(document.head.querySelector('meta[name="twitter:image"]')?.getAttribute("content")).toBe(
      "https://example.com/jane.png"
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://example.com/p/jane-doe"
    );
  });

  it("can restore default metadata", () => {
    applyPublicPageMetadata({
      title: "Temporary Title",
      description: "Temporary description",
      image: "https://example.com/temp.png",
      url: "https://example.com/temp"
    });

    resetDefaultMetadata();

    expect(document.title).toBe("BuildFolio");
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(
      "BuildFolio"
    );
  });
});
