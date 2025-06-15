
export const filterAlgorithmsAndProtocols = (data: any, filter: string) => {
  if (!data || filter === 'all') return data;

  const filterItems = (items: any[]) => {
    if (filter === 'enabled') {
      return items.filter(item => item.status === 'enabled');
    }
    if (filter === 'supported') {
      return items.filter(item => item.status === 'enabled' || item.status === 'supported');
    }
    return items;
  };

  return {
    ...data,
    cryptoAlgorithms: filterItems(data.cryptoAlgorithms || []),
    protocols: filterItems(data.protocols || [])
  };
};
