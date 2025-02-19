export const extractFirstImageSrc = (
  htmlContent: string
): string | undefined => {
  const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
};
