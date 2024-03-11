import fs from 'fs';

export const SearchSubFolders = (dir, folderList) => {
  var files = fs.readdirSync(dir + '/');
  folderList = folderList || [];
  if (folderList.indexOf(dir) === -1) {
    folderList.push(dir);
  }
  files.forEach(function (file) {
    var subfolder = dir + '/' + file;
    if (folderList.indexOf(subfolder) === -1) {
      if (fs.statSync(subfolder).isDirectory()) {
        folderList = SearchSubFolders(subfolder, folderList);
      }
    }
  });
  return folderList;
};
