/*
 * 
 *  Blockstrap v0.8.0.1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 *  -- Including this file in the HTML header is the only requirement
 *  -- Everything else, including the loading of dependencies is handled here
 *  
 */

var blockstrap_options = {
    v: "0.8.0.1",
    id: "blockstrap",
    app_id: "passport",
    account_poll: false,
    install: false,
    skip_config: true,
    public: false, 
    security: false,
    role: "admin",
    element: "body",
    less: false,
    test: false,
    refresh: true,
    cascade: false,
    html_base: "html/",
    data_base: "data/",
    core_base: "blockstrap/",
    theme_base: "themes/",
    dependency_base: "js/dependencies/",
    module_base: "js/modules/",
    page_base: "index",
    slug_base: "dashboard",
    blockchains: {
        btct: {
            blockchain: "Bitcoin (Testnet)",
            lib: "bitcointestnet",
            apis: {
                blockcypher: "http://api.blockcypher.com/v1/btc/test3/",
                blocktrail: "https://api.blocktrail.com/v1/tBTC/",
                toshi: "https://testnet3.toshi.io/api/v0/",
                qt: "proxies/rpc.php?blockchain=btct"
            },
            fee: 0.0001,
            op_return: true,
            op_limit: 80
        },
        dasht: {
            blockchain: "DashPay (Testnet)",
            lib: "dashpaytestnet",
            apis: {
                
            },
            fee: 0.0001,
            op_return: true,
            op_limit: 80
        },
        doget: {
            blockchain: "Dogecoin (Testnet)",
            lib: "dogecointestnet",
            apis: {
                blockstrap: "http://officeapi.neuroware.io/v0/doget/",
                spinal: "http://spinal.neuroware.io/v1/doget/"
            },
            fee: 2,
            op_return: true,
            op_limit: 80
        },
        ltct: {
            blockchain: "Litecoin (Testnet)",
            lib: "litecointestnet",
            apis: {
                
            },
            fee: 0.001,
            op_return: true,
            op_limit: 80
        },
        multi: {
            private: true,
            apis: {
                blockstrap: "http://officeapi.neuroware.io/v0/multi/"
            }
        },
        btc: {
            blockchain: "Bitcoin",
            lib: "bitcoin",
            apis: {
                blockcypher: "http://api.blockcypher.com/v1/btc/main/",
                blocktrail: "https://api.blocktrail.com/v1/btc/",
                spinal: "http://spinal.neuroware.io/v1/btc/",
                toshi: "https://bitcoin.toshi.io/api/v0/"
            },
            fee: 0.0001,
            op_return: true,
            op_limit: 80
        },
        dash: {
            blockchain: "DashPay",
            lib: "dashpay",
            apis: {
                
            },
            fee: 0.0001,
            op_return: true,
            op_limit: 80
        },
        doge: {
            blockchain: "Dogecoin",
            lib: "dogecoin",
            apis: {
                blockcypher: "http://api.blockcypher.com/v1/doge/main/",
                qt: "proxies/rpc.php?blockchain=doge"
            },
            fee: 1,
            op_return: true,
            op_limit: 80
        },
        ltc: {
            blockchain: "Litecoin",
            lib: "litecoin",
            apis: {
                
            },
            fee: 0.001,
            op_return: true,
            op_limit: 80
        }
    },
    apis: {
        available: {
            blockstrap: "Blockstrap",
            blockcypher: "BlockCypher",
            blocktrail: "BlockTrail",
            qt: "Local QTs",
            spinal: "Spinal",
            toshi: "Toshi"
        },
        defaults: {
            blockcypher: {
                async: false,
                functions: {
                    to: {
                        address: "addrs/$call/full",
                        addresses: "addrs/$call/full",
                        block: "blocks/",
                        op_returns: "addrs/$call/full",
                        relay: "txs/push/",
                        relay_param: "tx",
                        relay_json: "tx",
                        transaction: "txs/",
                        transactions: "addrs/$call/full",
                        unspents: "addrs/$call?unspentOnly=true&includeScript=true"
                    },
                    from: {
                        address: {
                            key: "",
                            address: "address",
                            hash: "",
                            tx_count: "final_n_tx",
                            received: "total_received",
                            balance: "final_balance"
                        },
                        addresses: {
                            key: "",
                            address: "address",
                            hash: "",
                            tx_count: "final_n_tx",
                            received: "total_received",
                            balance: "final_balance"
                        },
                        block: {
                            key: "",
                            height: "height",
                            hash: "hash",
                            prev: "prev_block",
                            next: "",
                            next: "",
                            tx_count: "n_tx",
                            time: "[time, utctoepoch]"
                        },
                        op_returns: {
                            key: "",
                            inner: "txs",
                            txid: "hash",
                            data: "script"
                        },
                        relay: {
                            txid: "hash",
                            inner: "tx"
                        },
                        transaction: {
                            key: "",
                            txid: "hash",
                            size: "size",
                            block: "block_height",
                            time: "[received, utctoepoch]",
                            input: "[total, +, fees, int]",
                            output: "total",
                            value: "[total, -, fees, int]",
                            fees: "fees",
                            data: "transactions.outputs.data_string"
                        },
                        transactions: {
                            key: "",
                            inner: "txs",
                            txid: "hash",
                            size: "size",
                            block: "block_height",
                            time: "[received, utctoepoch]",
                            input: "[total, +, fees, int]",
                            output: "total",
                            value: "[outputs, value]",
                            fees: "fees",
                            data: "transactions.outputs.data_string",
                            transactions: "txs"
                        },
                        unspents: {
                            key: "",
                            inner: "txrefs",
                            inner_unconfirmed: "unconfirmed_txrefs",
                            confirmations: "confirmations",
                            txid: "tx_hash",
                            index: "tx_output_n",
                            value: "value",
                            script: "script"
                        }
                    }
                }
            },
            blocktrail: {
                async: false,
                functions: {
                    to: {
                        address: "address/$call",
                        unspents: "address/$call/unspent-outputs",
                        transactions: "address/$call/transactions",
                        op_returns: "address/$call/transactions",
                        transaction: "transaction/$call",
                        block: "block/$call"
                    },
                    from: {
                        address: {
                            key: "",
                            address: "address",
                            hash: "[hash160, lowercase]",
                            tx_count: "transactions",
                            received: "received",
                            balance: "balance"
                        },
                        unspents: {
                            key: "",
                            inner: "../",
                            confirmations: "confirmations",
                            txid: "hash",
                            index: "index",
                            value: "value",
                            script: "script_hex",
                            reverse_array: true
                        },
                        transaction: {
                            key: "",
                            txid: "hash",
                            size: "",
                            block: "block_height",
                            time: "[last_seen_at, utctoepoch]",
                            input: "total_input_value",
                            output: "total_output_value",
                            value: "estimated_value",
                            fees: "total_fee",
                            data: false
                        },
                        transactions: {
                            key: "",
                            inner: "../",
                            txid: "hash",
                            size: false,
                            block: false,
                            time: "[time, utctoepoch]",
                            input: "total_input_value",
                            output: "total_output_value",
                            value: "[value, amount_minus_output_check]",
                            fees: "total_fee",
                            data: false,
                            reverse_array: true
                        },
                        block: {
                            key: "",
                            height: "height",
                            hash: "hash",
                            prev: "prev_block",
                            next: "next_block",
                            tx_count: "transactions",
                            time: "[block_time, utctoepoch]"
                        },
                        op_returns: {
                            key: "",
                            inner: "../",
                            txid: "hash",
                            data: "script_hex"
                        }
                    }
                }
            },
            blockstrap: {
                async: true,
                paginate: true,
                functions: {
                    to: {
                        address: "address/transactions/",
                        addresses: "address/ids/",
                        block: "block/height/",
                        dnkey: "dnkey/",
                        dnkeys: "dnkey/",
                        market: "market/stats/",
                        op_returns: "address/transactions/$call?showtxnio=1",
                        relay: "transaction/relay/",
                        relay_param: "txn_hex",
                        transaction: "transaction/id/",
                        transactions: "address/transactions/$call?showtxnio=1",
                        tx_pagination: "records, skip",
                        unspents: "address/unspents/$call?showtxnio=1"
                    },
                    from: {
                        address: {
                            key: "address",
                            address: "address",
                            hash: "address_hash160",
                            tx_count: "transaction_count_total",
                            received: "inputs_value_confirmed",
                            balance: "balance"
                        },
                        addresses: {
                            key: "addresses",
                            delimiter: ",",
                            address: "address",
                            hash: "address_hash160",
                            tx_count: "transaction_count_total",
                            received: "inputs_value_confirmed",
                            balance:"balance"
                        },
                        block: {
                            key: "blocks.0",
                            height: "height",
                            hash: "[id, lowercase]",
                            prev: "[prev_block_id, lowercase]",
                            next: "[next_block_id, lowercase]",
                            tx_count: "tx_count",
                            time: "time"
                        },
                        dnkey: {
                            key: "",
                            dnkeys: "dnkeys"
                        },
                        dnkeys: {
                            key: "",
                            dnkeys: "dnkeys"
                        },
                        market: {
                            key: "market",
                            price_usd_now: "fiat_usd_now",
                            tx_count_24hr: "tx_count_24hr",
                            sent_usd_24hr: "[output_value_24hr, *, fiat_usd_now, int]",
                            sent_coins_24hr: "output_value_24hr",
                            coins_discovered: "coinbase_value_todate",
                            marketcap: "marketcap"
                        },
                        op_returns: {
                            key: "address",
                            inner: "transactions",
                            txid: "id",
                            data: "script_pub_key"
                        },
                        relay: {
                            txid: "id",
                            inner: ""
                        },
                        transaction: {
                            key: "transaction",
                            txid: "[id, lowercase]",
                            size: "size",
                            block: "block_height",
                            time: "time",
                            input: "input_value",
                            output: "output_value",
                            value: "[output_value, -, fees, int]",
                            fees: "fees"
                        },
                        transactions: {
                            key: "address.transactions",
                            txid: "[id, lowercase]",
                            size: "size",
                            block: "block_height",
                            time: "time",
                            input: "input_value",
                            output: "output_value",
                            value: "[outputs, value]",
                            fees: "fees"
                        },
                        unspents: {
                            key: "address.transactions",
                            reverse_array: true,
                            confirmations: "confirmations",
                            txid: "[id, lowercase]",
                            index: "tx_address_pos",
                            value: "tx_address_value",
                            script: "[tx_address_script_pub_key, lowercase]"
                        }
                    }
                }
            },
            qt: {
                async: false,
                type: "rpc",
                functions: {
                    to: {
                        address: "&call=address&id=",
                        block: "&call=block&id=",
                        dnkey: "&call=dnkey&id=",
                        dnkeys: "&call=dnkey&id=",
                        op_returns: "&call=op_returns&id=",
                        relay: "&call=relay&id=",
                        relay_param: "tx",
                        transaction: "&call=transaction&id=",
                        transactions: "&call=transactions&id=",
                        unspents: "&call=unspents&id=",
                    },
                    from: {
                        address: {
                            key: "results",
                            address: "address",
                            hash: "hash",
                            tx_count: "tx_count",
                            received: "received",
                            balance: "balance"
                        },
                        block: {
                            key: "results",
                            height: "height",
                            hash: "hash",
                            prev: "prev",
                            next: "next",
                            tx_count: "tx_count",
                            time: "time"
                        },
                        dnkey: {
                            key: "results",
                            dnkeys: "dnkeys"
                        },
                        dnkeys: {
                            key: "results",
                            dnkeys: "dnkeys"
                        },
                        op_returns: {
                            key: "results",
                            inner: "txs",
                            txid: "txid",
                            data: "data"
                        },
                        relay: {
                            key: "results",
                            txid: "txid"
                        },
                        transaction: {
                            key: "results",
                            txid: "txid",
                            size: "size",
                            block: "block",
                            time: "time",
                            input: "input",
                            output: "output",
                            value: "value",
                            fees: "fees"
                        },
                        transactions: {
                            key: "results",
                            inner: "txs",
                            txid: "txid",
                            size: "size",
                            block: "block",
                            time: "time",
                            input: "input",
                            output: "output",
                            value: "value",
                            fees: "fees"
                        },
                        unspents: {
                            key: "results",
                            inner: "txs",
                            confirmations: "confirmations",
                            txid: "txid",
                            index: "index",
                            value: "value",
                            script: "script"
                        }
                    }
                }
            },
            spinal: {
                async: false,
                key: [],
                key_name: "",
                functions: {
                    to: {
                        address: 'addr/$call/1/txfull',
                        dnkeys: 'dnkey/',
                        op_returns: "addr/$call/1/txfull",
                        relay: "tx/relay/",
                        relay_param: "tx",
                        relay_json: "tx",
                        transaction: "tx/$call/verbose",
                        transactions: "addr/$call/1/txfull",
                        unspents: "addr/$call/1/unspent"
                    },
                    from: {
                        address: {
                            key: "",
                            address: "address",
                            hash: "address_hash160",
                            tx_count: "transaction_count_total",
                            received: "inputs_value_confirmed",
                            balance: "[tx_list]"
                        },
                        dnkeys: {
                            key: "",
                            dnkeys: "dnkeys"
                        },
                        op_returns: {
                            key: "",
                            inner: "tx_list",
                            txid: "id",
                            data: "script_hex"
                        },
                        relay: {
                            key: "",
                            txid: "tx"
                        },
                        transaction: {
                            key: "",
                            txid: "id",
                            size: "N/A",
                            block: "block_height",
                            time: "time",
                            input: "input_value",
                            output: "output_value",
                            value: "N/A",
                            fees: "fees_value"
                        },
                        transactions: {
                            key: "tx_list",
                            txid: "id",
                            size: "N/A",
                            block: "block_height",
                            time: "time",
                            input: "input_value",
                            output: "output_value",
                            value: "N/A",
                            fees: "fees_value"
                        },
                        unspents: {
                            key: "uxto_list",
                            inner: "",
                            confirmations: "",
                            txid: "tx_hash",
                            index: "pos",
                            value: "value",
                            script: "script_hex"
                        }
                    }
                }
            },
            toshi: {
                async: false,
                key: [],
                key_name: "",
                functions: {
                    to: {
                        address: "addresses/$call/transactions",
                        unspents: "addresses/$call/unspent_outputs",
                        transactions: "addresses/$call/transactions",
                        op_returns: "addresses/$call/transactions",
                        transaction: "transactions/$call",
                        relay: "transactions",
                        relay_param: "hex",
                        relay_json: true,
                        block: "blocks/$call"
                    },
                    from: {
                        address: {
                            key: "",
                            address: "hash",
                            hash: "[transactions.outputs, hash_from_script]",
                            tx_count: "[transactions, count]",
                            received: "received",
                            balance: "balance"
                        },
                        unspents: {
                            key: "",
                            inner: "",
                            confirmations: "confirmations",
                            txid: "transaction_hash",
                            index: "output_index",
                            value: "amount",
                            script: "script_hex"
                        },
                        transaction: {
                            key: "",
                            txid: "hash",
                            size: "size",
                            block: "block_height",
                            time: "[block_time, utctoepoch]",
                            input: "amount",
                            output: "amount",
                            value: "amount",
                            fees: "fees"
                        },
                        transactions: {
                            key: "",
                            inner: "transactions",
                            inner_unconfirmed: "unconfirmed_transactions",
                            txid: "hash",
                            size: "size",
                            block: "block_height",
                            time: "[block_time, utctoepoch]",
                            input: "[inputs.amount, total]",
                            output: "[outputs.amount, total]",
                            value: "[amount, amount_minus_output_check]",
                            fees: "fees",
                            data: false
                        },
                        block: {
                            key: "",
                            height: "height",
                            hash: "hash",
                            prev: "previous_block_hash",
                            next: "[next_blocks.hash, object_in_array]",
                            tx_count: "transactions_count",
                            time: "[time, utctoepoch]"
                        },
                        relay: {
                            key: "",
                            txid: "hash"
                        },
                        op_returns: {
                            key: "",
                            inner: "transactions",
                            inner_unconfirmed: "unconfirmed_transactions",
                            txid: "hash",
                            data: "script_hex"
                        }
                    }
                }
            }
        }
    }
};
    
var blockstrap_defaults = JSON.stringify(blockstrap_options);