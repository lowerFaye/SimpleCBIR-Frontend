上传图片
----- 
method: post
url: /api/start
content-type: application/json
body: {
    path string,
    preprocessMethod string, // "1-A"
    featureExtractionMethod string, //"2-A"
    similarityCalculationMethod string //"3-A"
}
response:{
    status: 200/error code
}

1-A 代表 平滑
1-B 代表 锐化
2-A 代表 默认
3-A 代表 MobileNet(Caffe)
4-A 代表 特征向量

- path是一个绝对路径，它是用户上传的本地图片路径
- 三个Method分别是预处理、特征提取、相似计算的算法名
- 我现在不知道这仨我们实现了啥算法叫啥名，需要算法大佬给个反馈
- 返回一个status，成功就200，失败就其他


检索处理完毕后，在 C:\Users\username\AppData\Local\Temp\SimpleCBIR\ 里输出一个result.json文件
在写文件之前，在该目录放一个文件名为result.json.busy的文件，代表正在写文件
写完后删除该.busy文件,代表解锁

result.json
-------
{
    rawImage: string, // the raw path
    recallRatio: string, //"92.5%" 查全率
    precision: string, //"87.5%" 查准率
    faetures: {
        color: string, // path of the generated image
        texture: string, // path of the generated image
        shape: string // path of the generated image
        position: string
    },
    results:{
        one: {
            similarity: string, //"99.9%"
            path: string //path of the most similar image,
            faetures: {
            color: string, // path of the generated image
            texture: string, // path of the generated image
            shape: string // path of the generated image
            position: string
            }
        },
        two: {
            similarity: string, //"76.2%"
            path: string, //path of the second similar image
            faetures: {
            color: string, // path of the generated image
            texture: string, // path of the generated image
            shape: string // path of the generated image
            position: string
            }
        },
        three: {
            similarity: string, //"64.1%"
            path: string, //path of the third similar image
            faetures: {
            color: string, // path of the generated image
            texture: string, // path of the generated image
            shape: string // path of the generated image
            position: string
            }
        }
    }
}

获得图片
---------
method: get
url: /api/image
query: ?i=path
response:{
    status: 200/error code
}
- path是result.json中获得的各个图片的path
