// console.log('_PATHNAME_', window.location.pathname)

const { pathname } = window.location

if (pathname === '/') {
  import('./directory.mjs')
} else {
  import(`./resource.mjs`)
}
