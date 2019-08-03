#!/bin/sh
BASE="https://www.fuzzwork.co.uk/dump"
SCHEMA_ARCHIVE="$BASE/postgres-schema-latest.dmp.bz2"
DUMP_FILE="postgres-schema-latest.dmp"

cd /tmp

# Get Archive
curl $SCHEMA_ARCHIVE -o "$DUMP_FILE.bz2"
curl "$SCHEMA_ARCHIVE.md5" -o "$DUMP_FILE.bz2.md5"

# Validate file
md5sum -c "$DUMP_FILE.bz2.md5"

bunzip2 "$DUMP_FILE.bz2"

export PGUSER=`cat /etc/evept/db/credentials/POSTGRES_USER`
export PGPASSWORD=`cat /etc/evept/db/credentials/POSTGRES_PASSWORD`

pg_restore -c -h evept-db -d evept $DUMP_FILE

psql -h evept-db -d evept -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name='evesde';" | grep "1 row"