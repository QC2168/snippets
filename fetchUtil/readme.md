基于fetch封装的请求工具，实现全局一个请求，使用说明如下：

1. 实例化，并传入全局配置

```
const service = fetchUtil.create({
    baseURL: 'http://localhost:8888/dev',
    headers: {'Content-Type': 'application/json'},
});
```

2. 请求接口可以单独传入配置，也可传入完整请求路径，优先级更高

```
let res = await request.get('/admin/user/login', data,{
      headers: {'Content-Type': 'application/json'}
   });
```

3. 如果是表单请求，直接使用URLSearchParams构造参数,使用URLSearchParams时会自动维护请求头中的Content-Type字段

```
    const data=new URLSearchParams()
    data.append("username", "admin");
    data.append("password", "123456");
    const res = await useLoginApi().logIn(data);
```

4. 如果是上传文件的请求，直接使用FormData构造参数，会自动维护请求头中的Content-Type字段

```
    const data=new FormData()
    data.append("username", "admin");
    data.append("password", "123456");
    const res = await useLoginApi().logIn(data);
```

4. 如果是提交json数据，直接传入一个普通对象即可，如果此时调用接口时传入配置项，将header中的Content-Type修改为application/x-www-form-urlencoded，即可自动转换为表单请求

```
    const res = await useLoginApi().logIn({
        username:"admin",
        password:"123456"
    });
```

5. 如果是下载文件，或者其他非json格式的响应数据，需要配置responseType字段，如果全部接口都是下载文件，直接全局配置，如果是个别接口用作下载文件，单独在接口处配置

```
let res = await request.get('/admin/user/login', data,{
       responseType:"blob"
   });
```

request.ts文件中提高了全局配置和拦截器的用法