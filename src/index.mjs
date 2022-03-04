import { markdown } from 'markdown'
import Cabinet from '@silicon-jungle/cabinet'
import CabinetClient from './cabinet-client.mjs'

// The cabinet could just be hidden away in the client right?
const cabinet = new Cabinet()
const client = new CabinetClient({
  uri: 'wss://silicon-jungle.herokuapp.com',
  cabinet,
})

const $ = (id) => document.getElementById(id)
const input = $('text-input')
const preview = $('preview')

// This can be reduced into a function
let data = null
const setData = value => {
  data = value
}

const subscriptionCallback = (key, value, version) => {
  if (data !== value) {
    setData(value)
    editor.setValue(value)
  }
}

const dataKey = window.location.pathname

client.subscribe(dataKey)
cabinet.addSubscription(dataKey, subscriptionCallback)

const setValue = (key, value) => {
  setData(value)
  cabinet.setState(key, value)
  const shelf = cabinet.getShelf(key)
  client.sendMessage({
    type: 'set',
    data: {
      key,
      value: shelf,
    },
  })
}
// _END_

function Editor(input, preview) {
  this.update = (sync = true) => {
    preview.innerHTML = markdown.toHTML(input.value)
    if (sync && input.value !== data) {
      setValue(dataKey, input.value)
    }
  }
  this.setValue = (value) => {
    input.innerHTML = value
    preview.innerHTML = markdown.toHTML(value)
  }
  input.editor = this
  this.update(false)
}

const editor = new Editor(input, preview)

console.log(dataKey)
