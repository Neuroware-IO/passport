var chancery_passport = {
    buttons: {
        init: function()
        {
            chancery_passport.buttons.login();
            chancery_passport.buttons.logout();
            chancery_passport.buttons.nav();
            chancery_passport.buttons.reset();
        },
        login: function()
        {
            $('body').on('click', '.btn-login', function(e)
            {
                e.preventDefault();
                var password = $('#login-password').val();
                if(password)
                {
                    var credit_path = 1;
                    var user = chancery_passport.user.get();
                    var user_string = user.name + '_' + user.cob + '_' + user.dob + '_' + user.email;
                    var blockchain_key = $.fn.blockstrap.blockchains.key(user.chain.api);
                    var blockchain_obj = bitcoin.networks[blockchain_key];
                    var secure_salt_string = user_string + '_' + user.username + '_' + CryptoJS.MD5(password).toString() + '_' + user.secret;
                    var secure_salt = bitcoin.crypto.sha256(secure_salt_string).toString('hex');
                    var key_object = bitcoin.crypto.sha256(secure_salt_string);
                    var user_keys = bitcoin.HDNode.fromSeedBuffer(key_object, blockchain_obj);
                    var credit_address = user_keys.derive(credit_path).pubKey.getAddress(blockchain_obj).toString();
                    if(credit_address == user.addresses.credit)
                    {
                        localStorage.setItem('chancery_password', CryptoJS.MD5(password).toString());
                        location.reload();
                    }
                    else
                    {
                        $.fn.blockstrap.core.modal('Warning', 'Wrong Password');
                    }
                }
            });
        },
        logout: function()
        {
            $('body').on('click', '.btn-logout', function(e)
            {
                e.preventDefault();
                localStorage.removeItem('chancery_password');
                location.reload();
            });
        },
        nav: function()
        {
            $('body').on('click', '.page-nav', function(e)
            {
                e.preventDefault();
                var button = $(this);
                var id = $(button).attr('id').split('-')[1];
                var direction = $(button).attr('data-direction');
                if(!$(button).hasClass('active'))
                {
                    $('#content').addClass('loading');
                    chancery_passport.pages.switch(id, button, function()
                    {
                        // NEW PAGE NOW VISIBLE
                    }, direction);
                }
            });
        },
        reset: function()
        {
            $('body').on('click', '.btn-reset', function(e)
            {
                e.preventDefault();
                localStorage.removeItem('chancery_passport_user');
                location.reload();
            });
        }
    },
    forms: {
        init: function()
        {
            chancery_passport.forms.setup();
        },
        setup: function()
        {
            var chancery_password = localStorage.getItem('chancery_password');
            var saved_user = chancery_passport.user.get();
            if(saved_user && chancery_password)
            {
                $('form#setup-form').remove();
                $('.preload').removeClass('preload');
            }
            else
            {
                if(saved_user && !chancery_password)
                {
                    $('form#setup-form').find('.setup-only').css('display', 'none');
                    $('form#setup-form').find('.login-only').css('display', 'block');
                }
                $('form#setup-form').on('submit', function(e)
                {
                    e.preventDefault();
                    var form = $(this);
                    var modal = $('#modal-payment');
                    var name = $(form).find('#name').val();
                    var cob = $(form).find('#nation').val();
                    var dob_day = $(form).find('#birth-day').val();
                    var dob_month = $(form).find('#birth-month').val();
                    var dob_year = $(form).find('#birth-year').val();
                    var dob = '' + dob_day + '_' + dob_month + '_' + dob_year;
                    var email = $(form).find('#email').val();
                    var username = $(form).find('#username').val();
                    var password = $(form).find('#password').val();
                    var repeat = $(form).find('#password-repeat').val();
                    var secret = $(form).find('#secret').val();
                    var chain = $(form).find('#chain').val();
                    if(name && cob && dob_day && dob_month && dob_year && email)
                    {
                        if(username && password && repeat && password == repeat && secret && chain)
                        {
                            var user = {
                                name: name,
                                cob: cob,
                                dob: dob,
                                email: email,
                                username: username,
                                secret: secret
                            };
                            var credit_path = 1;
                            var user_string = name + '_' + cob + '_' + dob + '_' + email;
                            var blockchain_key = $.fn.blockstrap.blockchains.key(chain);
                            var blockchain_obj = bitcoin.networks[blockchain_key];
                            var user_hash_object = bitcoin.crypto.sha256(user);
                            var user_hash = bitcoin.crypto.sha256(user_string).toString('hex');
                            var fee = parseFloat($.fn.blockstrap.settings.blockchains[chain].fee * 100000000);

                            user.id = user_hash;
                            
                            var secret_hash = CryptoJS.MD5(user.id + secret).toString();
                            var secure_salt_string = user_string + '_' + user.username + '_' + CryptoJS.MD5(password).toString() + '_' + secret_hash;
                            var secure_salt = bitcoin.crypto.sha256(secure_salt_string).toString('hex');
                            var shared_salt = CryptoJS.MD5(user.id + secure_salt).toString();
                            var key_object = bitcoin.crypto.sha256(secure_salt_string);
                            
                            var user_keys = bitcoin.HDNode.fromSeedBuffer(key_object, blockchain_obj);
                            var credit_address = user_keys.derive(credit_path).pubKey.getAddress(blockchain_obj).toString();
                            
                            $('#modal-payment').find('.qr-holder').attr('data-content', credit_address);
                            $('#modal-payment').find('.address').text(credit_address);

                            $('#modal-payment').find('.qr-holder').each(function(i)
                            {
                                $(this).find('img').remove();
                                $(this).qrcode({
                                    render: 'image',
                                    text: $(this).attr('data-content')
                                });
                            });

                            user.secret = secret_hash;

                            var user_data = [
                                {
                                    path: [2, 1, 2],
                                    value: CryptoJS.MD5(user.id).toString()
                                },
                                {
                                    path: [2, 2, 1],
                                    value: user.name
                                },
                                {
                                    path: [2, 3, 1],
                                    value: user.cob
                                },
                                {
                                    path: [2, 4, 2],
                                    value: CryptoJS.MD5(user.id + user.dob).toString()
                                },
                                {
                                    path: [2, 4, 3],
                                    value: CryptoJS.AES.encrypt(user.dob, shared_salt).toString()
                                },
                                {
                                    path: [2, 5, 2],
                                    value: CryptoJS.MD5(user.id + user.email).toString()
                                },
                                {
                                    path: [2, 5, 3],
                                    value: CryptoJS.AES.encrypt(user.email, shared_salt).toString()
                                },
                                {
                                    path: [2, 6, 2],
                                    value: CryptoJS.MD5(user.id + user.username).toString()
                                },
                                {
                                    path: [2, 6, 3],
                                    value: CryptoJS.AES.encrypt(user.username, shared_salt).toString()
                                }
                            ];

                            $.each(user_data, function(i)
                            {
                                var these_keys = user_keys;
                                $.each(user_data[i].path, function(a)
                                {
                                    these_keys = these_keys.derive(user_data[i].path[a]);
                                });
                                var this_address = these_keys.pubKey.getAddress(blockchain_obj).toString();
                                user_data[i].address = this_address;
                                
                                /* NEED TO ADD RAW TXS HERE */
                                
                                //user_data[i].tx = 'xxx';
                            });

                            user.addresses = {};
                            user.chain = {
                                api: chain, 
                                name: $.fn.blockstrap.settings.blockchains[chain].blockchain, 
                                obj: blockchain_obj
                            };
                            user.addresses.credit = credit_address;
                            user.keys = {};
                            user.keys.public = user_keys.neutered().toString();
                            
                            $('#page-profile').find('.qr-holder').attr('data-content', user.keys.public);
                            $('#ata-url').attr('href', 'http://ata-plus.com/wp-login.php?passport=doget&username=chancery_passport&password='+user.keys.public);

                            $('#page-profile').find('.qr-holder').each(function(i)
                            {
                                $(this).find('img').remove();
                                $(this).qrcode({
                                    render: 'image',
                                    text: $(this).attr('data-content')
                                });
                            });
                            
                            $('.profile-name').text(user.name);
                            $('.profile-cob').text(user.cob);

                            var field_count = user_data.length + 1;
                            var total = parseFloat(((fee * 2) * field_count) / 100000000).toFixed(8);
                            var required = "" + total + " " + user.chain.name;

                            $('#modal-payment').find('.required').text(required);

                            var chancery_passport_data = JSON.stringify(user);

                            localStorage.setItem('chancery_passport_user', chancery_passport_data);
                            localStorage.setItem('chancery_password', CryptoJS.MD5(password).toString());
                            
                            chancery_passport.poll(1, user_data);

                            $("body, html, form#setup-form").animate({ scrollTop: 0 }, 150, function()
                            {
                                $(form).animate({opacity: 0}, 150, function()
                                {
                                    $(form).remove();
                                    $('.preload').removeClass('preload').addClass('preloading');
                                    $('.preloading').animate({opacity: 1}, 350, function()
                                    {
                                        $(this).removeClass('preloading');
                                    });
                                    $(modal).modal('show');
                                });
                            });
                        }
                        else
                        {
                            if(password && repeat && password != repeat)
                            {
                                $.fn.blockstrap.core.modal('Warning', 'The two passwords do not match');
                            }
                            else if(!chain)
                            {
                                $.fn.blockstrap.core.modal('Warning', 'Please select supported blockchain');
                            }
                            else
                            {
                                $.fn.blockstrap.core.modal('Warning', 'Missing vital information needed to complete setup');
                            }
                        }
                    }
                    else
                    {
                        $.fn.blockstrap.core.modal('Warning', '<p>Complete personal details required in order to generate a salt that is stored on your device, which is then used to add extra security throughout the experience.</p><p><strong>However, please note</strong> that only your name and nationality are stored publicly on the blockchains, whereas your email address and date of birth are hashed and encrypted prior to being encoded on the blockchains.');
                    }
                })
            }
        }
    },
    iframes: function()
    {
        $('iframe').each(function()
        {
            var height = $(this).parent().parent().parent().height();
            $(this).height(height - 70);
        });
    },
    init: function()
    {
        chancery_passport.updates();
        chancery_passport.buttons.init();
        chancery_passport.forms.init();
        chancery_passport.iframes();
        chancery_passport.qrs();
        //load img
        var images = [
            'assets/img/people.png',
            'assets/img/services.png', 
            'assets/img/stamps.png'
        ];
        var total = images.length;
        var image_loaded = 0;
        for (var i in images) {
            $("<img />").load(function() {
                image_loaded++;
                if (image_loaded == total) {
                    //when all images loaded we hide start up image.
                    $('body').animate({opacity: 0}, 250, function()
                    {
                        $(this).removeClass('loading').animate({opacity: 1}, 250, function()
                        {

                        });
                    });
                }
            }).error(function() {
                image_loaded++;
                if (image_loaded == total) {
                    //when all images loaded even error in img loading, we hide startup image.
                    $(this).removeClass('loading').animate({opacity: 1}, 250, function()
                    {

                    });
                }   
            }).attr("src", images[i]);
        }   
    },
    loader: {
        close: function(callback, direction)
        {
            if(
                typeof direction != 'undefined'
                && (
                    direction == 'left'
                    || direction == 'right'
                    || direction == 'up'
                    || direction == 'down'
                )
            ){
                var amount = '100%';
                if(direction == 'down') 
                {
                    direction = 'top';
                    amount = '-100%';
                }
                else if(direction == 'up') 
                {
                    direction = 'top';
                    amount = '100%';
                }
                else if(direction == 'right')
                {
                    direction = 'left';
                    amount = '-100%';
                }
                var way = {}; 
                way[direction] = 0;
                $('#content .page.active').css(direction, amount);
                $('#content .page.active').animate(way, 300, function()
                {
                    $('#content .page').css('left', 0);
                    $('#content .page').css('right', 0);
                    $('#content .page').css('top', 0);
                    $('#content .page').css('bottom', 0);
                    callback();
                });
            }
            else
            {
                $('#content #loader').animate({'opacity':0}, 300, function()
                {
                    $('#content .page').css('left', 0);
                    $('#content .page').css('right', 0);
                    $('#content .page').css('top', 0);
                    $('#content .page').css('bottom', 0);
                    $('#content #loader').css('z-index', 4);
                    callback();
                });
            }
        },
        open: function(callback, direction)
        {
            if(
                typeof direction != 'undefined'
                && (
                    direction == 'left'
                    || direction == 'right'
                    || direction == 'up'
                    || direction == 'down'
                )
            ){
                var amount = '-100%';
                if(direction == 'down') 
                {
                    direction = 'top';
                    amount = '100%';
                }
                else if(direction == 'up')
                {
                    direction = 'top';
                    amount = '-100%';
                }
                else if(direction == 'right') 
                {
                    direction = 'left';
                    amount = '100%';
                }
                var way = {};
                way[direction] = amount;
                $('#content .page.active').animate(way, 300, function()
                {
                    callback();
                });
            }
            else
            {
                $('#content .page').css('left', 0);
                $('#content .page').css('right', 0);
                $('#content .page').css('top', 0);
                $('#content .page').css('bottom', 0);
                $('#content #loader').css('z-index', 444);
                $('#content #loader').animate({'opacity':1}, 300, function()
                {
                    callback();
                });
            }
        }
    },
    pages: {
        switch: function(id, button, callback, direction)
        {
            $('.page-nav').removeClass('active');
            $(button).addClass('active');
            chancery_passport.loader.open(function()
            {
                $('.page').removeClass('active');
                $('.page').css('display', 'none');
                $('#page-'+id).addClass('active').css('display', 'block');
                chancery_passport.loader.close(callback, direction);
            }, direction);
        }
    },
    poll: function(attempt, user_data)
    {
        var poll_time = 60000;
        if(typeof attempt == 'undefined')
        {
            attempt = 1;
        }
        if(attempt > 0)
        {
            setTimeout(function()
            {
                var this_attempt = attempt - 1;
                var text = 'ATTEMPT';
                if(this_attempt > 1) text = 'ATTEMPTS';
                $('#modal-payment').find('.qr-holder').addClass('loading');
                if(this_attempt > 0)
                {
                    $('#modal-payment').find('.qr-holder').attr('data-text', this_attempt + ' ' + text + ' ALREADY - WILL BE CHECKING AGAIN IN 30 SECONDS');
                }
                else
                {
                    $('#modal-payment').find('.qr-holder').attr('data-text', 'WILL BE CHECKING THE ADDRESS IN 30 SECONDS');
                }
            }, poll_time / 2);
            setTimeout(function()
            {
                var user = chancery_passport.user.get();
                var address = user.addresses.credit;
                $('#modal-payment').find('.qr-holder').addClass('loading');
                $('#modal-payment').find('.qr-holder').attr('data-text', 'CHECKING CREDIT ADDRESS');
                $.fn.blockstrap.api.unspents(address, user.chain.api, function(txs)
                {
                    attempt++;
                    if(typeof txs != 'undefined' && $.isArray(txs))
                    {
                        $('#modal-payment').find('.qr-holder').attr('data-text', 'FUNDS HAVE BEEN OBTAINED - NOW SETTING UP THE DATA');
                        var inputs = [];
                        var outputs = [];
                        var fees = $.fn.blockstrap.settings.blockchains[user.chain.api].fee * 100000000;
                        $.each(user_data, function(i)
                        {
                            outputs.push({
                                address: user_data[i].address,
                                value: fees * 2
                            });
                        });

                        /*

                        CHECK BALANCE - ENSURE GOT ENOUGH UNSPENS BEFORE CONTINUING

                        */

                        $.each(txs, function(k, unspent)
                        {
                            inputs.push({
                                txid: unspent.txid,
                                n: unspent.index,
                                script: unspent.script,
                                value: unspent.value,
                            });
                        });
                        var pw = localStorage.getItem('chancery_password');
                        var credit_path = 1;
                        var user_string = user.name + '_' + user.cob + '_' + user.dob + '_' + user.email;
                        var blockchain_key = $.fn.blockstrap.blockchains.key(user.chain.api);
                        var blockchain_obj = bitcoin.networks[blockchain_key];
                        var secure_salt_string = user_string + '_' + user.username + '_' + pw + '_' + user.secret;
                        var secure_salt = bitcoin.crypto.sha256(secure_salt_string).toString('hex');
                        var key_object = bitcoin.crypto.sha256(secure_salt_string);
                        var user_keys = bitcoin.HDNode.fromSeedBuffer(key_object, blockchain_obj);
                        var credit_keys = user_keys.derive(credit_path);
                        var private_key = credit_keys.privKey.toWIF(blockchain_obj);
                        var raw_transaction = $.fn.blockstrap.blockchains.raw(
                            address, 
                            private_key, 
                            inputs, 
                            outputs,
                            fees,
                            ((fees * 2) * user_data.length)
                        );
                        var credit_address = credit_keys.pubKey.getAddress(blockchain_obj).toString('hex');
                        $.fn.blockstrap.api.relay(raw_transaction, user.chain.api, function(tx)
                        {
                            if(tx && tx.txid)
                            {
                                $('#modal-payment').find('.qr-holder').attr('data-text', 'SCHEMA SAVED - SAVING DATA AFTER SCHEMA CONFIRMED IN 3 MINUTES');
                                setTimeout(function()
                                {
                                    var txs_completed = 0;
                                    if(typeof user_data.txids == 'undefined') user_data.txids = [];
                                    for (var i = 0; i < user_data.length; i ++)
                                    {
                                        var these_keys = user_keys;
                                        $.each(user_data[i].path, function(a)
                                        {
                                            these_keys = these_keys.derive(user_data[i].path[a]);
                                        });
                                        var from_address = these_keys.pubKey.getAddress(blockchain_obj).toString('hex');
                                        $.fn.blockstrap.api.unspents(from_address, user.chain.api, function(txs)
                                        {
                                            if(typeof txs != 'udefined' && $.isArray(txs))
                                            {
                                                var these_inputs = [];
                                                $.each(txs, function(k, unspent)
                                                {
                                                    these_inputs.push({
                                                        txid: unspent.txid,
                                                        n: unspent.index,
                                                        script: unspent.script,
                                                        value: unspent.value,
                                                    });
                                                });
                                                var these_outputs = [{
                                                    address: from_address,
                                                    value: fees
                                                }];
                                                var this_key = these_keys.privKey.toWIF(blockchain_obj);
                                                var this_tx_index = i;
                                                var this_raw_tx = $.fn.blockstrap.blockchains.raw(
                                                    credit_address, 
                                                    this_key, 
                                                    these_inputs, 
                                                    these_outputs,
                                                    fees,
                                                    fees,
                                                    user_data[this_tx_index].value
                                                );
                                                user_data[this_tx_index].raw = this_raw_tx;
                                                setTimeout(function()
                                                {
                                                    $('#modal-payment').find('.qr-holder').attr('data-text', 'ATTEMPTING TX ' + (this_tx_index + 1) + ' of ' + user_data.length);
                                                    $.fn.blockstrap.api.relay(this_raw_tx, user.chain.api, function(tx)
                                                    {
                                                        txs_completed++;
                                                        if(tx && tx.txid)
                                                        {
                                                            user_data[this_tx_index].txid = tx.txid;
                                                            user_data.txids.push(tx.txid);
                                                        }
                                                        if(txs_completed >= user_data.length)
                                                        {
                                                            if(user_data.txids.length < user_data.length)
                                                            {
                                                                chancery_passport.poll(-1, user_data);
                                                            }
                                                            else
                                                            {
                                                                $.fn.blockstrap.core.modals('close_all');
                                                                setTimeout(function()
                                                                {
                                                                    $.fn.blockstrap.core.modal('Success', 'Encoding complete - you are now on the blockchains!');
                                                                    //console.log('user_data results1', user_data);
                                                                }, 500);
                                                            }
                                                        }
                                                    });
                                                }, ((poll_time / 4) * (txs_completed + 1)));
                                            }
                                            else
                                            {
                                                //console.log('no unspents');
                                            }
                                        });
                                    }
                                }, poll_time * 3);
                            }
                            else
                            {
                                $.fn.blockstrap.core.modal('Error', 'Unable to relay initial transaction');
                            }
                        })
                    }
                    else
                    {
                        $('#modal-payment').find('.qr-holder').attr('data-text', 'WAITING FOR ATTEMPT #' + attempt);
                        setTimeout(function()
                        {
                            $('#modal-payment').find('.qr-holder').removeClass('loading');
                        }, poll_time / 2);
                        setTimeout(function()
                        {
                            chancery_passport.poll(attempt);
                        }, poll_time);
                    }
                }, 0, 'spinal');   
            }, poll_time);
        }
        else
        {
            var retested = 0;
            var user = chancery_passport.user.get();
            for (var txi = 0; txi < user_data.length; txi ++)
            {
                if(typeof user_data[txi].txid == 'undefined')
                {
                    $('#modal-payment').find('.qr-holder').attr('data-text', 'RE-TRYING TX #' + (txi + 1) + ' of ' + user_data.length);
                    $.fn.blockstrap.api.relay(user_data[txi].raw, user.chain.api, function(this_tx)
                    {
                        retested++;
                        if(this_tx && this_tx.txid)
                        {
                            user_data[txi].txid = this_tx.txid;
                            user_data.txids.push(this_tx.txid);
                        }
                        if(retested >= user_data.length)
                        {
                            if(user_data.txids.length >= user_data.length)
                            {
                                $.fn.blockstrap.core.modals('close_all');
                                setTimeout(function()
                                {
                                    $.fn.blockstrap.core.modal('Success', 'Encoding complete - you are now on the blockchains!');
                                    //console.log('user_data results2', user_data);
                                }, 500);
                            }
                            else
                            {
                                chancery_passport.poll(-1, user_data);
                            }
                        }
                    });
                }
                else
                {
                    retested++;
                    if(retested >= user_data.length)
                    {
                        if(user_data.txids.length >= user_data.length)
                        {
                            $.fn.blockstrap.core.modals('close_all');
                            setTimeout(function()
                            {
                                $.fn.blockstrap.core.modal('Success', 'Encoding complete - you are now on the blockchains!');
                                //console.log('user_data results3', user_data);
                            }, 500);
                        }
                        else
                        {
                            chancery_passport.poll(-1, user_data);
                        }
                    }
                }
            }
        }
    },
    qrs: function()
    {
        $('.qr-holder').each(function()
        {
            if($(this).find('img').length > 0)
            {
                $(this).find('img').remove();
            }
            $(this).qrcode({
                render: 'image',
                text: $(this).attr('data-content')
            });
        });
    },
    updates: function()
    {
        var user = chancery_passport.user.get();
        if(user)
        {
            $('.profile-name').text(user.name);
            $('.profile-cob').text(user.cob);
            $('.profile-key').text(user.keys.public);
            $('#ata-url').attr('href', 'http://ata-plus.com/wp-login.php?passport=doget&username=chancery_passport&password='+user.keys.public);
            $('#page-profile').find('.qr-holder').attr('data-content', user.keys.public);
        }
    },
    user: {
        get: function()
        {
            var user = false;
            var obj = localStorage.getItem('chancery_passport_user');
            if(obj)
            {
                user = JSON.parse(obj);
            }
            return user;
        },
        lookup: function(master_extended_key, chain)
        {
            var user = {};
            var field_count = 0;
            var blockchain_key = $.fn.blockstrap.blockchains.key(chain);
            var blockchain_obj = bitcoin.networks[blockchain_key];
            var fields = [
                {
                    key: 'id',
                    path: [2, 1, 1]
                },
                {
                    key: 'name',
                    path: [2, 2, 1]
                },
                {
                    key: 'cob',
                    path: [2, 3, 1]
                },
                {
                    key: 'dob',
                    paths: [
                        {
                            key: 'md5',
                            path: [2, 4, 2]
                        },
                        {
                            key: 'aes',
                            path: [2, 4, 3]
                        }
                    ]
                },
                {
                    key: 'email',
                    paths: [
                        {
                            key: 'md5',
                            path: [2, 5, 2]
                        },
                        {
                            key: 'aes',
                            path: [2, 5, 3]
                        }
                    ]
                },
                {
                    key: 'username',
                    paths: [
                        {
                            key: 'md5',
                            path: [2, 6, 2]
                        },
                        {
                            key: 'aes',
                            path: [2, 6, 3]
                        }
                    ]
                }
            ];

            /* 

            GET ADDRESS FOR EACH FIELD 

            */
            for(i = 0; i < fields.length; i++)
            {
                if(
                    typeof fields[i].key != 'undefined'
                    &&
                    (
                        typeof fields[i].path != 'undefined'
                        || typeof fields[i].paths != 'undefined'
                    )
                ){
                    if(typeof fields[i].path != 'undefined')
                    {
                        var this_key = chancery_passport.temp.hd_key_lookup(master_extended_key, chain, fields[i].path);
                        fields[i].address = this_key.pubKey.getAddress(blockchain_obj).toString('hex');
                        $.fn.blockstrap.api.op_returns(fields[i].address, chain, function(results)
                        {
                            if(typeof results[0] != 'undefined' && typeof results[0].data != 'undefined')
                            {
                                fields[i].value = $.fn.blockstrap.blockchains.decode(results[0].data);
                                user[fields[i].key] = fields[i].value;
                            }
                        });
                    }
                    else if(typeof fields[i].paths != 'undefined')
                    {
                        user[fields[i].key] = {};
                        for(a = 0; a < fields[i].paths.length; a++)
                        {
                            if(
                                typeof fields[i].paths[a].key != 'undefined'
                                && typeof fields[i].paths[a].path != 'undefined'
                            ){
                                var this_key = chancery_passport.temp.hd_key_lookup(master_extended_key, chain, fields[i].paths[a].path);
                                fields[i].paths[a].address = this_key.pubKey.getAddress(blockchain_obj).toString('hex');
                                $.fn.blockstrap.api.op_returns(fields[i].paths[a].address, chain, function(results)
                                {
                                    if(typeof results[0] != 'undefined' && typeof results[0].data != 'undefined')
                                    {
                                        fields[i].paths[a].value = $.fn.blockstrap.blockchains.decode(results[0].data);
                                        user[fields[i].key][fields[i].paths[a].key] = fields[i].paths[a].value;
                                    }
                                });
                            }
                        }
                    }
                }
            }
            return user;
        }
    },
    temp: {
        hd_key_lookup: function(master_extended_key, chain, path)
        {
            try
            {
                var blockchain_key = $.fn.blockstrap.blockchains.key(chain);
                var blockchain_obj = bitcoin.networks[blockchain_key];
                var keys = bitcoin.HDNode.fromBase58(master_extended_key, blockchain_obj);
                for(var i = 0; i < path.length; i++)
                {
                    keys = keys.derive(path[i]);
                }
                return keys;
            }
            catch(error)
            {
                return false;
            }
        }
    }
    
};

$(document).ready(function()
{
    chancery_passport.init();
});