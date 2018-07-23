#! /bin/bash

scp -r ./config imonir:~/work/imonir.back
scp ./.env.production imonir:~/work/imonir.back/.env.production
