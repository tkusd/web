import postcss from 'postcss';

export default postcss.plugin('f7', function(options = {}){
  return function(css, result){
    const {input} = css.source;

    if (!/framework7\/dist\/css\//.test(input.file)) {
      return;
    }

    css.eachRule(rule => {
      const {selectors} = rule;

      if (~selectors.indexOf('html') || ~selectors.indexOf('body')){
        rule.removeSelf();
        return;
      }

      if (options.prefix){
        rule.selector = `${options.prefix} ${rule.selector}`;
      }
    });
  };
});
