import { Portfolio } from '../src/portfolio.js';

describe('Portfolio', () => {
  let portfolio;

  beforeEach(() => {
    portfolio = new Portfolio();
  });

  describe('allocateFunds', () => {
    it('should allocate funds and update desired allocation', () => {
      const amounts = [6000,3000, 1000];
      portfolio.allocateFunds(amounts);

      expect(portfolio.portfolio.equity).toEqual(6000);
      expect(portfolio.portfolio.debt).toEqual(3000);
      expect(portfolio.portfolio.gold).toEqual(1000);

      expect(portfolio.desiredAllocation.equity).toEqual(0.6);
      expect(portfolio.desiredAllocation.debt).toEqual(0.3);
      expect(portfolio.desiredAllocation.gold).toEqual(0.1);
    });
  });

  describe('sipInvestment', () => {
    it('should update SIP investments', () => {
      const amounts = [6000,3000, 1000];
      portfolio.sipInvestment(amounts);

      expect(portfolio.sip.equity).toEqual(6000);
      expect(portfolio.sip.debt).toEqual(3000);
      expect(portfolio.sip.gold).toEqual(1000);
    });
  });

  describe('changeMonthlyRate', () => {
    it('should change monthly rates', () => {
      const month = 'JUNE';
      const rates = [1.5, 2.0, 1.2];
      portfolio.changeMonthlyRate(month, rates);

      expect(portfolio.rateChanges[month]).toEqual({
        equity: 1.5,
        debt: 2.0,
        gold: 1.2,
      });
    });
  });

  describe('calculateBalance', () => {
    beforeEach(() => {
      // Set up initial portfolio values
      portfolio.portfolio.equity = 6000;
      portfolio.portfolio.debt = 3000;
      portfolio.portfolio.gold = 1000;
      portfolio.sip.equity = 2000;
      portfolio.sip.debt = 1000;
      portfolio.sip.gold = 500;

      // Set up rate changes
      portfolio.rateChanges = {
        JANUARY: { equity: 4, debt: 10, gold: 2 },
        FEBRUARY: { equity: -10, debt: 40, gold: 0 },
        MARCH: { equity: 12.5, debt: 12.5, gold: 12.5 },
      };
    });

    it('should calculate balance for a specific month with SIP investment', () => {
      const month = 'MARCH';
      const balance = portfolio.calculateBalance(month);

      expect(balance.equity).toEqual(10593);
      expect(balance.debt).toEqual(7897);
      expect(balance.gold).toEqual(2272);
    });
  });

  describe('rebalancePortfolio', () => {
    beforeEach(() => {
      // Set up initial portfolio values
      portfolio.portfolio.equity = 6000;
      portfolio.portfolio.debt = 3000;
      portfolio.portfolio.gold = 1000;
      portfolio.sip.equity = 2000;
      portfolio.sip.debt = 1000;
      portfolio.sip.gold = 500;
      portfolio.desiredAllocation.equity = 0.6;
      portfolio.desiredAllocation.debt = 0.3;
      portfolio.desiredAllocation.gold = 0.1;

      // Set up rate changes
      portfolio.rateChanges = {
        JANUARY: { equity: 4, debt: 10, gold: 2 },
        FEBRUARY: { equity: -10, debt: 40, gold: 0 },
        MARCH: { equity: 12.5, debt: 12.5, gold: 12.5 },
        APRIL: { equity: 8, debt: -3, gold: 7 },
        MAY: { equity: 13, debt: 21, gold: 10.5 },
        JUNE: { equity: 10, debt: 8, gold: -5 },
      };
    });

    it('should rebalance portfolio', () => {
      const balance = portfolio.rebalancePortfolio();

      expect(balance.equity).toEqual(23619);
      expect(balance.debt).toEqual(11809);
      expect(balance.gold).toEqual(3936);
    });
  });
});
