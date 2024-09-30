export const getAuth = () => {
  try {
    const auth = localStorage.getItem("auth");
    const parse = JSON.parse(auth);
    return parse;
  } catch (error) {
    return;
  }
};
