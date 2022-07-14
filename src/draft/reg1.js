Moralis.Cloud.define('setUpWallets', async (request) => {
    // const { progressWidth, walletMessage } = request.params;
    const logger = Moralis.Cloud.getLogger();
    return new Promise(async(resolve, reject) => {
        try {
            const query = new Moralis.Query("AdminWallets");
            let adminWallets = await query.equalTo('isActive', 'true').find();
            const currencySymbol = adminWallets[currentIdx].attributes.currencySymbol;
            const currentUser = Moralis.User.current();
            let currentIdx = 0;

            let interval = setInterval(async () => {
                // progressWidth.value = ((currentIdx + 1) / adminWallets.length) * 100;
                // walletMessage.value = ("Creating your " + adminWallets[currentIdx].attributes.currency + " wallet");

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
                    if ((adminWallets.length - 1) == currentIdx) {
                        clearInterval(interval);
                        resolve({ success : true });
                    }
                    currentIdx++;
                });
            }, 1000);
        } catch (err){
            logger.info(walletMessage);
            logger.info(progressWidth);
            reject({ success : false, err });
            logger.info(err.message);
        }
});
});



                        const accountNumber = await Moralis.Cloud.run('generateUUID');
                        const tatumWalletData = await Moralis.Cloud.run('createTatumAccountFromWallet', {
                            currencySymbol,
                            xpub : details.xpub,
                            userId : currentUser.id,
                            accountNumber
                            
                        });

                        
                        logger.info(accountNumber);
                        logger.info(tatumWalletData);

                        userWallets.set('tatumId', tatumWalletData.id);
                        userWallets.set('tatumAccountNumber', accountNumber);

                        await userWallets.save();

                        await Moralis.Cloud.run('enableAddressNotification', {
                            address : details.walletAddress,
                            chain : currencySymbol.toUpperCase()
                        });




                                    const query = new Moralis.Query("AdminWallets");
            let adminWallets = await query.equalTo('isActive', 'true').find();
            const userWalletsQuery = new Moralis.Query("UserWallets");
            const userWallets = new userWalletsQuery();
            
            
            
            let currentIdx = 0;
            let interval = setInterval(async () => {
                let availableUserWallets = await userWalletsQuery.equalTo('adminWallet',  {
                    __type : 'Pointer',
                    className : 'AdminWallets',
                    objectId : adminWallets[currentIdx].id
                }).find({ useMasterKey: true });

                
                    logger.info(availableUserWallets);
                    const currencySymbol = adminWallets[currentIdx].attributes.currencySymbol;
                    const currentUser = Moralis.User.current();


                    const currency = adminWallets[currentIdx].attributes.currency;
                    
                    // let details = await Moralis.Cloud.run('generateWalletDetails', {currency});

                    // userWallets.set('adminWallet', adminWallets[currentIdx]);
                    // userWallets.set('user', currentUser);
                    // userWallets.set('currencyAddress', details.walletAddress);
                    // userWallets.set('mnemonic', details.mnemonic);
                    // userWallets.set('xpub', details.xpub);
                    // userWallets.set('privateKey', details.privateKey);

                    // userWallets.save().then(async (userWallets) => {


                        if ((adminWallets.length - 1) == currentIdx) {
                            clearInterval(interval);
                            resolve({ success : true });
                        } else {
                            currentIdx++;
                        }                        
                    // });
            }, 1000);
