import { ProcessPortfolio } from '../src/process-portfolio.js';

describe('ProcessPortfolio', () => {
  let portfolio;
  let processPortfolio;

  beforeEach(() => {
    // Initialize the portfolio object
    portfolio = {
      allocateFunds: jest.fn(),
      sipInvestment: jest.fn(),
      changeMonthlyRate: jest.fn(),
      calculateBalance: jest.fn().mockReturnValue({
        equity: 100,
        debt: 200,
        gold: 300,
      }),
      rebalancePortfolio: jest.fn().mockReturnValue({
        equity: 400,
        debt: 500,
        gold: 600,
      }),
      rateChanges: {
        JAN: { equity: 1, debt: 2, gold: 3 },
        FEB: { equity: 4, debt: 5, gold: 6 },
        MAR: { equity: 7, debt: 8, gold: 9 },
      },
    };

    // Initialize the ProcessPortfolio object with the portfolio
    processPortfolio = new ProcessPortfolio(portfolio);
  });

  describe('execute', () => {
    it('should call allocateFunds method on portfolio for ALLOCATE command', () => {
      const args = ['10', '20', '30'];
      processPortfolio.execute('ALLOCATE', args);

      expect(portfolio.allocateFunds).toHaveBeenCalledWith([10, 20, 30]);
    });

    it('should call sipInvestment method on portfolio for SIP command', () => {
      const args = ['5', '10', '15'];
      processPortfolio.execute('SIP', args);

      expect(portfolio.sipInvestment).toHaveBeenCalledWith([5, 10, 15]);
    });

    it('should call changeMonthlyRate method on portfolio for CHANGE command', () => {
      const args = ['1.5', '2.5', '3.5', 'JUL'];
      processPortfolio.execute('CHANGE', args);

      expect(portfolio.changeMonthlyRate).toHaveBeenCalledWith('JUL', [1.5, 2.5, 3.5]);
    });

    it('should call calculateBalance method on portfolio for BALANCE command', () => {
      const args = ['JAN'];
      processPortfolio.execute('BALANCE', args);

      expect(portfolio.calculateBalance).toHaveBeenCalledWith('JAN');
    });

    it('should call rebalancePortfolio method on portfolio for REBALANCE command when rateChanges length is >= 6', () => {
      portfolio.rateChanges = { JAN: {}, FEB: {}, MARCH: {}, APRIL: {}, MAY: {}, JUNE: {} };
      processPortfolio.execute('REBALANCE', []);

      expect(portfolio.rebalancePortfolio).toHaveBeenCalled();
    });

    it('should not call rebalancePortfolio method on portfolio for REBALANCE command when rateChanges length is < 6', () => {
      portfolio.rateChanges = { JAN: {}, FEB: {} };

      processPortfolio.execute('REBALANCE', []);

      expect(portfolio.rebalancePortfolio).not.toHaveBeenCalled();
    });
  });
});
