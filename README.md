# Raikou Backend Note
TypeScript makes JavaScript a bit complicated. Here's how to start the server:

`pm2 start npm --name=raikou1 -- run start`

### For Production
`pm2 start npm --name=raikou1 -- run prod`

### Adding Images
Copy images into appropriate webassets folder, then start restart raikou server before restarting website