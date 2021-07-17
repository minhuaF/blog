> 未完待续...

### 特别说明
下面提及的例子是方式，都是以宽为例，也就是`flex-direction: row`的情况，`flex-direction: column`的情况同理，只是把宽度改成高度

### 背景
`FlexBox Layout` 旨在提供一种更加有效的方式来布局、对齐和分配容器中各个项目直接的空间，即使它们的大小未知或是动态改变的。

`FlexBox Layout` 的主要思想是使容器能更改其项目的宽度/高度（和顺序），来最好地填充可用空间（主要是使用所有类型的显示设备和屏幕尺寸）。FLex容器会扩展项目以填充可用的可用空间，或收缩它们以防止溢出。

最重要的是，和常规布局（块是垂直的，内联是水平的）相比，`flexbox`布局与方向无关的。虽然方向这些功能在页面上工作的很好，但是常规布局缺乏支持大型或复杂应用程序的灵活性（特别是在改变方向、调整大小、拉伸、收缩等方面）。

注意：`Flexbox` 布局最适合应用程序的组件和小规模布局，而Grid布局则用于较大规模的布局。

### 属性使用（脑图）
<img width="1845" alt="Flexbox -Flexible Box Layout-" src="https://user-images.githubusercontent.com/12391746/125943393-74e6065a-3d5f-4f17-b79f-0ffe5555bc00.png">

爆炸，脑图原稿找不到了......
1. 脑图有错，flex-shrink 的默认值不是0，而是1

### 一直迷惑的 flex-grow

先来默读三遍下[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-grow)上面的对`flex-grow`的介绍：

>`css` 属性`flex-grow`设置了一个flex项主尺寸的flex增长系数。它指定了flex容器中剩余空间的多少应该分配给项目（flex增长系数）。
>
> 主尺寸是项的宽度和高度，这取决于 `flex-direction` 的值。
>
> 剩余的空间是flex容器的大小减去所有flex项的大小加起来的大小。如果所有的兄弟项目都有相同的`flex-grow`系数，那么所有的项目将获得相同的剩余空间，否则将根据不同的flex-grow系数定义的比例进行分配。

上面的解说其实很清晰的说明白了`flex-grow`的定义，但不够接地气，可能有的小伙伴读完之后还不能很清晰了理解到`flex-grow`的用法，那这边就列举具体的例子来介绍下`flex-grow`的用法。

首先，`flex-grow`的值是一个`<number>`，它代表的是一个系数（也就是一个权重，如果还不是十分理解权重，建议先去了解下，方便后续理解）。默认值是0，默认并不会对剩余空间进行分配。

然后，`flex-grow`属性决定的是父元素在空间分配上有剩余空间时，如何分配这些剩余空间。

最后，得出设置了`flex-grow`属性时，剩余空间的分配公式是这样子的：比如剩余空间是 `x`, 子元素A、B、C的`flex-grow` 属性分别是a，b，c，那么`flex-grow`的系数总和就是`sum = a + b + c`，根据上面的解说，A、B、C三个元素将得到的剩余空间:

```
              a
A ===>  x * —————  （A获得的剩余空间）
             sum
             
              b
B ===>  x * —————  （B获得的剩余空间）
             sum
             
              c
C ===>  x * —————  （C获得的剩余空间）
             sum            
```

`flex-grow`的取值不能是负数，那么情况有3种 `x` 表示每个子元素是`flex-grow`的值

1. x = 0 
2. 0 < x < 1
3. x = 1
4. x > 1

接下来示例说明：父元素的宽度是`1000px`，里面有3个子元素，设置的宽度分别是`100px`，`200px`，`300px`，那么剩余空间就是`400px`,代码如下：

```html
  <style>
    * {
      padding: 0;
      margin: 0;
      color: #fff;
    }

    h2 {
      color: #000;
    }

    .container {
      display: flex;
      flex-direction: row;
      width: 1000px;
      margin: 0 auto;
      border: 1px solid red;
    }

    .start {
      background-color: green;
      width: 100px;
    }

    .mid {
      background-color: blueviolet;
      width: 200px;
    }

    .end {
      background-color: darkgrey;
      width: 300px;
    }
  </style>
  <div class="container">
    <div class="start">w100</div>
    <div class="mid">w200</div>
    <div class="end">w300</div>
  </div>
```
![Yinxiang_2021071611-10-30](https://user-images.githubusercontent.com/12391746/125943565-57a78595-91ab-4fd3-b8cf-2ecbf179f99c.png)

看到剩余空间是`400px`，此时分别给子元素添加`flex-grow`属性，`flex-grow`取值情况不能是负数，默认是0 ，所以取值的情况只会有两种

##### 【情况1】 x = 0

默认值；相当于都没有设置`flex-grow`属性的情况；不会分配剩余空间

![Yinxiang_2021071611-10-30](https://user-images.githubusercontent.com/12391746/125943565-57a78595-91ab-4fd3-b8cf-2ecbf179f99c.png)

#### 【情况2】 0 < x < 1； 

每个子元素的`flex-grow`属性都小于1，所有子元素的`flex-grow`属性加起来就小于1，上面式子中的`sum`将会等于1，意思是说，如果`flex-grow`属性设置小于0的时候，父元素的剩余空间不会全部分配给子元素：

```css
.start {
  background-color: green;
  width: 100px;
  flex-grow: 0.1;
}

.mid {
  background-color: blueviolet;
  width: 200px;
  flex-grow: 0.2;
}

.end {
  background-color: darkgrey;
  width: 300px;
  flex-grow: 0.3;
}
```
根据上面的公式计算下设置了`flex-grow`属性情况下，各个子元素的宽度
```
sum = 0.1 + 0.2 + 0.3 = 0.6 < 1 
sum = 1

               0.1
A ===>  400 * —————  = 40 （A获得的剩余空间）+ 100(原来宽度) = 140 （当前宽度）
                1
             
               0.2
B ===>  400 * —————  = 80（B获得的剩余空间）+ 200(原来宽度) = 280 （当前宽度）
                1
             
               0.3
C ===>  400 * —————  = 120（C获得的剩余空间）+ 300(原来宽度) = 320 （当前宽度）
                1            
```
![Yinxiang_2021071611-10-30](https://user-images.githubusercontent.com/12391746/125943629-7bd3ceda-fa3a-4066-9d37-9804183199bb.png)

#### 【情况3】 x = 1

所有子元素的`flex-grow`属性都设置成1，是一种特殊的情况，表示的是所有元素将按权重均分剩余空间；

##### 【情况4】 x > 1

所有子元素的`flex-grow`属性都大于1，它们的和也大于1；

```css
.start {
  background-color: green;
  width: 100px;
  flex-grow: 1;
}

.mid {
  background-color: blueviolet;
  width: 200px;
  flex-grow: 2;
}

.end {
  background-color: darkgrey;
  width: 300px;
  flex-grow: 3;
}
```

根据上面的公式计算下设置了`flex-grow`属性情况下，各个子元素的宽度
```
sum = 1 + 2 + 3 = 6

               1
A ===>  400 * —————  = 66.67 （A获得的剩余空间）+ 100(原来宽度) = 166.67 （当前宽度）
               6
             
               2
B ===>  400 * —————  = 133.33（B获得的剩余空间）+ 200(原来宽度) = 333.33 （当前宽度）
               6
             
               3
C ===>  400 * —————  = 200（C获得的剩余空间）+ 300(原来宽度) = 500 （当前宽度）
               6            
```

验证下：

![Yinxiang_2021071611-10-30](https://user-images.githubusercontent.com/12391746/125943668-738bcb53-f4be-4cd0-a6ab-691a1f43d6cf.png)

#### 意外

好了，到此就把`flex-grow`的计算方式介绍完成，但是，剩余空间的分配后的宽度收到`max-width`的影响，如果分配之后的宽度大于`max-width`，那么`mqx-width`的优先级更高，看下面代码：

```css
.start {
  background-color: green;
  width: 100px;
  flex-grow: 1;
}

.mid {
  background-color: blueviolet;
  width: 200px;
  flex-grow: 2;
}

.end {
  background-color: darkgrey;
  width: 300px;
  max-width: 400px;
  flex-grow: 3;
}
```

最后一个元素被添加了`max-width: 400px`，按照上面的计算，如果不加`max-width`属性的话，三个元素的宽度经过分配之后分别是`166.67px、333.33px、500px`，加了`max-width`之后却是`200px、400px、400px`，完全不一样，分析下这种情况下的计算规则。

由于最后一个元素剩余了 100px 没有被占用，那么这 100px 会被前面的2个元素按权重分配，所以是

```
sum = 1 + 2 = 3

               1
A ===>  100 * —————  = 33.33 （A获得的剩余空间）+ 166.67(原来分配之后宽度) = 200 （当前宽度）
               3
             
               2
B ===>  100 * —————  = 66.67（B获得的剩余空间）+ 333.33(原来分配之后宽度) = 400 （当前宽度）
               3
                    
```

### 同样迷惑的 flex-shrink
同样，先来默读三遍下[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-shrink)上面的对`flex-shrink`的介绍：
> CSS `flex-shrink`属性指定了flex元素的收缩规则。flex元素尽在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据flex-shrink的值。

我觉得这个说明也还算接地气吧，哈哈，不过还是就要实例来解说下，会比较容易理解。

首先，`flex-shrink`的值也是一个`<number>`，也是代表一个系数（权重）。默认值是1，表示会按照1的权重进行空间收缩。

然后，`flex-shrink`属性决定的是如果所有子元素的宽度和大于容器的时候，如何收缩以适应父元素的宽度。

最后，得出设置了`flex-shrink`属性时，元素总宽超出部分的收缩分配公式是这样子的：比如超出空间是 `y`, 子元素A、B、C的宽度分别是wA、wB、wC，设置的`flex-shrink` 属性分别是a，b，c，（不设置的话，就是默认值1）那么`flex-shrink`的总权重`weight = a * wA + b * wB + c * wC`，接下来可能需要运用点数学计算了，假设单个元素的收缩宽度是v，那么v与已知数据的关系是:
```
 元素需要收缩的值（v）              元素所占的权重（元素的宽度 * flex-shrink）
——————————————————————————  =  ——————————————————————————————————————————
所有元素收缩的值的总和（已知）              所有元素的总权重（weight）

```

变换下等式

```
                     元素所占的权重（元素的宽度 * flex-shrink）* 所有元素收缩的值的总和
元素需要收缩的值（v） =  ——————————————————————————————————————————————————————————————
                                    所有元素的总权重（weight）

```

和`flex-grow`一样，`flex-shrink`的取值和不能是负数，那么，取值情况有4种

1. x = 0;
2. 0 < x < 1;
3. x = 1;
4. x > 1;

接下来示例说明： 父元素的宽度是500px，里面有3个子元素，设置的宽度分别是100px，200px，300px，代码如下：

```html
  <style>
    * {
      padding: 0;
      margin: 0;
      color: #fff;
    }

    h2 {
      color: #000;
    }

    .container {
      display: flex;
      flex-direction: row;
      width: 500px;
      margin: 0 auto;
      border: 1px solid red;
    }

    .start {
      background-color: green;
      width: 100px;
    }

    .mid {
      background-color: blueviolet;
      width: 200px;
    }

    .end {
      background-color: darkgrey;
      width: 300px;
    }
  </style>
  <body>
   <div class="container">
    <div class="start">w100</div>
    <div class="mid">w200</div>
    <div class="end">w300</div>
   </div>
 </body>
```

#### 【情况1】x = 0
根据定义和公式可以`get`到，`flex-shrink`为0，其实就是表示在宽度和超出父元素总宽度的时，不进行任何系数的收缩。如下表示，给第一个子元素设置了`flex-shrink = 0`之后，在宽度不足的情况下，并没有压缩，而是压缩了其他元素以适应。
```css
.start {
  background-color: green;
  width: 100px;
  flex-shrink: 0;
}
```
<img width="570" alt="Yinxiang_2021071611-10-30" src="https://user-images.githubusercontent.com/12391746/125943722-84ca4dbb-7994-401b-8499-b65cfa0c7d17.png">

##### 【情况2】0 < x < 1
```css
.start {
  background-color: green;
  width: 100px;
  flex-shrink: 0.3;
}

.mid {
  background-color: blueviolet;
  width: 200px;
  flex-shrink: 0.2;
}

.end {
  background-color: darkgrey;
  width: 300px;
  flex-shrink: 0.1;
}
```
代入公式
```
weight = 100 * 0.3 + 200 * 0.2 + 300 * 0.1 = 100 

由于每个每个元素的flex-shrink属性都小于0，那么实际收缩的宽度就不是 100，而是 (0.3 + 0.2 + 0.1) / 1 = 0.6 * 100 = 60

       ( 100 * 0.3) * 60
A ===> —————————————————— = 18（A需要收缩的空间）==> 100 - 18 = 82（A收缩后的宽度）
            100
             
       ( 200 * 0.2) * 60
B ===> —————————————————— = 24（B需要收缩的空间）==> 200 - 24 = 176（A收缩后的宽度）
           100
             
       ( 300 * 0.1) * 60
C ===> —————————————————— = 18 （C需要收缩的空间）==> 300 - 18 = 282（A收缩后的宽度）
             100            
```
<img width="620" alt="Yinxiang_2021071611-10-30" src="https://user-images.githubusercontent.com/12391746/125943780-5214e13b-ba89-40a3-a338-cd1af2100489.png">

从实际图片中看到计算结果和渲染结果一致。


#### 【情况3】 x = 1 （默认值）

代入公式
```
weight = 100 * 1 + 200 * 1 + 300 * 1 = 600

       ( 100 * 1) * 100
A ===> —————————————————— = 16.67（A需要收缩的空间）==> 100 - 16.67 = 83.33（A收缩后的宽度）
            600
             
       ( 200 * 1) * 100
B ===> —————————————————— = 33.33（B需要收缩的空间）==> 200 - 33.33 = 166.67（A收缩后的宽度）
           600
             
       ( 300 * 1) * 100
C ===> —————————————————— = 50 （C需要收缩的空间）==> 300 - 50 = 250（A收缩后的宽度）
             600            
```

<img width="1169" alt="Yinxiang_2021071611-10-30" src="https://user-images.githubusercontent.com/12391746/125943816-ae18374d-211f-4969-a485-f0587f1a1c1c.png">
<img width="557" alt="Yinxiang_2021071611-10-30" src="https://user-images.githubusercontent.com/12391746/125943839-ce7e86fc-ec43-4748-889f-16d8e25a236a.png">

从实际图片中看到计算结果和渲染结果一致。

#### 【情况4】x > 1

```css
.start {
  background-color: green;
  width: 100px;
  flex-shrink: 3;
}

.mid {
  background-color: blueviolet;
  width: 200px;
  flex-shrink: 2;
}

.end {
  background-color: darkgrey;
  width: 300px;
  flex-shrink: 1;
}
```

带入等式计算每个元素收缩之后的宽度

```
weight = 100 * 3 + 200 * 2 + 300 * 1 = 1000

       ( 100 * 3) * 100
A ===> —————————————————— = 30（A需要收缩的空间）==> 100 - 30 = 70（A收缩后的宽度）
            1000
             
       ( 200 * 2) * 100
B ===> —————————————————— = 40（B需要收缩的空间）==> 200 - 40 = 160（A收缩后的宽度）
           1000
             
       ( 300 * 1) * 100
C ===> —————————————————— = 30 （C需要收缩的空间）==> 300 - 30 = 270（A收缩后的宽度）
             1000            
```
<img width="570" alt="Yinxiang_2021071611-10-30" src="https://user-images.githubusercontent.com/12391746/125943913-3b671cda-ff4b-487d-adc4-af31df020090.png">

从实际图片中看到计算结果和渲染结果一致。

#### 【情况5】x > 1 和 0 < x < 1 混合在一起
计算方式和【情况4】是一致的，那这里就不贴代码了。

#### 意外
子元素被设置了`min-width`属性，那么`min-width`的属性优先级将会比较高
```css
.start {
  background-color: green;
  width: 100px;
  flex-shrink: 1;
}

.mid {
  background-color: blueviolet;
  width: 200px;
  flex-shrink: 2;
}

.end {
  background-color: darkgrey;
  width: 300px;
  min-width: 300px;
  flex-shrink: 3;
}
```

![wecom-temp-4e682bde701648cc32d00f4f92c83951](https://user-images.githubusercontent.com/12391746/125943955-0378d3ef-e665-4bab-8e14-98273c3b56f3.png)

设置了`min-width`的元素将不会被压缩，其他元素按权重压缩。


### 一般迷惑的 flex-basis
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-basis) 上的介绍：
> CSS属性`flex-basis`指定了flex元素在主轴方向上的初始大小。

`flex-basis` 一般取值是`0`、`auto`、`<number>`，（其他值暂时没见到过）

`flex-basis`属性不涉及到计算，就是理解对值的获取，下面是对3种取值的示例

```html
<style>
.container {
    display: flex;
    flex-direction: row;
    width: 500px;
    margin: 0 auto;
    border: 1px solid red;
  }

  .start {
    background-color: green;
  }

  .mid {
    background-color: blueviolet;
    flex-grow: 1;
    flex-shrink: 1;
  }

  .end {
    background-color: darkgrey;
    flex-grow: 1;
    flex-shrink: 1;
  }
</style>
<body>
<div class="container">
  <div class="start">w100 w100</div>
  <div class="mid">w200 w200</div>
  <div class="end">w300 w300</div>
</div>
</body>

```
![image](https://user-images.githubusercontent.com/12391746/126023643-ab5a0841-caa8-4055-b664-f360e39452be.png)

示例代码中，第一个子元素没有设置`flex-grow`、`flex-shrink`属性，其他两个子元素都设置了，可以更好的对比`flex-basis`属性表现出来的样式；

#### 【情况1】 `flex-basis:0`
![image](https://user-images.githubusercontent.com/12391746/126023784-43c65333-f63b-42f0-9bb0-9b2ff939f7ed.png)


#### 【情况2】 `flex-basis:auto`
![image](https://user-images.githubusercontent.com/12391746/126023807-979d3ea9-5196-4ef4-a4f4-67cd378f8776.png)


#### 【情况3】 `flex-basis:400px` 具体的值
![image](https://user-images.githubusercontent.com/12391746/126023820-94a21fa8-8164-46b7-930a-b2fbb33ce2a5.png)


#### 意外
![image](https://user-images.githubusercontent.com/12391746/126023835-b8ab8560-05c9-499b-972d-a5e709b3d64b.png)

如果看完还没有全懂，或者还没有解答你的问题，记得留言，让我也不懂，未完，待续

### 社区整理的bugfix参考文档
[philipwalton/flexbugs](https://github.com/philipwalton/flexbugs)

### 参考文档
> `FlexBox Layout` 从2017年出现以来，社区已经和完善，也有很多布道师发布了教程，借此记录下，下次有疑问的时候可以直接在这里找了

[图解CSS：Flexbox布局(Part1) - 大漠老师对flex系列的讲解太棒了](https://www.w3cplus.com/css/css-flexbox-layout-model-part1.html)
[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
[详解 flex-grow 与 flex-shrink](https://zhuanlan.zhihu.com/p/24372279)