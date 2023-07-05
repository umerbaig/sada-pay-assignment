export class Portfolio {
    constructor() {
      this.portfolio = {
        equity: 0,
        debt: 0,
        gold: 0,
      };
      this.sip = {
        equity: 0,
        debt: 0,
        gold: 0,
      };
      this.desiredAllocation = {
        equity: 0,
        debt: 0,
        gold: 0,
      };
      this.rateChanges = {};
    }
  
    allocateFunds(amounts) {
      const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
      this.portfolio.equity = amounts[0];
      this.portfolio.debt = amounts[1];
      this.portfolio.gold = amounts[2];
      this.desiredAllocation.equity = amounts[0] / totalAmount;
      this.desiredAllocation.debt = amounts[1] / totalAmount;
      this.desiredAllocation.gold = amounts[2] / totalAmount;
    }
  
    sipInvestment(amounts) {
      this.sip.equity = amounts[0];
      this.sip.debt = amounts[1];
      this.sip.gold = amounts[2];
    }
  
    changeMonthlyRate(month, rates) {
      this.rateChanges[month] = {
        equity: rates[0],
        debt: rates[1],
        gold: rates[2],
      };
    }
  
    calculateBalance(month) {
      const keys = Object.keys(this.rateChanges);
      const monthNumber = keys.indexOf(month) + 1;
      const balance = {
        equity: this.portfolio.equity,
        debt: this.portfolio.debt,
        gold: this.portfolio.gold,
      };
    
      for (let i = 1; i <= monthNumber; i++) {
        if (this.rateChanges[month] && i === 1) {
          const rate = this.rateChanges[keys[i - 1]];
          balance.equity = Math.floor(balance.equity + (balance.equity * (rate.equity / 100)));
          balance.debt = Math.floor(balance.debt + (balance.debt * (rate.debt / 100)));
          balance.gold = Math.floor(balance.gold + (balance.gold * (rate.gold / 100)));
        } else if (this.rateChanges[month]) {
            const rate = this.rateChanges[keys[i - 1]];
            balance.equity = Math.floor(balance.equity + this.sip.equity + ((balance.equity + this.sip.equity) * (rate.equity / 100)));
            balance.debt = Math.floor(balance.debt + this.sip.debt + ((balance.debt + this.sip.debt) * (rate.debt / 100)));
            balance.gold = Math.floor(balance.gold + this.sip.gold + ((balance.gold + this.sip.gold) * (rate.gold / 100)));
        }
      }
    
      return balance;
    }
  
    rebalancePortfolio() {
      const balance = this.calculateBalance('JUNE');
      const totalProfit = (balance.equity + balance.debt + balance.gold) - (this.portfolio.equity + this.portfolio.debt + this.portfolio.gold);
  
      const rebalancedPortfolio = {
        equity: Math.floor(this.portfolio.equity + (totalProfit * this.desiredAllocation.equity)),
        debt: Math.floor(this.portfolio.debt + (totalProfit * this.desiredAllocation.debt)),
        gold: Math.floor(this.portfolio.gold + (totalProfit * this.desiredAllocation.gold)),
      };
      return rebalancedPortfolio;
    }
}