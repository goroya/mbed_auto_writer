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

1. Execute "mbedaw" in the download destination folder of hex file for mbed on the command line.

1. Press "Compile" button on Mbed Web IDE(https://developer.mbed.org/compiler)

1. The downloaded hex file will be written to the mbed being connected.

## Help

     Usage: mbedaw [options]
      Options:
        -V, --version              output the version number
        -w, --watch  <watch path>  Watching mbed hex file directory (example: mbedaw -w 'C:\Users\hogehoge\Desktop\*.hex')
        -m, --mount  <mount path>  Mbed Mount Drive (example: mbedaw -m 'D:')
        -h, --help                 output usage information
