#!/usr/bin/env bash

mkdir -p proxies
for f in scripts/*.js; do
    node "$f"
done