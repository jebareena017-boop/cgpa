@echo off
title SJC MCA CGPA Calculator Local Server
echo ======================================================
echo Starting SJC MCA CGPA Calculator on Localhost...
echo ======================================================
start http://localhost:3000/login.html
node server.js
pause
