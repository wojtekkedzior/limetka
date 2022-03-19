#!/bin/bash

./limetka-backend/backend &
serve -s /limetka-ui/build &
/bin/bash