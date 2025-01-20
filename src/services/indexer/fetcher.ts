export const fetchQuery = async <T>(
  url: string,
  query: string,
  request: Partial<any>
): Promise<T> => {
  const data = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      query: query,
      variables: request,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });

  return (await data.json()) as T;
};
