#!/bin/bash

cd "$(dirname "$0")"

if [ ! -d pypyjs-release-nojit ] ; then
    git clone https://github.com/syrusakbary/pypyjs-release-nojit.git
else
    cd pypyjs-release-nojit
    rm -rf ./lib/modules
    git reset --hard
    cd ..
fi

GRAPHENE_DIR="$(python -c "import os; import graphene; print os.path.dirname(graphene.__file__)")"
GRAPHQL_DIR="$(python -c "import os; import graphql; print os.path.dirname(graphql.__file__)")"
GRAPHQL_RELAY_DIR="$(python -c "import os; import graphql_relay; print os.path.dirname(graphql_relay.__file__)")"
PROMISE_DIR="$(python -c "import os; import promise; print os.path.dirname(promise.__file__)")"
SIX_DIR="$(python -c "import os; import six; print six.__file__.rstrip('c')")"
TYPING_DIR="$(python -c "import os; import typing; print typing.__file__.rstrip('c')")"

cd pypyjs-release-nojit

cp ../threading.py ./lib/modules/

eval python tools/module_bundler.py add ./lib/modules "$GRAPHENE_DIR"
eval python tools/module_bundler.py add ./lib/modules "$GRAPHQL_DIR"
eval python tools/module_bundler.py add ./lib/modules "$GRAPHQL_RELAY_DIR"
python tools/module_bundler.py add --include threading ./lib/modules ../threading.py
python tools/module_bundler.py add --include subprocess ./lib/modules ../subprocess.py
eval python tools/module_bundler.py add ./lib/modules "$PROMISE_DIR"
eval python tools/module_bundler.py add ./lib/modules "$SIX_DIR"
eval python tools/module_bundler.py add ./lib/modules "$TYPING_DIR"

python ./tools/module_bundler.py preload ./lib/modules graphene
python ./tools/module_bundler.py preload ./lib/modules graphene.relay
python ./tools/module_bundler.py preload ./lib/modules graphql
python ./tools/module_bundler.py preload ./lib/modules graphql_relay
python ./tools/module_bundler.py preload ./lib/modules threading
python ./tools/module_bundler.py preload ./lib/modules subprocess
python ./tools/module_bundler.py preload ./lib/modules promise
python ./tools/module_bundler.py preload ./lib/modules six
python ./tools/module_bundler.py preload ./lib/modules typing

python ./tools/module_bundler.py remove ./lib/modules unittest

lib_dirname=`perl -e 'use Cwd "abs_path";print abs_path(shift)' lib/`

if [ -d ../../../static/playground/lib ] ; then
    rm -rf ../../../static/playground/lib
fi

mkdir -p ../../../static/playground

exec cp -R "$lib_dirname/" ../../../static/playground/lib
