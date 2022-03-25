import { setUsersByKey, clearStore } from './users-store.mjs'

// const READY_STATE = {
//   CONNECTING: 0,
//   OPEN: 1,
//   CLOSING: 2,
//   CLOSED: 3,
// }

// const DISCONNECT_TIMEOUT = 7000

function CabinetClient (options) {
  this.messages = []
  this.connection = null
  // this.pong = false
  this.cabinet = options.cabinet

  // this.ping = () => {
  //   console.log('_PING_')
  //   if (this.connection.readyState > READY_STATE.OPEN) return
  //   if (!this.pong) {
  //     return this.connection.close()
  //   }
  //   this.pong = false
  //   // this.connection.send(0x9)
  //   setTimeout(this.ping, DISCONNECT_TIMEOUT)
  // }

  this.onmessage = event => {
    const message = JSON.parse(event.data)
    // if (message === 'pong') {
    //   this.pong = true
    //   return
    // }

    const { type, data } = message
    if (type === 'get') {
      const { key, patches, users } = data
      setUsersByKey(key, users)
      this.cabinet.applyOps(key, patches)
    }
  }

  this.onopen = event => {
    // this.pong = true
    // this.ping()
    this.messages.forEach(message => {
      this.sendMessage(message)
    })
  }

  this.onclose = event => {
    clearStore()
    this.createConnection()
    console.log('_ON_CLOSE_')
  }

  // This is going to cause issues if you're offline on a train or something without internet.
  // Instead, notify the user when you've disconnected OR have a timer based approach that increases
  // If the user hasn't disconnected in a while.
  this.createConnection = () => {
    console.log('_CREATE_CONNECTION_')
    this.connection = new WebSocket(options.uri)
    this.connection.onmessage = this.onmessage
    this.connection.onopen = this.onopen
    this.connection.onclose = this.onclose
  }

  this.createConnection()

  this.sendMessage = message => {
    if (this.connection?.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message))
    } else {
      // If a lot of changes happen all offline, this will cause an explosion of updates to all be sent.
      // Merge messages together
      if (message.type === 'set') {
        const existingMessage = this.messages.find(message2 => message.data.key === message2.data.key)
        if (existingMessage) {
          existingMessage.data.patches.push(message.data.patches)
          return
        }
      }
      this.messages.push(message)
    }
  }

  this.subscribe = (key, patches) => {
    this.sendMessage({
      type: 'subscribe',
      data: { cabinet: '/shelves', key, patches },
    })
  }

  this.unsubscribe = key => {
    this.sendMessage({
      type: 'unsubscribe',
      data: { cabinet: '/shelves', key },
    })
  }

  this.uri = options.uri
}

export default CabinetClient
