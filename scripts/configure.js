#!/usr/bin/env node

const { execSync } = require('child_process')
const chalk = require('chalk')

const log = (message, color = 'white') => {
  console.log(chalk[color](message))
}

async function main() {
  try {
    log('\n🔧 AI Provider Configuration Wizard\n', 'cyan')
    log('Starting the interactive configuration interface...', 'yellow')
    
    // Start Next.js development server for the configuration wizard
    log('\n🌐 Opening configuration wizard in your browser...', 'cyan')
    log('If it doesn\'t open automatically, go to: http://localhost:3000', 'white')
    log('\nPress Ctrl+C to exit when done.\n', 'gray')
    
    execSync('npm run dev', { stdio: 'inherit' })
    
  } catch (error) {
    if (error.signal === 'SIGINT') {
      log('\n👋 Configuration wizard closed.', 'yellow')
      process.exit(0)
    } else {
      log(`\n❌ Error starting configuration wizard: ${error.message}`, 'red')
      process.exit(1)
    }
  }
}

if (require.main === module) {
  main()
}