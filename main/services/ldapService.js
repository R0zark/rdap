const ldap = require('ldapjs');
const { default: TYPE_OBJECT } = require('../constants/typeobject');
class LdapService {

    constructor(url, dn) {
        this.url = url
        this.dn = dn
        const client = ldap.createClient({
            url: this.url
        });

        this.login = ({ user: user, password: password }, dn) => {
            return new Promise((resolve, reject) => {
                let completeDN = `cn=${user},${dn}`
                client.bind(completeDN, password, (err) => {
                    if (err) {
                        console.log("Error: " + err)
                        reject(new Error(err.message))
                    } else {
                        resolve()
                    }
                })
            })
        }


        this.searchCurrentDN = (
            query = {
                filter: '(objectClass=*)',
                scope: 'sub',
            }) => {
            return new Promise((resolve, reject) => {
                let entries = []
                client.search(this.dn, query, (err, res) => {
                    res.on('searchEntry', (entry) => {
                        entries.push(entry)
                    });
                    res.on('error', (err) => {
                        console.error('error: ' + err.message);
                        this.disconnect();
                        reject(err);
                    });
                    res.on('end', (result) => {
                        this.disconnect();
                        resolve(entries);
                    });
                })
            })
        }


        this.deleteRecord = (dn) => {
            return new Promise((resolve, reject) => {
                client.del(dn, (err) => {
                    if (err) {
                        console.log("Error: " + err)
                        reject(new Error(err.message))
                    } else {
                        this.disconnect()
                        resolve()
                    }
                })
            })
        }



        this.updateRecord = (oldDN, entry, typeObject) => {
            if (typeObject == TYPE_OBJECT.OU) {
                let newDN = `ou=${entry.modification.ou},` + entry.dn
                return new Promise((resolve, reject) => {
                    client.modifyDN(oldDN, newDN, (err) => {
                        if (err) {
                            reject(new Error(err.message))
                            this.disconnect()
                        }
                        else {
                            this.disconnect()
                            resolve("Se ha modificado con exito")
                        }

                    })
                })
            }
            else {
                let newDN = `cn=${entry.modification.cn},` + entry.dn
                return new Promise((resolve, reject) => {
                    client.modifyDN(oldDN, newDN, (err) => {
                        if (err) {
                            reject(new Error(err.message));
                            this.disconnect();
                            return;
                        }

                        const changes = [];

                        for (let key of Object.keys(entry.modification)) {
                            changes.push(new ldap.Change({
                                operation: 'replace',
                                modification: new ldap.Attribute({
                                    type: key,
                                    vals: entry.modification[key]
                                })
                            }));
                        }
                        client.modify(newDN, changes, (err) => {
                            if (err) {
                                reject(new Error(err.message));
                                this.disconnect();
                            } else {
                                this.disconnect();
                                resolve('Se ha modificado con éxito');
                            }
                        });
                    });
                });
            }
        }


        this.addNewObject = (entry) => {
            let newObject = entry
            let dnOv = ""
            if (entry.attributes.objectClass.includes("inetOrgPerson")) {
                newObject.attributes.uid = newObject.attributes.cn.toLowerCase()
                newObject.attributes.cn = newObject.attributes.cn.toLowerCase()
            }

            if (entry.attributes.objectClass == 'organizationalUnit') {
                dnOv += `ou=${entry.attributes.ou}`
            }

            else {
                dnOv += `cn=${entry.attributes.cn}`
            }

            if (entry.dn != '') {
                dnOv += ',' + entry.dn
            }
            else {
                dnOv += ',' + this.dn
            }
            return new Promise((resolve, reject) => {
                client.add(dnOv, newObject.attributes, (err) => {
                    if (err) {
                        console.log("Error: " + err)
                        reject(new Error(err.message))
                        this.disconnect()
                    } else {
                        this.disconnect()
                        resolve("Se ha creado un nuevo registro")
                    }
                })
            })
        }


        this.disconnect = () => client.unbind()
    }
}

module.exports = LdapService