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
            <p><i class="primary">*</i>摄像头名称</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入摄像头名称" v-model="model.cameraName" name="cameraName" v-validate="'required'">
            <p v-if="vaerrors.has('cameraName:required')" class="is-danger">请输入摄像头名称</p>
          </div>
        </div>
        <!--<div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>ip</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入ip" v-model="model.ip" name="ip" v-validate="'required|ipchk'">
            <p v-if="vaerrors.has('ip:required')" class="is-danger">请输入ip</p>
            <p v-if="vaerrors.has('ip:ipchk')" class="is-danger">请输入正确的ip格式</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>端口号</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入端口号" v-model="model.port" name="port" v-validate="'required'">
            <p v-if="vaerrors.has('port:required')" class="is-danger">请输入端口号</p>
          </div>
        </div>-->
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>所属企业</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.enterpriseId" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择" @focus="clearStore">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="enterpriseError" class="is-danger busiError">请输入所属企业</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>所属门店</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="editModel.store" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择" @focus="getStores">
              <el-option
                v-for="item in storeOptions"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
            <p v-if="storeError" class="is-danger busiError">请输入所属门店</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>类型</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.cameraType" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择" @visible-change="cameraBlur">
              <el-option
                v-for="item in cameraTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="cameraTypeError" class="is-danger busiError">请输入类型</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>抬杆类型</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="model.liftingType" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in liftingTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="liftingTypeError" class="is-danger busiError">请输入抬杆类型</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>romid</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入romid" v-model="model.romid" name="romid" v-validate="'required'">
            <p v-if="vaerrors.has('romid:required')" class="is-danger">请输入romid</p>
          </div>
        </div>
        <div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>sn</p>
          </div>
          <div class="form_right">
            <input class="el_box w288" placeholder="请输入sn" v-model="model.sn" name="sn" v-validate="'required'">
            <p v-if="vaerrors.has('sn:required')" class="is-danger">请输入sn</p>
          </div>
        </div>
        <!--<div class="form_item">
          <div class="form_left">
            <p><i class="primary">*</i>在线状态</p>
          </div>
          <div class="form_right w302">
            <el-select v-model="addModel.lineStatus" class="el_box position-ab ml10 ml16-wi299" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in lineStatuses"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-if="lineStatusError" class="is-danger busiError">请选择在线状态</p>
          </div>
        </div>-->
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
          cameraName:'',//摄像头名称
          storeId:'',//门店ID
          cameraType:'',//类型 (0 入场 1 出场)
          liftingType:'',//(0 自动抬杆 1 识别抬杆)
          romid:'',
          sn:'',
          state:1,
          enterpriseId:'',//企业id
        },
        storeOptions:[],//所属门店
        storeError:false,//所属门店错误显示状态
        cameraTypeError:false,//类型显示状态
        liftingTypeError:false,//抬杆类型显示状态
        stateError:false,//状态显示
        // lineStatusError:false,//在线状态错误显示
        enterpriseError:false,//所属企业显示状态
        editModel:{
          store:'',
        },
        addModel:{
          state:'启用',
          // lineStatus:'在线'
        },
        cameraTypes:[
          {
            value:0,
            text:'入场'
          },
          {
            value:1,
            text:'出场'
          }
        ],
        liftingTypes:[
          {
            value:0,
            text:'自动抬杆'
          },
          {
            value:1,
            text:'识别抬杆'
          }
        ],
        lineStatuses:[
          {
            value:0,
            text:'离线'
          },
          {
            value:1,
            text:'在线'
          }
        ],
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
      }
    },
    props:{
      popUp:Boolean,
      title:String,
      cameraId:String,//摄像头id
      companyList:Array,//企业
    },
    created() {
      this.$validator.remove("ipchk");
      this.$validator.extend("ipchk", {
        validate: value => {
          const reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
          return reg.test(value)
        }
      });
    },
    methods:{
      clearStore(){
        this.editModel.store='';
      },
      getStores(){
        if(this.model.enterpriseId==''){
          this.AppUtils.alert('请先选择所属企业');
        }else{
          this.getStoreList(this.model.enterpriseId);
        }
      },
      getStoreList(id){
        this.$axios.post('/system/store/all',{enterpriseId:id}).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if(data){
            this.storeOptions= data.value;
          }
        })
      },
      cameraBlur(arg){
        if(!arg){
          if(!this.model.cameraType){
            this.model.liftingType=0;
          };
        }
      },
      addCancel(){
        for(var key in this.model){
          if(key=='state'){
            this.model[key]=1;
          }else{
            this.model[key]='';
          }
        }
        this.editModel.store='';
        this.storeError=false,//所属门店错误显示状态
        this.cameraTypeError=false,//类型显示状态
        this.liftingTypeError=false,//抬杆类型显示状态
        this.stateError=false;//状态显示
        // this.lineStatusError=false;//在线状态错误显示
        this.enterpriseError=false;//状态显示
        this.$emit('change')
      },
      addSave(){
        if(this.model.enterpriseId===''){
          this.enterpriseError=true;
        }else{
          this.enterpriseError=false;
        }
        if(typeof this.editModel.store=='number'){
          this.model.storeId=this.editModel.store;
        }else if(typeof this.editModel.store=='string'){
        }
        if(this.editModel.store===''){
          this.storeError=true;
        }else{
          this.storeError=false;
        }
        if(this.model.cameraType===''){
          this.cameraTypeError=true;
        }else{
          this.cameraTypeError=false;
        }
        if(this.model.liftingType===''){
          this.liftingTypeError=true;
        }else{
          this.liftingTypeError=false;
        }
        if(this.model.state===''){
          this.stateError=true;
        }else{
          this.stateError=false;
        }
          this.$validator
            .validateAll()
            .then((result) => {
              if (result) {
                if(this.editModel.store!==''&&this.model.enterpriseId!==''&&this.model.cameraType!==''&&this.model.liftingType!==''&&this.model.state!=='') {
                  this.save();
                }
              } else {
                // this.AppUtils.alert("请正确填写信息");
              }
            })
            .catch(err => {
            });
      },
      save(){
        if(this.title=="新增"){
          this.$axios.post('/system/camera/add',this.model).then(res=>{
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
          this.editModel.cameraId=this.cameraId;
          this.$axios.post('/system/camera/update',this.editModel).then(res=>{
            let data = this.AppUtils.checkResponse(res);
            if(data) {
              this.$emit('change');
              this.$emit('relod');
            }
          })
        }
      },
      //获取摄像头编辑详情
      getDetail(arg){
        this.detail(parseFloat(arg));
      },
      detail(arg){
        this.$axios.get(`/system/camera/detail/${arg}`).then(res=>{
          let data = this.AppUtils.checkResponse(res);
          if (data.value){
            var cameraInfor=data.value;
            for(var key in this.model){
              this.model[key]=cameraInfor[key];
            }
            this.editModel.store=cameraInfor['storeName'];
          }
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import '../../../../assets/css/cover.css';
</style>

