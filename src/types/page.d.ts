type PageSearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  params: Record<string, string>;
  searchParams: PageSearchParams;
}
