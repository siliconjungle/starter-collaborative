const URL = 'https://silicon-jungle.herokuapp.com/shelves'
// const URL = 'http://localhost:3000'

fetch(URL).then((response) => {
  return response.json()
}).then((data) => {
  const $ = (id) => document.getElementById(id)
  const directoryContainer = $('directory-container')
  directoryContainer.innerHTML = data.map(route => `<a href="${route}">${route}</a>`).join('')
}).catch(() => {
})
