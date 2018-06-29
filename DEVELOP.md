### Development

1. fork/clone repo
2. install correct node dependency `nvm install && npm i -g npm`
3. install dependencies `npm install`
4. run unit test suites `npm run test:watch`

### Deployment (Publish && Release)

Deployment must be done using only `master` branch.

1. Make sure `CHANGELOG.md` and `README.md` are updated properly
2. `npm version [major|minor|patch]`
3. `git push origin vM.m.p` (push newly created tag)
4. `git push origin master` (`npm version ...` creates a new commit, make sure it is pushed to `master`)
5. Create release in GitHub using the new tag `vM.m.p`
6. Publish: `npm publish`

### Checklist for any PRs

If needed, copy & paste the following checklist:

```
- [ ] Implement feature/update
- [ ] Update unit tests
- [ ] Update CHANGELOG.md
```
