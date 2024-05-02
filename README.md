# Alloy Configurator Tool

The _Alloy Configuration Generator_ is an easy to use web interface for creating and editing alloy configuration files. It targets the flow configuration format.

Try it out here: [grafana.github.io/alloy-configurator/](https://grafana.github.io/alloy-configurator/)

**This is an experimental tool and still in its early days!**. While we aim to support all alloy components and are commited to adding support for new components, complete support will take some time.

## Core Features

Features marked as completed are currently present while the rest are still in development.

* [x] Create a fresh alloy configuration file using a guided configuration wizard
* [x] Update existing configurations by editing existing components or adding new ones
* [ ] Have [all components](https://grafana.com/docs/alloy/latest/reference/components/) configurable without writing code
* [x] Share configurations as URLs

## Target Audience

* First time alloy users
  * Provide value by allowing _mix and match_ configuration without having to understand the configuration language
* Advanced users
  * Provide value by improving discoverability of components and configuration options
* Expert users
  * Provide value by sharing configurations using a single URL

# Setup

1. Run `npm install` to install all dependencies.
   * Due to incompatibilities in react dependencies, you will need to use `--force` to avoid a dependency conflict
2. Run `npm start` to start the server.
3. Access the config generator on [localhost:3000](localhost:3000).

To enable and use the converter feature do the following before starting the react server.

1. From the `./backend` directory run `go run main.go` to start the API server.
2. Point at the locally running API server by running `export REACT_APP_CONVERT_ENDPOINT=http://localhost:8080/convert`.
