### Development

1. fork/clone repo
2. install correct node dependency `nvm install && npm i -g npm`
3. install dependencies `npm install`
4. run unit test suites `npm run test:watch`

### Deployment (Publish && Release)

1. Update `CHANGELOG.md`
2. Create distribution files: `npm run build`
3. Login to NPM: `npm login`
4. Increase library version: `npm version [major|minor|patch]`
5. Upload new tag created on step 5: `git push origin <new tag>`
6. Create release in GitHub
7. Publish: `npm publish`

### Checklist for any PRs

If needed, copy & paste the following checklist:

```
- [ ] Implement feature/update
- [ ] Update unit tests
- [ ] Update CHANGELOG.md
```
