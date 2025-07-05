#!/bin/bash
# set the var to be the container
CONTAINER=raikou
FLAGS='-d -p 3200:3200 -v /opt/webassets:/opt/webassets --restart unless-stopped'
MYMAX=0
# stop the containers
for n in $(docker images $CONTAINER --format "{{.Tag}}")
do
    for m in $(docker ps -aqf ancestor=$CONTAINER:$n)
    do
        docker stop $m
        docker remove $m
    done
done
# remove all but the oldest image
for n in $(docker images $CONTAINER --format "{{.Tag}}")
do
    if [ $n -gt $MYMAX ];
    then
        MYMAX=$n
    fi
done

for n in $(docker images $CONTAINER --format "{{.Tag}}")
do
    if [ $n -lt $MYMAX ];
    then
        docker image rm $CONTAINER:$n
    fi
done
# build the new image
IMAGETAG=$CONTAINER:$(date +%Y%m%d%H%M%S)
#echo $IMAGETAG
docker build -t $IMAGETAG .

# start the new image
docker run $FLAGS $IMAGETAG


