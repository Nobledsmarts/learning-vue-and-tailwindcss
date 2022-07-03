const apiHeader = {
    header : {
        'x-api-key':TATUM_MAINNET,
    }
}

const requestObject = {
    method: 'GET',
    ...apiHeader
}

Moralis.Cloud.define('useGenerateWalletDetails', async (request) => {
    const { currency } = request.params;
    let mnemonicData = await Moralis.Cloud.run('generateMnemonic', {currency});
    const { mnemonic, xpub } = mnemonicData;
    let walletAddress = await generateWalletAddress(currency, xpub);
    let privateKey = await generatePrivateKey(currency, mnemonic);

    return { mnemonic, xpub, walletAddress, privateKey };
});

Moralis.Cloud.define('generateWalletAddress', async(request) => {
    const { currency, xpub, index } = request.params;
    return Moralis.Cloud.httpRequest({
        url : `${TATUM_ENDPOINT}/${currency}/address/${xpub}/${index}`,
        requestObject
    }).then((response) => {
        response.data.address
    });
});

Moralis.Cloud.define('generateMnemonic', async (request) => {
    const { currency } = request.params;
    return Moralis.Cloud.httpRequest({
        url : `${TATUM_ENDPOINT}/${currency}/wallet`,
        requestObject
    }).then((response) => {
        return response.data
    });
})

Moralis.Cloud.define('generatePrivateKey', async (request) => {
    const { currency, mnemonic } = request.params;
    return Moralis.Cloud.httpRequest({
        url : `${TATUM_ENDPOINT}/${currency}/wallet/priv`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key':TATUM_MAINNET
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
        'x-api-key': TATUM_MAINNET
        },
        body: JSON.stringify({
            currency: currencySymbol,
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
        'x-api-key': 'TATUM_MAINNET'
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

Moralis.Cloud.define('setUpWallet', async (request) => {
    const { progressWidth, walletMessage } = request.params;
    const logger = Moralis.Cloud.getLogger();
    return new Promise(async(resolve, reject) => {
        try {
            const query = new Moralis.Query("AdminWallets");
            let adminWallets = await query.equalTo('isActive', 'true').find();
            const currencySymbol = adminWallets[currentIdx].attributes.currencySymbol;
            const currentUser = Moralis.User.current();
            let currentIdx = 0;

            let interval = setInterval(async () => {
                progressWidth.value = ((currentIdx + 1) / adminWallets.length) * 100;
                walletMessage.value = ("Creating your " + adminWallets[currentIdx].attributes.currency + " wallet");


                const currency = adminWallets[currentIdx].attributes.currency;
                const UserWallets = Moralis.Object.extend("UserWallets");
                const userWallets = new UserWallets();
                let details = await Moralis.run('generateWalletDetails', {currency});

                userWallets.set('adminWallet', adminWallets[currentIdx]);
                userWallets.set('user', currentUser);
                userWallets.set('currencyAddress', details.walletAddress);
                userWallets.set('mnemonic', details.mnemonic);
                userWallets.set('xpub', details.xpub);
                userWallets.set('privateKey', details.privateKey);

                userWallets.save().then(async (userwallets) => {
                    const accountNumber = await Moralis.Cloud.run('generateUUID');
                    const tatumWalletData = await Moralis.Cloud.run('createTatumAccountFromWallet', {
                        currencySymbol,
                        xpub : details.xpub,
                        userId : currentUser.id,
                        accountNumber
                        
                    });
                    userWallets.set('tatumId', tatumWalletData.id);
                    userWallets.set('tatumAccountNumber', accountNumber);

                    await userWallets.save();

                    await Moralis.Cloud.run('enableAddressNotification', {
                        address : details.walletAddress,
                        chain : currencySymbol.toUpperCase()
                    });
                    if ((adminWallets.length - 1) == currentIdx) {
                        clearInterval(interval);
                        resolve({ success : true });
                    }
                    currentIdx++;
                });
            }, 1000);
        } catch (err){
            reject({ success : false, err });
            logger.info(err);
        }
});
});

Moralis.Cloud.define("generateUUID", () => {
    return String(
        Date.now().toString(32) + Math.random().toString(16)
    ).replace(/\./g, '')
});