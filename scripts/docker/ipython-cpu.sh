#!/usr/bin/env bash
set -e

if ! [[ "$0" =~ "./scripts/docker/ipython-cpu.sh" ]]; then
  echo "must be run from repository root"
  exit 255
fi

# -P
# -p hostPort:containerPort
# -p 80:80
# -p 2200:2200
# -p 4200:4200
docker run \
  --privileged \
  --rm \
  -it \
  -p 8888:8888 \
  --volume=`pwd`/notebooks:/gopath/src/github.com/gyuho/deephardway/notebooks \
  gcr.io/deephardway/deephardway:latest-cpu \
  /bin/sh -c "pushd /gopath/src/github.com/gyuho/deephardway && PASSWORD='' ./run_jupyter.sh -y --notebook-dir=./notebooks"

# source activate py36

<<COMMENT
# if run with Python 2
docker run \
  --rm \
  -it \
  -p 8888:8888 \
  --volume=`pwd`/notebooks:/gopath/src/github.com/gyuho/deephardway/notebooks \
  gcr.io/deephardway/deephardway:latest-cpu \
  /bin/sh -c "pushd /gopath/src/github.com/gyuho/deephardway && PASSWORD='' ./run_jupyter.sh -y --allow-root --notebook-dir=./notebooks"
COMMENT

