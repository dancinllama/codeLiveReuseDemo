## Deploy to Scratch Org

[![Deploy](https://deploy-to-sfdx.com/dist/assets/images/DeployToSFDX.svg)](https://deploy-to-sfdx.com)

## Installing in a Scratch Org


1. Create a scratch org and provide it with an alias:

```
sfdx force:org:create -s -f config/project-scratch-def.json -a alias
```

2. Push the app to your scratch org:

```
sfdx force:source:push
```

3. Open the scratch org:

```
sfdx force:org:open
```

5. Optional: Create a community in the scratch org and use form1, form2, and form3 components
