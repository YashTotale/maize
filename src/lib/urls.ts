export const createServerAPIRoute = (route: string) => {
  if (process.env.NODE_ENV === "production") {
    return route;
  }
  return `http://localhost:3000${route}`;
};
