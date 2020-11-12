# AMO Blockchain Explorer v2
For AMO blockchain explorer v1, see [old
repository](https://github.com/amolabs/explorer).

## Introduction
TBA

## Test run
For development testing

## Build

## Install
For production use

### Web server setup
Use static web server for client web app.

### Support service setup
- node.js server
  - server location
  - API endpoint
- mysql server
  - DB location
  - DB api endpoint

## Server API
The server API implements RESTful API with the following URIs. All URIs will
give `application/json` type document. All list items will use **descending**
order.

### Networks
- **GET /networks**
  - get available networks

### Chain
- **GET /chain/{chain_id}**
  - get summary of a chain

#### Genesis
- **GET /chain/{chain_id}/genesis**
  - get genesis document (json)

#### Blocks
- **GET /chain/{chain_id}/blocks**
  - get list of blocks
    - `anchor`: anchor height (default 0, which means latest block)
    - `from`: offset from `anchor` (default 0)
    - `num`: number of blocks to retrieve (default 20)
- **GET /chain/{chain_id}/blocks?stat**
  - get stat of blocks
    - `non_empty`: exclude empty blocks (default false)
    - `num_blks`: stat range as a number of blocks (default all, CAUTION!)
- **GET /chain/{chain_id}/blocks/{height}**
  - get one block
- **GET /chain/{chain_id}/blocks/{height}/txs**
  - get lsit of txs included in a block
    - `from`: offset from `anchor` (default 0)
    - `num`: number of blocks to retrieve (default 20)
- **GET /chain/{chain_id}/blocks/{height}/txs/{index}**
  - get one txs in a block with an {index}

#### Txs
NOTE: Each tx is identified by a block height and an index within the block.

- **GET /chain/{chain_id}/txs**
  - get list of txs
    - `top`: anchor height
    - `from`: offset from `anchor` (default 0)
    - `num`: number of txs to retrieve (default 20)
- **GET /chain/{chain_id}/txs?stat**
  - get stat of txs
    - `num_txs`: stat range as a number of txs (default all, CAUTION!)
- **GET /chain/{chain_id}/txs/{hash}**
  - get one tx

#### Accounts
- **GET /chain/{chain_id}/accounts**
  - SHOULD NOT BE USED
    - `from`
    - `num`
- **GET /chain/{chain_id}/accounts/{address}**
  - get one account
- **GET /chain/{chain_id}/accounts/{address}/txs**
  - get list of txs sent by an account
    - `top`: anchor height (default 0, which means latest block)
    - `from`: offset from `anchor` (default 0)
    - `num`: number of txs to retrieve (default 20)

#### Validators
- **GET /chain/{chain_id}/validators**
  - get list of validators
    - `from`: offset (default 0)
    - `num`: number of validators to retrieve (default 20)
- **GET /chain/{chain_id}/validators?stat**
  - get stat of validators
    - `num_blks`: stat range as a number of blocks (default all, CAUTION!)
- **GET /chain/{chain_id}/validators/{address}**
  - get one validator
- **GET /chain/{chain_id}/validators/{address}/delegators**
  - get list of delegators for this validator
    - `from`: offset (default 0)
    - `num`: number of delegators to retrieve (default 20)

#### Drafts
- **GET /chain/{chain_id}/drafts**
  - get list of drafts
    - `anchor`: anchor id (default 0, which means latest draft id)
    - `from`: offset from `anchor` (default 0)
    - `num`: number of blocks to retrieve (default 20)
- **GET /chain/{chain_id}/drafts?stat** (N/A)
  - get stat of drafts
    - `num_blks`: stat range as a number of blocks (default all, CAUTION!)
- **GET /chain/{chain_id}/drafts/{draft_id}**
  - get one draft
- **GET /chain/{chain_id}/drafts/{draft_id}/votes**
  - get list of votes for the draft
- **GET /chain/{chain_id}/drafts/{draft_id}/votes?absent**
  - get list of absent votes for the draft

#### Config
- **GET /chain/{chain_id}/config** (N/A)
  - get AMO config of the chain

#### Storages
- **GET /chain/{chain_id}/storages** (N/A)
  - get lis tof storages
- **GET /chain/{chain_id}/storages/{storage_id}**
  - get one storage

#### Parcels
- **GET /chain/{chain_id}/parcels** (N/A)
  - get list of parcels
- **GET /chain/{chain_id}/parcels/{parcel_id}**
  - get one parcel
- **GET /chain/{chain_id}/parcels/{parcel_id}/requests**
  - get list of requests on the parcel
    - `from`: offset (default 0)
    - `num`: number of items to retrieve (default 20)
- **GET /chain/{chain_id}/parcels/{parcel_id}/requests/{address}** (N/A)
  - get list of request on the parcel from an account
- **GET /chain/{chain_id}/requests/{parcel_id}** (N/A)
  - alias of GET /chains/{chain_id}/parcels/{parcel_id}/requests
- **GET /chain/{chain_id}/requests/{parcel_id}/{address}** (N/A)
  - alias of GET /chains/{chain_id}/parcels/{parcel_id}/requests/{address}
