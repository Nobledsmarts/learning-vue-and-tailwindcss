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
