使用方式



```html
<!--方法tableListClick,tableCellClassName,tableRowClassName目前都是写死的-->

<el-table :data="lists"
            border
            @cell-click="tableListClick"
            :cell-class-name="tableCellClassName"
            :row-class-name="tableRowClassName"
>
					<el-table-column label="ID	" min-width="5%">
						<template slot-scope="scope">
							{{scope.row.menuId}}
						</template>
					</el-table-column>

					<el-table-column label="菜单名称" min-width="15%">
						<template slot-scope="scope">
							<div :class="{'expand-table':scope.row.open}" class="name-wrap tableTreeName">
								<p :style="{'margin-left':scope.row.series*15+'px'}">
									<i v-if="!scope.row.last" style="color: #409EFF" class="el-icon el-icon-arrow-right"></i>
									<span>{{scope.row.name}}</span>
								</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
```
```JavaScript

import tableTree from 'tableTree';


     // 数据类型一
    let list = [
        {
            parentId:0,
            menuId:1
        },
         {
           parentId:0,
           menuId:2
         },
        {
            parentId:1,
            menuId:100
         }
    ]
    tableTree(null, this, {
		        type: 'arr', // 数据类型,平级,非父子嵌套关系
				parentId: 'parentId',//父级id
				menuId: 'menuId'//自身id
			});


     // 数据类型二
    let list = [
        {
            parentId:0,
            menuId:1,
            childList:[
                   {
                      parentId:1,
                      menuId:100
                    }
            ]
        },
         {
           parentId:0,
           menuId:2
         },

    ]
    tableTree(null, this, {
		        type: 'list', // 数据类型,父子嵌套关系
                parentId: 'reid',
                menuId: 'id'
			});



```