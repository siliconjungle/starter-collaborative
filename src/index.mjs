import { markdown } from 'markdown'

function Editor(input, preview) {
  this.update = () => {
    preview.innerHTML = markdown.toHTML(input.value)
  }
  input.editor = this
  this.update()
}

const $ = (id) => document.getElementById(id)
new Editor($('text-input'), $('preview'))

console.log(window.location.pathname)
