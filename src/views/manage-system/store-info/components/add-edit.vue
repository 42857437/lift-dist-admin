<template>
  <div>
    <div class="zzc" v-if="popUp">
      <form action="" class="addform">
        <div class="addTitle">
          <div class="addUser">{{title}}</div>
          <div class="close" @click="addCancel">×</div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>门店名称</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入门店名称" name="storeName" v-model="model.storeName" v-validate="'required'">
            <p v-if="vaerrors.has('storeName:required')" class="is-danger">请输入门店名称</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>所属企业</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.enterpriseId" class="el_box position-ab ml16-wi299 ml10" clearable filterable placeholder="请选择" @focus="clearArea">
              <el-option
                v-for="item in companyOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="enterpriseShow" class="is-danger busiError">请输入所属企业</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>所属区域</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="editModel.area" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择" @focus="getArea">
              <el-option
                v-for="item in areaLists1"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="areaShow" class="is-danger busiError">请选择所属区域</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>管理类型</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.manageType" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in manageTypeLists"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="manageTypeShow" class="is-danger busiError">请选择管理类型</p>
          </div>
        </div>
        <div class="form_item" style="margin-bottom:52px">
          <div class="form_left" style="padding-top: 40px;">
            <p>门店Logo</p>
          </div>
          <div class="form_right w302" style="margin-bottom: 20px;">
            <div class="imgZoneImg">
              <span class="logoClose" v-if="closeShow" @click="deleteLogo">X</span>
              <img :src=storeImg alt="" width="100" height="100">
            </div>
            <div class="imgZone">
              <div class="add">+</div>
              <input class="file" type="file" accept="image/*" @change="previewFiles($event)">
            </div>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>门店负责人</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入门店负责人" v-model="model.linkMan" name="linkMan">
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p>负责人电话</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入负责人电话" v-model="model.linkTel" v-validate="'telchk'" name="linkTel">
            <p v-if="vaerrors.has('linkTel:telchk')" class="is-danger">手机号码格式不正确</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>状态</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.state" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="stateError" class="is-danger busiError">请选择状态</p>
          </div>
        </div>
        <div class="form_item mtp10">
          <button class="serachBtn" type="button" @click="addSave">保存</button>
          <button class="cancelBtn" type="button" @click="addCancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    name:'addit',
    data(){
      return{
        model:{
          state:1,
          storeName:'',//门店名称
          enterpriseId:'',//企业id
          enterpriseName:'',//企业名称
          areaId:'',//区域id
          areaName:'',//区域名称
          linkMan:'',//门店负责人
          linkTel:'',//负责人电话
          manageType:'',//管理类型
          storeImg:'',//门店logo
        },
        storeImg:'',
        closeImg:'',
        centerImg:'',
        editModel:{
          area:'',
        },
        companySel:'',
        areaName:'',
        saveStoreImg:'',//编辑的时候保存接口返回的图片的路径
        saveStoreImg1:'',
        deleteImgList:[],//删除图片存放数组
        closeShow:false,//删除logo
        enterpriseShow:false,//所属企业错误状态
        areaShow:false,//所属区域错误状态
        stateError:false,//状态显示
        manageTypeShow:false,//管理类型状态
        areaLists1:[],//区域列表
        options:[
          {
            value:1,
            text:'启用'
          },
          {
            value:0,
            text:'停用'
          }
        ],
        manageTypeLists:[
          {
            id:0,
            name:'白名单管理'
          },
          {
            id:1,
            name:'车间黑名单管理'
          },
          {
            id:2,
            name:'黑名单管理'
          },
        ]
      }
    },
    props:{
      popUp:Boolean,
      title:String,
      companyOptions1:Array,
      // areaLists1:Array,
      storeId:String
    },
    created(){
      this.$validator.remove("telchk");
      this.$validator.extend("telchk", {
        validate: value => {
          const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
          return reg.test(value)
        }
      });
    },
    methods:{
      clearArea(){
        this.editModel.area='';
      },
      getArea(){
        if(this.model.enterpriseId==''){
          this.AppUtils.alert('请先选择所属企业');
        }else{
          this.getAreaList1(this.model.enterpriseId);
        }
      },
      //'启用'区域
      getAreaList1(id){
        this.$axios.post('/system//area/all',{enterpriseId:id}).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.areaLists1= data.value;
          }
        })
      },
      addCancel(){
        for(var key in this.model){
          if(key=='state'){
            this.model[key]=1;
          }else{
            this.model[key]='';
          }
        }
        var str='';
        if(this.saveStoreImg==this.closeImg){

        }else{
          str='images/store/'+this.closeImg;
          var newArr=[];
          newArr.push(str);
          this.deleteImg(newArr);
        }
        this.enterpriseShow=false;
        this.areaShow=false;
        this.stateError=false;
        this.manageTypeShow=false;
        this.$emit('change');
      },
      addSave(){
        if(this.model.enterpriseId===''){
          this.enterpriseShow=true;
        }else{
          this.enterpriseShow=false;
        }
        if(typeof this.editModel.area=='number'){
           this.model.areaId=this.editModel.area;
        }else if(typeof this.editModel.area=='string'){
        }
        if(this.editModel.area===''){
          this.areaShow=true;
        }else{
          this.areaShow=false;
        }
        if(this.model.state===''){
          this.stateError=true;
        }else {
          this.stateError=false;
        }
        if(this.model.manageType===''){
          this.manageTypeShow=true;
        }else {
          this.manageTypeShow=false;
        }
        this.$validator
          .validateAll()
          .then((result) => {
            if (result) {
              if(this.model.enterpriseId!==''&&this.editModel.area!==''&&this.model.state!==''&&this.model.manageType!==''){
                this.save();
              }
            } else {
              // this.AppUtils.alert("请正确填写信息");
            }
          })
          .catch(err => {
          });
      },
      deleteLogo(){
        this.storeImg='';
        var str='';
        if(this.saveStoreImg==this.model.storeImg){
          str='images/store/'+this.saveStoreImg
          this.deleteImgList.push(str);
          this.model.storeImg='';
        }else{
          str='images/store/'+this.model.storeImg;
          var newArr=[];
          newArr.push(str);
          this.deleteImg(newArr);
          this.model.storeImg='';
        }
        this.closeShow=false;
      },
      previewFiles(e){
           let file = e.target.files[0];
           // for (let i = 0; i < files.length; i++) {
           //      if (files[i].size/1024/1024 > 2) { //限制每张上传图片的大小
           //            alert('第'+(i+1)+'张图片大于2M,请上传小于2M的图片');
           //            return;
           //      }
           //  }
                 // console.log(files[0].size/1024/1024);
            // formData.append("file");//调用它的append()方法来添加字段
            // for (let i = 0; i < files.length; i++) {
            //     formData.append("file[]",files[i]);
            // }
           var fileData = new FormData();
           fileData.append('file',file);
            this.$axios.post('/system/store/upload',fileData)
               .then((res) => {
                 let data = this.AppUtils.checkResponse(res);
                 var str='';
                 if(data){
                   this.closeShow=true;
                    this.model.storeImg=data.value;
                    this.centerImg=this.model.storeImg;
                    if(this.centerImg!=this.closeImg){
                      str='images/store/'+this.closeImg;
                      var newArr=[];
                      newArr.push(str);
                      this.deleteImgList.push('images/store/'+this.saveStoreImg1);
                      this.deleteImg(newArr);
                    }
                    this.closeImg=this.model.storeImg;
                    this.storeImg='https://defensor.oss-cn-beijing.aliyuncs.com/images/store/'+this.model.storeImg;
                  }
               })
      },
      save(){
        if(this.title=="新增"){
          this.$axios.post('/system/store/add',this.model).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data){
              this.$emit('change');
              this.$emit('relod');
             }
          })
        }else if(this.title=="编辑"){
          for(var key in this.model){
            this.editModel[key]=this.model[key];
          }
          this.editModel.id=this.storeId;
          this.$axios.post('/system/store/update',this.editModel).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data) {
              this.$emit('change');
              if(this.deleteImgList.length!=0){
                this.deleteImg(this.deleteImgList);
              }
              this.$emit('relod');
            }
          })
        }
      },
      deleteImg(list){
        this.$axios.post('/system/store/delImg',list).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data) {
          }
        })
      },
      //获取区域编辑详情
      getDetail(arg){
        this.detail(parseFloat(arg));
      },
      detail(arg){
        this.$axios.get(`/system/store/detail/${arg}`).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if (data.value){
            for(var key in this.model){
              this.model[key]=data.value[key];
            }
            this.editModel.area=this.model.areaName;
            if(this.model.storeImg){
              this.closeShow=true;
              this.saveStoreImg1=this.model.storeImg;
              this.saveStoreImg=this.model.storeImg;
              this.storeImg='https://defensor.oss-cn-beijing.aliyuncs.com/images/store/'+this.model.storeImg;
            }
          }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
  .imgZoneImg{
    height: 100px;
    border-radius: 3px;
    float: left;
    margin-right: 10px;
    position: relative;
    .logoClose{
      width: 20px;
      height: 20px;
      position: absolute;
      right: 0px;
      top: 0px;
      border: 1px solid #ccc;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: rgba(0,0,0,0.2);
      cursor: pointer;
    }
  }
  .imgZone{
    float: left;
    height: 100px;
    width: 100px;
    border-radius: 3px;
    line-height: 93px;
    font-size: 47px;
    position: relative;
    .add{
      width: 100px;
      height: 100px;
      background: #ccc;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    .file{
      width: 100px!important;
      height: 100px!important;
      display: inline-block;
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: 1;
      opacity: 0;
      background: #ccc;
    }
    img{
      width: 100px;
      height: 100px;
    }
  }
</style>
