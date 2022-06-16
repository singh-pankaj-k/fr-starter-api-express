'use strict';

/**
 * This file should only call functions, all functions specific to ItemsController should be defined in ./lib/libUser.js.
 */
module.exports = {
    getRequestFirstNameHandler,
    getRequestMostRecentHandler,
    postRequestHandler,
    patchRequestHandler,
    deleteRequestHandler,
}

const User = require( './userModelFactory' ).getUser();
const lib = require( '../lib/controller/libCommon' );
const UserLib = require( './libUserController' );

async function getRequestFirstNameHandler( req, res, next ) {

    await lib.validateReceivedObjectProperties( req?.query, [ 'first_name' ] )
        .then( validObj => User.findByFirstName( validObj?.first_name ) )
        .then( user => lib.checkSuccess( user, next ) )
        .then( savedUserDto => lib.createSendObject( savedUserDto, [ 'first_name' ] ) )
        .then( sendObject => res?.send( ...sendObject ) )
        .catch( next );
}

async function postRequestHandler( req, res, next ) {
    await lib.validateReceivedObjectProperties( req?.body?.user, [ 'first_name' ] )
        .then( user => User.save( user ) )
        .then( savedUserDto => lib.checkSuccess( savedUserDto, next ) )
        .then( savedUserDto => lib.createSendObject( savedUserDto, [ 'first_name' ] ) )
        .then( sendObject => res?.send( ...sendObject ) )
        .catch( next );
}

async function patchRequestHandler( req, res, next ) {
    await UserLib.checkUser( req )
        .then( user => User.findByFirstName( user?.first_name ) )
        .then( user => lib.checkSuccess( user, next ) )
        .then( user => User.update( user?.data[ 0 ]?.user_id, req?.body?.updated_user ) )
        .then( user => lib.checkSuccess( user, next ) )
        .then( user => res?.send( user?.data[ 0 ] ) )
        .catch( next );
}

async function deleteRequestHandler( req, res, next ) {
    await UserLib.checkUser( req )
        .then( user => User.findByFirstName( user?.first_name ) )
        .then( user => lib.checkSuccess( user, next ) )
        .then( user => User.delete( user?.data[ 0 ]?.user_id ) )
        .then( user => lib.checkSuccess( user, next ) )
        .then( user => res?.send( user?.data[ 0 ] ) )
        .catch( next );
}

async function getRequestMostRecentHandler( req, res, next ) {
    await User.findLastTen()
        .then( user => lib.checkSuccess( user, next ) )
        .then( user => res?.send( user?.data ) )
        .catch( next );
}
