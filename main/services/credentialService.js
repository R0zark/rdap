
const fs = require('fs')
class CredentialService {
    constructor() {
        let file="cred.json"
        this.saveCredentials = (userConfig) => {
            fs.writeFile(file,JSON.stringify(userConfig), err=> {
                if  (err) console.log(err)
            })
        }
        this.loadCredentials = () =>{
            let configJSON = null;
            let userConfig = null
            try{
                configJSON = fs.readFileSync(file)
            }
            catch(error){
                if(error.code === 'ENOENT') {
                    fs.writeFile(file,JSON.stringify([]),err => {
                        if(err) console.log(err)
                    })
                    return []
                }
            }
            userConfig = JSON.parse(configJSON)
            return userConfig
        }
    }

}
module.exports = CredentialService