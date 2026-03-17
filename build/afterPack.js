// afterPack hook for electron-builder
// Runs after the app is packaged but before it's compressed

const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  const { appOutDir, electronPlatformName } = context;

  // For Windows, we can add any platform-specific modifications here
  if (electronPlatformName === 'win32') {
    console.log('Running Windows-specific post-pack tasks...');
    
    // If you need to copy additional files to the Windows distribution
    // you can do it here
  }
  
  console.log(`Packaging complete for ${electronPlatformName}`);
};
