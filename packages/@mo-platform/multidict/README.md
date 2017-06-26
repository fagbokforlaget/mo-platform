# JS client for Multidict Service

Multidict js client provides dictionary service in various mo apps.

## Install
```
<script
src="https://unpkg.com/@mo-platform/multidict@0.2.0/dist/multidict.js"></script>
<script type="text/javascript">
var dict = new MultiDictClient();
dict
.search('dyr', 'nb_NO')
.then( function(data) {
  console.log(data.data);
  data.data.phrases.forEach(function(phrase) {
    console.log(phrase);
  });
});
</script>

```
