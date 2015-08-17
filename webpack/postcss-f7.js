import postcss from 'postcss';

const THEME_REGEX = /framework7\.(.+?)\./;

export default postcss.plugin('f7', function(){
  return function(css, result){
    const {input} = css.source;

    if (!/framework7\/dist\/css\//.test(input.file)) {
      return;
    }

    let theme = '';

    if (THEME_REGEX.test(input.file)){
      theme = input.file.match(THEME_REGEX)[1];
    }

    css.eachRule(rule => {
      const {selectors} = rule;

      if (~selectors.indexOf('html') || ~selectors.indexOf('body')){
        rule.removeSelf();
        return;
      }

      if (theme){
        rule.selector = `.${theme} ${rule.selector}`;
      }
    });
  };
});
