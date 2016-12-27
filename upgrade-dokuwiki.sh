#!/bin/bash
set -euo pipefail
IFS=$'\n\t'


restorebackup() {
  cd /tmp
  rm -rf /tmp/dansullivan.io/
  #the s3 bucket that is being used for backups should be mounted
  if [ ! -e /tmp/dokuwiki-latest.tar.gz ]; then
    cp /mnt/dansullivan-io-backup/dokuwiki-latest.tar.gz /tmp
  fi
  tar -zxvf dokuwiki-latest.tar.gz
}

upgrade() {
  rm -rf /tmp/dokuwiki-release
  mkdir -p /tmp/dokuwiki-release
  cd /tmp/dokuwiki-release
  if [ ! -e ~/working/temp/dokuwiki-download/$1 ]; then
    wget http://download.dokuwiki.org/src/dokuwiki/$1 -O \
     ~/working/temp/dokuwiki-download/$1
  fi
  tar -xzvf ~/working/temp/dokuwiki-download/$1 --strip-components=1
  cp -r * /tmp/html/wiki
  cd /tmp/html/wiki
  grep -Ev '^($|#)' data/deleted.files | xargs -n 1 rm -vf
}

#https://www.dokuwiki.org/:tips:maintenance
function cleanup()
{
    local data_path="$1"        # full path to data directory of wiki
    local retention_days="$2"   # number of days after which old files are to be removed
    # purge files older than ${retention_days} days from attic and media_attic (old revisions)
    find "${data_path}"/{media_,}attic/ -type f -mtime +${retention_days} -delete
 
    # remove stale lock files (files which are 1-2 days old)
    find "${data_path}"/locks/ -name '*.lock' -type f -mtime +1 -delete
 
    # remove empty directories
    find "${data_path}"/{attic,cache,index,locks,media,media_attic,media_meta,meta,pages,tmp}/ \
        -mindepth 1 -type d -empty -delete
 
    # remove files older than ${retention_days} days from the cache
    if [ -e "${data_path}/cache/?/" ]
    then
        find "${data_path}"/cache/?/ -type f -mtime +${retention_days} -delete
    fi
}

if ! [[ `uname -a` =~ Darwin ]]; then
  echo "This script is written for MacOS"
  exit 1
fi

#gnu sed for in place editing (-i)
if [[ `which gsed` = 1 ]]; then 
  brew install gsed
fi

restorebackup
mkdir -p ~/working/temp/dokuwiki-download
#remove any historic plugins
#rm -rf /tmp/html/wiki/lib/plugins
#rm -rf /tmp/html/wiki/lib/tpl
upgrade 'dokuwiki-2012-01-25.tgz'
#revert back to the default template
gsed -i 's\uhmya\dokuwiki\g' /tmp/html/wiki/conf/local.php

upgrade 'dokuwiki-2012-09-10.tgz'
upgrade 'dokuwiki-2012-10-13.tgz'
upgrade 'dokuwiki-2013-05-10.tgz'
upgrade 'dokuwiki-2013-12-08.tgz'
upgrade 'dokuwiki-2014-05-05.tgz'
upgrade 'dokuwiki-2014-09-29.tgz'
upgrade 'dokuwiki-2015-08-10.tgz'
upgrade 'dokuwiki-2016-06-26.tgz'
upgrade 'dokuwiki-2016-06-26a.tgz'

#upgrade 'dokuwiki-2014-09-29d.tgz'
#flush cache for messages needed to be updated
touch /tmp/html/wiki/doku.php
rm -rf /tmp/html/wiki/data/cache/messages.txt
cd /tmp/html/
echo "before cleanup"
du -d 0
#cleanup /tmp/html/wiki 1
echo "after cleanup"
du -d 0
rm -rf /tmp/html/wiki/lib/tpl/dokuwiki_template_starter-stable
wget https://github.com/selfthinker/dokuwiki_template_starter/archive/stable.zip \
  -O /tmp/html/wiki/lib/tpl/stable.zip
unzip /tmp/html/wiki/lib/tpl/stable.zip -d /tmp/html/wiki/lib/tpl/
gsed -i 's\dokuwiki\dokuwiki_template_starter-stable\g' /tmp/html/wiki/conf/local.php
##tar -zxvf dps.devopsrockstars.htdocs.06.10.15.tar.gz --no-overwrite-dir
php -S localhost:8000
