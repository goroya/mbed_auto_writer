# Mbed Auto Writer

[![npm version](https://badge.fury.io/js/mbed_auto_writer.svg)](https://badge.fury.io/js/mbed_auto_writer)

[![NPM](https://nodei.co/npm/mbed_auto_writer.png)](https://nodei.co/npm/mbed_auto_writer/)

## What is this?
This is a tool for automatic writing after compiling Mbed Web IDE.
これはMbed Web IDEのコンパイル完了後に自動書き込みする為のツールです。

## Require
    Node.js  >=7.6.0

## Installation
    npm install -g mbed_auto_writer

## testing environment
    Windows 10 professional 64bit

## How to Use

1. Execute "mbed_auto_writer" in the download destination folder of hex file for mbed on the command line.

1. Press "Compile" button on Mbed Web IDE(https://developer.mbed.org/compiler)

1. The downloaded hex file will be written to the mbed being connected.

## Help

     Usage: index Usage: mbedaw [options]
      Options:
        -V, --version  output the version number
        -w, --watch    Watching mbed hex file directory (example "C:\Users\*.hex")
        -m, --mount    Mbed Mount Drive (example "D:")
        -h, --help     output usage information