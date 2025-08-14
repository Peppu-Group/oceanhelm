#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');

// Get args (node index.js create myproject)
const args = process.argv.slice(2);
const command = args[0];
const projectName = args[1];

// Resolve paths


const templateDir = path.join(__dirname, '../templates');
const targetDir = path.join(process.cwd(), projectName);

if (command === 'create') {
  if (!projectName) {
    console.error('❌ Please provide a project name.');
    process.exit(1);
  }

  // Copy template
  fs.copySync(templateDir, targetDir);

  // Update package.json name
  const pkgPath = path.join(targetDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  console.log(`✅ Project "${projectName}" created successfully.`);
} else {
  console.log('Usage: oceanhelm create <project-name>');
}
