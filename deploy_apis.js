#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const packageJson = require('./package.json');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for version number
function askForVersion() {
  return new Promise((resolve) => {
    rl.question(`Enter version number current version is ${packageJson.version}: `, (version) => {
      resolve(version.trim());
    });
  });
}

// Function to update version in package.json
function updatePackageVersion(packagePath, version) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ Updated version to ${version} in ${packagePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${packagePath}:`, error.message);
    throw error;
  }
}

// Function to run command and handle errors
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`🔄 Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    console.log(`✅ Successfully executed: ${command}`);
  } catch (error) {
    console.error(`❌ Error executing: ${command}`);
    throw error;
  }
}

// Main deploy function
async function deploy() {
  try {
    console.log('🚀 Starting API deployment process...\n');
    
    // 1. Ask for version number
    const version = await askForVersion();
    if (!version) {
      throw new Error('Version number is required');
    }
    
    console.log(`\n📦 Version: ${version}\n`);
    
    // 2. Update version in current package.json
    const currentPackagePath = path.join(process.cwd(), 'package.json');
    updatePackageVersion(currentPackagePath, version);
    
    // 3. Run npm install to ensure dependencies are up to date
    console.log('\n📦 Installing dependencies...');
    runCommand('npm install');
    
   
    
    // 5. Commit and push
    console.log('\n📝 Committing and pushing changes...');
    
    // Add all changes
    runCommand('git add .');
    
    // Commit with version
    runCommand(`git commit -m "Release API version ${version}"`);
    
    // Push to remote
    runCommand('git push');
    
    console.log('\n🎉 API deployment completed successfully!');
    console.log(`📦 API version ${version} has been deployed.`);
    
  } catch (error) {
    console.error('\n❌ API deployment failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the deploy script
deploy();
