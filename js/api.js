//! API
export const getData = async () => {
  const url = "https://65e441b83070132b3b246fe9.mockapi.io/products";

  try {
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
