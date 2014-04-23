
# Relay

Relay is a fast and private way to send and receive text messages on your phone, via your computer.

Relay works by a combination of an application you run on your computer + an app on your phone, they communicate directly over the local network and so no external services are involved.

## Features
 - Private - communication is all done via the local network
 - Fast - direct communication cuts overhead significantly
 - Open - add, remove and generally hack to your hearts content

## Getting Started

### Installation

First you need to download, compile and run the android application available here: https://github.com/thomseddon/relay-android (will be in the play store very soon)

Then, grab a copy of this project:

```
git clone https://github.com/thomseddon/relay.git
```

### Run

```
npm start
```

This will start the application on port 5283, you can check it out at http://127.0.0.1:5283 and assuming the android application is running on your device it should Just Work&trade;).

## Notes
 - It's very early days at the moment so things (mainly the android app) are a little fragile at the moment, there are a a load of [issues here](https://github.com/thomseddon/relay/issues?state=open) and [there](https://github.com/thomseddon/relay-android) around making this better, I'd love your help
 - There is a general disregard for browser compatibility, if you're not using chrome it probably won't work - the general thinking is that if you're able to run a local node application you can probably make a good decision about which browser you use
 - The computer app binds to the native DNS Service Discovery API on your PC (via [mdns2](https://github.com/ronkorving/node_mdns)) and therefore requires native compilation, extra libraries may be required, more details here: https://github.com/ronkorving/node_mdns#installation

## Architecture (in brief)
- Host (your computer) announces itself on the network using the multicast DNS service discovery protocol (zeroconf/bonjour)
- Host serves static application on local port 5283
- Host creates web socket server, handshaking also done on port 5283
- App searches for host advertisements
- User selects a host to connect to, app then attempts to open web socket connection with host
- Upon successful connection, app emits messages via websocket requesting list of contacts and SMSs
- Upon receiving such requests, app replies with requested data
- Upon new SMS, app emits message via websocket

## Future work

See: https://github.com/thomseddon/relay/issues?state=open

## Author

[Thom Seddon](https://twitter.com/ThomSeddon)

## License

MIT
