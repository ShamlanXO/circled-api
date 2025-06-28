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

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to remove directory recursively
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Main deploy function
async function deploy() {
  try {
    console.log('🚀 Starting deployment process...\n');
    
    // 1. Ask for version number
    const version = await askForVersion();
    if (!version) {
      throw new Error('Version number is required');
    }
    
    console.log(`\n📦 Version: ${version}\n`);
    
    // 2. Update version in current package.json
    const currentPackagePath = path.join(process.cwd(), 'package.json');
    updatePackageVersion(currentPackagePath, version);
    
    // 3. Go to ../circled-ui
    const uiPath = path.join(process.cwd(), '..', 'circled-ui');
    if (!fs.existsSync(uiPath)) {
      throw new Error(`UI directory not found at: ${uiPath}`);
    }
    
    console.log(`\n📁 Switching to UI directory: ${uiPath}`);
    
    // 4. Update version in UI package.json
    const uiPackagePath = path.join(uiPath, 'package.json');
    if (!fs.existsSync(uiPackagePath)) {
      throw new Error(`UI package.json not found at: ${uiPackagePath}`);
    }
    updatePackageVersion(uiPackagePath, version);
    
    // 5. Run npm build:all
    console.log('\n🔨 Building UI...');
    runCommand('npm run build:all', uiPath);
    
    // 6. Copy build and build_prod folders to current directory
    console.log('\n📋 Copying build folders...');
    
    const buildSrc = path.join(uiPath, 'build');
    const buildProdSrc = path.join(uiPath, 'build_prod');
    const buildDest = path.join(process.cwd(), 'build');
    const buildProdDest = path.join(process.cwd(), 'build_prod');
    
    // Remove existing build folders
    removeDirectory(buildDest);
    removeDirectory(buildProdDest);
    
    // Copy new build folders
    if (fs.existsSync(buildSrc)) {
      copyDirectory(buildSrc, buildDest);
      console.log('✅ Copied build folder');
    } else {
      console.log('⚠️  build folder not found in UI directory');
    }
    
    if (fs.existsSync(buildProdSrc)) {
      copyDirectory(buildProdSrc, buildProdDest);
      console.log('✅ Copied build_prod folder');
    } else {
      console.log('⚠️  build_prod folder not found in UI directory');
    }
    
    // 7. Commit and push
    console.log('\n📝 Committing and pushing changes...');
    
    // Add all changes
    runCommand('git add .');
    
    // Commit with version
    runCommand(`git commit -m "Release version ${version}"`);
    
    // Push to remote
    runCommand('git push');
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log(`📦 Version ${version} has been deployed.`);
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the deploy script
deploy();
