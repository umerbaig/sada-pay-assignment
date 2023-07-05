export class ProcessPortfolio {
  constructor(portfolio) {
    this.portfolio = portfolio;
  }

  execute(command, args) {
    switch(command) {
      case 'ALLOCATE': {
        const amounts = args.map(Number);
        this.portfolio.allocateFunds(amounts);
        break;
      }
      case 'SIP': {
        const amounts = args.map(Number);
        this.portfolio.sipInvestment(amounts);
        break;
      }
      case 'CHANGE': {
        const rates = args.slice(0, args.length -1 ).map((a) => parseFloat(a));
        const month = args[args.length - 1];
        this.portfolio.changeMonthlyRate(month, rates);
        break;
      }
      case 'BALANCE': {
        const month = args[0];
        const balance = this.portfolio.calculateBalance(month);
        console.log(`${balance.equity} ${balance.debt} ${balance.gold}`);
        break;
      }
      case 'REBALANCE': {
        if (Object.keys(this.portfolio.rateChanges).length < 6) {
          console.log('CANNOT_REBALANCE');
        } else {
          const rebalancedPortfolio = this.portfolio.rebalancePortfolio();
          console.log(`${rebalancedPortfolio.equity} ${rebalancedPortfolio.debt} ${rebalancedPortfolio.gold}`);
        }
        break;
      }
        
    }
  }
}