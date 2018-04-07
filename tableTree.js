
export default function tableTree(vue,_this,config) {

  if(config&&config.type==='arr'){
    let self = _this;
    let _config = config;
    _this.hasChild=function(lists){//判断是否有子级
      let list = lists;
      list.forEach((item)=>{
        let r = list.some((i)=>{
          return item[_config.menuId]===i[_config.parentId]
        });
        item.last = !r;
      });
      return list;
    };
    _this.tableRowClassName=function({row, rowIndex}){
      return '';
    };
    _this.tableCellClassName=function({row, column, rowIndex, columnIndex}){
      if(columnIndex==1){
        return 'table-list-name';
      }
    };
    _this.tableListClick=function(row, column, cell, event) {//
      let className = cell.className.trim();
      let re = /\stable-list-name/gi;
      if(!re.test(className)){
        return;
      }
      if(row.last){return}// 是否已是最后一层
      if(row.open){//如果处于打开状态  关闭
        self[_config.menuId] = row[_config.menuId];
        self.removeChild(self[_config.menuId],row[_config.parentId],row);
        return;
      }

      // 根据传入的id,筛选出对应的子列表
      let index = event.currentTarget.rowIndex+1;
      let menuId = row[_config.menuId];
      let list = self.tableList.filter((item)=>{
        return item[_config.parentId]===menuId;
      });
      if(list.length<=0){
        row.last = true;
        return;
      }
      // 传入数组挡住
      list.forEach((item)=>{
        self.lists.splice(index,0,item)
      });
      row.open = true;
    };
    // 从table移除需要关闭的子项
    _this.removeChild=function(menuId,parentId,row){
      let list = self.lists.filter((item)=>{
        return item[_config.parentId]===menuId
      });
      if(list.length>0){
        row.open = true;
        self.lists=self.lists.filter((item)=>{
          for (let i = 0,l = list.length;i<l;i++){
            if(item[_config.menuId] === list[i][_config.menuId]){
              item.open = false;
              return false
            }
          }
          return true;
        });
        self.filterArr = self.filterArr.concat(list);
        list.forEach((item)=>{
          self.removeChild(item[_config.menuId],item[_config.parentId],row);
        })
      }else {
        row.open = false;
      }
    };
  }else {
    let _config = config;
    _this.tableRowClassName = function (obj) {
      let row = obj.row;
      let rowIndex = obj.rowIndex;
      // if(row.series%2===0){
      //   return 'double-row';
      // }
      return '';
    };
    _this.tableCellClassName = function ({row, column, rowIndex, columnIndex}) {
      if(columnIndex==1){
        return 'table-list-name';
      }
    };
    _this.tableListClick = function (row, column, cell, event) {
      let className = cell.className.trim();
      let self = _this;
      let re = /\stable-list-name/gi;
      if(!re.test(className)||!_this.isArray(row.childList)||row.childList.length<=0){
        return;
      }
      let table = _this.tableList;
      _this.rootId = row[_config.menuId];
      if(row.open){
        _this.table_close(table,row);
        return;
      }
      row.open = true;
      if(_this.isArray(row.childList)&&row.childList.length>0){
        let arr = row.childList;
        arr = arr.sort((a,b)=>{
          return b.sortnum - a.sortnum
        });
        arr.forEach(function (item,index) {
          item.open = false;
          table.splice(event.currentTarget.rowIndex+1,0,item);
        });
      }
    };
    _this.table_close = function (arr,row) {
      let a,
        id = '',
        child,
        self = _this;
      let ar = [];
      for (let i = 0;i<arr.length;i++){
        if(arr[i][_config.parentId]==_this.rootId){
          _this.mapArr.push(arr[i]);
        }
      }
      _this.mapArr.map(function (item) {
        ar.push(item)
      });
      let map=  {};
      ar = ar.filter(function (item) {
        return map[item[_config.menuId]]?false:map[item[_config.menuId]] = true;
      });
      for (let j = 0;j<ar.length;j++){
        if(_this.isArray(ar[j].childList)&&ar[j].childList.length>0&&ar[j].open){
          _this.rootId = ar[j][_config.menuId];
          child= ar[j].childList;
          ar[j].open = false;
          _this.table_close(child,row);
        }
      }
      let isOK = ar.every(function (item) {
        return !item.open
      });
      if(isOK){
        let table = _this.tableList;
        _this.tableList = table.filter(function (item) {
          for (let s = 0,sl=self.mapArr.length;s<sl;s++){
            if(item[_config.menuId] == self.mapArr[s][[_config.menuId]]){
              return false
            }
          }
          return true;
        });
        row.open = false;
        self.mapArr = [];
      }
    };
  }


}
