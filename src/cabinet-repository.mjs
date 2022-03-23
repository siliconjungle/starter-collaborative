// This is going to be annoying to implement? but then again do I really need it?
// I think I'd need to store all the indices in local storage somewhere.
const getKeys = async () => []

const getShelfByKey = async key => {
  const storedValue = window.localStorage.getItem(key)
  return storedValue && JSON.parse(storedValue) || null
}

const setShelfByKey = async (key, shelf) => {
  localStorage.setItem(key, JSON.stringify(shelf))
}

export default {
  getKeys,
  getShelfByKey,
  setShelfByKey,
}
