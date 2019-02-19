# Browser Support
--------------------------------------
**IE6+**

**Chrome26+**

**FireFox3.6+**

## Usage
--------------------------------------

```html
<script src="dist/sp-excel.js"></script>
<script type="text/javascript">
        window.onload = function(){
            var data = {
                id:"file", //input file id
                fun:"fun", //callback name
            }
            var sheet = new spexcel(data);
        }
        function fun(data){
            console.log(data);
        }                       
</script>
```

```javascript
  data:{
    head:["head1","head2","head3"],
    list:[{head1:value1,head2:value2,head3:value3},{head1:value1,head2:value2,head3:value3}.....]
  }
```

## Update


### The Relentless Pursuit of Perfection    持续更新中
