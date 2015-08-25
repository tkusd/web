export default function createClassFromMixin(mixin) {
  var OutputClass = function() {
    //
  };

  Object.keys(mixin).forEach(key => {
    OutputClass.prototype[key] = mixin[key];
  });

  Object.keys(mixin.statics).forEach(key => {
    OutputClass[key] = mixin.statics[key];
  });

  return OutputClass;
}
