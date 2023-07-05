import fs from 'fs';
import { Portfolio }  from './portfolio.js';
import { ProcessPortfolio } from './process-portfolio.js';
const filePath = process.argv[2];

if (!filePath) {
  throw new Error('Please provide a file path');
}

const portfolio = new Portfolio();
const processPortfolio = new ProcessPortfolio(portfolio);


try {
  // Read input from file
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const [command, ...args] = line.split(' ');
      processPortfolio.execute(command, args);
  }
} catch(err) {
    console.log(err);
}
