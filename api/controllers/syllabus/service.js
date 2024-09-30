
function replaceDirectoryInPath(filePath) {
    return filePath.replace(/content-video\//, 'content-video_reduced_item/');
  }


  module.exports = {
    replaceDirectoryInPath
  }