const TATUM_ENDPOINT = 'https://api-eu1.tatum.io/v3'
const TATUM_TESTNET='6873e50f-a592-4b68-b65c-f24ab54c1c9c';
const TATUM_MAINNET='5c00f0e9-77aa-4fb6-b5b0-1c414d5ae5f6';

Moralis.Cloud.define("linkAddress", async (request) => {
    const results = await Moralis.Cloud.run(
    'watchEthAddress',
    {
      address: "0xbfc95c6471fd1c717abfac578ecff70fc14783a5",
      syncHistorical: false,
    },
    { useMasterKey: true });
});

Moralis.Cloud.define('getUsdRate', async (request) => {
    const logger = Moralis.Cloud.getLogger();
    const { fsym } = request.params;
    return Moralis.Cloud.httpRequest({
        url: `https://min-api.cryptocompare.com/data/price?fsym=${fsym}&tsyms=usd`,
    }).then((httpResponse) => {
        return httpResponse.data['USD']
    });
});

Moralis.Cloud.define('getBalance', async (request) => {
    const logger = Moralis.Cloud.getLogger();
    const { currency, currencyAddress } = request.params;
    
    return Moralis.Cloud.httpRequest({
        url : `${TATUM_ENDPOINT}/${currency}/address/balance/${currencyAddress}`,
        followRedirects : true,
        headers: {
            'x-api-key': TATUM_MAINNET
        }
    }).then((response) => {
        const { data } = response;
        let balance = (data.incoming - data.outgoing);
        return balance;
    }, (response) => {
        logger.info(response);
        return 0;
    });
});

Moralis.Cloud.define('cloudCryptoBalance', async(request) => {
    const { userId } = request.params;

    const u = 'DP2deaFSMtuVAG8EpggJqbCH'

    // if(!userId){
    const User = Moralis.Object.extend("_User");
    const userQuery = new Moralis.Query(User);
    const loggedIn = await userQuery.get(u, {
        useMasterKey : true
    });

    const userWalletsQuery = new Moralis.Query("UserWallets");
    let userWallets = await userWalletsQuery.equalTo('user',  {
        __type : 'Pointer',
        className : '_User',
        objectId :  u
    }).find({ useMasterKey: true });

    const adminWalletsQuery = new Moralis.Query("AdminWallets");

    return new Promise(async (resolve) => {
        let idx = 0;
        let totalBalance = 0;
        let interval = setInterval(async () => {
            if((userWallets.length) == idx){
                clearInterval(interval);
                resolve(totalBalance);
            } else {
                let wallet = userWallets[idx];
                let adminWallets = await adminWalletsQuery.equalTo('objectId',  wallet.attributes.adminWallet.id).find({ useMasterKey: true });
                adminWallets = adminWallets[0];
                const currencySymbol =  adminWallets.attributes.currencySymbol;

                const balance = await Moralis.Cloud.run('getBalance', {
                    currency : adminWallets.attributes.currency,
                    currencyAddress : wallet.attributes.currencyAddress
                });

                const usdRate = await Moralis.Cloud.run('getUsdRate', {
                    fsym : currencySymbol
                });

                const logger = Moralis.Cloud.getLogger();

                const usdRate2dp = parseFloat(((+usdRate).toFixed(2)));
                totalBalance += balance * usdRate2dp;
                logger.info(`${balance} * ${usdRate2dp} == ${balance * usdRate2dp}`);

                idx++;
            }
        }, 1000);
    });
});

Moralis.Cloud.define("cryptoBalance", async(request) => {
    const cryptoBalance = await Moralis.Cloud.run('cloudCryptoBalance', {
         userId : request.user.id 
    });
    return parseFloat(((+cryptoBalance).toFixed(2)));
});

Moralis.Cloud.define("getAccounts", async (request) => {
    const logger = Moralis.Cloud.getLogger();
    const UserWallets = Moralis.Object.extend("UserWallets")
    const walletsQuery =  new Moralis.Query(UserWallets);
    // const userWallets = new UserWallets();
    // const { userId } = request.params;
    const u = 'DP2deaFSMtuVAG8EpggJqbCH'

    // if(!userId){
    const User = Moralis.Object.extend("_User");
    const userQuery = new Moralis.Query(User);
    const loggedIn = await userQuery.get(u, {
        useMasterKey : true
    });

                        // userWallets.set('user', request.params.u);
                    // }
    const wallets =  await walletsQuery.equalTo('user', {
        __type : 'Pointer',
        className : '_User',
        objectId : u
    }).find({ useMasterKey: true });

    // const wallets = await results;

    const accounts = [];

     return new Promise(async(resolve, reject) => {
        try {
            
            let currentIdx = 0;
            let interval = setInterval(async () => {
                const AdminWalletQuery = new Moralis.Query("AdminWallets");
                
                //moralis bug workaroud
                const currentWallet = JSON.parse(JSON.stringify(wallets[currentIdx]));

                const adminWalletQuery = await AdminWalletQuery.get(currentWallet.adminWallet.objectId);
                const adminWallet = JSON.parse(JSON.stringify(adminWalletQuery));

                const currencySymbol = adminWallet.currencySymbol.toUpperCase();
                const accountNumber = currentWallet.tatumAccountNumber;
                const tatumId = currentWallet.tatumId;

                const walletDetail = await Moralis.Cloud.run("fetchAccounts", { currencySymbol,  accountNumber, tatumId});
                
                accounts.push(walletDetail);
                
                if ((wallets[wallets.length - 1].id) == wallets[currentIdx].id) {
                    clearInterval(interval);
                    resolve(accounts);
                } else {
                    currentIdx++;
                }
            }, 1000);
        } catch (err){
            reject(JSON.stringify({ success : false, err : err.message, msg : 'catch'}));
            logger.info(err.message);
            clearInterval(interval);
        }
    });
});

Moralis.Cloud.define("getTransactions", async (request) => {
    const { pageSize = '10', offset = '0' } = request.params;
    const logger = Moralis.Cloud.getLogger();
    const UserWallets = Moralis.Object.extend("UserWallets")
    const walletsQuery =  new Moralis.Query(UserWallets);
    // const userWallets = new UserWallets();
    // const { userId } = request.params;
    const u = 'DP2deaFSMtuVAG8EpggJqbCH'

    // if(!userId){
    const User = Moralis.Object.extend("_User");
    const userQuery = new Moralis.Query(User);
    const loggedIn = await userQuery.get(u, {
        useMasterKey : true
    });

                        // userWallets.set('user', request.params.u);
                    // }
    const wallets =  await walletsQuery.equalTo('user', {
        __type : 'Pointer',
        className : '_User',
        objectId : u
    }).find({ useMasterKey: true });

    // const wallets = await results;

    const transactions = [];

     return new Promise(async(resolve, reject) => {
        try {
            
            let currentIdx = 0;
            let interval = setInterval(async () => {
                const AdminWalletQuery = new Moralis.Query("AdminWallets");
                
                //moralis bug workaroud
                const currentWallet = JSON.parse(JSON.stringify(wallets[currentIdx]));

                const adminWalletQuery = await AdminWalletQuery.get(currentWallet.adminWallet.objectId);
                const adminWallet = JSON.parse(JSON.stringify(adminWalletQuery));

                const currency = adminWallet.currency;
                const address = currentWallet.currencyAddress;
                

                let currentWalletTransactions = await Moralis.Cloud.run("fetchTransactions", { currency,  address, pageSize, offset});

                currentWalletTransactions =  currentWalletTransactions.map((transactions) => {
                    transactions.currency = currency;
                    Moralis.Cloud.run('getUsdRate', {
                        fsym : 'sats'
                    }).then((rate) => {
                        const usdAmount = rate * transactions.outputs[0].value;
                        transactions.usdAmount = parseFloat(((usdAmount).toFixed(2)));
                    })
                    return transactions;
                });
                           
                transactions.push(...currentWalletTransactions);
                
                if ((wallets[wallets.length - 1].id) == wallets[currentIdx].id) {
                    clearInterval(interval);
                    resolve(transactions);
                } else {
                    currentIdx++;
                }
            }, 1000);
        } catch (err){
            reject(JSON.stringify({ success : false, err : err.message, msg : 'catch'}));
            logger.info(err.message);
            clearInterval(interval);
        }
    });
});

Moralis.Cloud.define("fetchAccounts", async ( request ) => {
    const { currencySymbol, accountNumber, tatumId } = request.params;
    const logger = Moralis.Cloud.getLogger();
    const query = new URLSearchParams({
        pageSize: '20',
        page: '0',
        sort: 'asc',
        sortBy: 'account_balance',
        active: 'true',
        onlyNonZeroBalance: 'false',
        frozen: 'false',
        currency: currencySymbol,
        accountNumber,
    }).toString();   
    
    let results = await Moralis.Cloud.httpRequest({
        url : `https://api-eu1.tatum.io/v3/ledger/account?${query}`,
        followRedirects : true,
        method : 'GET',
        headers: {
            'x-api-key': TATUM_MAINNET
        }
    }).then((httpResponse) => {
        logger.info(JSON.stringify(httpResponse));
         return httpResponse.data;
    }).catch((e) => {
        logger.info(e.message);
        return {};
    })
    return results;
});

Moralis.Cloud.define("fetchTransactions", async ( request ) => {
    const { address, currency, pageSize , offset  } = request.params;
    const logger = Moralis.Cloud.getLogger();
    const query = new URLSearchParams({
        pageSize,
        offset
    }).toString();


    const ethEndPoint = await Moralis.Cloud.run('getEthTrxEndPoint', {address, query});

    const url = currency == 'ethereum' ? ethEndPoint : `https://api-eu1.tatum.io/v3/${currency}/transaction/address/${address}?${query}`;
    
    let results = await Moralis.Cloud.httpRequest({
        url,
        followRedirects : true,
        method : 'GET',
        headers: {
            'x-testnet-type': 'ethereum-ropsten',
            'x-api-key': TATUM_MAINNET,
        }
    }).then((httpResponse) => {
        logger.info(JSON.stringify(httpResponse));
        const response  = httpResponse.data;
         return httpResponse.data;
    }).catch((e) => {
        logger.info(e.message);
        return [];
    })
    return results;
});

// Moralis.Cloud.g

Moralis.Cloud.define('getEthTrxEndPoint', (request) => {
    const {address, query} = request.params;
    return `https://api-eu1.tatum.io/v3/ethereum/account/transaction/${address}?${query}`;
});

// Moralis.Cloud.define('satoshiTo')