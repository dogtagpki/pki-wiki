#!/bin/sh

SCRIPT=$(readlink -f "$0")
BASEDIR=$(dirname "$SCRIPT")

echo "Creating backup folder..."

DATE=`date +%Y-%m-%d`
FOLDER=`$BASEDIR/gdrive mkdir -p $PKI_BACKUP_DIR $DATE | awk '{print $2;}'`

echo "Backing up MySQL database..."

cd ${HOME}app-root/data
mysqldump \
 -h $OPENSHIFT_MYSQL_DB_HOST \
 -P $OPENSHIFT_MYSQL_DB_PORT \
 -u $OPENSHIFT_MYSQL_DB_USERNAME \
 --password=$OPENSHIFT_MYSQL_DB_PASSWORD \
 $OPENSHIFT_APP_NAME \
 > mysql-$DATE.sql

gzip mysql-$DATE.sql
$BASEDIR/gdrive upload -p $FOLDER --delete mysql-$DATE.sql.gz

echo "Backing up Wiki images..."

tar czvf images-$DATE.tar.gz images
$BASEDIR/gdrive upload -p $FOLDER --delete images-$DATE.tar.gz

echo "Backing up PKI Javadocs and sources..."

tar czvf pki-$DATE.tar.gz pki
$BASEDIR/gdrive upload -p $FOLDER --delete pki-$DATE.tar.gz
