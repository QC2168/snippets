export default function slicePage<T = any>(data: T[], page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: data.slice(start, end),
    total: Math.ceil(data.length / limit)
  };
}
