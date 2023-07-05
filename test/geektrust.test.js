import fs from 'fs';
import { Portfolio } from '../src/portfolio.js';
import { ProcessPortfolio } from '../src/process-portfolio.js';

jest.mock('fs');

describe('Portfolio Management', () => {
  let mockReadFileSync;
  let portfolio;
  let processPortfolio;

  beforeEach(() => {
    mockReadFileSync = jest.spyOn(fs, 'readFileSync');
    portfolio = new Portfolio();
    processPortfolio = new ProcessPortfolio(portfolio);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error if file path is not provided', () => {
    expect(() => {
      require('./main.js');
    }).toThrowError();
  });

});
