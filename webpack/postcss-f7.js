import postcss from 'postcss';

const rTranslate3d = /translate3d\((.+?), *(.+?), *(.+?)\)/;

export default postcss.plugin('f7', function(options = {}){
  return function(css, result){
    const {input} = css.source;

    if (!/framework7\/dist\/css\//.test(input.file)) {
      return;
    }

    css.walkRules(rule => {
      const {selectors} = rule;

      if (~selectors.indexOf('html') || ~selectors.indexOf('body')){
        rule.removeSelf();
        return;
      }

      if (options.prefix){
        rule.selector = rule.selectors.map(selector => options.prefix + ' ' + selector).join(', ');
      }
    });

    css.replaceValues(rTranslate3d, {fast: 'translate3d'}, str => {
      return str.replace(rTranslate3d, 'translate($1, $2)');
    });
  };
});
