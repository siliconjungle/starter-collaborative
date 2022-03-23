function CabinetClient (options) {
  this.messages = []
  this.connection = new WebSocket(options.uri)
  this.cabinet = options.cabinet

  this.connection.onmessage = event => {
    const message = JSON.parse(event.data)
    const { type, data } = message
    if (type === 'get') {
      const { key, patches } = data
      this.cabinet.applyOps(key, patches)
    }
  }

  this.connection.onopen = event => {
    this.messages.forEach(message => {
      this.sendMessage(message)
    })
  }

  this.sendMessage = message => {
    if (this.connection?.readyState === WebSocket.OPEN) {
      this.connection.send(JSON.stringify(message))
    } else {
      this.messages.push(message)
    }
  }

  this.subscribe = (key, patches) => {
    this.sendMessage({
      type: 'subscribe',
      data: { key, patches },
    })
  }

  this.unsubscribe = key => {
    this.sendMessage({
      type: 'unsubscribe',
      data: { key },
    })
  }

  this.uri = options.uri
}

export default CabinetClient
