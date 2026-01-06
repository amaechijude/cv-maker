import { v4 as uuidv4 } from 'uuid';

export const useArrayManager = <T extends { id: string; order: number }>(
  items: T[],
  onUpdate: (newItems: T[]) => void
) => {
  const add = (newItem: Omit<T, 'id' | 'order'>) => {
    const item = {
      ...newItem,
      id: uuidv4(),
      order: items.length
    } as T;
    onUpdate([...items, item]);
  };

  const remove = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const update = (id: string, data: Partial<T>) => {
    onUpdate(
      items.map(item => item.id === id ? { ...item, ...data } : item)
    );
  };

  const reorder = (newItems: T[]) => {
    onUpdate(newItems);
  };

  return { add, remove, update, reorder };
};
