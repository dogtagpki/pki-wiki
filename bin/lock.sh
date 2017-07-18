#!/bin/sh

SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")

echo "Locking Wiki page..."

cp ${HOME}app-root/repo/LocalSettings.php ${HOME}app-root/repo/LocalSettings.php.tmp
sed -n '/#### LOCK ####/q;p' ${HOME}app-root/repo/LocalSettings.php.tmp > ${HOME}app-root/repo/LocalSettings.php
rm -f ${HOME}app-root/repo/LocalSettings.php.tmp

echo "#### LOCK ####" >> ${HOME}app-root/repo/LocalSettings.php
cat ${HOME}app-root/repo/LocalSettings-lock.php >> ${HOME}app-root/repo/LocalSettings.php

echo "Locking Wiki database..."

mysql $OPENSHIFT_APP_NAME << EOF
flush tables with read lock;
set global read_only = on;
EOF
