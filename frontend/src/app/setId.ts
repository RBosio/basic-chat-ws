export const setId = (): string => {
  const id = localStorage.getItem('id');

  if (!id) {
    const id = Math.random().toString();

    localStorage.setItem('id', id);
    return id;
  }

  return id;
};
