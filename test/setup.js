require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');

//set the environment to test so tests get the proper testing db url (check ../src/knexContext.js)
process.env.NODE_ENV = 'test';

global.expect = expect;
global.supertest = supertest;