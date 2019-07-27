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

PGUSER=`cat /etc/evept/db/credentials/POSTGRES_USER`
PGPASSWORD=`cat /etc/evept/db/credentials/POSTGRES_PASSWORD`

pg_restore -h evept-db -d evept $DUMP_FILE
