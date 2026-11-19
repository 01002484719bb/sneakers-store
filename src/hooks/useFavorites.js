import useLocalStorage from "./useLocalStorage";

export default function useFavorites() {
  const [ids, setIds] = useLocalStorage("sneakers-favorites", []);

  const toggle = (id) =>
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const isFavorite = (id) => ids.includes(id);

  return { ids, toggle, isFavorite, count: ids.length };
}