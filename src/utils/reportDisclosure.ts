export const toggleDescription = (expanded: string[], id: string): string[] =>
  expanded.includes(id) ? expanded.filter((value) => value !== id) : [...expanded, id];

export const expandDescriptions = (items: { id: string; description?: string }[]): string[] =>
  items.filter((item) => Boolean(item.description?.trim())).map((item) => item.id);