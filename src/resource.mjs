import { markdown } from 'markdown'
import Cabinet from '@silicon-jungle/cabinet'
// import Cabinet from './cabinet.js'
import CabinetClient from './cabinet-client.mjs'
import cabinetRepository from './cabinet-repository.mjs'
import { subscribeToUsersByKey } from './users-store.mjs'

window.addEventListener('load', () => {
  const dataKey = window.location.pathname

  const $ = (id) => document.getElementById(id)
  const input = $('text-input')
  const preview = $('preview')
  const usersContainer = $('users-container')

  const cabinet = new Cabinet(cabinetRepository)
  let onlineUsers = []

  const setUsers = users => {
    onlineUsers = users
    usersContainer.innerHTML = `${users.length} guests <b>viewing</b> this page.`
  }

  subscribeToUsersByKey(dataKey, setUsers)

  const client = new CabinetClient({
    uri: 'wss://silicon-jungle.herokuapp.com',
    // uri: 'ws://localhost:3000',
    cabinet,
  })

  let accessToken = localStorage.getItem('accessToken')

  window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey) {
      if (e.which === 80) {
        accessToken = prompt('Enter access token')
        localStorage.setItem('accessToken', accessToken)
      } else if (e.which === 86) {
        input.style.display = input.style.display === 'block' ? 'none' : 'block'
      }
    }
  })

  let data = null
  const setData = value => {
    data = value
  }

  const subscriptionCallback = (key, shelf, patches) => {
    if (data !== shelf.value) {
      setData(shelf.value)
      editor.setValue(shelf.value)
    }
  }

  cabinet.getShelf(dataKey).then(shelf => {
    client.subscribe(dataKey, shelf.history)
    cabinet.addSubscription(dataKey, subscriptionCallback)
  }).catch(error => {
    console.log('_ERROR_', error)
  })

  const setValue = (key, value) => {
    if (accessToken) {
      setData(value)
      cabinet.setState(key, value).then((patches) => {
        client.sendMessage({
          accessToken,
          type: 'set',
          data: {
            cabinet: '/shelves',
            key,
            patches,
          },
        })
      }).catch(e => {
        console.log('_ERROR_', e)
      })
    }
  }

  function Editor(input, preview) {
    this.update = (sync = true) => {
      preview.innerHTML = markdown.toHTML(input.value)
      if (sync /* && input.value !== data */) {
        setValue(dataKey, input.value)
      }
    }
    this.setValue = (value) => {
      input.innerHTML = value
      input.value = value
      preview.innerHTML = markdown.toHTML(value)
    }
    input.editor = this
    this.update(false)
  }

  const editor = new Editor(input, preview)
})
