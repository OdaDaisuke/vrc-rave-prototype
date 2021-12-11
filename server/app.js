require('dotenv').config();
const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const PORT = 8081;
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = express();

const nocache = (req, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
};

const generateAccessToken = (req, resp) => {
  resp.header('Access-Control-Allow-Origin', '*');
  const channelName = req.query.channelName;
  if (!channelName) {
    return resp.status(500).json({ 'error': 'channel is required' });
  }
  let uid = req.query.uid;
  if(!uid || uid == '') {
    uid = 0;
  }
  const role = RtcRole.PUBLISHER;
  // get the expire time
  const expireTime = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime);
  return resp.json({ 'token': token });
};
app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
