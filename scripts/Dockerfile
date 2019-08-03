FROM debian:10-slim

LABEL description="EVEPT Scripting Docker Container (One-Off Tasks)"

RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
 && rm -rf /var/lib/apt/lists

ADD load_sde.sh /usr/bin/load_sde

RUN chmod +x /usr/bin/load_sde