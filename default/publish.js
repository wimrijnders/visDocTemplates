/*==============================================================================
  Demo template, showing how documentation can be generated for `vis.js`.

  ------------------------------------------------------------------------------
  ## Notes

  ### Stuff I learned here which looks useful. 

  var toDir = fs.toDir(outFile);                // Isolates the path from the full filename
  fs.mkPath(toDir);                             // Create the directory with all path elements
  var docs = fs.readFileSync(fileName, 'utf8'); // Read contents of file 'fileName'
  fs.writeFileSync(outFile, html, 'utf8');      // Write buffer 'html' to file 'outFile'

  ### specific to `jsdoc`.

    // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
    // doesn't try to hand them out later
    indexUrl = helper.getUniqueFilename('index');
    // don't call registerLink() on this one! 'index' is also a valid longname

    globalUrl = helper.getUniqueFilename('global');
    helper.registerLink('global', globalUrl);
  ============================================================================== */
'use strict';
//var taffy = require('taffydb').taffy;  // not really required here, left for reference

// Internal modules of `jsdoc` are available here.
// This is not the complete list, there may be more useful stuff in jsdoc
// For all modules scan in: '/usr/lib/node_modules/jsdoc/lib/jsdoc/' (or similar on your system)
var fs = require('jsdoc/fs');
var path = require('jsdoc/path');
var template = require('jsdoc/template');




/**
 * Set up the template rendering engine.
 */
function createRenderer(fromDir, data) {
  var renderer = new template.Template(fromDir);  // Param is the template source directory.
                                                  // All template files are relative to this directory!

  /**
   * Example helper method
   * 
   * This can be called from within a template as follows:
   * 
   * ```
   * <?js
   *  var self = this;
   * ?>
   * ... 
   * <?js= self.helper('hello!') ?>
   * ```
   * 
   * /
  renderer.helper = function(val) {
    return 'this is a helper! ' + val;
	};
  */

  /**
   * Example helper, which retrieves jsdoc info.
   * /
  renderer.helper2 = function() {
    var tmp = data().filter({name:'_drawText'}).get();
	  return JSON.stringify(tmp);
	};
  */
  

  return renderer;
}


/**
  Entry point for the template.

  This is called from `jsdoc` during execution

    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = function(taffyData, opts, tutorials) {
  var fromDir = path.join('./docs');
  var renderer = createRenderer(fromDir, taffyData);

  var outDir = path.join('./gen');
  var myFiles = fs.ls(fromDir, 3);

  myFiles.forEach(function(fileName) {
  if (/\.tmpl$/.test(fileName)) return;   // Skip handling of .tmpl files; these are used as partials only

    var outFile = fileName.replace(fromDir, outDir);

    if (!/\.html$/.test(fileName)) {        // Just plain copy over non-html files
      var toDir = fs.toDir(outFile);
      fs.mkPath(toDir);
      fs.copyFileSync(fileName, toDir);
      return;
    }
   
    // Render html files as templates 
    var inFile = fileName.replace(fromDir + '/', '');  // Adjust filename to be relative to template source dir
    var docData = {};

    var html = renderer.partial(inFile, docData);
    fs.mkPath(fs.toDir(outFile));
    fs.writeFileSync(outFile, html, 'utf8');
  });

 //console.log(JSON.stringify(env));
};
