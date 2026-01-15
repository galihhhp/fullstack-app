#!/bin/sh
set -e
cat <<EOF >/usr/share/nginx/html/config.json
{
  "apiUrl": "${API_URL:-http://localhost:3000}",
  "userApiUrl": "${USER_API_URL:-http://localhost:4000}",
  "featureEditTask": "${FEATURE_EDIT_TASK:-false}",
  "featureDeleteTask": "${FEATURE_DELETE_TASK:-false}",
  "featureShowTasks": "${FEATURE_SHOW_TASKS:-true}",
  "featureShowUsers": "${FEATURE_SHOW_USERS:-true}"
}
EOF
chown nginx:nginx /usr/share/nginx/html/config.json
exec nginx -g 'daemon off;'
