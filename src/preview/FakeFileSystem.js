import fs from 'graceful-fs';
import MemoryFileSystem from 'memory-fs';
import {inherits} from 'util';

function FakeFileSystem() {
  MemoryFileSystem.apply(this, arguments);
}

inherits(FakeFileSystem, MemoryFileSystem);

FakeFileSystem.prototype._exists = MemoryFileSystem.prototype.exists;

FakeFileSystem.prototype.exists = function(path, callback){
  this._exists(path, function(exist){
    if (exist) return exist;
    return fs.exists(path, callback);
  });
};

FakeFileSystem.prototype._existsSync = MemoryFileSystem.prototype.existsSync;

FakeFileSystem.prototype.existsSync = function(path){
  let exist = this._existsSync(path);
  if (exist) return exist;

  return fs.existsSync(path);
};

['stat', 'readdir', 'readFile'].forEach(function(key){
  FakeFileSystem.prototype[key] = function(path){
    if (this._existsSync(path)){
      MemoryFileSystem.prototype[key].apply(this, arguments);
    } else {
      fs[key].apply(fs, arguments);
    }
  };

  FakeFileSystem.prototype[key + 'Sync'] = function(path){
    if (this._existsSync(path)){
      return MemoryFileSystem.prototype[key + 'Sync'].apply(this, arguments);
    } else {
      return fs[key + 'Sync'].apply(fs, arguments);
    }
  };
});

export default FakeFileSystem;
