#!/bin/sh

SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")

echo "Unlocking Wiki database..."

mysql $OPENSHIFT_APP_NAME << EOF
set global read_only = off;
unlock tables;
EOF

echo "Unlocking Wiki page..."

cp ${HOME}app-root/repo/LocalSettings.php ${HOME}app-root/repo/LocalSettings.php.tmp
sed -n '/#### LOCK ####/q;p' ${HOME}app-root/repo/LocalSettings.php.tmp > ${HOME}app-root/repo/LocalSettings.php
rm -f ${HOME}app-root/repo/LocalSettings.php.tmp
