const _TATUM_ENDPOINT = 'https://api-eu1.tatum.io/v3'
const _TATUM_TESTNET='6873e50f-a592-4b68-b65c-f24ab54c1c9c';
const _TATUM_MAINNET='5c00f0e9-77aa-4fb6-b5b0-1c414d5ae5f6';


const apiHeader = {
    header : {
        'x-api-key':_TATUM_MAINNET,
    }
}

const requestObject = {
    method: 'GET',
    ...apiHeader
}

Moralis.Cloud.define('generateWalletDetails', async (request) => {
    const { currency } = request.params;
    let mnemonicData = await Moralis.Cloud.run('generateMnemonic', {currency});
    const { mnemonic, xpub } = mnemonicData;
    let walletAddress = await Moralis.Cloud.run('generateWalletAddress', {currency, xpub});
    let privateKey = await Moralis.Cloud.run('generatePrivateKey', {currency, mnemonic});
    return { mnemonic, xpub, walletAddress, privateKey };
});


Moralis.Cloud.define('generateWalletAddress', async(request) => {
    const logger = Moralis.Cloud.getLogger();
    const { currency, xpub, index = 0} = request.params;
    return Moralis.Cloud.httpRequest({
        url : `${_TATUM_ENDPOINT}/${currency}/address/${xpub}/${index}`,
        requestObject
    }).then((response) => {
         logger.info("WTF1");
        logger.info(JSON.stringify(response.data));
        return response.data.address
    }).catch((e) => {
        logger.info("WTF2");
    });
});


Moralis.Cloud.define('generateMnemonic', async (request) => {
    const { currency } = request.params;
    return Moralis.Cloud.httpRequest({
        url : `${_TATUM_ENDPOINT}/${currency}/wallet`,
        requestObject
    }).then((response) => {
        return response.data
    });
})



Moralis.Cloud.define('generatePrivateKey', async (request) => {
    const { currency, mnemonic } = request.params;
    return Moralis.Cloud.httpRequest({
        url : `${_TATUM_ENDPOINT}/${currency}/wallet/priv`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key':_TATUM_MAINNET
        },
        body: JSON.stringify({
            index: 0,
            mnemonic
        })  
    }).then((response) => {
        return response.data.key
    })
    // const data = await response.json();
    // return data.key;
});


Moralis.Cloud.define('createTatumAccountFromWallet', async (request) => {
    const { currencySymbol, xpub, userId, accountNumber } = request.params;
    return Moralis.Cloud.httpRequest({
        url : `https://api-eu1.tatum.io/v3/ledger/account`,
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'x-api-key': _TATUM_MAINNET
        },
        body: JSON.stringify({
            currency: currencySymbol.toUpperCase(),
            xpub,
            customer: {
                accountingCurrency: 'USD',
                customerCountry: 'US',
                externalId: userId,
                providerCountry: 'US'
            },
            compliant: false,
            accountCode: 'AC_1011_B',
            accountingCurrency: 'USD',
            accountNumber
        })
    }).then((httpResponse) => {
        return httpResponse.data
    });
});

Moralis.Cloud.define('enableAddressNotification', async (request) => {
    const { address, chain } = request.params;
    return Moralis.Cloud.httpRequest({
        url : `https://api-eu1.tatum.io/v3/subscription`,
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'x-api-key': _TATUM_MAINNET
        },
        body: JSON.stringify({
        type: 'ADDRESS_TRANSACTION',
        attr: {
            address,
            chain,
            url: 'https://webhook.tatum.io/account'
        }
        })
    }).then((httpResponse) => {
        return httpResponse.data
    });
});

Moralis.Cloud.define('setUpWallets', async (request) => {
    // const { progressWidth, walletMessage } = request.params;
    const currentUser = Moralis.User.current();
     const { userId } = request.params;

    const logger = Moralis.Cloud.getLogger();
    return new Promise(async(resolve, reject) => {
        try {
            const query = new Moralis.Query("AdminWallets");
            let adminWallets = await query.equalTo('isActive', 'true').find();
           
            
            let currentIdx = 0;
            let interval = setInterval(async () => {
                const UserWallets = Moralis.Object.extend("UserWallets")
                const userWallets = new UserWallets();
                const WalletExists = userWallets.get("adminWallet");
                const userWalletsQuery = new Moralis.Query(UserWallets);
                
                // let availableUserWallets = await userWalletsQuery.equalTo('adminWallet', {
                //     __type : 'Pointer',
                //     className : 'AdminWallets',
                //     objectId : adminWallets[currentIdx].id
                // }).find({ useMasterKey: true });

                

                let availableUserWallets = await userWalletsQuery.equalTo('adminWallet', {
                    __type : 'Pointer',
                    className : 'AdminWallets',
                    objectId : adminWallets[currentIdx].id
                }).equalTo('user', {
                     __type : 'Pointer',
                    className : '_User',
                    objectId : userId ?? request.params.u
                }).find({ useMasterKey: true });

                    // logger.info(['available wallet iqq', JSON.stringify(availableUserWallets)]);
                    // logger.info(['available user test', JSON.stringify(test)]);
                    // logger.info(['userid', request.params.u]);
                    // logger.info(['name', request.params.name]);

                if(!availableUserWallets.length){
                    logger.info(JSON.stringify(['availableUserWallets', availableUserWallets]));

                    const currencySymbol = adminWallets[currentIdx].attributes.currencySymbol;
                    


                    const currency = adminWallets[currentIdx].attributes.currency;
                    
                    let details = await Moralis.Cloud.run('generateWalletDetails', {currency});
                    if(!userId){
                        const User = Moralis.Object.extend("_User");
                        const userQuery = new Moralis.Query(User);
                        const loggedIn = await userQuery.get(request.params.u, {
                            useMasterKey : true
                        });
                        userWallets.set('user', loggedIn);

                        // userWallets.set('user', request.params.u);
                    }
                    userWallets.set('adminWallet', adminWallets[currentIdx]);
                    // userWallets.set('user', currentUser);
                    userWallets.set('currencyAddress', details.walletAddress);
                    userWallets.set('mnemonic', details.mnemonic);
                    userWallets.set('xpub', details.xpub);
                    userWallets.set('privateKey', details.privateKey);

                    userWallets.save().then(async (wallets) => {
                        const accountNumber = await Moralis.Cloud.run('generateUUID');
                        const tatumWalletData = await Moralis.Cloud.run('createTatumAccountFromWallet', {
                            currencySymbol,
                            xpub : details.xpub,
                            userId : userId,
                            accountNumber
                            
                        });
                    
                        logger.info(accountNumber);
                        logger.info(tatumWalletData);

                        wallets.set('tatumId', tatumWalletData.id);
                        wallets.set('tatumCustomerId', tatumWalletData.customerId);
                        wallets.set('tatumAccountNumber', accountNumber);
                        
                        wallets.set('tatumAccountBalance', tatumWalletData.accountBalance);
                        wallets.set('tatumAvailableBalance', tatumWalletData.availableBalance);

                        await wallets.save();

                        await Moralis.Cloud.run('enableAddressNotification', {
                            address : details.walletAddress,
                            chain : currencySymbol.toUpperCase()
                        });

                    });
                }
                if ((adminWallets[adminWallets.length - 1].id) == adminWallets[currentIdx].id) {
                    clearInterval(interval);
                    resolve({ success : true });
                } else {
                    currentIdx++;
                }   
            }, 500);
        } catch (err){
            reject(JSON.stringify({ success : false, err : err.message}));
            logger.info(err.message);
            clearInterval(interval);
        }
    });
});

Moralis.Cloud.define("generateUUID", () => {
    return String(
        Date.now().toString(32) + Math.random().toString(16)
    ).replace(/\./g, '')
});