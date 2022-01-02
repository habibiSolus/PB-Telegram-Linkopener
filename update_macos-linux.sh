#!/bin/sh
cd -- "$(dirname -- "$BASH_SOURCE")"
git pull
npm update
